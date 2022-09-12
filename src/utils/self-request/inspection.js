import request, { backendIP } from "@/utils/request";
//工器具状态下拉框
export const toolStatus = () => request({ url: backendIP + "/selectDown/listAllToolStatus", method: "get"});
//仓库类型下拉框
export const storeHouse = () => request({ url: backendIP + "/selectDown/listAllStorehouse", method: "get"});
//表格列表
export const inspectionPageList = (params) => request({ url: backendIP + "/inspection/pageList", method: "post",data:params});
//送检状态下拉框
export const selectDownAllInspectionStatus = () => request({ url: backendIP + "/selectDown/listAllInspectionStatus", method: "get"});
//送检表格
export const inspectionDetailPageList = (params) => request({ url: backendIP + "/inspection/inspectionDetail/pageList", method: "post",data:params});
//送检完成表格
export const inspectionCompletePageList = (params) => request({ url: backendIP + "/inspection/inspectionComplete/pageList", method: "post",data:params});
//完成送检
export const inspectionComplete = (params) => request({ url: backendIP + "/inspection/inspectionComplete/complete", method: "post",data:params});

//送检取消表格
export const inspectionDelete = (params) => request({ url: backendIP + "/inspection/delete", method: "delete",data:params});
//取消送检
export const inspectionDeleteCancel = (params) => request({ url: backendIP + "/inspection/delete/cancel", method: "delete",data:params});