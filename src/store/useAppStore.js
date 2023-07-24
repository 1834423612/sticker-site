import { defineStore } from 'pinia'
import { ref, reactive } from "vue";

export const useAppStore = defineStore('main', {

    state: () => {
        return {


        }
    },
    getters: {

    },

    actions: {

    },

    // 开启数据持久化
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'sticker-site',
                storage: localStorage,
            }
        ]
    },

})