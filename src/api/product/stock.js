import request, { backendIP } from "@/utils/request.js";

export function getStockInfo(data) {
    return request({ url: backendIP + "/tool/v1/pagelist", data, method: "post" });
}

export function getStockNameList() {
    return request({ url: backendIP + "/selectDown/listAllTool", method: "get" });
}

export function getStockStatusList() {
    return request({ url: backendIP + "/selectDown/listAllToolStatus", method: "get" });
}

export function getCargospacePull() {
    return request({ url: backendIP + "/selectDown/listAllCargoSpace", method: "get" });
}

export function getStockDetailInfo(data) {
    return request({ url: backendIP + "/tool/v1/operation/pagelist", method: "post", data });
}

export function deleteTool(data) {
    return request({ url: backendIP + "/tool/v1/destroy", method: "delete", data });
}

export function updateToolInfo(data) {
    return request({ url: backendIP + "/tool/v1/update", method: "post", data });
}
