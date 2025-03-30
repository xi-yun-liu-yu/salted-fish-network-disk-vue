<template>
  <!-- 用户资料主容器 -->
  <div class="user-profile-container">
    <!-- 头像上传区域：点击触发文件选择 -->
    <div class="avatar-section" @click="triggerAvatarUpload">
      <transition name="scale" mode="out-in">
        <!-- 头像展示状态 -->
        <div v-if="!uploading" class="avatar-wrapper">
          <el-avatar :size="120" :src="userStore.avatarUrl" class="hover-effect">
            <el-icon :size="40"><User /></el-icon>
          </el-avatar>
          <!-- 上传蒙层提示 -->
          <div class="upload-mask">
            <el-icon :size="24"><Camera /></el-icon>
          </div>
          <!-- 上传加载状态 -->
        </div>
        <div v-else class="upload-loading">
          <el-icon class="loading-icon" :size="40"><Loading /></el-icon>
        </div>
      </transition>
      <!-- 隐藏的文件输入 -->
      <input
          ref="avatarInput"
          type="file"
          accept="image/*"
          class="hidden-input"
          @change="handleAvatarChange"
      />
    </div>
    <!-- 个人信息展示区域 -->
    <div class="info-section">
      <!-- 昵称信息项 -->
      <div class="info-item animate-item">
        <el-icon class="info-icon"><User /></el-icon>
        <div class="info-content">
          <div class="info-label">昵称</div>
          <div class="info-value">{{ userStore.nickname }}</div>
        </div>
        <el-button
            type="primary"
            link
            class="edit-btn"
            @click="openEditDialog('nickname')"
        >
          <el-icon><EditPen /></el-icon>
          修改
        </el-button>
      </div>
      <!-- 邮箱信息项 -->
      <div class="info-item animate-item">
        <el-icon class="info-icon"><Message /></el-icon>
        <div class="info-content">
          <div class="info-label">邮箱</div>
          <div class="info-value">{{ userStore.email }}</div>
        </div>
        <el-button
            type="primary"
            link
            class="edit-btn"
            @click="openEditDialog('email')"
        >
          <el-icon><EditPen /></el-icon>
          修改
        </el-button>
      </div>

      <!-- 存储空间展示 -->
      <div class="storage-section animate-item">
        <div class="storage-header">
          <el-icon class="storage-icon"><Folder /></el-icon>
          <span>存储空间</span>
          <el-tag type="info" size="small">
            {{ formatStorage(userStore.usedStorage) }} / {{ formatStorage(userStore.storageLimit) }}
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

      <!-- 编辑信息对话框 -->
      <el-dialog
          v-model="showEditDialog"
          :title="`修改${editType === 'nickname' ? '昵称' : '邮箱'}`"
          width="400px"
      >
        <el-form :model="editForm" label-width="80px">
          <el-form-item v-if="editType === 'nickname'" label="新昵称">
            <el-input v-model="editForm.newValue" />
          </el-form-item>

          <el-form-item v-if="editType === 'email'" label="新邮箱">
            <el-input v-model="editForm.newValue" type="email" />
          </el-form-item>
        </el-form>

        <template #footer>
          <el-button @click="showEditDialog = false" style="margin-top: 0;margin-right: 12px">取消</el-button>
          <el-button type="primary" @click="confirmEdit" style="margin-top: 0;margin-right: 12px">确认修改</el-button>
        </template>
      </el-dialog>

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

    <el-dialog
        v-model="showPasswordDialog.step1"
        title="验证原密码"
        width="400px"
        :close-on-click-modal="false"
    >
      <el-form :model="passwordForm" label-width="80px">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input
              v-model="passwordForm.oldPassword"
              type="password"
              show-password
              placeholder="请输入当前密码"
          />
        </el-form-item>
      </el-form>
      <!-- 修改密码对话框 -->
      <template #footer>
        <el-button @click="showPasswordDialog.step1 = false" style="margin-top: 0;margin-right: 12px">取消</el-button>
        <el-button
            type="primary"
            :loading="verifying"
            @click="verifyOldPassword"
            style="margin-top: 0;margin-right: 12px"
        >
          下一步
        </el-button>
      </template>
    </el-dialog>

    <el-dialog
        v-model="showPasswordDialog.step2"
        title="设置新密码"
        width="400px"
        :close-on-click-modal="false"
    >
      <el-form :model="passwordForm" autocomplete="off" label-width="80px" :rules = "rules">
        <el-form-item label="新密码" prop="newPassword">
          <el-input
              v-model="passwordForm.newPassword"
              type="password"
              show-password
              placeholder="请输入新密码"
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="rePassword">
          <el-input
              v-model="passwordForm.rePassword"
              type="password"
              show-password
              placeholder="请再次输入新密码"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showPasswordDialog.step2 = false" style="margin-top: 0;margin-right: 12px">上一步</el-button>
        <el-button
            type="primary"
            :loading="updating"
            @click="updatePassword"
            style="margin-top: 0;margin-right: 12px"
        >
          确认修改
        </el-button>
      </template>
    </el-dialog>
  </div>
  <!-- 套餐升级对话框 -->
  <el-dialog
      v-model="showUpgradeDialog"
      title="升级存储空间"
      width="680px"

      class="vip-dialog"
  >
    <div class="upgrade-container">
      <!-- 套餐选择 -->
      <div class="plan-selector">
        <div
            v-for="plan in plans"
            :key="plan.type"
            class="plan-card"
            :class="{ 'active': selectedPlan === plan.type }"
            @click="selectedPlan = plan.type"
        >
          <div class="plan-badge" :style="{ backgroundColor: plan.color }">
            {{ plan.title }}
          </div>
          <div class="price">
            <span class="symbol">¥</span>
            <span class="amount">{{ plan.price }}</span>
            <span class="duration">/{{ plan.duration }}</span>
          </div>
          <div class="storage">
            <el-icon><Folder /></el-icon>
            {{ plan.storage }}
          </div>
        </div>
      </div>

      <!-- 权益表格 -->
      <div class="benefits-table">
        <div class="benefits-header">
          <el-icon><StarFilled /></el-icon>
          <span>{{ currentPlan.title }}专属权益</span>
        </div>
        <el-scrollbar>
          <div class="benefits-list">
            <div
                v-for="(benefit, index) in currentPlan.benefits"
                :key="index"
                class="benefit-item"
            >
              <el-icon class="check-icon"><Select /></el-icon>
              <span class="benefit-text">{{ benefit }}</span>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>

    <template #footer>
      <el-button
          type="primary"
          class="confirm-btn"
          @click="handleUpgrade()"
      >
        立即升级（{{ currentPlan.price }}元/{{ currentPlan.duration }}）
      </el-button>
    </template>
  </el-dialog>

