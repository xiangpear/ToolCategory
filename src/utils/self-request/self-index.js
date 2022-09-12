import request, { backendIP } from "@/utils/request";
//总量数据
//http://123.23.55.9:23555/index/list?
export const indexListall = (params) => request({
    url: backendIP + "/index/listall", method: "get", params: {
        storeHouseId: params
    }
});

export const getStoreHouse = () => request({ url: backendIP + "/selectDown/listAllStorehouse", method: "get" });

export const toolCategory = (params) => request({ url: backendIP + "/toolCategory/listall", method: "get", data: params });

export const environment = (params) => request({ url: backendIP + "/index/environment", method: "get", data: params })

//暖风机开启
export const heaterOpen = (params) => request({ url: backendIP + "/index/heater/open", method: "post", data: params })
//暖风机关闭
export const heaterClose = (params) => request({ url: backendIP + "/index/heater/close", method: "post", data: params })
//盘点任务表
export const countTask = (params) => request({ url: backendIP + "/countTask/v1/pagelist", method: "post", data: params })
//领用任务表
export const receiveTask = (params) => request({ url: backendIP + "/receive/v1/record/pagelist", method: "post", data: params })
//送检任务表
export const inspectionWarn = (params) => request({ url: backendIP + "/inspectionWarn/pageList", method: "post", data: params })