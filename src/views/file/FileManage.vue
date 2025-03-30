<template>
  <!-- 文件管理主容器 -->
  <div class="file-manager-container">
    <!-- 路径导航：显示当前目录层级，支持快速导航 -->
    <div class="path-navigation">
      <!-- 动态生成面包屑导航，支持折叠中间路径 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item
            v-for="(item, index) in breadcrumb"
            :key="index"
            :class="{ 'ellipsis-item': item.ellipsis }"
        >
          <!-- 省略号表示折叠的路径 -->
          <template v-if="item.ellipsis">...</template>
          <!-- 可点击的路径项 -->
          <template v-else>
            <span @click="navigateTo(item.id)" class="path-item">
              {{ item.name }}
            </span>
          </template>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 操作工具栏：包含导航控制、上传/新建操作和搜索 -->
    <div class="operation-bar">
      <!-- 返回上一级按钮 -->
      <el-button
          v-if="pathStore.path.length > 1"
          @click="goBack"
          :icon="Back"
          circle
      />
      <!-- 文件操作按钮组 -->
      <el-button type="primary" :icon="UploadFilled" @click="handleUpload">
        上传文件
      </el-button>
      <el-button type="primary" :icon="FolderAdd" @click="addFolder">
        新键文件夹
      </el-button>
      <!-- 文件搜索框 -->
      <el-input
          v-model="searchQuery"
          placeholder="搜索文件"
          style="width: 240px; margin-left: 20px"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <!-- 文件展示表格 -->
    <el-table
        :data="filteredFiles"
        style="width: 100%"
        @selection-change="handleSelectionChange"
    >
      <!-- 多选列 -->
      <el-table-column type="selection" width="55" />

      <!-- 文件名列：展示图标、名称和预览 -->
      <el-table-column prop="name" label="名称" min-width="300">
        <template #default="{ row }">
          <div
              class="file-item"
              :class="{ 'clickable': row.type === 'folder' }"
              @click="handleFolderClick(row)"
          >
            <!-- 动态文件类型图标 -->
            <el-icon class="file-icon" :size="24">
              <component :is="getFileIcon(row)" />
            </el-icon>
            <span class="file-name">{{ row.name }}</span>
            <!-- 图片预览功能 -->
            <el-image
                v-if="isImage(row)"
                style="width: 40px; height: 40px; margin-left: 12px"
                :src="row.url"
                :preview-src-list="[row.url]"
                hide-on-click-modal
            />
          </div>
        </template>
      </el-table-column>


      <!-- 文件类型列 -->
      <el-table-column prop="type" label="类型" width="120" />

      <!-- 文件大小列 -->
      <el-table-column prop="size" label="大小" width="120"  >
        <template #default="{ row }" >
          <div v-if = "row.type === 'folder'">
            -
          </div>
          <div v-else>
            {{ formatFileSize(row.size) }}
          </div>
        </template>
      </el-table-column>

      <!-- 修改时间列 -->
      <el-table-column prop="modified" label="修改时间" width="180">
        <template #default="{ row }">
          {{ formatDateTime(row.updatedAt) }}
        </template>
      </el-table-column>

      <!-- 操作列：文件操作按钮 -->
      <el-table-column label="操作" width="220" fixed="right">
        <template #default="{ row }">
          <!-- 分享 -->
          <el-button v-if="row.type !== 'folder'" type="primary" :icon="Share" circle @click="handleShare(row)" />
          <!-- 下载 -->
          <el-button v-if="row.type !== 'folder'" type="success" :icon="Download" circle @click="handleDownload(row)" />
          <!-- 删除 -->
          <el-button
              type="danger"
              :icon="Delete"
              circle
              @click="handleDeleteConfirm(row)"
          />
        </template>
      </el-table-column>
      <!-- 空状态提示 -->
      <template #empty>
        <el-empty
            description="暂无文件"
            image-size="120"
            class="custom-empty"
        >
          <template #image>
            <el-icon :size="60" color="#67C23A"><FolderOpened/></el-icon>
          </template>
        </el-empty>
      </template>
    </el-table>

    <!-- 批量操作栏：显示选中文件数和批量操作 -->
    <div v-if="selectedFiles.length > 0" class="batch-operation-bar">
      <span>已选择 {{ selectedFiles.length }} 个文件</span>
      <el-button type="danger" :icon="Delete" @click="handleBatchDelete">批量删除</el-button>
