import {defineStore} from "pinia";
import {ref} from "vue";


export const useActiveStore = defineStore(
    "active",
    () => {
        const active = ref('/main/file/FileManage')

        const setActive = (newActive) => {
            active.value = newActive
        }

        const removeActive = () => {
            active.value = '/main/file/FileManage'
        }

        return {active,setActive,removeActive}
    },
    {
        persist: true
    }
)