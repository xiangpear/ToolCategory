// 引入axios封装文件
import request, { backendIP } from "@/utils/request";

//yemian - 分页列表
export function yemianPagelist(data) {
    return request({
        url: backendIP + "/business/yemian/pagelist",
        method: "post",
        data: data,
    });
}

//yemian - 获取详情信息
export function yemianInfo(data) {
    return request({
        url: backendIP + "/business/yemian/info",
        method: "get",
        params: data,
    });
}

//yemian - 新增
export function yemianSave(data) {
    return request({
        url: backendIP + "/business/yemian/save",
        method: "post",
        data: data,
    });
}

//yemian - 修改
export function yemianUpdate(data) {
    return request({
        url: backendIP + "/business/yemian/update",
        method: "post",
        data: data,
    });
}

//yemian - 删除
export function yemianDelete(data) {
    return request({
        url: backendIP + "/business/yemian/delete",
        method: "post",
        data: data,
    });
}

//yemian - 全量列表
export function yemianListall(data) {
    return request({
        url: backendIP + "/business/yemian/listall",
        method: "post",
        data: data,
    });
}

//yemian - 导出
export function yemianDownload(data) {
    return request({
        url: backendIP + "/business/yemian/download",
        method: "post",
        data: data,
        responseType: "blob",
    });
}

//yemian - 导入模板下载
export function yemianDownloadTemplate(data) {
    return request({
        url: backendIP + "/business/yemian/downloadTemplate",
        method: "post",
        data: data,
        responseType: "blob",
    });
}

//yemian - 导入
export function yemianUpload(data) {
    return backendIP + "/business/yemian/upload";
}

/*return {
    yemianPagelist,
    yemianInfo,
    yemianSave,
    yemianUpdate,
    yemianDelete,
    yemianListall,
    yemianDownload,
    yemianDownloadTemplate,
    yemianUpload,
};return*/
