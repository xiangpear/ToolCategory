// 引入axios封装文件
import request, { backendIP } from "@/utils/request";

// 用户管理 - 添加用户
export function sysUserAdd(data) {
    return request({
        url: backendIP + "/sysApi/user/add",
        method: "post",
        data: data,
    });
}

// 用户管理 - 删除
export function sysUserDelete(data) {
    return request({
        url: backendIP + "/sysApi/user/delete",
        method: "post",
        data: data,
    });
}

// 用户管理 - 编辑
export function sysUserEdit(data) {
    return request({
        url: backendIP + "/sysApi/user/edit",
        method: "post",
        data: data,
    });
}

// 用户管理 - 查询列表分页
export function sysUserPagelist(data) {
    return request({
        url: backendIP + "/sysApi/user/list",
        method: "post",
        data: data,
    });
}

// 用户管理 - 用户列表
export function sysUserList(data) {
    return request({
        url: backendIP + "/sysApi/user/userList",
        method: "get",
        params: data,
    });
}

// 用户管理 - 修改密码
export function sysUserPassword(data) {
    return request({
        url: backendIP + "/sysApi/user/password",
        method: "post",
        data: data,
    });
}

// 用户管理 - 根据用户ID查询用户信息
export function sysUserQueryByIdUserId(data) {
    return request({
        url: backendIP + "/sysApi/user/queryById",
        method: "get",
        params: data,
    });
}

// 用户管理 - 登陆后获取用户信息
export function sysUserQueryUserInfo() {
    return request({
        url: backendIP + "/sysApi/user/queryUserInfo",
        method: "get",
    });
}
// 用户管理 - 重置密码
export function sysUserResetPwd(data) {
    return request({
        url: backendIP + "/sysApi/user/resetPwd",
        method: "get",
        params: data,
    });
}

// 用户管理 - 解锁
export function sysUserUnLock(data) {
    return request({
        url: backendIP + "/sysApi/user/unLock",
        method: "get",
        params: data,
    });
}

// 用户管理 - 模板下载
export function sysUserTemplateDownload() {
    return request({
        url: backendIP + "/sysApi/user/download",
        method: "GET",
        responseType: "blob",
    });
}

// 用户管理 - 导入
export function sysUserUpload(data) {
    return request({
        url: backendIP + "/sysApi/user/upload",
        method: "POST",
        data: data,
        responseType: "blob",
    });
}

// 用户管理 - 导出
export function sysUserExport(data) {
    return request({
        url: backendIP + "/sysApi/user/export",
        method: "POST",
        data: data,
        responseType: "blob",
    });
}
