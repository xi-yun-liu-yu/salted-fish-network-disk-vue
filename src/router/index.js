//导入vue-router
import {createRouter,createWebHistory} from 'vue-router'

//导入组件
import LayoutVue from '@/views/Layout.vue'
import LoginVue from '@/views/login.vue'


import FileUploadVue from '@/views/file/FileUpload.vue'
import FileDownloadVue from '@/views/file/FileDownload.vue'
import FileManageVue from '@/views/file/FileManage.vue'
import UserAvatarVue from '@/views/user/UserAvatar.vue'
import UserInfoVue from '@/views/user/UserInfo.vue'
import UserResetPasswordVue from '@/views/user/UserResetPassword.vue'


const routes = [
    {path: '/main',component: LayoutVue,children:[
            {path: '/file/FileUpload',component: FileUploadVue},
            {path: '/file/FileDownload',component: FileDownloadVue},
            {path: '/file/FileManage',component: FileManageVue},
            {path: '/user/UserAvatar',component: UserAvatarVue},
            {path: '/user/UserInfo',component: UserInfoVue},
            {path: '/user/UserResetPassword',component: UserResetPasswordVue},
        ]},
    {path: '/',component: LoginVue},
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router