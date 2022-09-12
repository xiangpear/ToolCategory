// 引入axios封装文件
import request, { backendIP } from "@/utils/request";

// 系统配置 - 获取页面数据
export function baseSysPageList() {
    return request({
        url: backendIP + "/sysProperty/pageList",
        method: "post",
    });
}

// 系统配置 - 更新数据
export function baseSysUpdate(data) {
    return request({
        url: backendIP + "/sysProperty/update",
        method: "put",
        data: data,
    });
}
