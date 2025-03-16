//导入request.js请求工具
import request from '@/utils/request.js'

//请求指定用户的文件树
export const fileNodeTreeService = (token) =>{
    const headers = {
        'Authorization': token,
    };
    return  request.get('/file/getFileNodeTree', {headers} );
}

//删除指定文件
export const fileDeleteService = (token,fileUUID) =>{
    const headers = {
        'Authorization': token,
    };
    return  request.delete('/file/deleteFile/'+fileUUID, {headers} );
}