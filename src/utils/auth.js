import Cookies from "js-cookie";
import { aesDecrypt, getUrlSearch } from "@/utils/index.js";

const TokenKey = "wewin_token" + handleParams().params;
const UpdatePwdKey = "wewin_updatePwd" + handleParams().params;

// 返回url的参数
export function handleParams() {
    var searchJson = getUrlSearch();
    let params = "";
    let title = window.publicConfig.projectName;
    if (searchJson.makeid_params && searchJson.makeid_title) {
        params = searchJson.makeid_params;
        title = decodeURIComponent(searchJson.makeid_title);
    }
    return {
        params,
        title,
    };
}

// 返回开发管理传过来的对象
export function handleURL(params) {
    if (!params) return;
    let searchObj = {
        params: {},
    };
    searchObj.params = JSON.parse(decodeURIComponent(aesDecrypt(params)));
    return searchObj;
}

export function getToken() {
    return Cookies.get(TokenKey);
}

export function setToken(token) {
    return Cookies.set(TokenKey, token);
}

export function removeToken() {
    return Cookies.remove(TokenKey);
}

export function getUpdatePwd() {
    return Cookies.get(UpdatePwdKey);
}

export function setUpdatePwd(updatePwd) {
    return Cookies.set(UpdatePwdKey, updatePwd);
}

export function removeUpdatePwd() {
    return Cookies.remove(UpdatePwdKey);
}
