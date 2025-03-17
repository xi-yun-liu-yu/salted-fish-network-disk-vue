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

// 上传文件
export const fileUpdateService = (token,nodeId,file,fileName) =>{
    console.log(file);
    var data = new FormData();
    data.append('file', file);
    console.log(data);
    const headers = {
        'Authorization': token,
        'Content-Type': 'multipart/form-data'
    };
    return  request.post('/file/upload/'+nodeId + '/' + fileName, data,{headers},{

    });
}


