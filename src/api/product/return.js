import request, { backendIP } from "@/utils/request.js";

export function getReturnIndex(data) {
    return request({ url: backendIP + "/revert/v1/pagelist", method: "post", data });
}

export function getReturnDetailInfo(data) {
    return request({
        url: backendIP + "/revert/v1/detail/pagelist",
        method: "get",
        params: {
            pageSize: data.pageSize,
            pageNo: data.pageNo,
            revertId: data.id,
        },
    });
}
