// 引入axios封装文件
import request, { backendIP } from "@/utils/request";

// 机构管理 - 删除机构
export function sysDeptDelete(data) {
    return request({
        url: backendIP + "/sysApi/dept/delete",
        method: "post",
        data: data,
    });
}

// 机构管理 - 查询机构详情
export function sysDeptInfoDeptId(data) {
    return request({
        url: backendIP + "/sysApi/dept/info",
        method: "get",
        params: data,
    });
}

// 机构管理 - 机构树结构列表
export function sysDeptAll(data) {
    return request({
        url: backendIP + "/sysApi/dept/deptAll",
        method: "get",
        params: data,
    });
}

//部门数据
export function sysDeptData(data) {
    return request({
        url: backendIP + "/sysApi/dept/deptData",
        method: "get",
        params: data,
    });
}

export function sysDeptList(data) {
    return request({
        url: backendIP + "/sysApi/dept/list",
        method: "get",
        params: data,
    });
}

// 机构管理 - 用户部门列表
export function sysDeptListAll(data) {
    return request({
        url: backendIP + "/sysApi/dept/deptList",
        method: "get",
        params: data,
    });
}

// 机构管理 - 新增机构
export function sysDeptSave(data) {
    return request({
        url: backendIP + "/sysApi/dept/save",
        method: "post",
        data: data,
    });
}

// 机构管理 - 修改机构信息
export function sysDeptUpdate(data) {
    return request({
        url: backendIP + "/sysApi/dept/update",
        method: "post",
        data: data,
    });
}

// 机构管理 - 模板下载
export function sysDeptTemplateDownload() {
    return request({
        url: backendIP + "/sysApi/dept/download",
        method: "GET",
        responseType: "blob",
    });
}

// 机构管理 - 导入
export function sysDeptUpload(data) {
    return request({
        url: backendIP + "/sysApi/dept/upload",
        method: "POST",
        data: data,
        responseType: "blob",
    });
}

// 机构管理 - 导出
export function sysDeptExport() {
    return request({
        url: backendIP + "/sysApi/dept/export",
        method: "GET",
        responseType: "blob",
    });
}
