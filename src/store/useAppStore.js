import { defineStore } from 'pinia'
import { ref, reactive } from "vue";

export const useAppStore = defineStore('main', {

    state: () => {
        return {
            apiData: [], //从json文件读得数据

            itemList: [], // 展示分区数据；展示搜索结果

            list_num: "", //【分区】选择的是哪个

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