// 引入axios封装文件
import request, { backendIP } from "@/utils/request";

// 仓库下拉列表
export function baseStorehouseList() {
    return request({
        url: backendIP + "/selectDown/listAllStorehouse",
        method: "get",
    });
}

// 货位管理 - 查询列表分页
export function baseHuoweiPageList(data) {
    return request({
        url: backendIP + "/cargoSpace/pageList",
        method: "post",
        data: data,
    });
}

// 货位管理 - 新增货位
export function baseAddHuowei(data) {
    return request({
        url: backendIP + "/cargoSpace/save",
        method: "post",
        data: data,
    });
}

// 货位管理 - 编辑货位
export function baseUpdateHuowei(data) {
    return request({
        url: backendIP + "/cargoSpace/update",
        method: "put",
        data: data,
    });
}

// 货位管理 - 删除货位信息
export function baseDeleteHuowei(id) {
    return request({
        url: backendIP + `/cargoSpace/delete`,
        method: "delete",
        params: { id: id },
    });
}

// 货位管理 - 货架号下拉列表
// export function baseHuojiaList() {
//     return request({
//         url: "/shelve/listall",
//         method: "get",
//     })
// }

// 货位管理 - 根据仓库获取货架号下拉列表
export function baseHuojiaList(id) {
    return request({
        url: backendIP + `/cargoSpace/listAllShelve`,
        method: "get",
        params: { id: id },
    });
}
