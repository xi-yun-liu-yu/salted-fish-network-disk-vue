//定制请求实例
import axios from "axios";
import { ElMessage } from 'element-plus'


const baseURL ='/api';
const instance = axios.create({baseURL})

//添加响应拦截器
instance.interceptors.response.use(

    result=>{
        return result.data;
    },
    err=>{
        ElMessage.error({
            message:'服务异常',
            grouping: true
        })
        return Promise.reject(err);
    }
)

export default instance;