import {defineStore} from "pinia";
import {ref} from "vue";

/*
* {
*   uuid:
*   fileName:
*   progress:
*   speed:
*   status:
* }
* */
export const useUploadListStore = defineStore(
    "uploadList",
    () => {
        const uploadList = ref([])
        const finishList = ref([])

        const setUploadList = (newUploadList) => {
            uploadList.value = newUploadList
        }

        const pushUploadList = (newUploadList) => {
            uploadList.value.push(newUploadList)
        }

        const hasUploadList = (uuid)=> {
            let i = 0
            while (i < uploadList.value.length) {
                if (uploadList.value[i].uuid === uuid) {
                    return true
                }
                i++;
            }
            return false
        }

        const getUploadList = (uuid) => {
            let i = 0
            while (i < uploadList.value.length) {
                if (uploadList.value[i].uuid === uuid) {
                    return uploadList.value[i]
                }
                i++;

            }
            return null
        }

        const deleteUploadList = (uuid) => {
            let i = 0
            while (i < uploadList.value.length) {
                if (uploadList.value[i].uuid === uuid) {
                    uploadList.value.splice(i, 1);
                } else {
                    i++;
                }
            }
        }

        const setFinishList = (newFinishList) => {
            finishList.value = newFinishList
        }

        const pushFinishList = (newFinishList) => {
            finishList.value.push(newFinishList)
        }

        const hasFinishList = (uuid)=> {
            let i = 0
            while (i < finishList.value.length) {
                if (finishList.value[i].uuid === uuid) {
                    return true
                }
                i++;
            }
            return false
        }

        const getFinishList = (uuid) => {
            let i = 0
            while (i < finishList.value.length) {
                if (finishList.value[i].uuid === uuid) {
                    return finishList.value[i]
                }
                i++;

            }
            return null
        }

        const deleteFinishList = (uuid) => {
            let i = 0
            while (i < finishList.value.length) {
                if (finishList.value[i].uuid === uuid) {
                    finishList.value.splice(i, 1);
                } else {
                    i++;
                }
            }
        }

        const removeUploadList = () => {
            uploadList.value = []
        }

        const removeFinishList = () => {
            finishList.value = []
        }

        return {uploadList,finishList,
            setUploadList,pushUploadList,hasUploadList,getUploadList,deleteUploadList,removeUploadList,
            setFinishList,pushFinishList,hasFinishList,getFinishList,deleteFinishList,removeFinishList
        }
    },
    {
        persist: true
    }
)