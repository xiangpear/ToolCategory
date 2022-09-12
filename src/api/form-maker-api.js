// 引入axios封装文件
import request, { backendIP } from "@/utils/request";

//========================================================
//开发管理首页
//========================================================

// 开发管理首页 - 列表
export function MetaPageList(data) {
    return request({
        url: backendIP + "/meta/page/listall",
        method: "post",
        data: data,
    });
}

// 开发管理首页 - 获取详情信息
export function MetaPageInfo(data) {
    return request({
        url: backendIP + "/meta/page/info",
        method: "get",
        params: data,
    });
}

// 开发管理首页 - 页面管理-详情
export function MetaPageInfoPageId(data) {
    return request({
        url: backendIP + "/meta/page/info/" + data.pageId,
        method: "get",
        params: {
            type: data.type,
        },
    });
}

// 开发管理首页 - 新增
export function MetaPageSave(data) {
    return request({
        url: backendIP + "/meta/page/save",
        method: "post",
        data: data,
    });
}

// 开发管理首页 - 修改
export function MetaPageUpdate(data) {
    return request({
        url: backendIP + "/meta/page/update",
        method: "post",
        data: data,
    });
}

// 开发管理首页 - 删除
export function MetaPageDelete(data) {
    return request({
        url: backendIP + "/meta/page/delete",
        method: "post",
        data: data,
    });
}

//========================================================
//开发管理表单编辑器
//========================================================

// 开发管理表单编辑器 - 部署
export function MetaDataDeploy(data) {
    return request({
        url: backendIP + "/meta/dataDeploy",
        method: "post",
        data: data,
    });
}

// 开发管理表单编辑器 - DB表字段明细
export function MetaDbTableDetail(data) {
    return request({
        url: backendIP + "/meta/dbTableDetail",
        method: "get",
        params: data,
    });
}

// 开发管理表单编辑器 - DB数据库表列表
export function MetaDbTableList(data) {
    return request({
        url: backendIP + "/meta/dbTableList",
        method: "get",
        params: data,
    });
}

// 开发管理表单编辑器 - 获取初始化数据
export function MetaGetInitData(data) {
    return request({
        url: backendIP + `/meta/getInitData/${data.businessId}`,
        method: "get",
    });
}

// 开发管理表单编辑器 - 保存
export function MetaInitByTable(data) {
    return request({
        url: backendIP + "/meta/initByTable",
        method: "post",
        data: data,
    });
}

// 开发管理表单编辑器 - 后端代码下载
export function MetaSourceCodeDownload(data) {
    return request({
        url: backendIP + "/meta/sourceCodeDownload",
        method: "post",
        data: data,
    });
}
