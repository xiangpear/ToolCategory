// 引入axios封装文件
import request, { backendIP } from "@/utils/request";

// - 分页列表
export function todoTaskList(data) {
    return request({
        url: backendIP + "/leave/taskList",
        method: "post",
        data: data,
    });
}

// - 审核
export function todoTaskAudit(data) {
    return request({
        url: backendIP + "/leave/completeApply",
        method: "post",
        data: data,
    });
}
