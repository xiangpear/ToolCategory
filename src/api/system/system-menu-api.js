/* eslint-disable no-constant-condition */
// 引入axios封装文件
import request, { backendIP } from "@/utils/request";
import { replacePath } from "@/utils/index";

// 系统菜单 - 删除菜单
export function sysMenuDeleteMenuId(data) {
    const url = replacePath("/sysApi/menu/delete/{menuId}", data);
    return request({
        url: backendIP + url,
        method: "get",
        data: data,
    });
}

// 系统菜单 - 菜单详情
export function sysMenuInfoMenuId(data) {
    return request({
        url: backendIP + "/sysApi/menu/info",
        method: "get",
        params: data,
    });
}

// 系统菜单 - 获取全量菜单列表
export function sysMenuList() {
    return request({
        url: backendIP + "/sysApi/menu/list",
        method: "get",
    });
}

// 系统菜单 - 获取当前登录用户菜单列表
export function sysMenuNav() {
    return request({
        url: backendIP + "/sysApi/menu/nav",
        method: "get",
    });
}

// 系统菜单 - 保存菜单信息
export function sysMenuSave(data) {
    return request({
        url: backendIP + "/sysApi/menu/save",
        method: "post",
        data: data,
    });
}

// 系统菜单 - 修改菜单信息
export function sysMenuUpdate(data) {
    return request({
        url: backendIP + "/sysApi/menu/update",
        method: "post",
        data: data,
    });
}
