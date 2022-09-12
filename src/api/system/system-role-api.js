// 引入axios封装文件
import request, { backendIP } from "@/utils/request";

// 角色管理 - 删除角色信息
export function sysRoleDelete(data) {
    return request({
        url: backendIP + "/sysApi/role/delete",
        method: "post",
        data: data,
    });
}

// 角色管理 - 角色信息
export function sysRoleInfoRoleId(data) {
    return request({
        url: backendIP + "/sysApi/role/info",
        method: "get",
        params: data,
    });
}

// 角色管理 - 分页角色列表
export function sysRoleList(data) {
    return request({
        url: backendIP + "/sysApi/role/list",
        method: "post",
        data: data,
    });
}

// 角色管理 - 用户角色列表
export function sysUserRoleList(data) {
    return request({
        url: backendIP + "/sysApi/role/roleList",
        method: "get",
        params: data,
    });
}

// 角色管理 - 分页角色列表
export function sysRoleListAll(data) {
    return request({
        url: backendIP + "/sysApi/role/listAll",
        method: "get",
        data: data,
    });
}

// 角色管理 - 新增角色
export function sysRoleSave(data) {
    return request({
        url: backendIP + "/sysApi/role/save",
        method: "post",
        data: data,
    });
}

// 角色管理 - 修改角色信息
export function sysRoleUpdate(data) {
    return request({
        url: backendIP + "/sysApi/role/update",
        method: "post",
        data: data,
    });
}
