<template>
  <div class="file-manager-container">
    <!-- 路径导航 -->
    <div class="path-navigation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item
            v-for="(item, index) in breadcrumb"
            :key="index"
            :class="{ 'ellipsis-item': item.ellipsis }"
        >
          <template v-if="item.ellipsis">...</template>
          <template v-else>
            <span @click="navigateTo(item.id)" class="path-item">
              {{ item.name }}
            </span>
          </template>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 操作工具栏 -->
    <div class="operation-bar">
      <el-button
          v-if="currentPath.length > 1"
          @click="goBack"
          :icon="Back"
          circle
      />
      <el-button type="primary" :icon="UploadFilled" @click="handleUpload">
        上传文件
      </el-button>
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

    <!-- 文件表格 -->
    <el-table
        :data="filteredFiles"
        style="width: 100%"
        @selection-change="handleSelectionChange"
    >
      <!-- 多选列 -->
      <el-table-column type="selection" width="55" />

      <!-- 文件名称列 -->
      <el-table-column prop="name" label="名称" min-width="300">
        <template #default="{ row }">
          <div
              class="file-item"
              :class="{ 'clickable': row.type === 'folder' }"
              @click="handleFolderClick(row)"
          >
            <el-icon class="file-icon" :size="24">
              <component :is="getFileIcon(row)" />
            </el-icon>
            <span class="file-name">{{ row.name }}</span>
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
      <el-table-column prop="size" label="大小" width="120">
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
      <el-table-column prop="modified" label="修改时间" width="180" />

      <!-- 操作列 -->
      <el-table-column label="操作" width="220" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" :icon="Share" circle @click="handleShare(row)" />
          <el-button type="success" :icon="Download" circle @click="handleDownload(row)" />
          <el-button
              type="danger"
              :icon="Delete"
              circle
              @click="handleDeleteConfirm(row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <!-- 批量操作栏 -->
    <div v-if="selectedFiles.length > 0" class="batch-operation-bar">
      <span>已选择 {{ selectedFiles.length }} 个文件</span>
      <el-button type="danger" :icon="Delete" @click="handleBatchDelete">批量删除</el-button>
      <el-button type="success" :icon="Download" @click="handleBatchDownload">批量下载</el-button>
    </div>

    <!-- 上传组件 -->
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
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {
  Folder,
  Picture,
  Document,
  VideoPlay,
  Download,
  Delete,
  Share,
  UploadFilled,
  Search,
  ArrowLeftBold as Back
} from '@element-plus/icons-vue'
import {useUserInfoStore} from "@/stores/userInfo.js";
import {useTokenStore} from "@/stores/token.js";
import {fileDeleteService, fileNodeTreeService} from "@/api/file.js";
import {ElMessage, ElMessageBox} from "element-plus";
const userInfoStore = useUserInfoStore();
const tokenStore = useTokenStore();
const files = ref([])

onMounted(() => {
  console.log('页面加载完成，发送初始化请求')
  renewal()
})

const emit = defineEmits(["delete-file"])

const renewal = async ()=>{
  const fileList = await fileNodeTreeService(tokenStore.token);
  JSON.parse(fileList.data).forEach((item) => {
    files.value.push(item);
  });

  console.log(files.value)
}


// 路径管理
const currentPath = ref([userInfoStore.userId]) // 初始路径为根目录


// 获取当前目录文件
const currentFiles = computed(() => {
  const currentFolder = files.value.find((file) => {
    return  file.id === currentPath.value[currentPath.value.length - 1];
  })
  return currentFolder?.children
      ?.map(id => files.value.find(file => file.id === id))
      ?.filter(Boolean) || []
})

// 处理文件夹点击
const handleFolderClick = (row) => {
  if (row.type === 'folder') {
    currentPath.value.push(row.id)
  }
}

// 返回上一级
const goBack = () => {
  if (currentPath.value.length > 1) {
    currentPath.value.pop()
  }
}

