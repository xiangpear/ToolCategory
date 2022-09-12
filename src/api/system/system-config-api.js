// 引入axios封装文件
import request, { backendIP } from "@/utils/request";

// 系统配置-修改
export function sysConfigUpdte(data) {
    return request({
        url: backendIP + "/sysApi/config/update",
        method: "post",
        data: data,
    });
}

// 系统配置-获取详情信息
export function sysConfigInfo() {
    return request({
        url: backendIP + "/sysApi/config/info",
        method: "get",
    });
}