<!--      <el-button type="success" :icon="Download" @click="handleBatchDownload">批量下载</el-button>-->
    </div>

    <!-- 隐藏的上传组件（通过按钮触发） -->
    <el-upload
        class="hidden-upload"
        ref="uploadRef"
        :auto-upload="false"
        :on-change="handleFileChange"
        multiple
    >
      <template #trigger>
        <div style="display: none"></div>
      </template>
    </el-upload>
  </div>
  <!-- 新建文件夹对话框 -->
  <el-dialog
      v-model="showDialog"
      title="新建文件夹"
      width="400px"
      align-center
      @closed="resetForm"
  >
    <el-form :model="folderForm" label-width="80px">
      <el-form-item label="名称" required>
        <el-input
            v-model="folderForm.name"
            placeholder="请输入文件夹名称"
            clearable
            maxlength="50"
            show-word-limit
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="showDialog = false">取消</el-button>
      <el-button
          type="primary"
          :disabled="!folderForm.name"
          @click="confirmCreateFolder"
      >
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import {computed, onMounted, reactive, ref} from 'vue'
import {
  ArrowLeftBold as Back,
  Delete,
  Document,
  Download,
  Folder,
  FolderAdd,
  FolderOpened,
  Picture,
  Search,
  Share,
  UploadFilled,
  VideoPlay
} from '@element-plus/icons-vue'
import {useUserInfoStore} from "@/stores/userInfo.js";
import {useTokenStore} from "@/stores/token.js";
import {createFolder, deleteFolder, fileDeleteService, fileNodeTreeService, fileUpdateService} from "@/api/file.js";
import {ElMessage, ElMessageBox} from "element-plus";
import {usePathStore} from "@/stores/path.js"
import router from "@/router/index.js";
import {useActiveStore} from "@/stores/active.js";
import {useUploadListStore} from "@/stores/uploadList.js";
import {v4 as uuidv4} from 'https://cdn.skypack.dev/uuid';
import {useDownListStore} from "@/stores/downList.js";
import openFile from "@/utils/openFile.js";

const userInfoStore = useUserInfoStore();
const tokenStore = useTokenStore();
const pathStore = usePathStore();
const downListStore = useDownListStore()
const files = ref([])

onMounted(() => {
  if (pathStore.path.length < 1) {
    pathStore.setPath([userInfoStore.userId])
  }
  renewal()
  console.log(pathStore.path)
})
/* 公共工具函数 */
// 格式化时间戳为本地日期时间格式
const formatDateTime = (timestamp) => {
  if (!timestamp) return '-'
  const date = new Date(timestamp)

  // 使用国际API进行格式化，兼容性更好
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(date)
}
/* 文件数据相关 */
// 刷新文件列表数据
const renewal = async ()=>{
  const fileList = await fileNodeTreeService(tokenStore.token);
  JSON.parse(fileList.data).forEach((item) => {
    files.value.push(item);
  });
}
// 计算当前路径下的文件列表
const currentFiles = ref(computed(() => {
  const currentFolder = files.value.find((file) => {
    return  file.id === pathStore.path[pathStore.path.length - 1];
  })
  return currentFolder?.children
      ?.map(id => files.value.find(file => file.id === id))
      ?.filter(Boolean) || []
}))

/* 用户交互处理 */
// 处理文件夹点击（导航到子目录
const handleFolderClick = (row) => {
  if (row.type === 'folder') {
    pathStore.pushPath(row.id)
  }
  console.log(pathStore.path)
}