</template>

<script setup>
// 新增图标引入
import { CirclePlus } from '@element-plus/icons-vue'


import {ref, computed, reactive, toRefs, onMounted} from 'vue'

import {
  User,
  Camera,
  Loading,
  Monitor,
  Message,
  Folder,
  EditPen,
  StarFilled,
  Select
} from '@element-plus/icons-vue'
import {useTokenStore} from "@/stores/token.js";
import {useUserInfoStore} from "@/stores/userInfo.js";
import {ElMessage} from 'element-plus'
import {
  userAddStorageService,
  userAvatarService,
  userGetService,
  userPutService,
  userVerifyPasswordService
} from "@/api/user.js";

const userStore = useUserInfoStore();
const tokenStore = useTokenStore();

onMounted(() => {
  console.log('页面加载完成，发送初始化请求')
  renewal()
})

const renewal = async ()=>{
  const userInfoStore = useUserInfoStore()
  userInfoStore.setUserInfo(await (await userGetService(tokenStore.token)).data)
}

const showUpgradeDialog = ref(false)
const selectedPlan = ref('vip')

const plans = [
  {
    type: 'vip',
    title: 'VIP会员',
    price: 15,
    duration: '月',
    storage: '50GB',
    color: '#ffc107',
    benefits: [
      '50GB专属存储空间',
      '单文件上传限制提升至500MB',
      '高速下载通道',
      '专属客服优先接入',
      '每月5次大文件极速传输'
    ]
  },
  {
    type: 'svip',
    title: '超级VIP',
    price: 128,
    duration: '年',
    storage: '200GB',
    color: '#e91e63',
    benefits: [
      '200GB超大存储空间',
      '单文件上传限制提升至2GB',
      '极速下载通道',
      '24小时专属客服',
      '无限次大文件极速传输',
      '云文件智能整理'
    ]
  },
  {
    type: 'custom',
    title: '按需扩容',
    price: 0.5,
    duration: 'GB/月',
    storage: '灵活扩展',
    color: '#4caf50',
    benefits: [
      '按实际使用量计费',
      '最小扩容单位10GB',
      '随时调整存储空间',
      '支持按日计费',
      '与企业账户兼容'
    ]
  }
]

