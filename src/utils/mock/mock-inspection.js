import Mock from "mockjs";
//工会器具状态下拉框
Mock.mock("/makeid-boot/selectDown/listAllToolStatus", "get", () => {
    return {
        code: 0,
        message: "",
        result: [
            {
                createdBy: 0,
                createdTime: "",
                toolStatusDesc: "",
                toolStatusId: 0,
                toolStatusName: "22",
                updatedBy: 0,
                updatedTime: "",
            },
        ],
        success: true,
        timestamp: 0,
    };
});
//获取表格数据
Mock.mock("/makeid-boot/inspection/pageList", "post", () => {
    return {
        code: 0,
        message: "",
        result: {
            current: 1,
            hitCount: true,
            pages: 0,
            records: [
                {
                    createdTime: "555",
                    finishTime: "6666",
                    inspectionId: 0,
                    inspectionIdentifier: "",
                    inspectionStatusName: "",
                    storehouseName: "",
                    userName: "",
                },
            ],
            searchCount: true,
            size: 5,
            total: 10,
        },
        success: true,
        timestamp: 0,
    };
});
//送检状态下拉框
Mock.mock("/makeid-boot/selectDown/listAllInspectionStatus", "get", () => {
    return {
        code: 0,
        message: "",
        result: [
            {
                createdBy: 0,
                createdTime: "",
                inspectionStatusDesc: "",
                inspectionStatusId: 0,
                inspectionStatusName: "tt",
                updatedBy: 0,
                updatedTime: "",
            },
        ],
        success: true,
        timestamp: 0,
    };
});
//送检详情表格
Mock.mock("/makeid-boot/inspection/inspectionDetail/pageList", "post", () => {
    return {
        code: 0,
        message: "",
        result: {
            current: 1,
            hitCount: true,
            pages: 0,
            records: [
                {
                    cargoSpaceId: 0,
                    cargoSpaceIdentifier: "",
                    createdBy: 0,
                    createdTime: "",
                    factory: "",
                    instockId: 0,
                    lastInspectionTime: "",
                    model: "",
                    nextInspectionTime: "",
                    produceNumber: "",
                    produceTime: "",
                    rfid: "",
                    storeHouse: "",
                    storehouseId: 0,
                    toolAlias: "",
                    toolAttribute: "",
                    toolCategory: {
                        alarmStockNumber: 0,
                        createdTime: "",
                        imgUrl: "",
                        inStockNumber: 0,
                        inspectionCycle: 0,
                        inspectionNumber: 0,
                        itemUnitName: "",
                        stockNumber: 0,
                        testVoltage: 0,
                        toolCategoryId: 0,
                        toolCategoryName: "",
                        toolStatusName: "",
                        updatedTime: "",
                        useCycle: 0,
                        useNumber: 0,
                        voltageLevel: 0,
                        voltageTime: 0,
                    },
                    toolCategoryId: 0,
                    toolId: 0,
                    toolStatus: {
                        createdBy: 0,
                        createdTime: "",
                        toolStatusDesc: "",
                        toolStatusId: 0,
                        toolStatusName: "",
                        updatedBy: 0,
                        updatedTime: "",
                    },
                    toolStatusId: 0,
                    updatedBy: 0,
                    updatedTime: "",
                    uselessDesc: "",
                },
            ],
            searchCount: true,
            size: 5,
            total: 10,
        },
        success: true,
        timestamp: 0,
    };
});
//送检完成表格
Mock.mock("/makeid-boot/inspection/inspectionComplete/pageList", "post", () => {
    return {
        code: 0,
        message: "",
        result: {
            current: 1,
            hitCount: true,
            pages: 0,
            records: [
                {
                    cargoSpaceId: 0,
                    cargoSpaceIdentifier: "",
                    createdBy: 0,
                    createdTime: "",
                    factory: "",
                    instockId: 0,
                    lastInspectionTime: "",
                    model: "",
                    nextInspectionTime: "",
                    produceNumber: "",
                    produceTime: "",
                    rfid: "",
                    storeHouse: "",
                    storehouseId: 0,
                    toolAlias: "",
                    toolAttribute: "",
                    toolCategory: {
                        alarmStockNumber: 0,
                        createdTime: "",
                        imgUrl: "",
                        inStockNumber: 0,
                        inspectionCycle: 0,
                        inspectionNumber: 0,
                        itemUnit: {
                            createdBy: 0,
                            createdTime: "",
                            itemUnitId: 0,
                            itemUnitName: "",
                            updatedBy: 0,
                            updatedTime: "",
                        },
                        stockNumber: 0,
                        testVoltage: 0,
                        toolCategoryId: 0,
                        toolCategoryName: "",
                        toolStatus: {
                            createdBy: 0,
                            createdTime: "",
                            toolStatusDesc: "",
                            toolStatusId: 0,
                            toolStatusName: "",
                            updatedBy: 0,
                            updatedTime: "",
                        },
                        updatedTime: "",
                        useCycle: 0,
                        useNumber: 0,
                        voltageLevel: 0,
                        voltageTime: 0,
                    },
                    toolCategoryId: 0,
                    toolId: 0,
                    toolStatus: {
                        createdBy: 0,
                        createdTime: "",
                        toolStatusDesc: "",
                        toolStatusId: 0,
                        toolStatusName: "",
                        updatedBy: 0,
                        updatedTime: "",
                    },
                    toolStatusId: 0,
                    updatedBy: 0,
                    updatedTime: "",
                    uselessDesc: "",
                },
            ],
            searchCount: true,
            size: 5,
            total: 10,
        },
        success: true,
        timestamp: 0,
    };
});
//送检完成
Mock.mock("/makeid-boot/inspection/inspectionComplete/complete", "post", () => {
    return {
        code: 0,
        message: "",
        result: {},
        success: true,
        timestamp: 0,
    };
});
//送检取消表格
Mock.mock("/makeid-boot/inspection/delete", "delete", () => {
    return {
        code: 0,
        message: "",
        result: {
            current: 1,
            hitCount: true,
            pages: 0,
            records: [
                {
                    cargoSpaceId: 0,
                    cargoSpaceIdentifier: "",
                    createdBy: 0,
                    createdTime: "",
                    factory: "",
                    instockId: 0,
                    lastInspectionTime: "",
                    model: "",
                    nextInspectionTime: "",
                    produceNumber: "",
                    produceTime: "",
                    rfid: "",
                    storeHouse: "",
                    storehouseId: 0,
                    toolAlias: "",
                    toolAttribute: "",
                    toolCategory: {
                        alarmStockNumber: 0,
                        createdTime: "",
                        imgUrl: "",
                        inStockNumber: 0,
                        inspectionCycle: 0,
                        inspectionNumber: 0,
                        itemUnit: {
                            createdBy: 0,
                            createdTime: "",
                            itemUnitId: 0,
                            itemUnitName: "",
                            updatedBy: 0,
                            updatedTime: "",
                        },
                        stockNumber: 0,
                        testVoltage: 0,
                        toolCategoryId: 0,
                        toolCategoryName: "",
                        toolStatus: {
                            createdBy: 0,
                            createdTime: "",
                            toolStatusDesc: "",
                            toolStatusId: 0,
                            toolStatusName: "",
                            updatedBy: 0,
                            updatedTime: "",
                        },
                        updatedTime: "",
                        useCycle: 0,
                        useNumber: 0,
                        voltageLevel: 0,
                        voltageTime: 0,
                    },
                    toolCategoryId: 0,
                    toolId: 0,
                    toolStatus: {
                        createdBy: 0,
                        createdTime: "",
                        toolStatusDesc: "",
                        toolStatusId: 0,
                        toolStatusName: "",
                        updatedBy: 0,
                        updatedTime: "",
                    },
                    toolStatusId: 0,
                    updatedBy: 0,
                    updatedTime: "",
                    uselessDesc: "",
                },
            ],
            searchCount: true,
            size: 5,
            total: 10,
        },
        success: true,
        timestamp: 0,
    };
});
//取消送检
Mock.mock("/makeid-boot/inspection/delete/cancel", "delete", () => {
    return {
        code: 0,
        message: "",
        result: {},
        success: true,
        timestamp: 0,
    };
});
