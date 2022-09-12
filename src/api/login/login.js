import request, { backendIP } from "@/utils/request.js";
import { randomString } from "@/utils/index.js";

export function getCodeImg() {
    var random = randomString(16);
    return request({
        url: backendIP + "/captcha.jpg",
        method: "get",
        params: {
            uuid: random,
        },
    });
}
export function login(data) {
    return request({
        url: backendIP + "/sysApi/login",
        method: "post",
        data: data,
    });
}
export function getInfo(userId) {
    return request({
        url: backendIP + "/sysApi/user/queryUserInfo",
        method: "get",
    });
}

export function logout() {
    return request({
        url: backendIP + "/sysApi/logout",
        method: "post",
    });
}

export function getTenantInfo(data) {
    return request({
        url: backendIP + "/database/getCache",
        method: "GET",
        params: {
            param: data,
        },
    });
}