// 过滤搜索
const searchQuery = ref('')
const filteredFiles = computed(() => {
  if (!searchQuery.value) return currentFiles.value
  const query = searchQuery.value.toLowerCase()
  return currentFiles.value.filter(file =>
      file.name.toLowerCase().includes(query)
  )
})

// 文件图标映射
const fileIcons = {
  folder: Folder,
  image: Picture,
  pdf: Document,
  video: VideoPlay,
  default: Document
}

// 获取文件图标
const getFileIcon = (file) => {
  return fileIcons[file.type] || fileIcons.default
}

// 判断是否为图片
const isImage = (file) => {
  return file.type === 'image'
}

// 文件大小格式化
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

// 文件操作处理
const handleShare = (file) => {
  ElMessage.success(`分享文件：${file.name}`)
}

const handleDownload = (file) => {
  ElMessage.success(`下载文件：${file.name}`)
}

const handleDelete = async (file) => {
  // 删除逻辑
  await fileDeleteService(tokenStore.token,file.id);
  emit('delete-file')
  ElMessage.success(`已删除${file.name}`)
}

// 批量操作
const handleBatchDelete = () => {
  // 批量删除逻辑
}

const handleBatchDownload = () => {
  // 批量下载逻辑
}

// 上传处理
const uploadRef = ref(null)
const handleUpload = () => {
  uploadRef.value.$el.querySelector('input').click()

}

const handleFileChange = (file) => {
  // 处理上传文件
}


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
    await fileDeleteService(tokenStore.token, file.id)

    // 更新文件列表（两种方式任选其一）
    // 方式一：直接过滤删除项（更高效）
    files.value = files.value.filter(f => f.id !== file.id)

    // 方式二：重新获取最新数据（更可靠）
    // await renewal()

    ElMessage.success(`已删除 ${file.name}`)
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 路径导航计算属性
const breadcrumb = computed(() => {
  const pathItems = currentPath.value.map(id => {
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
  const index = currentPath.value.findIndex(pathId => pathId === id)
  if (index >= 0) {
    currentPath.value = currentPath.value.slice(0, index + 1)
  }
}



</script>

<style lang="scss" scoped>
.path-navigation {
  margin-bottom: 20px;
  padding: 12px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .el-breadcrumb {
    font-size: 14px;

    .path-item {
      cursor: pointer;
      color: #606266;
      transition: all 0.3s ease;
      padding: 4px 8px;
      border-radius: 4px;

      &:hover {
        color: #409EFF;
        background: rgba(64, 158, 255, 0.1);
        transform: translateY(-1px);
      }

      &:active {
        transform: translateY(0);
      }
    }

    .ellipsis-item {
      pointer-events: none;
      color: #909399;
    }
  }
}

// 删除确认弹窗样式
:deep(.delete-confirm-dialog) {
  border-radius: 12px;

  .el-message-box__header {
    background: #f8f9fc;
    padding: 16px;
    border-radius: 12px 12px 0 0;
  }

  .el-message-box__content {
    padding: 24px;
  }

  .confirm-delete-btn {
    background-color: #f56c6c;
    border-color: #f56c6c;
    transition: all 0.3s ease;

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


//

.clickable {
  cursor: pointer;
  &:hover {
    background-color: #f5f7fa;
  }
}

.folder-name {
  color: #409EFF;
  &:hover {
    text-decoration: underline;
  }
}

//

.file-manager-container {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;

  .operation-bar {
    margin-bottom: 20px;
    padding: 15px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  }

  .file-item {
    display: flex;
    align-items: center;
    padding: 8px 0;

    .file-icon {
      margin-right: 12px;
      color: #409EFF;
    }

    .file-name {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .batch-operation-bar {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 12px 24px;
    background: white;
    border-radius: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 20px;
  }

  :deep(.el-table) {
    --el-table-border-color: transparent;
    --el-table-header-bg-color: #f8f9fc;

    th {
      font-weight: 600;
    }

    tr:hover td {
      background-color: #fafbff !important;
    }
  }

  .hidden-upload {
    display: none;
  }
}
</style>