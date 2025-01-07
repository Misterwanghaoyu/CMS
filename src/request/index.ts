import { MatterItemType, IdType, RoleType, SexType, CrackedType } from "@/utils/enum";
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

// 请求拦截器
instance.interceptors.request.use(config => {
    // 对请求头进行处理
    config.headers.Authorization = localStorage.getItem("token")
    // config.headers["Content-Type"] = "application/json"
    // config.headers.Accept = "application/json"


    if (config.method === "post") {
        // 对请求体进行处理
        const { data } = config
        console.log("原请求体数据", data);
        // 日期
        const matterDate = data.matterDate
        if (matterDate) {
            config.data.matterDate = dayjs(matterDate).format("YYYY-MM-DD HH:mm:ss")
        }
        // 日期范围
        if (data.matterDateRange) {
            config.data.beginDate = data.matterDateRange[0].format("YYYY-MM-DD HH:mm:ss")
            config.data.endDate = data.matterDateRange[1].format("YYYY-MM-DD HH:mm:ss")
            delete config.data.matterDateRange
        }
        // 案件类型
        const matterItem = config.data.matterItem
        if (matterItem) {
            config.data.matterItem = matterItem === MatterItemType.judicial ? 1 : 2
        }
        // 是否破解
        const cracked = config.data.cracked
        if (cracked !== undefined) {
            config.data.cracked = cracked === CrackedType.yes ? 1 : 2
        }
        // 证件类型
        const idType = config.data.idType
        if (idType) {
            config.data.idType = idType === IdType.idCard ? 1 : 2
        }
        // // 角色
        // const role = config.data.role
        // if (role) {
        //     config.data.role = role === RoleType.admin ? 1 : 2
        // }
        // 性别
        const sex = config.data.sex
        if (sex) {
            config.data.sex = sex === SexType.male ? 1 : 2
        }
        console.log("处理后的请求体数据", config.data);
    }

    return config
}, err => {
    return Promise.reject(err)
});
const formatData = (data: any) => {
    // if (data.matterDate) {
    //     data.matterDate = dayjs(data.matterDate).format("YYYY-MM-DD")
    // }
    if (data.matterItem) {
        data.matterItem = data.matterItem === 1 ? MatterItemType.judicial : MatterItemType.decryption
    }
    if (data.cracked) {
        data.cracked = data.cracked === 1 ? CrackedType.yes : CrackedType.no
    }
    if (data.idType) {
        data.idType = data.idType === 1 ? IdType.idCard : IdType.passport
    }
    // if (data.role) {
    //     data.role = data.role === 1 ? RoleType.admin : RoleType.user
    // }
    if (data.sex) {
        data.sex = data.sex === 1 ? SexType.male : SexType.female
    }
    return data
}
// 响应拦截器
instance.interceptors.response.use(res => {
    // 对返回的数据进行处理
    if (res.data.code === 0) {
        let { data } = res.data
        console.log("原响应体数据", data);
        if (data instanceof Array) {
            if (data[0] instanceof Object) {
                data = data.map((item: any, index: number) => {
                    item = formatData(item)
                    return {
                        ...item,
                        key: index
                    }
                })
            }
        }
        else {
            data = formatData(data)
        }
        console.log("处理后的响应体数据", data);
        return Promise.resolve(data)
    } else {
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