// 返回上一级
const goBack = () => {
  if (pathStore.path.length > 1) {
    pathStore.popPath();
  }
  console.log(pathStore.path)
}

/* 文件搜索功能 */
const searchQuery = ref('')
// 计算过滤后的文件列表
const filteredFiles = ref(computed(() => {
  if (!searchQuery.value) return currentFiles.value
  const query = searchQuery.value.toLowerCase()
  return currentFiles.value.filter(file =>
      file.name.toLowerCase().includes(query)
  )
}))

// 文件图标映射
const fileIcons = {
  folder: Folder,
  image: Picture,
  pdf: Document,
  video: VideoPlay,
  default: Document
}

/* 文件类型处理 */
// 获取文件类型对应的图标组件
const getFileIcon = (file) => {
  return fileIcons[file.type] || fileIcons.default
}

// 判断是否为图片
const isImage = (file) => {
  return file.type === 'image'
}

// 格式化文件大小（B/KB/MB/GB）
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 选择处理
const selectedFiles = ref([])
const handleSelectionChange = (selection) => {
  selectedFiles.value = selection
}

/* 文件操作处理 */
// 处理文件分享
const handleShare = (file) => {
  openFile.handleOpenFolder(file.url + 'sfnd')
  // ElMessage.success(`已复制链接`)
}

// 处理文件下载
const handleDownload = async (file) => {

  // if (!downLoadPathStore.downLoadPath){
  //   alert({
  //     title: '未设定下载地址',
  //     message: '请点击右上角头像，在设置中添加下载地址'
  //   })
  //   return
  // }
  // await router.push('/main/file/FileDownload');
  // const activeStore = useActiveStore();
  // activeStore.setActive('/main/file/FileDownload');
  // console.log(downLoadPathStore.downLoadPath+file.name)
  // const result = await fileDownService(tokenStore.token,file.id,downLoadPathStore.downLoadPath,file.name)
  // console.log(result)
  // if (result.code === 0) {
  //   ElMessage.success(`下载文件：${file.name}`)
  // }

  console.log(file)
  const link = document.createElement('a')
  link.href = file.url
  link.download = file.name // 设置下载文件名
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  downListStore.pushDownFinishList({
    fileName: file.name,
    finishData: new Date().toLocaleString(),
    fileSize: formatFileSize(file.size),
  })
}

/* 批量操作 */
// 处理批量删除
const handleBatchDelete = () => {
  ElMessageBox.confirm(
      `确定要永久删除这些文件吗？真的很久`,
      '删除确认',
      {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'delete-confirm-dialog',
        confirmButtonClass: 'confirm-delete-btn',
        cancelButtonClass: 'cancel-delete-btn'
      }
  ).then(async () => {
    //这里是偷懒，更节约网络资源与通信时间的方式是将删除接口的参数改为数组解决批量问题
    for (const file of selectedFiles.value) {
      if (file.type === 'folder') {
        await deleteFolder(tokenStore.token, file.id)
      }else {
        await fileDeleteService(tokenStore.token, file.id)
        const uploadListStore = useUploadListStore()
        if (uploadListStore.hasFinishList(file.id.match(/^[^.]+/)[0])) {
          uploadListStore.deleteUploadList(file.id.match(/^[^.]+/)[0])
        }
      }
      // 更新文件列表（两种方式任选其一）
      // 方式一：直接过滤删除项（更高效）
      files.value = files.value.filter(f => f.id !== file.id)
      await renewal()
      // // 方式二：重新获取最新数据（更可靠）

      ElMessage.success(`已删除 ${file.name}`)
    }

  }).catch(() => {
    ElMessage.info('已取消删除')
  })

  // 批量删除逻辑
}

// const handleBatchDownload = () => {
//   // 批量下载逻辑
// }

