import request, { backendIP } from "@/utils/request.js";

export function getIntoStockIndex(data) {
    return request({ url: backendIP + "/instock/v1/pagelist", method: "post", data });
}

export function getIntoStockdetailInfo(data) {
    // return request({ url: backendIP + `/instock/v1/detail/pagelist?pageSize=${data.pageSize}&pageNo=${data.pageNo}&instockId=${data.instockId}`, method: "get" });
    return request({
        url: backendIP + "/instock/v1/detail/pagelist",
        method: "get",
        params: {
            pageSize: data.pageSize,
            pageNo: data.pageNo,
            instockId: data.instockId,
        },
    });
}

export function postAddInfoIntoStock(data) {
    return request({ url: backendIP + "/instock/v1/save", method: "post", data });
}

export function getTemplateDownload() {
    return request({ url: backendIP + "/instock/download", method: "get", responseType: "blob" });
}