const currentPlan = computed(() =>
    plans.find(plan => plan.type === selectedPlan.value)
)

const handleUpgradeStorage = () => {
  showUpgradeDialog.value = true
}

/* 套餐升级功能 */
// 处理套餐升级
const handleUpgrade = async () => {
  try {
    // 调用支付接口
    ElMessage.success('正在跳转支付...')
    showUpgradeDialog.value = false
    ElMessage.success('模拟支付成功')
    let value = 0
    switch (selectedPlan.value){
      case 'vip':
        value = 50*1024*1024*1024
        break
      case 'svip':
        value = 120*1024*1024*1024
        break
      case 'custom':
        value = 10*1024*1024*1024
        break
    }
    await userAddStorageService(tokenStore.token,value);
    const userInfoStore = useUserInfoStore();
    ElMessage.success('储存空间增加'+formatStorage(value))
    userInfoStore.setUserInfo(await (await userGetService(tokenStore.token)).data);
  } catch (error) {
    ElMessage.error('操作失败: ' + error.message)
  }
}


const showEditDialog = ref(false)
const editType = ref('nickname')
const editForm = reactive({
  newValue: ''
})

const openEditDialog = (type) => {
  editType.value = type
  editForm.newValue = userStore[editType.value]
  showEditDialog.value = true
}

const confirmEdit = async () => {
  try {

    let result = null
    if (editType.value === "nickname"){
      result = await userPutService(tokenStore.token,userStore.email,editForm.newValue);
    }else{
      result = await userPutService(tokenStore.token,editForm.newValue,userStore.nickname);
    }

    if (result.code === 0){
      // 更新store
      userStore[editType.value] = editForm.newValue

      ElMessage.success('修改成功')
      showEditDialog.value = false

      if (editType.value === 'email') {
        // 重新验证邮箱等操作
      }
    }else {
      ElMessage.error(`修改失败: ` + result.message)
    }


  } catch (error) {
    ElMessage.error(`修改失败: ${error.message}`)
  }
}


const emit = defineEmits(['update-password', 'update-avatar'])

/* 存储空间计算 */
// 计算已用空间百分比
const storagePercentage = computed(() => {
  return Math.round((userStore.usedStorage / userStore.storageLimit) * 100)
})
// 格式化存储空间显示
const formatStorage = (bytes) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let unitIndex = 0
  while (bytes >= 1024 && unitIndex < units.length - 1) {
    bytes /= 1024
    unitIndex++
  }
  return `${bytes.toFixed(1)} ${units[unitIndex]}`
}


const avatarInput = ref(null)
const uploading = ref(false)

const triggerAvatarUpload = () => {
  avatarInput.value.click()
}
/* 头像上传处理 */
const handleAvatarChange = async (event) => {
  const file = event.target.files[0]
  console.log(event)
  console.log(file)
  if (!file.type.startsWith('image/')) {
    ElMessage.error('请选择图片文件')
    return
  }

  uploading.value = true
  try {
    var data = new FormData();
    data.append('file', file);
    const type = file.type.substring(file.type.indexOf('/') + 1)
    const temp = (userStore?.avatarUrl || '').split('/');
    const fileName = temp[temp.length - 1]
    const result = await userAvatarService(tokenStore.token,data,type,fileName);
    userStore.avatarUrl = result.data;
    emit('update-avatar', result)
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



// 新增状态管理
const showPasswordDialog = reactive({
  step1: false,
  step2: false
})

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  rePassword: ''
})

const verifying = ref(false)
const updating = ref(false)
const checkRePassword = (rule,value,callback)=>{
  if(value===''){
    callback(new Error('请再次输入密码'))
  }else if(value !== passwordForm.value.newPassword){
    callback(new Error('请确保两次输入的密码一样'))
  }else {
    callback()
  }
}
const rules ={
  newPassword: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 8, max: 32, message: '密码长度应在8至32个字符以内，且只包含大小写', trigger:'blur'},
  ],
  rePassword: [
    {validator: checkRePassword, trigger: 'blur'},
  ]
}

const handleChangePassword = () => {
  // 重置表单
  Object.assign(passwordForm.value, {
    oldPassword: '',
    newPassword: '',
    rePassword: ''
  });

  showPasswordDialog.step1 = true
}