// 上传处理
const uploadRef = ref([])
const handleUpload = async () => {
  uploadRef.value.$el.querySelector('input').click()
}
// 处理上传文件
const handleFileChange = async (file) => {

  var data = new FormData();
  data.append('file', file.raw);
  await router.push('/main/file/FileUpload');
  const activeStore = useActiveStore();
  activeStore.setActive('/main/file/FileUpload');
  const uuid = uuidv4();
  const result = await fileUpdateService(tokenStore.token,pathStore.path[pathStore.path.length - 1],data,file.name,uuid);
  const uploadListStore = useUploadListStore()
  const temp = []
  if(result.code === 1){
    ElMessage.error({
      message: result.msg,
      duration: 2000
    })
  }else {
    pathStore.path.forEach((element) => {
      temp.push(element);
    });
    temp.push(result.data)
    uploadListStore.getFinishList(uuid).path = temp
  }
}
//单个删除
const handleDeleteConfirm = (file) => {
  ElMessageBox.confirm(
      `确定要永久删除 "${file.name}" 吗？真的很久`,
      '删除确认',
      {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'delete-confirm-dialog',
        confirmButtonClass: 'confirm-delete-btn',
        cancelButtonClass: 'cancel-delete-btn'
      }
  ).then(async () => {
    if (file.type === 'folder') {
      await deleteFolder(tokenStore.token, file.id)
    }else {
      await fileDeleteService(tokenStore.token, file.id)
      const uploadListStore = useUploadListStore()
      if (uploadListStore.hasFinishList(file.id.match(/^[^.]+/)[0])) {
        uploadListStore.deleteUploadList(file.id.match(/^[^.]+/)[0])
      }
    }


    // 更新文件列表（两种方式任选其一）
    // 方式一：直接过滤删除项（更高效）
    files.value = files.value.filter(f => f.id !== file.id)
    await renewal()
    // // 方式二：重新获取最新数据（更可靠）

    ElMessage.success(`已删除 ${file.name}`)
  }).catch(() => {
    ElMessage.info('已取消删除')
  })

}

/* 路径导航相关 */
// 计算面包屑导航数据（含折叠逻辑）
const breadcrumb = computed(() => {
  const pathItems = pathStore.path.map(id => {
    const file = files.value.find(f => f.id === id)
    return { id, name: file?.name || '未知路径' }
  })

  // 路径过长时显示省略号
  if (pathItems.length <= 3) return pathItems

  return [
    pathItems[0],
    { ellipsis: true },
    ...pathItems.slice(-2)
  ]
})

// 路径导航点击
const navigateTo = (id) => {
  const index = pathStore.path.findIndex(pathId => pathId === id)
  if (index >= 0) {
    pathStore.path = pathStore.path.slice(0, index + 1)
  }
}
/* 新建文件夹功能 */
const showDialog = ref(false);
const folderForm = reactive({
  name: ''
});

// 打开新建文件夹对话框
const addFolder = () => {
  showDialog.value = true;
};

const resetForm = () => {
  folderForm.name = '';
};
// 确认创建新文件夹
const confirmCreateFolder = async () => {
  try {
    console.log(folderForm.name)
    console.log(pathStore.path[pathStore.path.length - 1])
    // 调用创建文件夹API（假设存在createFolderService）
    const result = await createFolder(
        tokenStore.token,
        folderForm.name,
        pathStore.path[pathStore.path.length - 1]
    );
    ElMessage.success('文件夹创建成功');
    // 立即添加新文件夹到本地数据

    files.value.push({
      id: result.data,
      name: folderForm.name,
      type: 'folder',
      children: [],
      updatedAt: new Date().toISOString()
    });
    //更新页面显示（很诡异的写法，不知为何这里响应式数据没有生效，测试了很多方法，这是第一个可行方案）
    await router.push('/main/file/FileUpload');
    await router.push('/main/file/FileManage');

    showDialog.value = false;
    await renewal(); // 刷新文件列表
  } catch (error) {
    ElMessage.error(`创建失败: ${error.message}`);
  }
};

