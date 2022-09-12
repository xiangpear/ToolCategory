// 引入axios封装文件
import request, { backendIP } from "@/utils/request";
// import mockRequest from "@/utils/requestMock";

// export function baseToolCategoryPageList() {
//     return mockRequest({
//         url: "/baseType",
//         method: "get",
//     })
// }

// 工器具类型 - 工器具名称下拉列表
export function baseToolCategoryNameList() {
    return request({
        url: backendIP + "/selectDown/listAllTool",
        method: "get",
    });
}

// 工器具类型 - 计量单位下拉列表
export function baseItemUnitList() {
    return request({
        url: backendIP + "/selectDown/listAllItemUnit",
        method: "get",
    });
}

// 工器具类型 - 模板下载
export function baseToolCategoryTemplateDownload() {
    return request({
        url: backendIP + "/toolCategory/download",
        method: "get",
        responseType: "blob",
    });
}

// 工器具类型 - 导入数据
export function baseToolCategoryUpload(data) {
    return request({
        url: backendIP + "/toolCategory/upload",
        method: "get",
        data: data,
        responseType: "blob",
    });
}

// 工器具类型 - 图片上传
export function baseToolCategoryImg(data) {
    return request({
        url: backendIP + "/oss/upload",
        method: "post",
        data: data,
    });
}

//工器具类型 - 查询列表分页
export function baseToolCategoryPageList(data) {
    return request({
        url: backendIP + "/toolCategory/pageList",
        method: "post",
        data: data,
    });
}

// 工器具类型 - 工器具类型全列表
// export function baseToolCategoryList(data) {
//     return request({
//         url: "/toolCategory/listall",
//         method: 'post',
//         params: data,
//     });
// }

// 工器具类型 - 新增工器具类型
export function baseAddToolCategory(data) {
    return request({
        url: backendIP + "/toolCategory/save",
        method: "post",
        data: data,
    });
}

// 工器具类型 - 编辑工器具类型
export function baseUpdateToolCategory(data) {
    return request({
        url: backendIP + "/toolCategory/update",
        method: "put",
        data: data,
    });
}

// 工器具类型 - 删除工器具类型
export function baseDeleteToolCategory(id) {
    return request({
        // url: backendIP + `/toolCategory/delete?id=${id}`,
        url: backendIP + `/toolCategory/delete`,
        method: "delete",
        params: { id: id },
    });
}
