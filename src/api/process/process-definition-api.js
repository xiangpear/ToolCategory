// 引入axios封装文件
import request, { backendIP } from "@/utils/request";

// 流程定义-列表
export function processDefinitionList(data) {
    return request({
        url: backendIP + "/definition/list",
        method: "post",
        data: data,
    });
}

// 流程定义-状态更改
export function processDefinitionSuspendState(data) {
    return request({
        url: backendIP + "/definition/suspendStateUpdate/" + data.id,
        method: "get",
        params: data,
    });
}

// 流程定义-删除
export function processDefinitionDelete(data) {
    return request({
        url: backendIP + "/definition/remove",
        method: "post",
        data: data,
    });
}

//流程定义-下载
export function processDefinitionDown(data) {
    return request({
        url: backendIP + "/definition/readResource",
        method: "post",
        data: data,
        responseType: "blob",
        timeout: 9999999999,
    });
}
