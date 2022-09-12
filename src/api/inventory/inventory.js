// 引入axios封装文件
import request from "@/utils/request";
const mockUrl = window.publicConfig.ip["development"];
//盘点管理-盘点记录获取
export function getInventoryList(data) {
    return request({
        url: mockUrl + "/countTask/v1/pagelist",
        method: "post",
        data: data,
    });
}

//仓库数据
export function getStores(data) {
    return request({
        url: mockUrl + "/selectDown/listAllStorehouse",
        method: "get",
        data: data,
    });
}

//盘点类型
export function getToolCategory(data) {
    return request({
        url: mockUrl + "/selectDown/listAllTool",
        method: "get",
        data: data,
    });
}

//自动盘点设置
export function setAutoCountCycle(data) {
    return request({
        url: mockUrl + "/countTask/v1/autoCountCycle/update",
        method: "put",
        params: data,
    });
}
//新建盘点任务
export function addCountTask(data) {
    return request({
        url: mockUrl + "/countTask/v1/save",
        method: "post",
        data: data,
    });
}

//结束盘点任务
export function endCountTask(data) {
    return request({
        url: mockUrl + "/countTask/v1/stop",
        method: "put",
        params: data,
    });
}
//盘点任务详情
export function getDetailList(data) {
    return request({
        url: mockUrl + "/countTask/v1/result/pagelist",
        method: "get",
        params: data,
    });
}
//工器具补录
export function collectionTool(data) {
    return request({
        url: mockUrl + "/countTask/v1/reload",
        method: "put",
        data: data,
    });
}
//导出
export function exportData(data) {
    return request({
        url: mockUrl + "/countTask/v1/download",
        method: "get",
        params: data,
        responseType: "blob",
    });
}
