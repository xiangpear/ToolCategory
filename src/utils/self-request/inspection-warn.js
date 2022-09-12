import request, { backendIP } from "@/utils/request";
//工器具类型下拉框
export const toolList = () => request({ url: backendIP+"/selectDown/listAllTool", method: "get" });
//工器具状态下拉框
export const toolStatus = () => request({ url: backendIP+"/selectDown/listAllToolStatus", method: "get" });
//仓库类型下拉框
export const storeHouse = () => request({ url: backendIP+"/selectDown/listAllStorehouse", method: "get" });
//送检提醒表格
export const inspectionWarnPageList = (params) => request({ url:backendIP+ "/inspectionWarn/pageList", method: "post", data: params });
//发送送检请求
export const inspectionWarnSave = (params) => request({ url:backendIP+ "/inspectionWarn/save", method: "post", data: params });