<script setup>

/* 主布局组件 - 包含导航菜单、用户操作和内容区域 */

import {
  Management,
  Promotion,
  UserFilled,
  User,
  Setting,
  Paperclip,
  SwitchButton,
  Edit, Check,
  CaretBottom, UploadFilled, Download
} from '@element-plus/icons-vue'
import { ref } from 'vue'
import {useActiveStore} from '@/stores/active.js'
import {useUserInfoStore} from "@/stores/userInfo.js";
import {useTokenStore} from "@/stores/token.js";
import {usePathStore} from "@/stores/path.js"
import {useRouter}  from "vue-router";
import {useDownLoadPathStore} from "@/stores/downLoadPath.js";

const router = useRouter()

const showSettings = ref(false)      // 下载设置对话框
const showLinkDownload = ref(false)  // 链接下载对话框
const editMode = ref(false)          // 路径编辑模式
const shareLink = ref('')            // 分享链接输入
const downloadPath = ref('')         // 下载路径输入


const userStore = useUserInfoStore();
const activeStore = useActiveStore();
const tokenStore = useTokenStore();
const pathStore = usePathStore();
const downLoadPathStore = useDownLoadPathStore();

/* 设置当前激活菜单项 */
const setActive = (index) =>{
  activeStore.setActive(index);
}

/* 处理用户退出登录 */
const exit = async () =>{
  // 清除所有用户相关状态
  userStore.removeUserInfo();
  activeStore.removeActive();
  tokenStore.removeToken();
  pathStore.removePath();
  localStorage.setItem('isLoggedIn', 'false');
  await router.replace("/");

}

/* 切换路径编辑模式 */
const toggleEdit = () => {
  editMode.value = !editMode.value
}

/* 处理链接下载操作 */
const handleDownload = () => {
  const link = document.createElement('a')
  link.href = shareLink.value.slice(0, -4)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  console.log('下载文件...', shareLink.value, downloadPath.value)
  showLinkDownload.value = false
}
</script>

<template>
  <!-- 主布局容器 -->
  <el-container class="layout-container">
    <!-- 左侧导航菜单 -->
    <el-aside width="250px" style="background-color: #409EFF">
      <div class="el-aside__logo"></div>
      <el-menu :default-active = activeStore.active active-text-color="#ffd04b" background-color="#409EFF"  text-color="#fff" router>
        <!-- 文件管理菜单 -->
        <el-menu-item index = "/main/file/FileManage" name="fileManage" @click = "setActive('/main/file/FileManage')">
          <el-icon>
            <Management />
          </el-icon>
          <span>我的文件</span>
        </el-menu-item>
        <!-- 传输管理子菜单 -->
        <el-sub-menu index="1">
          <template #title>
            <el-icon>
              <Promotion />
            </el-icon>
            <span>传输管理</span>
          </template>
          <el-menu-item index = "/main/file/FileUpload" name="fileUpload" @click = "setActive('/main/file/FileUpload')">
            <el-icon>
              <UploadFilled />
            </el-icon>
            <span>上传文件</span>
          </el-menu-item>
          <el-menu-item index = "/main/file/FileDownload" name="fileDownload" @click = "setActive('/main/file/FileDownload')">
            <el-icon>
              <Download />
            </el-icon>
            <span>下载文件</span>
          </el-menu-item>
        </el-sub-menu>
        <!-- 个人中心菜单 -->
        <el-menu-item index = "/main/user/UserInfo" name="userInfo" @click = "setActive('/main/user/UserInfo')">
          <el-icon>
            <UserFilled />
          </el-icon>
          <span>个人中心</span>
        </el-menu-item>

