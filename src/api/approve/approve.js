// 引入axios封装文件
import request, { backendIP } from "@/utils/request";

//我的审批-待处理任务
export function getPendingList(data) {
    return request({
        url: backendIP + "/audit/todoTask",
        method: "post",
        data: data,
    });
}
//我的审批-已处理任务
export function getProcessedList(data) {
    return request({
        url: backendIP + "/audit/doneTask",
        method: "post",
        data: data,
    });
}
//我的审批-已发起任务
export function getLaunchedList(data) {
    return request({
        url: backendIP + "/audit/applyTasks",
        method: "post",
        data: data,
    });
}
//我的审批-已抄送任务
export function getCopyList(data) {
    return request({
        url: backendIP + "/audit/sendTask",
        method: "post",
        data: data,
    });
}
//流程信息-完成任务
export function completeApply(data) {
    return request({
        url: backendIP + "/process/instance/completeApply",
        method: "post",
        data: data,
    });
}
//流程信息-审批历史
export function historyList(data) {
    return request({
        url: backendIP + "/process/history/list",
        method: "post",
        data: data,
    });
}
//流程信息-请假案例-单据详情
export function getFormData(data) {
    return request({
        url: backendIP + "/leave/info",
        method: "get",
        params: data,
    });
}
//我的审批-撤销流程
export function cancelApply(data) {
    return request({
        url: backendIP + "/process/cancelApply/" + data.processInstanceId,
        method: "get",
        params: data,
    });
}

//我的审批-消息提示
export function hint(data) {
    return request({
        url: backendIP + "/audit/hint",
        method: "get",
        params: data,
    });
}

//我的审批-更新抄送我预览信息
export function carbonCopy(data) {
    return request({
        url: backendIP + "/audit/preview/" + data.carbonCopyId,
        method: "get",
        params: "",
    });
}

//我的审批-删除
export function approveDelete(data) {
    return request({
        url: backendIP + "/audit/taskDelete",
        method: "post",
        data: data,
    });
}

//我的审批-抄送我 删除
export function copyDelete(data) {
    return request({
        url: backendIP + "/audit/copyDelete",
        method: "post",
        data: data,
    });
}
//我的审批-获取流程信息
export function getdrawing(data) {
    return request({
        url: backendIP + "/process/instance/drawing",
        method: "post",
        data: data,
    });
}

//我的审批-获取节点用户信息
export function getActivityUser(data) {
    return request({
        url: backendIP + "/process/activity/users",
        method: "post",
        data: data,
    });
}

//我的审批-提交流程
export function submitApply(data) {
    return request({
        url: backendIP + "/process/instance/submitApply",
        method: "post",
        data: data,
    });
}

//流程信息-委托流程
export function delegate(data) {
    return request({
        url: backendIP + "/makeid-boot/process/delegate/" + data.taskId,
        method: "get",
        data: { delegateToUser: data.delegateToUser },
    });
}

//流程信息-流程进度
export function readResource(data) {
    return request({
        url: backendIP + "/makeid-boot/process/readResource",
        method: "get",
        data: data,
    });
}
