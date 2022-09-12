// 引入axios封装文件
import request, { backendIP } from "@/utils/request";

// 计量单位 - 模板下载
export function baseUnitTemplateDownload() {
    return request({
        url: backendIP + "/itemUnit/download",
        method: "get",
        responseType: "blob",
    });
}

// 计量单位 - 导入数据
export function baseUnitUpload(data) {
    return request({
        url: backendIP + "/itemUnit/upload",
        method: "get",
        data: data,
        responseType: "blod",
    });
}

// 计量单位 - 查询列表分页
export function baseUnitPageList(data) {
    return request({
        url: backendIP + "/itemUnit/pageList",
        method: "post",
        data: data,
    });
}

// 计量单位 - 新增计量单位
export function baseAddUnit(data) {
    return request({
        url: backendIP + "/itemUnit/save",
        method: "post",
        data: data,
    });
}

// 计量单位 - 编辑计量单位
export function baseUpdateUnit(data) {
    return request({
        url: backendIP + "/itemUnit/update",
        method: "put",
        data: data,
    });
}

// 计量单位 - 删除计量单位
export function baseDeleteUnit(id) {
    return request({
        url: backendIP + `/itemUnit/delete`,
        method: "delete",
        params: { id: id },
    });
}
