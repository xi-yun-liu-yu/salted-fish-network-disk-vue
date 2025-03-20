<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
//控制注册与登录表单地显示， 默认显示注册
const isRegister = ref(false)
//定义数据模型
const registerData = ref({
  username: '',
  password: '',
  rePassword: ''
})
//校验密码函数
const checkRePassword = (rule,value,callback)=>{
  if(value===''){
    callback(new Error('请再次输入密码'))
  }else if(value !== registerData.value.password){
    callback(new Error('请确保两次输入的密码一样'))
  }else {
    callback()
  }
}

import {userGetService, userLoginService, userRegisterService} from '@/api/user.js'
//调用请求注册的接口
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
  }else {
    ElMessage({
      message: '注册失败' + result.msg ? result.msg : '服务器无msg返回',
      type: 'warning',
      showClose: true,
      grouping: true,
    })
  }
}

//定义表单校验规则
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
import {useRouter}  from "vue-router";
import {useTokenStore} from "@/stores/token.js";
import {useUserInfoStore} from "@/stores/userInfo.js";
import {useActiveStore} from "@/stores/active.js";
import {usePathStore} from "@/stores/path.js";
const pathStore = usePathStore();
const activeStore = useActiveStore();

const router = useRouter()
//调用请求登录的接口
const Login = async ()=>{
  let result = await userLoginService(registerData.value);
  if(result.code === 0){
    //成功
    ElMessage({
      message: result.msg ? result.msg : '登录成功',
      type: 'success',
      showClose: true,
      grouping: true,
    });
    const tokenStore = useTokenStore();

    tokenStore.setToken(result.data);
    result = await userGetService(tokenStore.token);
    const userInfoStore = useUserInfoStore();
    userInfoStore.setUserInfo(result.data);
    activeStore.setActive('/main/file/FileManage');
    localStorage.setItem('isLoggedIn', 'true');
    pathStore.setPath([userInfoStore.userId])
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
      <el-col :span="12" class="bg"></el-col>
      <el-col :span="6" :offset="3" class="form">
        <!-- 注册表单 -->
        <el-form ref="form" size="large" autocomplete="off" v-if="isRegister" :model="registerData" :rules="rules">
          <el-form-item>
            <h1>注册</h1>
          </el-form-item>
          <el-form-item prop="username">
            <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.username" ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="registerData.password"></el-input>
          </el-form-item>
          <el-form-item prop="rePassword">
            <el-input :prefix-icon="Lock" type="password" placeholder="请输入再次密码" v-model="registerData.rePassword"></el-input>
          </el-form-item>
          <!-- 注册按钮 -->
          <el-form-item>
            <el-button class="button" type="primary" auto-insert-space @click = "register">
              注册
            </el-button>
          </el-form-item>
          <el-form-item class="flex">
            <el-link type="info" :underline="false" @click="isRegister = false">
              ← 返回
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
              注册 →
            </el-link>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
/* 样式 */

.login-page {
  height: 100vh;

  //width: 70vw;
  //height: 70vh;
  background-color: #fff;

  .bg {
    background: url('@/assets/logo2.png') no-repeat 50% center / 250px auto,
    url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }

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

    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>