<template>
  <div class="file-manager-container">
    <!-- 操作工具栏 -->
    <div class="operation-bar">
      <el-button type="primary" :icon="UploadFilled" @click="handleUpload">
        上传文件
      </el-button>
      <el-input v-model="searchQuery" placeholder="搜索文件" style="width: 240px; margin-left: 20px">
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <!-- 文件表格 -->
    <el-table
        :data="files"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :row-class-name="tableRowClassName"
    >
      <!-- 多选列 -->
      <el-table-column type="selection" width="55" />

      <!-- 文件名称列 -->
      <el-table-column prop="name" label="名称" min-width="300">
        <template #default="{ row }">
          <div class="file-item">
            <el-icon class="file-icon" :size="24">
              <component :is="getFileIcon(row)" />
            </el-icon>
            <span class="file-name">{{ row.name }}</span>
            <el-image
                v-if="isImage(row)"
                style="width: 40px; height: 40px; margin-left: 12px"
                :src="row.thumbnail"
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
          <el-button type="danger" :icon="Delete" circle @click="handleDelete(row)" />
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
import { ref, computed } from 'vue'
import {
  Folder,
  Picture,
  Document,
  VideoPlay,
  Download,
  Delete,
  Share,
  UploadFilled,
  Search
} from '@element-plus/icons-vue'

// 文件数据示例
const files = ref([
  {
    id: 1,
    name: '项目文档',
    type: 'folder',
    size: 0,
    modified: '2023-07-20 14:30'
  },
  {
    id: 2,
    name: '风景.jpg',
    type: 'image',
    size: 2457600,
    modified: '2023-07-19 09:15',
    thumbnail: '/thumbnails/scenery.jpg',
    url: '/files/scenery.jpg'
  },
  // 更多文件数据...
])

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

const handleDelete = (file) => {
  // 删除逻辑
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
</script>

<style lang="scss" scoped>
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