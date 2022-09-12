// 引入axios封装文件
import request, { backendIP } from "@/utils/request";

// 仓库管理 - 获取仓库列表
export function baseStorehousePageList(data) {
    return request({
        url: backendIP + "/storehouse/pageList",
        method: "post",
        data: data,
    });
}

// 仓库管理 - 新增仓库
export function baseAddStorehouse(data) {
    return request({
        url: backendIP + "/storehouse/save",
        method: "post",
        data: data,
    });
}

// 仓库管理 - 编辑仓库
export function baseUpdateStorehouse(data) {
    return request({
        url: backendIP + "/storehouse/update",
        method: "put",
        data: data,
    });
}

// 仓库管理 - 删除仓库
export function baseDelStorehouse(id) {
    return request({
        url: backendIP + `/storehouse/delete`,
        method: "delete",
        params: { id: id },
    });
}
