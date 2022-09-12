import axios from "axios";
import store from "@/store";
import { getToken, removeToken } from "@/utils/auth";
import { ToPathStr } from "@/utils/index";
import router from "../router";
import md5 from "js-md5";
import { message } from "@/utils/reset-message";

// 后端IP地址
export var backendIP = window.publicConfig.ip[process.env.NODE_ENV];
console.log("当前运行环境", process.env.NODE_ENV);
const service = axios.create({
    // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
    timeout: 20 * 1000, // 请求超时时间 20S
});
service.interceptors.request.use(
    (config) => {
        if (store.getters.token) {
            config.headers["token"] = getToken();
        }

        if (config.method === "post" && !urlFilter(config.url)) {
            config.data = inputTrim(config.data);
        }

        // 接口请求验签
        config.headers["signature"] = "";
        if (config.data) {
            config.headers["signature"] = md5(md5(JSON.stringify(config.data)));
        } else if (config.hasOwnProperty("params") && config.params) {
            // console.log(ToPathStr(config.params))
            config.headers["signature"] = md5(md5(ToPathStr(config.params)));
        }

        return config;
    },
    (error) => {
        console.log(error); // for debug
        return Promise.reject(error);
    }
);
service.interceptors.response.use(
    (response) => {
        if (response.headers.code && response.headers.code == 500) {
            let msg = decodeURIComponent(response.headers.message);
            message({
                message: msg || "Error",
                type: "error",
                duration: 3 * 1000,
            });
        }
        if (response.headers["content-disposition"]) {
            window.makeid_disposition = response.headers["content-disposition"];
        }
        const res = response.data;
        if (res.code === 200) {
            return res.result;
        } else if (res.code === 500) {
            message({
                message: res.message || "Error",
                type: "error",
                duration: 3 * 1000,
            });
            return Promise.reject(new Error(res.message || "Error"));
        } else if (res.code === 401) {
            removeToken();
            router.push("/login");
            store.commit("user/RESET_STATE");
            store.dispatch("tagsView/delAllViews");
            message({
                message: res.message,
                type: "error",
                duration: 3000,
            });
        } else {
            return res;
        }
    },
    (error) => {
        if (error.message.includes("timeout")) {
            error.message = "请求超时，请稍后再试";
        } else if (error.message.includes("status code 500")) {
            error.message = "系统维护中，请稍后再试";
        } else if (error.message.includes("Network Error")) {
            error.message = "当前网络异常，请检查网络设置";
        }
        message({
            message: error.message,
            type: "error",
            duration: 3 * 1000,
        });
        return Promise.reject(error);
    }
);
// 对url进行过滤
function urlFilter(url) {
    url = url.toLowerCase();
    const lastUrl = url.split("/").pop();
    return lastUrl.includes("list") || lastUrl.includes("query");
}
/**
 * @author: pxt
 * @param {*} data
 * @return {*} data
 * @description: 对对象参数进行去首尾
 */
function inputTrim(data) {
    // 如果是空对象
    if (JSON.stringify(data) == "{}") {
        return data;
    }
    for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
            let element = data[key];
            if (typeof element == "string") {
                data[key] = element.trim();
            } else if (Object.prototype.toString.call(data) === "[object Object]") {
                inputTrim(element);
            }
        }
    }
    return data;
}

export default service;
