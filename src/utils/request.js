import axios from "axios";
import { useTokenStore } from "../store/UserToken";

const request = axios.create({
    baseURL: 'https://sapi.kjchmc.cn/api'
})

request.interceptors.request.use((config)=>{
    const store = useTokenStore()
    config.headers.Authorization = `Bearer ${store.Token}`

    return config
})

export default request