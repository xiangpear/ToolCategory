// 引入axios封装文件
import request, { backendIP } from "@/utils/request";

// 指示灯管理 - 查询列表分页
export function baseLampPageList(data) {
    return request({
        url: "/indicatorLight/pagelist",
        method: "post",
        data: data,
    });
}
