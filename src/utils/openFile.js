import {ElMessage} from "element-plus";

const handleOpenFolder = (path) => {
    // 复制到剪贴板
    navigator.clipboard.writeText(path)
        .then(() => ElMessage({
            message:'复制到剪贴板',
            grouping: true,
            type: 'success'
        }))
        .catch(() => ElMessage.error({
            message:'复制失败',
            grouping: true
        }))
}

export default {handleOpenFolder}