</script>

<style lang="scss" scoped>
/* 对话框内容区调整 */
:deep(.el-dialog__body) {
  padding: 20px 25px;// 优化内边距
}
/* 表单标签间距调整 */
:deep(.el-form-item__label) {
  padding-right: 15px;
}
/* 输入框宽度设置 */
.el-input {
  width: 100%;
}

/* 路径导航样式 */
.path-navigation {
  margin-bottom: 20px;
  padding: 12px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);// 添加立体阴影效果
  /* 面包屑导航基础样式 */
  .el-breadcrumb {
    font-size: 14px;

    /* 路径项交互样式 */
    .path-item {
      cursor: pointer;
      color: #606266;
      transition: all 0.3s ease;// 平滑过渡效果
      padding: 4px 8px;
      border-radius: 4px;
      /* 悬停状态效果 */
      &:hover {
        color: #409EFF;
        background: rgba(64, 158, 255, 0.1);// 半透明背景
        transform: translateY(-1px);// 轻微上移效果
      }
      /* 点击状态效果 */
      &:active {
        transform: translateY(0);
      }
    }
    /* 省略号项样式 */
    .ellipsis-item {
      pointer-events: none;// 禁用点击事件
      color: #909399;
    }
  }
}

/* 删除确认对话框深度样式 */
:deep(.delete-confirm-dialog) {
  border-radius: 12px;// 大圆角设计
  /* 对话框头部样式 */
  .el-message-box__header {
    background: #f8f9fc;// 浅色背景
    padding: 16px;
    border-radius: 12px 12px 0 0;// 顶部圆角匹配
  }

  .el-message-box__content {
    padding: 24px;
  }
  /* 确认按钮特殊样式 */
  .confirm-delete-btn {
    background-color: #f56c6c;
    border-color: #f56c6c;
    transition: all 0.3s ease;
    /* 悬停状态加强 */
    &:hover {
      background-color: #f78989;
      border-color: #f78989;
      transform: translateY(-1px);
    }
  }

  .cancel-delete-btn {
    &:hover {
      color: #409EFF;
      border-color: #409EFF;
    }
  }
}


/* 通用可点击元素样式 */
.clickable {
  cursor: pointer;
  /* 悬停背景色变化 */
  &:hover {
    background-color: #f5f7fa;
  }
}
/* 文件夹名称特殊样式 */
.folder-name {
  color: #409EFF;
  /* 悬停下划线效果 */
  &:hover {
    text-decoration: underline;
  }
}


/* 文件管理主容器布局 */
.file-manager-container {
  padding: 20px;
  background: #f5f7fa;// 浅灰背景
  min-height: 100vh;// 撑满可视高度
  /* 操作工具栏样式 */
  .operation-bar {
    margin-bottom: 20px;
    padding: 15px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);// 柔和阴影
  }
  /* 文件项布局样式 */
  .file-item {
    display: flex;
    align-items: center;
    padding: 8px 0;
    /* 文件图标样式 */
    .file-icon {
      margin-right: 12px;
      color: #409EFF;
    }
    /* 文件名溢出处理 */
    .file-name {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  /* 批量操作栏定位样式 */
  .batch-operation-bar {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);// 水平居中
    padding: 12px 24px;
    background: white;
    border-radius: 24px;// 胶囊形状
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);// 明显阴影
    display: flex;
    align-items: center;
    gap: 20px;
  }
  /* 表格全局样式调整 */
  :deep(.el-table) {
    --el-table-border-color: transparent;// 隐藏边框
    --el-table-header-bg-color: #f8f9fc;// 浅色表头背景
    /* 行悬停效果 */
    th {
      font-weight: 600;
    }
    /* 隐藏上传组件 */
    tr:hover td {
      background-color: #fafbff !important;
    }
  }

  .hidden-upload {
    display: none;
  }
}
</style>