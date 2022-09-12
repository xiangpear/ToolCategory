// 台账页面api
// 引入axios封装文件
import request from "@/utils/request";
const mockUrl = window.publicConfig.ip["development"];
// 入库台账

//获取仓库列表

export function getStores(data) {
    return request({
        url: mockUrl + "/selectDown/listAllStorehouse",
        method: "get",
        data: data,
    });
}
//工器具名称
export function getToolCategory(data) {
    return request({
        url: mockUrl + "/selectDown/listAllTool",
        method: "get",
        data: data,
    });
}
//获取入库列表数据
export function warehouse(data) {
    return request({
        url: mockUrl + "/instock/v1/record/pagelist",
        method: "post",
        data: data,
    });
}
//获取获取列表数据
export function collect(data) {
    return request({
        url: mockUrl + "/receive/v1/record/pagelist",
        method: "post",
        data: data,
    });
}
//获取归还列表数据
export function back(data) {
    return request({
        url: mockUrl + "/revert/v1/record/pagelist",
        method: "post",
        data: data,
    });
}
