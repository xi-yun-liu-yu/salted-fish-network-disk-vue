//导入request.js请求工具
import request from '@/utils/request.js'


//发送注册请求的函数
export const userRegisterService = (registerData) =>{
    return  request.post('/users/register' + '/' + registerData['username'] + '/' + registerData['password']);
}

//发送登录请求的函数
export const userLoginService = (registerData) =>{
    return  request.get('/users/login' + '/' + registerData['username'] + '/' + registerData['password']);
}

//获取用户信息
export const userGetService = (token) =>{
    const headers = {
        'Authorization': token
    };
    return  request.get('/users/info', {headers});
}

//更新用户信息
export const userPutService = (token,email,nickname) =>{
    const params =new URLSearchParams();

    params.append("email", email);
    params.append("nickname", nickname);

    const headers = {
        'Authorization': token,
        // 'Content-Type': 'application/json'
    };

    return  request.put('/users/update',params,  { headers });
}

//更新用户头像
export const userAvatarService = (token,file,type,url) =>{
    const headers = {
        'Authorization': token
        // 'Content-Type': 'application/json'
    };
    return  request.patch('/users/avatar/' + type + '/' + url,file, {headers} );
}

//验证密码
export const userVerifyPasswordService = (token,password) =>{
    const headers = {
        'Authorization': token
        // 'Content-Type': 'application/json'
    };
    return  request.get('/users/verifyPassword/' + password, {headers} );
}

//存储空间扩容
export const userAddStorageService = (token,value) =>{
    const headers = {
        'Authorization': token,
        'Content-Type': 'application/json',
        'Connection': 'keep-alive'
    };
    const body = {}
    return  request.put('/admin/users/storage/INCREASE/' + value,body,{headers} );
}