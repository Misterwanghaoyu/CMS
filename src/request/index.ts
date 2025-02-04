import { MatterItemType, IdType, SexType, CrackedType } from "@/utils/enum";
import { notification } from "antd";
import axios from "axios"
import dayjs from 'dayjs';
// 创建axios实例
const instance = axios.create({
    // 基本请求路径的抽取
    baseURL: import.meta.env.VITE_APP_BASEAPI,
    // 这个时间是你每次请求的过期时间，这次请求认为20秒之后这个请求就是失败的
    timeout: 5000,
})
const formatReqData = (data: any) => {
    // 日期
    const matterDate = data.matterDate
    if (data.matterDate) {
        data.matterDate = dayjs(matterDate).format("YYYY-MM-DD HH:mm:ss")
    }
    // 日期范围
    if (data.matterDateRange) {
        data.beginDate = data.matterDateRange[0].format("YYYY-MM-DD HH:mm:ss")
        data.endDate = data.matterDateRange[1].format("YYYY-MM-DD HH:mm:ss")
        delete data.matterDateRange
    }
    // 案件类型
    const matterItem = data.matterItem
    if (data.matterItem) {
        data.matterItem = matterItem === MatterItemType.judicial ? 1 : 2
    }
    // 是否破解
    const cracked = data.cracked
    if (data.cracked !== undefined) {
        data.cracked = cracked === CrackedType.yes ? 1 : 2
    }
    // 证件类型
    const idType = data.idType
    if (data.idType) {
        data.idType = idType === IdType.idCard ? 1 : 2
    }
    // 性别
    const sex = data.sex
    if (data.sex) {
        data.sex = sex === SexType.male ? 1 : 2
    }
    return data
}
const formatResData = (data: any) => {
    if (data.matterItem) {
        data.matterItem = data.matterItem === 1 ? MatterItemType.judicial : MatterItemType.decryption
    }
    if (data.cracked) {
        data.cracked = data.cracked === 1 ? CrackedType.yes : CrackedType.no
    }
    if (data.idType) {
        data.idType = data.idType === 1 ? IdType.idCard : IdType.passport
    }
    if (data.sex) {
        data.sex = data.sex === 1 ? SexType.male : SexType.female
    }
    return data
}
// 请求拦截器
instance.interceptors.request.use(config => {
    // 对请求头进行处理
    config.headers.Authorization = localStorage.getItem("token")
    config.headers["Content-Type"] = "application/json"
    if (config.method === "post") {
        // 对请求体进行处理
        let { data } = config
        if (data.judicialList) {
            data.judicialList = data.judicialList.map((item: any) => formatReqData(item))
        }
        if (data.decryptionList) {
            data.decryptionList = data.decryptionList.map((item: any) => formatReqData(item))
        }
        config.data = formatReqData(data)

        console.log("处理后的请求体数据", config.data);
    }

    return config
}, err => {
    return Promise.reject(err)
});

// 响应拦截器
instance.interceptors.response.use(res => {

    if (res.config.responseType === "blob") {
        return res
    }
    // 对返回的数据进行处理
    if (res.data.code === 0) {
        let { data } = res.data
        if (data) {
            if (data instanceof Array) {
                if (data[0] instanceof Object) {
                    data = data.map((item: any, index: number) => {
                        item = formatResData(item)
                        return {
                            ...item,
                            key: index
                        }
                    })
                }
            }
            else {
                data = formatResData(data)
            }
            console.log("处理后的响应体数据", data);
        } else {
            console.log("data为空");
        }
        return Promise.resolve(data)
    } else {
        
        const errorCodePrefix = res.data.code.toString().substring(0, 3);
        if (errorCodePrefix === "401") {
            setTimeout(() => {
                localStorage.removeItem("token")
                localStorage.removeItem("userInfo")
                window.location.href = "/login"
            }, 3000)
        }
        notification.error({
            message: '错误',
            description: res.data.message,
            placement: "bottomLeft"
        })
        return Promise.reject(res.data)
    }
}, err => {
    notification.error({
        message: '错误',
        description: err.message,
        placement: "bottomLeft"
    })
    return Promise.reject(err)
})

export default instance