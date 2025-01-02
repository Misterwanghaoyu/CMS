import axios from "axios"
import dayjs from 'dayjs';

// 创建axios实例
const instance = axios.create({
    // 基本请求路径的抽取
    baseURL: import.meta.env.VITE_APP_BASEAPI,
    // 这个时间是你每次请求的过期时间，这次请求认为20秒之后这个请求就是失败的
    timeout: 20000
})

// 请求拦截器
instance.interceptors.request.use(config => {
    // 对请求头进行处理
    config.headers.Authorization = localStorage.getItem("token")
    // 对请求体进行处理
    if (config.data) {
        // 对请求体中的matterDate进行处理
        const matterDate = config.data.matterDate
        if (matterDate) {
            config.data.matterDate = dayjs(matterDate).format("YYYY-MM-DD HH:mm:ss")
        }
    }
    return config
}, err => {
    return Promise.reject(err)
});
// 响应拦截器
instance.interceptors.response.use(res => {
    // 对返回的数据进行处理
    if (res.data.data.matterDate) {
        res.data.data.matterDate = dayjs(res.data.data.matterDate)
    }
    return res.data
}, err => {
    return Promise.reject(err)
})

export default instance