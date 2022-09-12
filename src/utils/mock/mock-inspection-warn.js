import Mock from "mockjs";
//工会器具名称下拉框
Mock.mock("/makeid-boot/selectDown/listAllTool", "get", () => {
    return {
        code: 0,
        message: "",
        result: [
            {
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
        ],
        success: true,
        timestamp: 0,
    };
});

//仓库类型下拉框
Mock.mock("/makeid-boot/selectDown/listAllStorehouse", "get", () => {
    return {
        code: 0,
        message: "",
        result: [
            {
                createdTime: "",
                isUse: 0,
                storehouseDept: 0,
                storehouseId: 0,
                storehouseMqId: 0,
                storehouseName: "44",
                updatedTime: "",
            },
        ],
        success: true,
        timestamp: 0,
    };
});
//送检提醒表格
Mock.mock("/makeid-boot/inspectionWarn/pageList", "post", () => {
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
//发送送检请求
Mock.mock("/makeid-boot/inspectionWarn/save", "post", () => {
    return {
        code: 0,
        result: {},
        timestamp: 970095603391,
        success: true,
        message: "fugiat nulla non",
    };
});