/* 密码修改流程 */
// 验证原密码
const verifyOldPassword = async () => {
  if (!passwordForm.value.oldPassword) {
    ElMessage.warning('请输入原密码')
    return
  }

  verifying.value = true
  try {
    // 调用验证原密码接口
    console.log(tokenStore.token)
    const valid = await userVerifyPasswordService(tokenStore.token,passwordForm.value.oldPassword)

    if (valid.data === "验证成功") {
      ElMessage.success('验证成功,请修改密码')
      showPasswordDialog.step1 = false
      showPasswordDialog.step2 = true
    } else {
      ElMessage.error('原密码不正确')
    }
  } catch (error) {
    ElMessage.error('验证失败: ' + error.message)
  } finally {
    verifying.value = false
  }
}

const updatePassword = async () => {

  updating.value = true
  try {
    // 调用修改密码接口
    // await api.updatePassword(passwordForm.newPassword)
    ElMessage.success('密码修改成功')
    showPasswordDialog.step2 = false
    emit('update-password') // 如果需要可以触发事件
  } catch (error) {
    ElMessage.error('修改失败: ' + error.message)
  } finally {
    updating.value = false
  }
}
</script>

<style lang="scss" scoped>
.el-scrollbar {
  height: 85%;
}

.upgrade-container {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 24px;
  height: 440px;
}

.plan-selector {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.plan-card {
  position: relative;
  padding: 20px;
  border-radius: 12px;
  border: 2px solid #ebeef5;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &.active {
    border-color: var(--el-color-primary);
    background: rgba(64, 158, 255, 0.05);

    .plan-badge {
      transform: scale(1.05);
    }
  }
}

.plan-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 16px;
  border-radius: 20px;
  color: white;
  font-weight: bold;
  font-size: 12px;
  transition: all 0.3s ease;
}

.price {
  text-align: center;
  margin: 16px 0;

  .symbol {
    font-size: 20px;
    color: #f56c6c;
  }

  .amount {
    font-size: 32px;
    font-weight: bold;
    margin: 0 4px;
  }

  .duration {
    color: #909399;
    font-size: 14px;
  }
}

.storage {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #606266;
}

.benefits-table {
  border: 1px solid #ebeef5;
  border-radius: 12px;
  padding: 16px;
}

.benefits-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  color: var(--el-color-primary);
  margin-bottom: 16px;
}

.benefits-list {
  display: grid;
  gap: 12px;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border-radius: 8px;
  background: #f8f9fe;
  transition: all 0.2s ease;

  &:hover {
    transform: translateX(8px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
}

.check-icon {
  color: #4caf50;
  font-size: 18px;
}

.confirm-btn {
  width: 100%;
  padding: 16px;
  font-size: 16px;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  }
}

/* 升级套餐对话框动画 */
.vip-dialog {
  :deep(.el-dialog) {
    animation: dialogEnter 0.4s ease;
  }
}
/* 关键帧动画 */
@keyframes dialogEnter {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.el-button+.el-button {
  margin-left: 0;
  margin-top: 24px;
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
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
    }

    &:active {
      transform: translateY(1px);
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

/* 用户资料主容器样式 */
.user-profile-container {
  padding: 32px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(64, 158, 255, 0.1);
  max-width: 480px;
  margin: 0 auto;
}
/* 头像区域样式 */
.avatar-section {
  position: relative;
  margin-bottom: 32px;
  display: flex;
  justify-content: center;
  /* 头像悬停效果 */
  .avatar-wrapper {
    position: relative;
    cursor: pointer;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05);
      animation: floating 3s ease-in-out infinite;

      .upload-mask {
        opacity: 1; // 显示上传蒙层
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
  /* 上传加载动画 */
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
  /* 信息项通用样式 */
  .info-item {
    display: flex;
    align-items: center;
    padding: 16px;
    margin-bottom: 12px;
    background: #f8f9fe;
    border-radius: 12px;
    transition: all 0.3s ease;
    /* 悬停效果 */
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
/* 存储空间进度条样式 */
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
/* 操作按钮组样式 */
.action-button {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);// 上浮效果
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);// 动态阴影
  }

  &:active {
    transform: translateY(1px);
  }
}
/* 关键帧动画 */
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


.info-item {
  position: relative;
  padding-right: 100px; // 为按钮留出空间


  .edit-btn {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    padding: 8px;

    .el-icon {
      margin-right: 4px;
    }

    &:hover {
      color: var(--el-color-primary);
      background: rgba(64, 158, 255, 0.1);
    }
  }
}

/*对话框自定义样式*/
:deep(.el-dialog) {
  border-radius: 12px;

  .el-dialog__header {
    border-bottom: 1px solid #eee;
    margin-bottom: 20px;
  }

  .el-dialog__footer {
    border-top: 1px solid #eee;
    padding-top: 20px;
  }


}


</style>