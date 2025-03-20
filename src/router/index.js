//导入vue-router
import {createRouter,createWebHistory} from 'vue-router'

//导入组件

import LoginVue from '@/views/login.vue'
import LayoutVue from '@/views/Layout.vue'
import FileUploadVue from '@/views/file/FileUpload.vue'
import FileDownloadVue from '@/views/file/FileDownload.vue'
import FileManageVue from '@/views/file/FileManage.vue'
import UserInfoVue from '@/views/user/UserInfo.vue'


const routes = [
    {name:'Login' ,path: '/',component: LoginVue},
    {path: '/main',component: LayoutVue,
        redirect: '/main/file/FileManage',
        children:[
            {path: '/main/file/FileUpload',component: FileUploadVue},
            {path: '/main/file/FileDownload',component: FileDownloadVue},
            {path: '/main/file/FileManage',component: FileManageVue},
            {path: '/main/user/UserInfo',component: UserInfoVue},
        ]},

]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

function checkUserAuthenticated() {
    const isAuthenticated = localStorage.getItem('isLoggedIn');
    return isAuthenticated === 'true';
}

// 全局前置守卫
router.beforeEach((to, from) => {
    // 检查用户是否已登录
    const isAuthenticated = checkUserAuthenticated();
    if (!isAuthenticated && to.name!== 'Login') {
        // 将用户重定向到登录页面
        return { name: 'Login' };
    }
    // 用户已经登录，继续导航
    return true;
});

export default router