<!--        <el-sub-menu index="2">-->
<!--          <template #title>-->
<!--            <el-icon>-->
<!--              <UserFilled />-->
<!--            </el-icon>-->
<!--            <span>个人中心</span>-->
<!--          </template>-->
<!--          <el-menu-item index = "/user/UserInfo">-->
<!--            <el-icon>-->
<!--              <User />-->
<!--            </el-icon>-->
<!--            <span>基本资料</span>-->
<!--          </el-menu-item>-->
<!--          <el-menu-item index = "/user/UserAvatar">-->
<!--            <el-icon>-->
<!--              <Crop />-->
<!--            </el-icon>-->
<!--            <span>更换头像</span>-->
<!--          </el-menu-item>-->
<!--          <el-menu-item index = "/user/UserResetPassword">-->
<!--            <el-icon>-->
<!--              <EditPen />-->
<!--            </el-icon>-->
<!--            <span>重置密码</span>-->
<!--          </el-menu-item>-->
<!--        </el-sub-menu>-->
      </el-menu>
    </el-aside>
    <!-- 右侧内容区域 -->
    <el-container>
      <!-- 头部区域 -->
      <el-header >
        <div style="font-family: 微软雅黑;font-size :30px">{{userStore.nickname}}的资源空间</div>
        <!-- 用户操作下拉菜单 -->
        <el-dropdown placement="bottom-end">
                    <span class="el-dropdown__box">
                        <el-avatar :src="userStore.avatarUrl" />
                        <el-icon>
                            <CaretBottom />
                        </el-icon>
                    </span>
          <template #dropdown>
            <el-dropdown-menu>
<!--              <el-dropdown-item command="profile" :icon="Setting" @click="showSettings = true">设置</el-dropdown-item>-->
                <el-dropdown-item command="avatar" :icon="Paperclip" @click="showLinkDownload = true">使用链接下载</el-dropdown-item>
<!--              <el-dropdown-item command="password" :icon="EditPen">重置密码</el-dropdown-item>-->
              <el-dropdown-item command="logout" :icon="SwitchButton" @click = "exit">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <!-- 主体内容区域 -->
      <el-main>
        <router-view>
        </router-view>
      </el-main>
      <!-- 底部区域 -->
      <el-footer>咸鱼网盘 ©2025 Created by 溪云流雨</el-footer>
    </el-container>
  </el-container>

  <!-- 下载设置对话框 -->
  <el-dialog
      v-model="showSettings"
      title="下载设置"
      width="500px"
      align-center
      class="custom-dialog"
  >
    <div class="setting-content">
      <el-input
          v-model="downLoadPathStore.downLoadPath"
          :disabled="!editMode"
          placeholder="请输入默认下载路径"
      >
        <template #append>
          <el-button
              :icon="editMode ? Check : Edit"
              @click="toggleEdit"
              :type="editMode ? 'success' : 'primary'"
              circle
          />
        </template>
      </el-input>
      <div class="tip-text">提示：修改后将会影响默认下载位置</div>
    </div>
    <template #footer>
      <el-button @click="showSettings = false">关闭</el-button>
    </template>
  </el-dialog>

  <!-- 链接下载对话框 -->
  <el-dialog
      v-model="showLinkDownload"
      title="链接下载"
      width="500px"
      align-center
      class="custom-dialog"
  >
    <div class="link-download-content">
      <el-input
          v-model="shareLink"
          placeholder="请输入文件分享链接"
          clearable
          class="mb-4"
      >
        <template #prepend>链接</template>
      </el-input>

<!--      <el-input-->
<!--          v-model="downloadPath"-->
<!--          placeholder="请输入下载保存路径"-->
<!--          clearable-->
<!--      >-->
<!--        <template #prepend>路径</template>-->
<!--      </el-input>-->
    </div>
    <template #footer>
      <el-button @click="showLinkDownload = false">取消</el-button>
      <el-button
          type="primary"
          @click="handleDownload"
          :icon="Download"
      >
        开始下载
      </el-button>
    </template>
  </el-dialog>
</template>


<style lang="scss" scoped>

