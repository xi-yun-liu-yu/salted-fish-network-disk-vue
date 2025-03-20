import {defineStore} from "pinia";
import {ref} from "vue";

/*
* {
*   fileName:
*   progress:
*   speed:
*   status:
* }
* */
export const useDownListStore = defineStore(
    "downList",
    () => {
        const downList = ref([])
        const downFinishList = ref([])

        const setDownList = (newDownList) => {
            downList.value = newDownList
        }

        const pushDownList = (newDownList) => {
            downList.value.push(newDownList)
        }

        const hasDownList = (fileName)=> {
            let i = 0
            while (i < downList.value.length) {
                if (downList.value[i].fileName === fileName) {
                    return true
                }
                i++;
            }
            return false
        }

        const getDownList = (fileName) => {
            let i = 0
            while (i < downList.value.length) {
                if (downList.value[i].fileName === fileName) {
                    return downList.value[i]
                }
                i++;

            }
            return null
        }

        const deleteDownList = (fileName) => {
            let i = 0
            while (i < downList.value.length) {

                if (downList.value[i].fileName === fileName) {
                    downList.value.splice(i, 1);
                } else {
                    i++;
                }
            }
        }

        const setDownFinishList = (newFinishList) => {
            downFinishList.value = newFinishList
        }

        const pushDownFinishList = (newFinishList) => {
            downFinishList.value.push(newFinishList)
        }

        const hasDownFinishList = (fileName)=> {
            let i = 0
            while (i < downFinishList.value.length) {
                if (downFinishList.value[i].fileName === fileName) {
                    return true
                }
                i++;
            }
            return false
        }

        const getDownFinishList = (fileName) => {
            let i = 0
            while (i < downFinishList.value.length) {
                if (downFinishList.value[i].fileName === fileName) {
                    return downFinishList.value[i]
                }
                i++;

            }
            return null
        }

        const deleteDownFinishList = (fileName) => {
            console.log(1)
            let i = 0
            while (i < downFinishList.value.length) {
                console.log(downFinishList.value[i])
                console.log(fileName)
                if (downFinishList.value[i].fileName === fileName) {
                    downFinishList.value.splice(i, 1);
                } else {
                    i++;
                }
            }
            console.log(1)
        }

        const removeDownList = () => {
            downList.value = []
        }

        const removeDownFinishList = () => {
            downFinishList.value = []
        }

        return {downList,downFinishList,
            setDownList,pushDownList,hasDownList,getDownList,deleteDownList,removeDownList,
            setDownFinishList,pushDownFinishList,hasDownFinishList,getDownFinishList,deleteDownFinishList,removeDownFinishList
        }
    },
    {
        persist: true
    }
)