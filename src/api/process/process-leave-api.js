// 引入axios封装文件
import request, { backendIP } from "@/utils/request";

// - 分页列表
export function bizLeaveList(data) {
    return request({
        url: backendIP + "/leave/pagelist",
        method: "post",
        data: data,
    });
}

// - 获取详情信息
export function bizLeaveInfo(data) {
    return request({
        url: backendIP + "/leave/info",
        method: "get",
        params: data,
    });
}

// - 新增
export function bizLeaveSave(data) {
    return request({
        url: backendIP + "/leave/save",
        method: "post",
        data: data,
    });
}

// - 修改
export function bizLeaveUpdate(data) {
    return request({
        url: backendIP + "/leave/update",
        method: "patch",
        data: data,
    });
}

// - 删除
export function bizLeaveDelete(data) {
    return request({
        url: backendIP + "/leave/delete",
        method: "delete",
        data: data,
    });
}

// - 提交
export function bizLeaveSubmit(data) {
    return request({
        url: backendIP + "/leave/submitApply",
        method: "get",
        params: data,
    });
}
