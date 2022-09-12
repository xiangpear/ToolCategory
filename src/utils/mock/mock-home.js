import Mock from "mockjs";
//总量数据
Mock.mock("/makeid-boot/index/listall", "get", () => {
    return {
        code: 0,
        message: "",
        result: [1, 2, 3, 4],
        success: true,
        timestamp: 0,
    };
});
// 工器具类型
Mock.mock("/makeid-boot/toolCategory/listall", "get", () => {
    return {
        code: 0,
        message: "",
        result: [
            {
                imgUrl: "",
                inStockNumber: 0,
                inspectionNumber: 0,
                itemUnitName: "",
                stockNumber: 0,
                toolCategoryId: 0,
                toolCategoryName: "hhhhh",
                useNumber: 0,
            },
        ],
        success: true,
        timestamp: 0,
    };
});
//环境参数
Mock.mock("/makeid-boot/index/environment", "get", () => {
    return {
        code: 0,
        message: "",
        result: {
            humidity: 0,
            temperature: 0,
        },
        success: true,
        timestamp: 0,
    };
});
//暖风机开启
Mock.mock("/makeid-boot/index/heater/open", "post", () => {
    return {
        success: true,
        message: "officia minim occaecat dolore",
        code: 42,
        result: {},
        timestamp: 893968144935,
    };
});
//暖风机关闭
Mock.mock("/makeid-boot/index/heater/close", "post", () => {
    return {
        code: 0,
        message: "",
        result: {},
        success: true,
        timestamp: 0,
    };
});
//盘点表格
Mock.mock("/makeid-boot/countTask/pagelist", "post", () => {
    return {
        code: 0,
        message: "",
        result: {
            current: 0,
            hitCount: true,
            pages: 0,
            records: [
                {
                    countTaskId: 0,
                    countTaskIdentifier: "",
                    countTaskName: "",
                    countTaskResult: 0,
                    countTaskStatus: 0,
                    createdBy: 0,
                    createdTime: "",
                    finishTime: "",
                    operationUserName: "",
                    storeHouseName: 0,
                    storehouseId: 0,
                    updatedBy: 0,
                    updatedTime: "",
                },
            ],
            searchCount: true,
            size: 0,
            total: 0,
        },
        success: true,
        timestamp: 0,
    };
});
//领用表格
Mock.mock("/receive/v1/record/pagelist", "post", () => {
    return {
        message: "esse",
        timestamp: 810423085258,
        code: 26,
        success: true,
        result: {
            pages: 25,
            records: [
                {
                    storeHouseName: "结状石织引",
                    produceTime: "2003-04-20 22:08:02",
                    rfid: "1",
                    nextInspectionTime: "1974-11-05 13:57:29",
                    toolAttribute: "amet tempor ea nulla ut",
                    userName: "林秀兰",
                    toolAlias: "Lorem aliqua occaecat ullamco nisi",
                    produceNumber: "71",
                    model: "cupidatat amet ea",
                    operationTime: "1977-09-03 19:42:39",
                    lastInspectionTime: "2020-03-14 20:19:24",
                    factory: "aliquip labore eu ut Excepteur",
                    toolCategory: {
                        imgUrl: "http://dummyimage.com/400x400",
                        toolStatus: {
                            toolStatusName: "特又三构术",
                            toolStatusDesc: "Excepteur amet nisi sed dolor",
                            updateTime: "1990-08-30 00:43:03",
                            updateBy: 48,
                            toolStatusId: 63,
                            createTime: "1995-11-05 05:47:51",
                            createBy: 94,
                        },
                        voltageLevel: 27,
                        itemUnitName: "年规准",
                        useCycle: "laborum sint quis dolore eiusmod",
                        toolCategoryName: "再调分族",
                        inspectionCycle: "ut mollit commodo",
                        voltageTime: 1055096363071,
                        toolCategoryId: 32,
                        alarmStockNumber: 91,
                        itemUnit: {
                            itemUnitName: "基各其到任",
                            itemUnitId: 95,
                            updatedBy: 20,
                            createBy: 44,
                            updatedTime: "2004-04-19 18:02:38",
                            createTime: "1981-04-16 07:59:22",
                        },
                        testVoltage: 22,
                    },
                },
                {
                    userName: "杨强",
                    toolAttribute: "reprehenderit dolor in",
                    factory: "enim elit laboris",
                    operationTime: "1992-11-28 05:00:06",
                    lastInspectionTime: "1995-11-05 12:45:27",
                    produceTime: "1986-11-24 22:07:27",
                    rfid: "86",
                    storeHouseName: "格研米段入技次",
                    produceNumber: "75",
                    toolAlias: "magna laboris laborum occaecat",
                    toolCategory: {
                        inspectionCycle: "proident dolore aute cupidatat dolore",
                        voltageTime: 250830179340,
                        imgUrl: "http://dummyimage.com/400x400",
                        alarmStockNumber: 90,
                        testVoltage: 62,
                        voltageLevel: 96,
                        useCycle: "laboris Ut ea",
                        toolCategoryId: 87,
                        toolStatus: {
                            createTime: "2013-03-04 05:57:40",
                            updateTime: "2011-02-01 13:32:58",
                            toolStatusName: "亲江相和",
                            toolStatusDesc: "ut ut mollit occaecat",
                            updateBy: 59,
                            createBy: 87,
                            toolStatusId: 77,
                        },
                        itemUnit: {
                            itemUnitName: "究儿音率",
                            createBy: 44,
                            itemUnitId: 51,
                            updatedBy: 42,
                            updatedTime: "2005-03-19 18:50:39",
                            createTime: "1995-03-13 18:37:56",
                        },
                        itemUnitName: "说九内各",
                        toolCategoryName: "面须政平飞",
                    },
                    model: "pariatur cillum consectetur",
                    nextInspectionTime: "2011-02-08 00:51:13",
                },
                {
                    toolCategory: {
                        itemUnitName: "决可周布",
                        toolStatus: {
                            updateBy: 81,
                            createTime: "1982-12-27 06:34:22",
                            toolStatusId: 10,
                            createBy: 63,
                            updateTime: "2001-02-17 21:06:18",
                            toolStatusName: "县导真",
                            toolStatusDesc: "exercitation nostrud dolor dolore",
                        },
                        useCycle: "magna amet",
                        toolCategoryName: "作只维半局间",
                        voltageTime: 499422445525,
                        inspectionCycle: "sit",
                        testVoltage: 1,
                        imgUrl: "http://dummyimage.com/400x400",
                        voltageLevel: 26,
                        toolCategoryId: 66,
                        alarmStockNumber: 19,
                        itemUnit: {
                            itemUnitId: 60,
                            createTime: "2001-12-04 14:13:04",
                            updatedBy: 86,
                            itemUnitName: "列积原从任情活",
                            createBy: 53,
                            updatedTime: "2020-09-19 03:15:17",
                        },
                    },
                    lastInspectionTime: "1973-09-05 04:43:13",
                    storeHouseName: "眼办并容然",
                    produceNumber: "46",
                    userName: "顾明",
                    rfid: "6",
                    model: "et amet commodo officia consectetur",
                    toolAttribute: "mollit proident",
                    operationTime: "2005-07-26 07:47:41",
                    toolAlias: "Duis est",
                    produceTime: "1998-03-28 22:27:24",
                    nextInspectionTime: "2002-12-12 11:46:44",
                    factory: "do commodo",
                },
                {
                    toolAttribute: "occaecat",
                    lastInspectionTime: "2012-08-09 23:37:34",
                    nextInspectionTime: "2015-11-15 17:07:27",
                    produceTime: "1993-09-01 11:26:34",
                    produceNumber: "69",
                    model: "aliqua dolor dolor",
                    toolAlias: "culpa magna dolore laborum",
                    storeHouseName: "道质主重中",
                    operationTime: "1984-07-13 19:56:04",
                    toolCategory: {
                        useCycle: "Lorem eu dolor voluptate",
                        voltageTime: 1027329431631,
                        testVoltage: 45,
                        voltageLevel: 11,
                        inspectionCycle: "exercitation do quis",
                        toolStatus: {
                            toolStatusId: 7,
                            toolStatusDesc: "exercitation",
                            toolStatusName: "运龙使众十但知",
                            createTime: "2003-01-25 22:18:56",
                            updateTime: "2008-12-03 08:14:54",
                            createBy: 3,
                            updateBy: 45,
                        },
                        toolCategoryId: 29,
                        imgUrl: "http://dummyimage.com/400x400",
                        itemUnit: {
                            updatedBy: 94,
                            createBy: 26,
                            itemUnitName: "等厂结产设",
                            createTime: "2006-10-01 16:41:15",
                            updatedTime: "2017-04-17 16:14:21",
                            itemUnitId: 88,
                        },
                        toolCategoryName: "起验美广",
                        itemUnitName: "只格此",
                        alarmStockNumber: 7,
                    },
                    rfid: "94",
                    userName: "戴磊",
                    factory: "est aliquip",
                },
                {
                    nextInspectionTime: "1998-11-09 04:12:17",
                    toolAlias: "eu Lorem minim adipisicing proident",
                    factory: "ut nostrud irure Duis",
                    produceTime: "2019-02-28 02:42:55",
                    operationTime: "1981-03-21 00:45:47",
                    toolCategory: {
                        toolCategoryName: "研单复极身",
                        voltageLevel: 37,
                        toolStatus: {
                            toolStatusDesc: "sed irure velit",
                            createTime: "1984-08-10 15:41:28",
                            createBy: 83,
                            toolStatusId: 11,
                            updateTime: "1999-12-15 04:02:20",
                            toolStatusName: "内是史交马",
                            updateBy: 58,
                        },
                        alarmStockNumber: 30,
                        testVoltage: 12,
                        voltageTime: 1391764384407,
                        itemUnitName: "家变表许",
                        toolCategoryId: 92,
                        useCycle: "quis et reprehenderit in sit",
                        imgUrl: "http://dummyimage.com/400x400",
                        inspectionCycle: "labore anim in",
                        itemUnit: {
                            itemUnitId: 37,
                            updatedBy: 34,
                            createTime: "1983-08-09 09:02:14",
                            updatedTime: "2001-09-25 01:31:13",
                            createBy: 30,
                            itemUnitName: "将接战两大现部",
                        },
                    },
                    storeHouseName: "利本何次着明",
                    lastInspectionTime: "2003-03-21 21:23:35",
                    userName: "余丽",
                    rfid: "96",
                    produceNumber: "53",
                    model: "dolore eiusmod Duis dolore ex",
                    toolAttribute: "eu Duis non",
                },
            ],
            current: 35,
            size: 60,
            total: 48,
            hitCount: true,
            searchCount: false,
        },
    };
});
//送检表格
Mock.mock("/inspectionWarn/pageList", "post", () => {
    return {
        result: {
            pageable: {
                pageNumber: 39,
                offset: 79,
                pageSize: 54,
                sort: {
                    empty: true,
                    sorted: false,
                    unsorted: true,
                },
                paged: true,
                unpaged: true,
            },
            sort: {
                unsorted: false,
                empty: true,
                sorted: false,
            },
            first: true,
            content: [
                {
                    toolCategoryId: 37,
                    produceNumber: "31",
                    createBy: 18,
                    model: "ut ullamco sunt consectetur adipisicing",
                    storehouseId: 62,
                    updateTime: "2001-05-29 02:09:52",
                    toolCategory: {
                        toolCategoryName: "社素转新多",
                        testVoltage: 67,
                        imgUrl: "http://dummyimage.com/400x400",
                        alarmStockNumber: 37,
                        voltageTime: 1279439025423,
                        itemUnit: {
                            createTime: "1998-07-10 15:39:09",
                            createBy: 18,
                            itemUnitName: "候严看步省正去",
                            updatedTime: "1988-05-16 05:26:04",
                            updatedBy: 66,
                            itemUnitId: 89,
                        },
                        voltageLevel: 43,
                        inspectionCycle: "quis Duis",
                        itemUnitName: "成备算",
                        toolStatus: {
                            updateTime: "1990-10-03 09:45:44",
                            toolStatusName: "没车强深广",
                            toolStatusDesc: "ex aliquip laboris",
                            toolStatusId: 27,
                            createTime: "1991-05-02 18:45:25",
                            updateBy: 44,
                            createBy: 20,
                        },
                        toolCategoryId: 80,
                        useCycle: "veniam",
                    },
                    nextInspectionTime: "2019-08-20 05:02:37",
                    toolId: 6,
                    instockId: 68,
                    toolAlias: "ut laborum fugiat commodo do",
                    createTime: "1975-10-11 07:40:58",
                    updateBy: 63,
                    rfid: "35",
                    produceTime: "1994-12-15 01:45:17",
                    factory: "consequat ut eiusmod nisi ad",
                    lastInspectionTime: "2010-10-08 11:57:03",
                    uselessDesc: "consectetur culpa commodo tempor",
                    toolAttribute: "voluptate fugiat",
                    cargoSpaceId: 31,
                    toolStatusId: 68,
                },
                {
                    toolCategoryId: 68,
                    rfid: "44",
                    lastInspectionTime: "2013-08-02 03:26:50",
                    factory: "veniam nisi",
                    toolAlias: "ut dolore sunt quis",
                    uselessDesc: "elit tempor occaecat laboris pariatur",
                    createTime: "1985-03-09 00:03:13",
                    createBy: 11,
                    instockId: 32,
                    model: "laborum officia incididunt elit",
                    toolCategory: {
                        toolStatus: {
                            updateBy: 62,
                            createTime: "2010-01-31 11:25:56",
                            toolStatusDesc: "consectetur incididunt ea id Excepteur",
                            createBy: 39,
                            toolStatusId: 81,
                            toolStatusName: "难高况接",
                            updateTime: "1978-11-20 11:11:59",
                        },
                        toolCategoryId: 7,
                        itemUnit: {
                            createTime: "1993-06-23 20:58:59",
                            itemUnitId: 74,
                            createBy: 68,
                            itemUnitName: "天参需活做",
                            updatedBy: 44,
                            updatedTime: "2016-12-15 02:08:27",
                        },
                        voltageLevel: 33,
                        useCycle: "aliquip nulla",
                        itemUnitName: "别线集去动把",
                        testVoltage: 59,
                        alarmStockNumber: 68,
                        voltageTime: 1173038093204,
                        imgUrl: "http://dummyimage.com/400x400",
                        toolCategoryName: "对许达长状造些",
                        inspectionCycle: "dolore Excepteur velit aliquip ea",
                    },
                    toolAttribute: "veniam voluptate exercitation ullamco",
                    toolStatusId: 63,
                    nextInspectionTime: "1980-10-16 04:27:27",
                    produceTime: "2015-02-06 00:32:09",
                    produceNumber: "91",
                    updateBy: 40,
                    storehouseId: 77,
                    toolId: 76,
                    cargoSpaceId: 97,
                    updateTime: "2019-01-08 05:23:05",
                },
                {
                    toolCategoryId: 27,
                    createBy: 71,
                    toolAttribute: "qui occaecat id",
                    factory: "commodo ipsum culpa",
                    rfid: "44",
                    instockId: 3,
                    cargoSpaceId: 37,
                    toolId: 88,
                    produceNumber: "62",
                    model: "commodo",
                    toolCategory: {
                        alarmStockNumber: 82,
                        toolCategoryName: "适红说光",
                        inspectionCycle: "culpa magna",
                        imgUrl: "http://dummyimage.com/400x400",
                        toolStatus: {
                            toolStatusId: 53,
                            updateBy: 17,
                            updateTime: "2001-05-16 12:08:52",
                            createBy: 19,
                            toolStatusDesc: "ut et",
                            toolStatusName: "般是决准",
                            createTime: "1974-11-05 02:52:25",
                        },
                        useCycle: "in aute officia dolore",
                        testVoltage: 79,
                        toolCategoryId: 64,
                        voltageTime: 539162266167,
                        itemUnit: {
                            itemUnitId: 82,
                            createTime: "1984-12-13 22:46:00",
                            createBy: 36,
                            updatedBy: 41,
                            updatedTime: "1995-11-14 18:15:26",
                            itemUnitName: "基传器决五管",
                        },
                        voltageLevel: 43,
                        itemUnitName: "之基适",
                    },
                    lastInspectionTime: "1984-08-25 00:23:04",
                    produceTime: "1997-10-11 00:58:20",
                    updateTime: "1971-09-07 04:45:42",
                    nextInspectionTime: "1992-01-11 06:37:00",
                    createTime: "1975-07-22 13:09:54",
                    toolAlias: "eiusmod ex",
                    toolStatusId: 42,
                    updateBy: 41,
                    uselessDesc: "est consectetur",
                    storehouseId: 80,
                },
                {
                    toolCategoryId: 20,
                    model: "nulla consectetur adipisicing",
                    instockId: 56,
                    createBy: 38,
                    toolCategory: {
                        toolStatus: {
                            toolStatusId: 20,
                            createTime: "1997-05-22 11:27:11",
                            updateBy: 28,
                            createBy: 26,
                            toolStatusName: "江思到长统",
                            toolStatusDesc: "aliquip velit",
                            updateTime: "1999-01-06 00:00:37",
                        },
                        voltageLevel: 43,
                        testVoltage: 91,
                        itemUnit: {
                            updatedBy: 93,
                            updatedTime: "2004-04-11 14:12:04",
                            createTime: "1992-09-17 04:29:23",
                            itemUnitName: "基又间义",
                            createBy: 43,
                            itemUnitId: 88,
                        },
                        alarmStockNumber: 27,
                        imgUrl: "http://dummyimage.com/400x400",
                        useCycle: "tempor consectetur elit pariatur sit",
                        itemUnitName: "何路算上具龙义",
                        toolCategoryId: 4,
                        voltageTime: 1440736348525,
                        inspectionCycle: "nostrud reprehenderit",
                        toolCategoryName: "型率把带",
                    },
                    rfid: "67",
                    toolId: 37,
                    updateBy: 73,
                    produceNumber: "96",
                    cargoSpaceId: 39,
                    uselessDesc: "reprehenderit incididunt adipisicing culpa fugiat",
                    toolStatusId: 38,
                    updateTime: "2000-03-09 05:09:43",
                    nextInspectionTime: "1988-04-01 20:25:08",
                    lastInspectionTime: "1980-08-25 14:19:58",
                    toolAlias: "enim eiusmod",
                    createTime: "2011-02-20 09:07:57",
                    factory: "tempor commodo",
                    produceTime: "1994-12-14 09:48:47",
                    storehouseId: 62,
                    toolAttribute: "magna voluptate enim elit",
                },
                {
                    toolCategoryId: 55,
                    toolId: 80,
                    toolAttribute: "Excepteur minim Duis cillum dolore",
                    model: "do ut dolore",
                    toolAlias: "commodo qui reprehenderit nostrud",
                    toolStatusId: 98,
                    lastInspectionTime: "2015-03-13 18:50:07",
                    instockId: 76,
                    uselessDesc: "adipisicing dolor dolor culpa quis",
                    nextInspectionTime: "1980-12-15 15:09:39",
                    createBy: 30,
                    createTime: "1987-11-22 14:02:12",
                    storehouseId: 77,
                    cargoSpaceId: 25,
                    factory: "officia magna",
                    toolCategory: {
                        itemUnit: {
                            createBy: 27,
                            updatedTime: "2001-10-27 00:44:33",
                            itemUnitId: 41,
                            itemUnitName: "义利此周点须它",
                            updatedBy: 21,
                            createTime: "1982-09-24 01:15:04",
                        },
                        testVoltage: 12,
                        imgUrl: "http://dummyimage.com/400x400",
                        voltageLevel: 10,
                        toolStatus: {
                            toolStatusDesc: "non",
                            updateBy: 31,
                            updateTime: "2015-01-24 16:32:37",
                            toolStatusId: 38,
                            toolStatusName: "从起经员多下",
                            createTime: "1995-05-25 19:40:37",
                            createBy: 28,
                        },
                        voltageTime: 1360107743899,
                        itemUnitName: "完高四油温",
                        useCycle: "quis esse laboris commodo ut",
                        inspectionCycle: "pariatur nulla id dolor culpa",
                        toolCategoryName: "深想月无",
                        toolCategoryId: 16,
                        alarmStockNumber: 14,
                    },
                    produceNumber: "30",
                    produceTime: "1994-07-12 20:12:36",
                    updateBy: 11,
                    updateTime: "2020-08-30 14:48:27",
                    rfid: "29",
                },
            ],
            totalPages: 32,
            empty: false,
            size: 57,
            number: 11,
            last: false,
            totalElements: 69,
            numberOfElements: 19,
        },
        code: 100,
        success: true,
        message: "Excepteur eiusmod sunt id",
        timestamp: 785999852975,
    };
});