// 引入axios封装文件
import request, { backendIP } from "@/utils/request";

// 终端管理 - 查询列表分页
export function baseTerminalPageList(data) {
    return request({
        url: backendIP + "/terminal/pageList",
        method: "post",
        data: data,
    });
}

// 终端管理 - 新增终端设备
export function baseAddTerminal(data) {
    return request({
        url: backendIP + "/terminal/save",
        method: "post",
        data: data,
    });
}

// 终端管理 - 编辑终端设备
export function baseUpdateTerminal(data) {
    return request({
        url: backendIP + "/terminal/update",
        method: "put",
        data: data,
    });
}

// 终端管理 - 删除终端设备
export function baseDeleteTerminal(id) {
    return request({
        url: backendIP + `/terminal/delete`,
        method: "delete",
        params: { id: id },
    });
}
