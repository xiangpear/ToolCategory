<template>
    <div class="home-container">
        <div class="head-tip">
            <el-dropdown @command="handleCommand" :popper-append-to-body="false">
                <span class="el-dropdown-link">{{ storeName }}<i class="el-icon-arrow-down el-icon--right"></i> </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="item in storeHouse" :key="item.storehouseId" :command="item.storehouseName">{{ item.storehouseName }}</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <div class="big-box">
            <div class="left">
                <div class="total">
                    <div>
                        <div>总数</div>
                        <span>{{ resultAllNum.stockNumber || 0 }}</span
                        >件
                    </div>
                    <div>
                        <div>在库</div>
                        <span>{{ resultAllNum.inStockNumber || 0 }}</span
                        >件
                    </div>
                    <div>
                        <div>在用</div>
                        <span>{{ resultAllNum.useNumber || 0 }}</span
                        >件
                    </div>
                    <div>
                        <div>送检</div>
                        <span>{{ resultAllNum.inspectionNumber || 0 }}</span
                        >件
                    </div>
                </div>
                <div class="class-number"><span>工器具类型统计</span></div>
                <div class="left-bottom">
                    <div class="bottom-item" v-for="item in toolCategory" :key="item.toolCategoryId">
                        <img :src="item.imgUrl" class="item-img" />
                        <span class="item-title">{{ item.toolCategoryName }}</span>
                        <span class="item-msg">总数:{{ item.stockNumber }} 在用:{{ item.useNumber }} 在库:{{ item.inStockNumber }} 送检:{{ item.inspectionNumber }} </span>
                    </div>
                </div>
            </div>
            <div class="right">
                <div class="right-top">
                    <div class="right-top-left">
                        <div class="box-top">
                            <span>暖风机</span>
                            <div class="box-switch">
                                <el-switch v-model="value1" @change="changeStatus"></el-switch>
                                <span class="switch-text">{{ text }}</span>
                            </div>
                        </div>
                        <div><img src="./images/wendu.png" class="wendu-img" /></div>
                        <div class="wendu-number">
                            <span class="wendu-num">{{ environment.temperature }}℃</span>
                            <span class="wendu-text">温度</span>
                        </div>
                    </div>
                    <div class="right-top-right">
                        <div class="box-top1">
                            <div class="box-top-bottom">
                                <img src="./images/shidu.png" class="car" />
                                <div class="wendu-number">
                                    <span class="shidu-num">{{ environment.humidity }}%</span>
                                    <span class="shidu-text">湿度</span>
                                </div>
                                <img src="./images/warn.png" class="warn" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right-bottom">
                    <div class="bottom-table-top">盘点记录 <span @click="toRouter('/inventory/inventory-records')">查看所有&nbsp;&nbsp;&nbsp;&nbsp;></span></div>
                    <div class="bottom-table">
                        <el-table :data="tableData" style="width: 100%" height="200px" :row-class-name="tableRowClassName">
                            <el-table-column prop="createdTime" label="盘点时间"> </el-table-column>
                            <el-table-column prop="countTaskResult" label="结果"> </el-table-column>
                        </el-table>
                    </div>
                </div>
                <div class="right-bottom">
                    <div class="bottom-table-top">
                        最近领用记录
                        <span @click="toRouter('/toolsManagement/Use')">查看所有&nbsp;&nbsp;&nbsp;&nbsp;></span>
                    </div>
                    <div class="bottom-table">
                        <el-table :data="tableData1" style="width: 100%" height="200px" :row-class-name="tableRowClassName">
                            <el-table-column prop="toolCategory.toolCategoryName" label="工器具名称" width="160"> </el-table-column>
                            <el-table-column prop="userName" label="操作人" width="100"> </el-table-column>
                            <el-table-column prop="operationTime" label="操作时间" width="180"> </el-table-column>
                        </el-table>
                    </div>
                </div>
                <div class="right-bottom">
                    <div class="bottom-table-top">送检提醒 <span @click="toRouter('/inspection/inspection-reminder')">查看所有&nbsp;&nbsp;&nbsp;&nbsp;></span></div>
                    <div class="bottom-table">
                        <el-table :data="tableData2" style="width: 100%" height="200px" :row-class-name="tableRowClassName">
                            <el-table-column prop="toolCategory.toolCategoryName" label="工会器具名称" width="160"> </el-table-column>
                            <el-table-column prop="toolCategory.toolCategoryId" label="工器具编号" width="100"> </el-table-column>
                            <el-table-column prop="lastInspectionTime" label="操作时间" width="180"> </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getStoreHouse, toolCategory, environment, heaterOpen, heaterClose, countTask, receiveTask, inspectionWarn, indexListall } from "@/utils/self-request/self-index";
// import { countTask, receiveTask, inspectionWarn,indexListall } from "@/utils/self-request/self-index";

