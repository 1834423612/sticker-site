import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useTokenStore = defineStore('UserToken', () => {
    // 存储状态值
    const Token = ref(window.localStorage.getItem('UserToken') || '')

    function saveToken(str) {
        Token.value = str
        window.localStorage.setItem('UserToken', str)
    }

    return { Token, saveToken }
})