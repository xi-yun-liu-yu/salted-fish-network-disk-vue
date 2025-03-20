//导入request.js请求工具
import request, {createCancelTokenSource} from '@/utils/request.js'
import {useUploadListStore} from "@/stores/uploadList.js";
import {useDownListStore} from "@/stores/downList.js";
import axios from "axios";

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
const cancelSource = createCancelTokenSource();
// 上传文件
export const fileUpdateService = (token,nodeId,file,fileName,uuid) =>{

    const headers = {
        'Authorization': token,
        'Content-Type': 'multipart/form-data'
    };

    let uploadStartTime;
    const uploadListStore = useUploadListStore()
    return  request.post('/file/upload/'+nodeId + '/' + fileName+'/'+uuid, file,{
        cancelToken: cancelSource.token,
        headers: headers,
        onUploadProgress: progressEvent => {
            function convertBytes(bytes) {
                const sizes = ['B', 'KB', 'MB', 'GB'];
                if (bytes === 0) return `0 ${sizes[0]}`;
                const i = Math.floor(Math.log(bytes) / Math.log(1024));
                const roundedValue = parseFloat((bytes / Math.pow(1024, i)).toFixed(2));
                return `${roundedValue} ${sizes[i]}`;
            }
            const hasFile = uploadListStore.hasUploadList(uuid)
            if(progressEvent.progress === 1){
                if(hasFile){
                    uploadListStore.deleteUploadList(uuid)
                }
                let currentDate = new Date();
                let currentDateString = currentDate.toLocaleString();
                uploadListStore.pushFinishList({
                    uuid: uuid,
                    fileName:fileName,
                    finishData: currentDateString,
                    fileSize: convertBytes(progressEvent.total),
                    filePath: []
                })
                return
            }
            if (!uploadStartTime) {
                uploadStartTime = new Date().getTime();
            }
            const diffTime = (new Date().getTime() - uploadStartTime) / 1000;
            const speed = convertBytes((progressEvent.bytes/diffTime))+'/s';
            if (hasFile){
                let temp = uploadListStore.getUploadList(uuid)
                temp.progress = (progressEvent.progress*100).toFixed(2)
                temp.speed = speed

            }else {
                uploadListStore.pushUploadList({
                    uuid: uuid,
                    fileName:fileName,
                    progress: (progressEvent.progress*100).toFixed(2),
                    speed: speed,
                    status: "传输中"
                })
            }

        }
    }).catch(err => {
        if (axios.isCancel(err)) {
            console.log('请求被取消:', err.message);
        } else {
            // 处理其他错误
        }
    });
}

// 下载文件
export const fileDownService = (token,fileName,path,name) =>{

    const headers = {
        'Authorization': token,
        'Content-Type': 'multipart/form-data'
    };
    var data = new FormData();
    data.append('filePath', path+name);
    let downStartTime;
    const downListStore = useDownListStore()
    return  request.post('/file/downLoad/'+fileName,data,{
        cancelToken: cancelSource.token,
        headers: headers,
        onDownloadProgress: progressEvent => {
            console.log(progressEvent)
            function convertBytes(bytes) {
                const sizes = ['B', 'KB', 'MB', 'GB'];
                if (bytes === 0) return `0 ${sizes[0]}`;
                const i = Math.floor(Math.log(bytes) / Math.log(1024));
                const roundedValue = parseFloat((bytes / Math.pow(1024, i)).toFixed(2));
                return `${roundedValue} ${sizes[i]}`;
            }
            const hasFile = downListStore.hasDownList(name)
            if(progressEvent.progress === 1 || !progressEvent.progress){
                if(hasFile){
                    console.log(1)
                    downListStore.deleteDownList(name)
                }
                let currentDate = new Date();
                let currentDateString = currentDate.toLocaleString();
                downListStore.pushDownFinishList({
                    fileName: name,
                    finishData: currentDateString,
                    fileSize: convertBytes(progressEvent.total),
                    filePath: path
                })
                console.log(2)
                return
            }
            if (!downStartTime) {
                downStartTime = new Date().getTime();
            }
            const diffTime = (new Date().getTime() - downStartTime) / 1000;
            const speed = convertBytes((progressEvent.bytes/diffTime))+'/s';
            if (hasFile){
                let temp = downListStore.getDownList(name)
                temp.progress = (progressEvent.progress*100).toFixed(2)
                temp.speed = speed

            }else {
                downListStore.pushDownList({
                    fileName:name,
                    progress: (progressEvent.progress*100).toFixed(2),
                    speed: speed,
                    status: "传输中"
                })
            }

        }
    }).catch(err => {
        if (axios.isCancel(err)) {
            console.log('请求被取消:', err.message);
        } else {
            // 处理其他错误
        }
    });
}

//删除文件夹
export const deleteFolder = (token,folder) =>{
    const headers = {
        'Authorization': token,
    }
    return request.get('/file/deleteFolder/'+folder,{
        headers: headers
    })
}

//获取文件夹是否存在
export const hasFolder = (token,folder) =>{
    const headers = {
        'Authorization': token,
    }
    return request.get('/file/hasFolder/'+folder,{
        headers: headers
    })
}

export const createFolder = (token,folderName,nodeId) =>{
    const headers = {
        'Authorization': token,
    }
    return request.post('/file/createFolder/'+folderName + '/' + nodeId,null,{
        headers: headers
    })
}