export default {
    data() {
        return {
            //下拉框仓库类型
            storeName: "全部仓库",
            storeHouse: [],
            storeHouseId: "",
            //工会器具类型
            toolCategory: [],
            //环境参数
            environment: {},
            //按钮的值
            value1: true,
            //盘点的表格数据
            tableData: [],
            //领用表格数据
            tableData1: [],
            //表格3数据
            //表格2数据
            tableData2: [],
            resultAllNum: [],
        };
    },
    mounted() {
        this._storeHouse();
        this._toolCategory();
        this._environment();
        this._countTask({ pageSize: 5, pageNo: 1 });
        this._receiveTask({ pageSize: 5, pageNo: 1 });
        this._inspectionWarn({ pageSize: 5, pageNo: 1 });
        this._indexListall();
    },
    methods: {
        toRouter(src) {
            this.$router.push({
                path: src,
                query: {
                    storehouseId: this.storeHouseId,
                },
            });
        },
        //总数量获取
        async _indexListall(data) {
            const res = await indexListall(data);
            this.resultAllNum = res;
            // console.log(this.resultAllNum);
        },
        // 请求仓库下拉框,获取所有的仓库列表数据
        async _storeHouse() {
            const res = await getStoreHouse();
            this.storeHouse = res;
            let obj = [];
            // console.log(this.storeHouse);
            for (let item of this.storeHouse) {
                obj.push({ storehouseId: item.storehouseId, storehouseName: item.storehouseName });
            }
            this.storeHouse = obj;
            // console.log(this.storeHouse);
        },
        //请求工具类型
        async _toolCategory(data) {
            const res = await toolCategory(data);
            // console.log(res);
            this.toolCategory = res;
            // console.log(this.toolCategory.length);
            if (this.toolCategory.length > 12) {
                this.toolCategory.length = 12;
            }
            // console.log(this.toolCategory);
        },
        //请求环境参数
        async _environment(data) {
            const res = await environment(data);
            // console.log(res);
            this.environment = res;
            // console.log(this.environment)
        },
        //开关状态回调
        async changeStatus(callback, data) {
            //   console.log(callback);

            if (callback) {
                //开启
                const res = await heaterOpen(data);
                this.$message({
                    dangerouslyUseHTMLString: true,
                    message: "开启成功",
                    type: "success",
                });
                // console.log(res);
            } else {
                //关闭
                const res = await heaterClose(data);
                this.$message({
                    dangerouslyUseHTMLString: true,
                    message: "关闭成功",
                    type: "success",
                });
                //    console.log(res);
            }
        },
        //盘点任务表
        async _countTask(data) {
            const res = await countTask(data);
            //  console.log(res)
            this.tableData = res.records;
            //   console.log(this.tableData);
        },
        //领用任务表
        async _receiveTask(data) {
            const res = await receiveTask(data);
            console.log(res);
            this.tableData1 = res.records;
            //   console.log(this.tableData1);
        },
        //送检任务表
        async _inspectionWarn(data) {
            const res = await inspectionWarn(data);
            //  console.log(res)
            this.tableData2 = res.records;
            //   console.log(this.tableData2);
        },
        //下拉框文字变化
        handleCommand(command) {
            this.storeName = command;
            let arr = this.storeHouse.filter((item) => {
                return item.storehouseName === command;
            });
            this.storeHouseId = arr[0].storehouseId;
            // console.log(this.storeHouseId);
            this._storeHouse();
            this._toolCategory(this.storeHouseId);
            this._environment();
            this._countTask({ pageSize: 5, pageNo: 1 });
            this._receiveTask({ pageSize: 5, pageNo: 1 });
            this._inspectionWarn({ pageSize: 5, pageNo: 1 });
            this._indexListall(this.storeHouseId);
        },
        //表格色块变化
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex === 1) {
                return "warning-row";
            } else if (rowIndex === 3) {
                return "success-row";
            }
            return "";
        },
    },
    computed: {
        text() {
            if (this.value1) {
                return "开启";
            } else {
                return "关闭";
            }
        },
    },
};
</script>

