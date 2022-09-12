// 引入axios封装文件
import request, { backendIP } from "@/utils/request";

// 系统日志 - 系统日志查询
export function sysLogList(data) {
    return request({
        url: backendIP + "/sysApi/log/pagelist",
        method: "post",
        data: data,
    });
}
