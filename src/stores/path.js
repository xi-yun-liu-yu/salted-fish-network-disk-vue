import {defineStore} from "pinia";
import {ref} from "vue";


export const usePathStore = defineStore(
    "path",
    () => {
        const path = ref([])

        const setPath = (newPath) => {
            path.value = newPath
        }

        const pushPath = (newPath) => {
            path.value.push(newPath)
        }

        const popPath = () => {
            path.value.pop()
        }

        const removePath = () => {
            path.value = []
        }

        return {path,setPath,pushPath,popPath,removePath}
    },
    {
        persist: true
    }
)