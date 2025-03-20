import {defineStore} from "pinia";
import {ref} from "vue";


export const useDownLoadPathStore = defineStore(
    "downLoadPath",
    () => {
        const downLoadPath = ref('')

        const setDownLoadPath = (newPath) => {
            downLoadPath.value = newPath
        }

        const removePath = () => {
            downLoadPath.value = ''
        }

        return {downLoadPath,setDownLoadPath,removePath}
    },
    {
        persist: true
    }
)