<style scoped>
.home-container {
    width: 100%;
    /* width: 1100px; */
    height: 1000px;
    background: rgb(232, 234, 247);
    margin: -10px;
    display: inline-block;
}
.big-box {
    width: 1253px;
    /* width: 100%; */
    position: absolute;
    top: 149px;
    margin-left: 34px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
}
.left {
    /* border: 1px solid #cccc; */
    width: 800px;
    height: 100%;
}
.right {
    /* border: 1px solid #cccc; */
    width: 443px;
    height: 735px;
}
.el-input__inner {
    margin-left: 1px;
}
.total {
    /* border: 1px solid #cccc; */
    width: 100%;
    height: 130px;
    display: flex;
    justify-content: center;
    justify-content: space-around;
    align-items: center;
    background: url(./images/total.png) no-repeat;
    box-shadow: 5px 5px 5px #798ff2;
}
.total div {
    /* border: 1px solid #cccc; */
    color: white;
}
.total span {
    font-size: 34px;
}
.class-number {
    /* border: 1px solid #cccc; */
    width: 100%;
    height: 84px;
}
.class-number span {
    padding-left: 10px;
    border-left: 5px solid #3a499e;
    color: #999;
    font-size: 20px;
    letter-spacing: 4px;
    position: absolute;
    top: 162px;
}
.el-dropdown-link {
    cursor: pointer;
    color: #409eff;
}
.el-icon-arrow-down {
    font-size: 12px;
}
.head-tip {
    position: absolute;
    left: 753px;
    top: 123px;
    width: 200px;
    /* background: hsla(0,0%,100%,0); */
    color: #999;
}
.left-bottom {
    height: 735px;
    /* border: 1px solid #cccc; */
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
}
.bottom-item {
    width: 185px;
    height: 219px;
    /* border: 1px solid #cccc; */
    background: white;
    position: relative;
}
.item-img {
    width: 100px;
    height: 100px;
    position: absolute;
    top: 10px;
    left: 43px;
}
.item-title {
    font-weight: 600;
    font-size: 15px;
    position: absolute;
    bottom: 54px;
    left: 75px;
}
.item-msg {
    position: absolute;
    bottom: 18px;
    font-size: 12px;
    color: #999;
    left: 14px;
}
.right-top {
    width: 106%;
    height: 131px;
    /* border: 1px solid #999; */
    margin-left: 15px;
    display: flex;
}
.right-top-left {
    width: 44%;
    height: 100%;
    /* border: 1px solid #999; */
    background: white;
    -webkit-box-shadow: 5px 5px 5px #cacad1;
    box-shadow: 5px 5px 5px #cacad1;
    margin-right: 23px;
}
.right-top-right {
    width: 44%;
    height: 100%;
    /* border: 1px solid #999; */
    background: white;
    -webkit-box-shadow: 5px 5px 5px #cacad1;
    box-shadow: 5px 5px 5px #cacad1;
    margin-right: 23px;
}
.box-top {
    width: 100%;
    height: 39px;
    background: #f6f6f6;
    position: relative;
}
.box-top span {
    font-size: 15px;
    line-height: 37px;
    position: absolute;
    font-weight: 400;
    left: 10px;
}
.box-switch {
    width: 127px;
    /* border: 1px solid #cccc; */
    position: absolute;
    left: 99px;
    top: 9px;
}
.switch-text {
    /* position: absolute; */
    font-size: 15px;
    margin-top: -8px;
    /* margin-right: -10px; */
    margin-left: 42px;
    color: rgb(62, 171, 249);
}
.wendu-img {
    width: 50px;
    height: 50px;
    margin-top: 18px;
    margin-left: 12px;
}
.wendu-number {
    width: 107px;
    /* height: 138px; */
    margin-left: 76px;
    margin-top: -52px;
    height: 30px;
    /* border: 1px solid #999; */
}
.wendu-num {
    font-size: 29px;
    margin-bottom: 3px;
}
.wendu-text {
    margin-left: 27px;
    font-size: 20px;
}
.box-top-bottom {
    margin-top: 41px;
    width: 100%;
    height: 90px;
    background: rgb(230, 108, 47);
}
.car {
    margin-top: 24px;
    width: 50px;
    height: 50px;
}
.warn {
    position: absolute;
    top: 72px;
    margin-left: 147px;
    width: 44px;
    /* margin-top: 34px; */
    height: 40px;
}
.shidu-num {
    font-size: 29px;
    margin-left: -16px;
    color: white;
}
.shidu-text {
    position: absolute;
    right: 99px;
    top: 100px;
    color: white;
    /* margin-left: 27px; */
    font-size: 20px;
}
.right-bottom {
    width: 100%;
    height: 253px;
    margin-left: 14px;
}
.bottom-table-top {
    width: 100%;
    font-size: 16px;
    height: 19px;
    border-left: 5px solid #3a499e;
    margin-top: 13px;
    padding-left: 8px;
}
.bottom-table-top span {
    font-size: 14px;
    position: absolute;
    right: 7px;
}
.bottom-table-top span:hover {
    cursor: pointer;
}
.bottom-table {
    width: 100%;
    height: 217px;
    background: white;
    margin-top: 10px;
    box-shadow: 5px 5px 5px #cacad1;
}
.el-table th > .cell {
    text-align: center;
}
.el-table .cell.el-tooltip {
    white-space: nowrap;
    min-width: 50px;
    text-align: center;
}

/* ::v-deep .el-table__header .el-table__body {
    width: 100%;
} */
</style>
