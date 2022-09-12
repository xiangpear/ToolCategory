// 引入axios封装文件
import request, { backendIP } from "@/utils/request";

// 用户管理 - 部署
export function sysProcessStart(data) {
    return request({
        url: backendIP + "/designer/save",
        method: "get",
        params: data,
    });
}

// 用户管理 - 新增
export function sysProcessSave(data) {
    return request({
        url: backendIP + "/designer/save",
        method: "post",
        data: data,
    });
}

// 用户管理 - 删除
export function sysProcessDelete(data) {
    return request({
        url: backendIP + "/designer/delete",
        method: "post",
        data: data,
    });
}

// 用户管理 - 编辑
export function sysProcessUpdate(data) {
    return request({
        url: backendIP + "/designer/update",
        method: "post",
        data: data,
    });
}

// 用户管理 - 查询列表分页
export function sysProcessPagelist(data) {
    return request({
        url: backendIP + "/designer/pagelist",
        method: "post",
        data: data,
    });
}

// 用户管理 - 根据用户ID查询用户信息
export function sysProcessInfo(data) {
    return request({
        url: backendIP + "/designer/info",
        method: "get",
        params: data,
    });
}
