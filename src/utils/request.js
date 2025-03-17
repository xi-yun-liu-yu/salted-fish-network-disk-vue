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

        const status = err.response? err.response.status : null;
        // 超出 2xx 范围的状态码都会触发该函数。
        // 对响应错误做点什么
        if (status === 400) {
            console.log('错误状态码为400，客户端请求错误，可能是请求语法错误或者请求参数错误。');
        } else if (status === 401) {
            console.log('错误状态码为401，未授权，通常是因为缺少有效的身份验证凭据。');
        } else if (status === 403) {
            console.log('错误状态码为403，服务器拒绝访问，可能是因为用户没有足够的权限。');
        } else if (status === 404) {
            console.log('错误状态码为404，请求的资源未找到。');
        } else if (status === 500) {
            console.log('错误状态码为500，服务器内部错误，可能是服务器代码出现问题。');
        } else {
            console.log(`错误状态码为${status}，其他未处理的状态码情况。`);
        }
        ElMessage.error({
            message: '服务异常'+status,
            grouping: true
        })
        return Promise.reject(err);
    }
)



export default instance;