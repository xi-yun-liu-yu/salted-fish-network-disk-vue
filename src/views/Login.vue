<script setup>

/* 登录注册组件 - 处理用户认证相关功能 */

import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

// 控制表单显示模式：注册(true)/登录(false)
const isRegister = ref(false)
// 用户认证数据模型
const registerData = ref({
  username: '',
  password: '',
  rePassword: '' // 仅注册时使用
})
// 密码二次验证规则
const checkRePassword = (rule,value,callback)=>{
  if(value===''){
    callback(new Error('请再次输入密码'))
  }else if(value !== registerData.value.password){
    callback(new Error('请确保两次输入的密码一样'))
  }else {
    callback()
  }
}
// 导入认证相关API
import {userGetService, userLoginService, userRegisterService} from '@/api/user.js'

// 处理用户注册
const register = async ()=>{
  let result = await userRegisterService(registerData.value);
  if(result.code === 0){
    //成功
    ElMessage({
      message: result.msg ? result.msg : '注册成功',
      type: 'success',
      showClose: true,
      grouping: true,
    });
    isRegister.value = false // 注册成功后切换登录表单
  }else {
    ElMessage({
      message: '注册失败' + result.msg ? result.msg : '服务器无msg返回',
      type: 'warning',
      showClose: true,
      grouping: true,
    })
  }
}

// 表单验证规则配置
const rules ={
  username: [
    {required: true, message: '请输入用户名', trigger: 'blur'},
    {min: 4, max: 20, message: '用户名长度在5至20个字符以内', trigger:'blur'},
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 8, max: 32, message: '密码长度应在8至32个字符以内，且只包含大小写', trigger:'blur'},
  ],
  rePassword: [
      {validator: checkRePassword, trigger: 'blur'},
  ]
}
// 导入状态管理和路由
import {useRouter}  from "vue-router";
import {useTokenStore} from "@/stores/token.js";
import {useUserInfoStore} from "@/stores/userInfo.js";
import {useActiveStore} from "@/stores/active.js";
import {usePathStore} from "@/stores/path.js";
const pathStore = usePathStore();
const activeStore = useActiveStore();

const router = useRouter()

// 处理用户登录
const Login = async ()=>{
  let result = await userLoginService(registerData.value);
  if(result.code === 0){
    // 登录成功处理
    ElMessage({
      message: result.msg ? result.msg : '登录成功',
      type: 'success',
      showClose: true,
      grouping: true,
    });
    // 存储认证信息
    const tokenStore = useTokenStore();
    tokenStore.setToken(result.data);
    // 获取并存储用户信息
    result = await userGetService(tokenStore.token);
    const userInfoStore = useUserInfoStore();
    userInfoStore.setUserInfo(result.data);
    // 初始化应用状态
    activeStore.setActive('/main/file/FileManage');
    localStorage.setItem('isLoggedIn', 'true');
    pathStore.setPath([userInfoStore.userId])
    // 跳转主界面
    await router.push('/main');
  }else {
    ElMessage({
      message: '登录失败' + result.msg ? result.msg : '服务器无msg返回',
      type: 'warning',
      showClose: true,
      grouping: true,
    })
  }
}
</script>

<template>
  <div class="login">
    <el-row class="login-page">
      <!-- 左侧背景区域 -->
      <el-col :span="12" class="bg"><!-- 组合背景：Logo叠加在背景图上 --></el-col>
      <!-- 右侧表单区域 -->
      <el-col :span="6" :offset="3" class="form">
        <!-- 注册表单 -->
        <el-form ref="form" size="large" autocomplete="off" v-if="isRegister" :model="registerData" :rules="rules">
          <el-form-item>
            <h1>注册</h1>
          </el-form-item>
          <!-- 用户名输入 -->
          <el-form-item prop="username">
            <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.username" ></el-input>
          </el-form-item>
          <!-- 密码输入 -->
          <el-form-item prop="password">
            <el-input :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="registerData.password"></el-input>
          </el-form-item>
          <!-- 确认密码 -->
          <el-form-item prop="rePassword">
            <el-input :prefix-icon="Lock" type="password" placeholder="请输入再次密码" v-model="registerData.rePassword"></el-input>
          </el-form-item>
          <!-- 注册操作 -->
          <el-form-item>
            <el-button class="button" type="primary" auto-insert-space @click = "register">
              注册
            </el-button>
          </el-form-item>
          <!-- 切换到登录 -->
          <el-form-item class="flex">
            <el-link type="info" :underline="false" @click="isRegister = false">
              ← 返回登录
            </el-link>
          </el-form-item>
        </el-form>
        <!-- 登录表单 -->
        <el-form ref="form" size="large" autocomplete="off" v-else :model="registerData">
          <el-form-item>
            <h1>登录</h1>
          </el-form-item>
          <el-form-item>
            <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.username"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码"v-model="registerData.password"></el-input>
          </el-form-item>
          <el-form-item class="flex">
            <div class="flex">
              <el-checkbox>记住我</el-checkbox>
              <el-link type="primary" :underline="false">忘记密码？</el-link>
            </div>
          </el-form-item>
          <!-- 登录按钮 -->
          <el-form-item>
            <el-button class="button" type="primary" auto-insert-space @click = "Login">登录</el-button>
          </el-form-item>
          <el-form-item class="flex">
            <el-link type="info" :underline="false" @click="isRegister = true">
              注册新账号 →
            </el-link>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
/* 登录页面布局样式 */

.login-page {
  height: 100vh;
  background-color: #fff;

  /* 左侧背景样式 */
  .bg {
    background: url('@/assets/logo2.png') no-repeat 50% center / 250px auto,
    url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }

  /* 表单容器样式 */
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;

    .title {
      margin: 0 auto;
    }

    .button {
      width: 100%;
    }
    /* 弹性布局容器 */
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>