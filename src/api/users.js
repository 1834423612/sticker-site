import request from "../utils/request";

//  登录接口
export const login = (userInfo) => {
    return request({
        method: 'POST',
        url: '/auth/local',
        data: userInfo,
    })
}

//  注册接口
export const register = (userInfo) => {
    return request({
        method: 'POST',
        url: '/auth/local/register',
        data: userInfo,
    })
}