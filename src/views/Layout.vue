<script setup>
import {
  Management,
  Promotion,
  UserFilled,
  User,
  SwitchButton,
  CaretBottom, UploadFilled, Download
} from '@element-plus/icons-vue'

import {useActiveStore} from '@/stores/active.js'
import {useUserInfoStore} from "@/stores/userInfo.js";
import {useTokenStore} from "@/stores/token.js";
import {useRouter}  from "vue-router";
const router = useRouter()

const userStore = useUserInfoStore();
const activeStore = useActiveStore();
const tokenStore = useTokenStore();

const setActive = (index) =>{
  activeStore.setActive(index);
}

const exit = async () =>{
  userStore.removeUserInfo();
  activeStore.removeActive();
  tokenStore.removeToken();
  localStorage.setItem('isLoggedIn', 'false');
  await router.replace("/");

}
</script>

<template>
  <el-container class="layout-container">
    <!-- 左侧菜单 -->
    <el-aside width="250px" style="background-color: #409EFF">
      <div class="el-aside__logo"></div>
      <el-menu :default-active = activeStore.active active-text-color="#ffd04b" background-color="#409EFF"  text-color="#fff" router>
        <el-menu-item index = "/main/file/FileManage" name="fileManage" @click = "setActive('/main/file/FileManage')">
          <el-icon>
            <Management />
          </el-icon>
          <span>我的文件</span>
        </el-menu-item>
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
    <!-- 右侧主区域 -->
    <el-container>
      <!-- 头部区域 -->
      <el-header >
        <div>用户：<strong>用户名</strong></div>

        <el-dropdown placement="bottom-end">
                    <span class="el-dropdown__box">
                        <el-avatar :src="userStore.avatarUrl" />
                        <el-icon>
                            <CaretBottom />
                        </el-icon>
                    </span>
          <template #dropdown>
            <el-dropdown-menu>
<!--              <el-dropdown-item command="profile" :icon="User">基本资料</el-dropdown-item>-->
<!--              <el-dropdown-item command="avatar" :icon="Crop">更换头像</el-dropdown-item>-->
<!--              <el-dropdown-item command="password" :icon="EditPen">重置密码</el-dropdown-item>-->
              <el-dropdown-item command="logout" :icon="SwitchButton" @click = "exit">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <!-- 中间区域 -->
      <el-main>
        <router-view>
        </router-view>
      </el-main>
      <!-- 底部区域 -->
      <el-footer>咸鱼网盘 ©2025 Created by 溪云流雨</el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;

  .el-aside {
    // 左侧菜单容器边框
    border-right: 1px solid #e8e8e8;
    //border-radius: 0 12px 12px 0;
    box-shadow: 4px 0 12px rgba(0, 0, 0, 0.1);

    &__logo {
      height: 120px;
      background: url('@/assets/logo.png') no-repeat center / 120px auto;
    }

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

        // 左侧指示条
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
            opacity: 1;
          }
        }
      }
    }

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

      .el-dropdown__box {
        border: 2px solid #f0f0f0;
        border-radius: 24px;
        padding: 6px;
        transition: all 0.3s;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

        &:hover {
          border-color: #c0e1ff;
          box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
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

  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
    --el-footer-height: 40px;
    //flex: 2;
  }

  .el-main{
    //overflow-x: auto;  /* 关键样式 */
    //border: 1px solid #ebeef5;
    //border-radius: 8px;
    padding: 24px;

    /* 隐藏原生滚动条（可选） */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
      display: none; /* Chrome/Safari */
    }
  }

  //.el-main {
  //  padding: 24px 24px 10px;
  //  --el-main-padding: 14px;
  //  height: calc(100vh - 114px); // 根据实际header/footer高度调整
  //  display: flex;
  //  justify-content: center;
  //
  //
  //  div[style*="border: 1px solid red"] {
  //    border: none !important;
  //    width: 95%;
  //    height: 93%;
  //
  //    /* 新增弹性布局 */
  //    display: flex;
  //    flex-direction: column;
  //    min-height: 0; // 防止内容溢出
  //
  //    background: linear-gradient(145deg, #ffffff, #f8fafc);
  //    border-radius: 16px;
  //    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  //    padding: 24px;
  //    position: relative;
  //    overflow: hidden; // 防止内容溢出
  //
  //    /* 标题样式适配 */
  //    > span {
  //      flex: 0 0 auto;
  //      position: relative;
  //      font-size: clamp(16px, 1.8vw, 20px); // 响应式字体
  //      color: #303133;
  //      font-weight: 600;
  //      margin-bottom: 1.5rem;
  //
  //      &::after {
  //        content: "";
  //        width: 40px;
  //        height: 3px;
  //        background: #409EFF;
  //        display: block;
  //        margin-top: 8px;
  //      }
  //    }
  //
  //    /* 内容区域 */
  //    //&::after {
  //    //  content: "内容展示区";
  //    //  position: absolute;
  //    //  top: 50%;
  //    //  left: 50%;
  //    //  transform: translate(-50%, -50%);
  //    //  font-size: min(5vw, 48px); // 响应式字号
  //    //  font-weight: 600;
  //    //  color: rgba(64, 158, 255, 0.08);
  //    //  white-space: nowrap;
  //    //  pointer-events: none;
  //    //}
  //
  //    /* 弹性内容容器 */
  //    > div {
  //      flex: 1;
  //      min-height: 0; // 修复Safari的flex溢出问题
  //      position: relative;
  //      display: flex;
  //      justify-content: center;
  //      align-items: center;
  //    }
  //
  //    /* 响应式处理 */
  //    @media (max-width: 768px) {
  //      padding: 16px;
  //      > span {
  //        font-size: 16px;
  //      }
  //      &::after {
  //        font-size: 24px;
  //      }
  //    }
  //
  //    /* 保持悬停动画 */
  //    transition: transform 0.3s ease;
  //    &:hover {
  //      transform: translateY(-2px);
  //    }
  //  }
  //}
}
</style>