/* 对话框统一样式 */
.custom-dialog {
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  /* 对话框头部样式 */
  :deep(.el-dialog__header) {
    border-bottom: 1px solid #eee;
    margin-right: 0;
    padding: 16px 24px;
  }

  :deep(.el-dialog__body) {
    padding: 24px;
  }
}

.setting-content {
  .tip-text {
    color: #999;
    font-size: 12px;
    margin-top: 8px;
    padding-left: 4px;
  }
}

.link-download-content {
  :deep(.el-input-group__prepend) {
    background: rgba(64, 158, 255, 0.1);
    color: #409EFF;
    width: 60px;
    justify-content: center;
  }
}

.mb-4 {
  margin-bottom: 1rem;
}

/* 按钮通用动画 */
.el-button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:active {
    transform: scale(0.95);
  }

  &[type='primary'] {
    &:hover {
      box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
    }
  }
}


/* 主布局样式 */
.layout-container {
  height: 100vh;
  /* 左侧菜单样式 */
  .el-aside {
    // 左侧菜单容器边框
    border-right: 1px solid #e8e8e8;
    //border-radius: 0 12px 12px 0;
    box-shadow: 4px 0 12px rgba(0, 0, 0, 0.1);

    &__logo {
      height: 120px;
      background: url('@/assets/logo.png') no-repeat center / 120px auto;
    }
    /* 菜单项交互效果 */
    .el-menu {
      border-right: none;
      :deep(.el-menu-item:not(:last-child)) {
        position: relative;
        &::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 20px;
          right: 20px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #e8e8e8 20%, #e8e8e8 80%, transparent);
        }
      }

      :deep(.el-menu-item),
      :deep(.el-sub-menu__title) {
        border-radius: 8px;
        margin: 6px 12px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        /* 激活状态指示条 */
        &::before {
          content: '';
          position: absolute;
          left: -12px;
          top: 50%;
          transform: translateY(-50%);
          height: 60%;
          width: 4px;
          background: #409EFF;
          border-radius: 2px;
          opacity: 0;
          transition: opacity 0.3s;
        }

        &:hover {
          border: 1px solid rgba(64, 158, 255, 0.2);
          box-shadow: 0 2px 6px rgba(64, 158, 255, 0.2);

          &::before {
            opacity: 0.4;
          }
        }
        &.is-active {
          border: 1px solid rgba(64, 158, 255, 0.3);
          background: rgba(64, 158, 255, 0.05) !important;

          &::before {
            opacity: 1;// 显示激活指示条
          }
        }
      }
    }

    /* 头部区域样式 */
    .el-header {
      // 头部容器边框
      border-radius: 0 0 12px 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border: 1px solid #f0f0f0;
      border-top: none;
      position: relative;

      // 底部装饰线
      &::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg,
            rgba(64, 158, 255, 0) 0%,
            rgba(64, 158, 255, 0.3) 50%,
            rgba(64, 158, 255, 0) 100%
        );
      }

      /* 用户下拉菜单样式 */
      .el-dropdown__box {
        border: 2px solid #f0f0f0;
        border-radius: 24px;
        padding: 6px;
        transition: all 0.3s;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

        &:hover {
          border-color: #c0e1ff;
          box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);// 悬停发光效果
        }
      }
    }

    :deep(.el-dropdown-menu) {
      border: 1px solid #f0f0f0;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);

      .el-dropdown-menu__item {
        border-bottom: 1px solid #f8f8f8;

        &:last-child {
          border-bottom: none;
        }
      }
    }
  }

  .el-header {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 80px;

    .el-dropdown__box {
      display: flex;
      align-items: center;

      .el-icon {
        color: #999;
        margin-left: 10px;
      }

      &:active,
      &:focus {
        outline: none;
      }
    }
  }
  /* 页脚样式 */
  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
    --el-footer-height: 40px;
    //flex: 2;
  }
  /* 主体内容区域 */
  .el-main{
    padding: 24px;

    /* 隐藏原生滚动条 */
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }

}
</style>