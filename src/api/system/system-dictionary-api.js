// 引入axios封装文件
import request, { backendIP } from "@/utils/request";

// 数据字典 - 删除字典信息
export function sysDictDelete(data) {
    return request({
        url: backendIP + "/sysApi/dict/delete",
        method: "post",
        data: data,
    });
}

// 数据字典 - 字典详情
export function sysDictInfoId(data) {
    // const url = replacePath('/sysApi/dict/info/{id}', data)
    return request({
        url: backendIP + "/sysApi/dict/info",
        method: "get",
        params: data,
    });
}

// 数据字典 - 字典列表分页查询
export function sysDictList(data) {
    return request({
        url: backendIP + "/sysApi/dict/list",
        method: "post",
        data: data,
    });
}

// 数据字典 - 新增字典
export function sysDictSave(data) {
    return request({
        url: backendIP + "/sysApi/dict/save",
        method: "post",
        data: data,
    });
}

// 数据字典 - 修改字典信息
export function sysDictUpdate(data) {
    return request({
        url: backendIP + "/sysApi/dict/update",
        method: "post",
        data: data,
    });
}
// 数据字典 - 下载模板
export function sysDictDownload(data) {
    return request({
        url: backendIP + "/sysApi/dict/download",
        method: "get",
        data: data,
        responseType: "blob",
    });
}
