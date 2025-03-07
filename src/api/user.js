//导入request.js请求工具
import request from '@/utils/request.js'


//发送注册请求的函数
export const userRegisterService = (registerData) =>{
    const params =new URLSearchParams();
    for(let key in registerData) {
        params.append(key, registerData[key]);
    }
    return  request.post('/users/register', params);
}

//发送登录请求的函数
export const userLoginService = (registerData) =>{
    const params =new URLSearchParams();
    for(let key in registerData) {
        params.append(key, registerData[key]);
    }
    return  request.post('/users/login', params);
}