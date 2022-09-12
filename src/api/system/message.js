// 引入axios封装文件
import request, { backendIP } from "@/utils/request";

//我的审批-消息提示
export function hint(data) {
    return request({
        url: backendIP + "/audit/hint",
        method: "get",
        params: data,
    });
}
