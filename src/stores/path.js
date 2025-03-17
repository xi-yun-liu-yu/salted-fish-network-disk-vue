import {defineStore} from "pinia";
import {ref} from "vue";


export const usePathStore = defineStore(
    "path",
    () => {
        const path = ref([])

        const setPath = (newPath) => {
            path.value = newPath
        }

        const removePath = () => {
            path.value = []
        }

        return {path,setPath,removePath}
    },
    {
        persist: true
    }
)