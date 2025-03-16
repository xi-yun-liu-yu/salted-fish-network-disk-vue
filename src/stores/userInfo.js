import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserInfoStore = defineStore("userInfo", () => {
    const userId = ref('');
    const username = ref('');
    const storageLimit = ref(0);
    const usedStorage = ref(0);
    const userPermId = ref(0);
    const nickname = ref('');
    const email = ref('');
    const avatarUrl = ref('');

    const setUserInfo = (userInfo) => {
        userId.value = userInfo.userId.toString();
        userPermId.value = userInfo.userPermId;
        nickname.value = userInfo.nickname;
        avatarUrl.value = userInfo.avatarUrl;
        username.value = userInfo.username;
        storageLimit.value = userInfo.storageLimit;
        usedStorage.value = userInfo.usedStorage;
        email.value = userInfo.email;
    };

    const removeUserInfo = () => {
        userId.value = '';
        userPermId.value = 0;
        nickname.value = '';
        avatarUrl.value = '';
        username.value = '';
        storageLimit.value = 0;
        usedStorage.value = 0;
        email.value = '';
    };

    return {
        userId,
        username,
        storageLimit,
        usedStorage,
        userPermId,
        nickname,
        email,
        avatarUrl,
        setUserInfo,
        removeUserInfo
    };
}, {
    persist: true // 或配置详细选项
});