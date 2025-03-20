import {defineStore} from "pinia";
import {ref} from "vue";


export const useProgressStore = defineStore(
    "progress",
    () => {
        const progress = ref(new Map())

        const setProgress = (newProgress,value) => {
            progress.value.set(newProgress,value)
        }

        const hasProgress = (newProgress) => {
            return progress.value.has(newProgress)
        }

        const getProgress = (newProgress) => {
            return progress.value.get(newProgress)
        }

        const deleteProgress = (newProgress) => {
            progress.value.delete(newProgress)
        }

        const removeProgress = () => {
            progress.value = new Map()
        }

        return {progress,setProgress,hasProgress,getProgress,deleteProgress,removeProgress}
    },
    {
        persist: true
    }
)