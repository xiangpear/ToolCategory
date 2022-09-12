// 引入axios封装文件
import request, { backendIP } from "@/utils/request";

// 定时任务 - 删除定时任务
export function jobDeleteJobId(data) {
    return request({
        url: backendIP + "/job/delete",
        method: "get",
        params: data,
    });
}

// 定时任务 - 查看定时任务明细
export function jobInfoJobId(data) {
    return request({
        url: backendIP + "/job/info",
        method: "get",
        params: data,
    });
}

// 定时任务 - 定时任务分页列表
export function jobList(data) {
    return request({
        url: backendIP + "/job/list",
        method: "post",
        data: data,
    });
}

// 定时任务 - 保存定时任务
export function jobSave(data) {
    return request({
        url: backendIP + "/job/save",
        method: "post",
        data: data,
    });
}

// 定时任务 - 启动单个定时任务
export function jobStart(data) {
    return request({
        url: backendIP + "/job/start",
        method: "get",
        params: data,
    });
}

// 定时任务 - 停止单个定时任务
export function jobStop(data) {
    return request({
        url: backendIP + "/job/stop",
        method: "get",
        params: data,
    });
}

// 定时任务 - 修改定时任务
export function jobUpdate(data) {
    return request({
        url: backendIP + "/job/update",
        method: "post",
        data: data,
    });
}
// 任务执行日志 - 日志分页列表
export function sysScheduleLogList(data) {
    return request({
        url: backendIP + "/sysApi/scheduleLog/list",
        method: "post",
        data: data,
    });
}
