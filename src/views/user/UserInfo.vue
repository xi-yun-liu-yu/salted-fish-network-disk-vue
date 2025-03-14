<template>
  <div class="user-profile-container">
    <!-- 头像上传区域 -->
    <div class="avatar-section" @click="triggerAvatarUpload">
      <transition name="scale" mode="out-in">
        <div v-if="!uploading" class="avatar-wrapper">
          <el-avatar :size="120" :src="user.avatar" class="hover-effect">
            <el-icon :size="40"><User /></el-icon>
          </el-avatar>
          <div class="upload-mask">
            <el-icon :size="24"><Camera /></el-icon>
          </div>
        </div>
        <div v-else class="upload-loading">
          <el-icon class="loading-icon" :size="40"><Loading /></el-icon>
        </div>
      </transition>
      <input
          ref="avatarInput"
          type="file"
          accept="image/*"
          class="hidden-input"
          @change="handleAvatarChange"
      />
    </div>

    <!-- 用户信息 -->
    <div class="info-section">
      <div class="info-item animate-item">
        <el-icon class="info-icon"><User /></el-icon>
        <div class="info-content">
          <div class="info-label">昵称</div>
          <div class="info-value">{{ user.nickname }}</div>
        </div>
      </div>

      <div class="info-item animate-item">
        <el-icon class="info-icon"><Monitor /></el-icon>
        <div class="info-content">
          <div class="info-label">账号</div>
          <div class="info-value">{{ user.account }}</div>
        </div>
      </div>

      <!-- 存储空间 -->
      <div class="storage-section animate-item">
        <div class="storage-header">
          <el-icon class="storage-icon"><Folder /></el-icon>
          <span>存储空间</span>
          <el-tag type="info" size="small">
            {{ formatStorage(user.usedStorage) }} / {{ formatStorage(user.totalStorage) }}
          </el-tag>
        </div>
        <el-progress
            :percentage="storagePercentage"
            :color="customProgressColor"
            :stroke-width="10"
            striped
            animated
        />
      </div>
    </div>

    <!-- 操作按钮 -->
    <el-button
        type="primary"
        :icon="EditPen"
        class="action-button"
        @click="handleChangePassword"
    >
      修改密码
    </el-button>

    <el-button
        type="success"
        :icon="CirclePlus"
        class="action-button upgrade-button"
        @click="handleUpgradeStorage"
    >
      提升储存限额
    </el-button>

  </div>
</template>

<script setup>
// 新增图标引入
import { CirclePlus } from '@element-plus/icons-vue'

// 新增事件发射
const handleUpgradeStorage = () => {
  emit('upgrade-storage')
}
import { ref, computed } from 'vue'
import {
  User,
  Camera,
  Loading,
  Monitor,
  Folder,
  EditPen
} from '@element-plus/icons-vue'

const props = defineProps({
  user: {
    type: Object,
    default: () => ({
      avatar: '',
      nickname: '未命名用户',
      account: 'user@example.com',
      usedStorage: 15 * 1024 ** 3, // 15GB
      totalStorage: 50 * 1024 ** 3 // 50GB
    })
  }
})

const emit = defineEmits(['update-password', 'update-avatar'])

// 存储空间计算
const storagePercentage = computed(() => {
  return Math.round((props.user.usedStorage / props.user.totalStorage) * 100)
})

const formatStorage = (bytes) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let unitIndex = 0
  while (bytes >= 1024 && unitIndex < units.length - 1) {
    bytes /= 1024
    unitIndex++
  }
  return `${bytes.toFixed(1)} ${units[unitIndex]}`
}

// 头像上传处理
const avatarInput = ref(null)
const uploading = ref(false)

const triggerAvatarUpload = () => {
  avatarInput.value.click()
}

const handleAvatarChange = async (event) => {
  const file = event.target.files[0]
  if (!file.type.startsWith('image/')) {
    ElMessage.error('请选择图片文件')
    return
  }

  uploading.value = true
  try {
    // 模拟上传过程
    await new Promise(resolve => setTimeout(resolve, 1500))
    const newAvatar = URL.createObjectURL(file)
    emit('update-avatar', newAvatar)
    ElMessage.success('头像更新成功')
  } catch (error) {
    ElMessage.error('头像上传失败')
  } finally {
    uploading.value = false
    event.target.value = '' // 清除输入
  }
}

// 进度条渐变色
const customProgressColor = [
  { color: '#409EFF', percentage: 20 },
  { color: '#66b1ff', percentage: 50 },
  { color: '#79bbff', percentage: 80 }
]

const handleChangePassword = () => {
  emit('update-password')
}
</script>

<style lang="scss" scoped>

.el-button+.el-button {
  margin-top: 24px;
  margin-left: 0;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;

  .action-button {
    width: 100%;
    padding: 12px;
    border-radius: 12px;
    transition: all 0.3s ease;

    &:hover {
      //transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
    }

    &:active {
      //transform: translateY(1px);
    }

    &.upgrade-button {
      background: linear-gradient(135deg, #67c23a, #85ce61);
      border-color: transparent;
      color: white;

      &:hover {
        box-shadow: 0 4px 12px rgba(103, 194, 58, 0.3);
      }
    }
  }
}


.user-profile-container {
  padding: 32px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(64, 158, 255, 0.1);
  max-width: 480px;
  margin: 0 auto;
}

.avatar-section {
  position: relative;
  margin-bottom: 32px;
  display: flex;
  justify-content: center;

  .avatar-wrapper {
    position: relative;
    cursor: pointer;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05);
      animation: floating 3s ease-in-out infinite;

      .upload-mask {
        opacity: 1;
      }
    }
  }

  .upload-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;

    .el-icon {
      color: white;
    }
  }

  .upload-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 120px;

    .loading-icon {
      animation: rotating 2s linear infinite;
    }
  }

  .hidden-input {
    display: none;
  }
}

.info-section {
  margin-bottom: 24px;

  .info-item {
    display: flex;
    align-items: center;
    padding: 16px;
    margin-bottom: 12px;
    background: #f8f9fe;
    border-radius: 12px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateX(8px);
      box-shadow: 0 4px 12px rgba(64, 158, 255, 0.1);
    }

    .info-icon {
      font-size: 24px;
      color: #409EFF;
      margin-right: 16px;
    }

    .info-content {
      flex: 1;

      .info-label {
        color: #909399;
        font-size: 12px;
        margin-bottom: 4px;
      }

      .info-value {
        color: #303133;
        font-weight: 500;
      }
    }
  }
}

.storage-section {
  padding: 16px;
  background: #f8f9fe;
  border-radius: 12px;

  .storage-header {
    display: flex;
    align-items: center;
    margin-bottom: 12px;

    .storage-icon {
      color: #409EFF;
      margin-right: 8px;
      font-size: 20px;
    }

    .el-tag {
      margin-left: auto;
    }
  }

  :deep(.el-progress) {
    .el-progress-bar {
      padding-right: 0;
    }

    .el-progress__text {
      font-weight: bold;
      color: #409EFF;
    }
  }
}

.action-button {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
  }

  &:active {
    transform: translateY(1px);
  }
}

@keyframes floating {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes rotating {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-item {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.6s ease forwards;

  @for $i from 1 through 3 {
    &:nth-child(#{$i}) {
      animation-delay: 0.1s * $i;
    }
  }
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>