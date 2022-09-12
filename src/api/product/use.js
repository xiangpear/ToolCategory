import request, { backendIP } from "@/utils/request";

export function getUseIndex(data) {
    return request({ url: backendIP + "/receive/v1/pagelist", method: "post", data });
}

export function getUseDetailInfo(data) {
    return request({
        url: backendIP + "/receive/v1/detail/pagelist",
        method: "get",
        params: {
            pageSize: data.pageSize,
            pageNo: data.pageNo,
            receiveId: data.receiveId,
        },
    });
}
