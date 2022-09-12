// 引入axios封装文件
import request, { backendIP } from "@/utils/request";

// 流程实例-状态更改
export function processInstanceSuspendState(data) {
    return request({
        url: backendIP + "/process/suspendStateUpdate/" + data.instanceId,
        method: "get",
        params: data,
    });
}

// 流程实例-撤销
export function processInstanceRevoke(data) {
    return request({
        url: backendIP + "/process/cancelApply/" + data.instanceId,
        method: "get",
        params: data,
    });
}

// 流程实例-历史
export function processInstanceHistory(data) {
    return request({
        url: backendIP + "/process/history/list",
        method: "post",
        data: data,
    });
}
