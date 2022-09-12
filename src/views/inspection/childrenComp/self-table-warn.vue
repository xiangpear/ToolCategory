<template>
    <!-- 普通表格表单模板 -->
    <div id="template-table">
        <!-- 表格容器 -->
        <makeid-table-box :pagination="pagination(dataList.current, dataList.size, dataList.total)" :handleSizeChange="SizeChangeWarn" :handleCurrentChange="CurrentChangeWarn">
            <div slot="content">
                <!-- 表格条件筛选 -->
                <div class="out-slect">
                    <div class="slect-item">
                        <span class="font-name">工器具名称:</span>
                        <el-select v-model="toolOptionsValue" clearable placeholder="工器具名称" size="small">
                            <el-option v-for="item in toolOptions" :key="item.toolCategoryId" :label="item.toolCategoryName" :value="item.toolCategoryId"> </el-option>
                        </el-select>
                        <span class="font-name">工器具编码:</span>
                        <div class="box-input">
                            <el-input placeholder="工器具编码" v-model="input" clearable size="small"> </el-input>
                        </div>
                        <span class="font-name">状态:</span>
                        <el-select v-model="toolStatusOptionsValue" clearable placeholder="请选择状态" size="small">
                            <el-option v-for="item in toolStatusOptions" :key="item.toolStatusId" :label="item.toolStatusName" :value="item.toolStatusId"> </el-option>
                        </el-select>
                        <span class="font-name">所属仓库:</span>
                        <el-select v-model="storeHouseOptionsValue" clearable placeholder="所属仓库" size="small">
                            <el-option v-for="item in storeHouseOptions" :key="item.storehouseId" :label="item.storehouseName" :value="item.storehouseId"> </el-option>
                        </el-select>
                        <div class="date-block">
                            <span class="font-name">下次试验日期:</span>
                            <el-date-picker v-model="valueDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="small"> </el-date-picker>
                        </div>
                        <div class="all-btn">
                            <el-button type="primary" class="btn-b" @click="open"><i class="el-icon-plus"></i>生成送检单</el-button>
                            <el-button type="primary" class="btn-s" @click="search"><i class="el-icon-search"></i>搜索</el-button>
                            <el-button class="reset" @click="clearValue"><i class="el-icon-refresh-left"></i>重置</el-button>
                        </div>
                    </div>
                </div>
                <!-- 自定义列 -->
                <makeid-table-select :selectedNum="dataListSelections.length" :table-line="tableLine" @refresh="refreshLine" :clear="clearMul"></makeid-table-select>
                <!-- 表格内容 -->
                <el-table ref="table" v-adaptive="{ type: 'table' }" :data="content" height="100%" @selection-change="selectionChangeHandle" :border="true" @select="selection">
                    <el-table-column type="selection" width="46" :selectable="selectable" />
                    <el-table-column prop="index" type="index" label="序号" width="50">
                        <!-- <template slot-scope="scope">
                            <span>{{ (pagination.pageNo - 1) * pagination.pageSize + scope.$index + 1 }}</span>
                        </template> -->
                    </el-table-column>
                    <!-- 动态表格列 -->
                    <el-table-column v-for="item in tableLineSelect" :key="JSON.stringify(item)" :width="item.width" :label="item.label" :prop="item.prop">
                        <template slot-scope="scope">
                            <span v-if="item.prop == 'status'"> {{ scope.row.status ? "暂停" : "正常" }}</span>
                            <span v-copy="{ text: scope.row[item.prop] }" v-else> {{ scope.row[item.prop] ? scope.row[item.prop] : "-" }}</span>
                        </template>
                    </el-table-column>
                    <div slot="empty" class="makeid-empty-svg">
                        <svg-icon :icon-class="defaultType" style="height: 30px; width: 16px" />
                    </div>
                </el-table>
            </div>
        </makeid-table-box>
    </div>
</template>

<script>
import tableMix from "../mixin/tableMix";
import * as that from "@/api/system/system-user-api";
// import MakeidTableMixin from "@/components/makeid-table/mixin/makeid-table-mixin";
import { toolList, toolStatus, storeHouse, inspectionWarnPageList, inspectionWarnSave } from "@/utils/self-request/inspection-warn";
import { dateFormatIE } from "@/utils/index";

export default {
    name: "template-table",
    mixins: [tableMix],
    data() {
        return {
            // 日期选择
            pickerOptions: {
                shortcuts: [
                    {
                        text: "最近一周",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit("pick", [start, end]);
                        },
                    },
                    {
                        text: "最近一个月",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit("pick", [start, end]);
                        },
                    },
                    {
                        text: "最近三个月",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit("pick", [start, end]);
                        },
                    },
                ],
            },

            //下次试验日期
            valueDate: [],
            //工器具类型下拉框
            toolOptions: [],
            toolOptionsValue: "",
            toolId: 0,
            //工器具状态下拉框
            toolStatusOptions: [],
            toolStatusOptionsValue: "",
            statusId: 0,
            //仓库状态
            storeHouseOptions: [],
            storeHouseOptionsValue: "",
            storehouseId: 0,
            // 送检目标对象
            toolIds: [],
            //工器具编码
            input: "",
            // 是否执行mixin中mounted初始化的getDataList获取列表函数
            mixinMounted: true,

            queryForm: {},
            //表格数据
            content: [],
            tableLine: [
                { label: "所属仓库", prop: "storeHouse" },
                { label: "工器具名称", prop: "toolCategoryName" },
                { label: "规格型号", prop: "model" },
                { label: "工器具编号", prop: "toolAlias" },
                { label: "工器具编码", prop: "rfid" },
                { label: "状态", prop: "toolStatusName" },
                { label: "上次试验日期", prop: "lastInspectionTime" },
                { label: "下次试验日期", prop: "nextInspectionTime" },
                { label: "属性", prop: "toolAttribute" },
            ],
            tableLineSelect: [],
            dataList: {},
        };
    },
    mounted() {
        console.log(this.$route.query);
        this.tableLineSelect = this.tableLine;
        this._toolList();
        this._toolStatus();
        this._storeHouse();
        let storeHouseId = this.$route.query.storehouseId;
        this._inspectionWarnPageList({ pageNo: 1, pageSize: 10, param: { storehouseId: storeHouseId || storeHouseId === 0 ? storeHouseId : undefined } });
    },
    methods: {
        selectable(row, index) {
            // console.log(row);
            if (row.toolStatusName === "在用") {
                return false;
            } else {
                return true;
            }
        },
        //分页器参数
        pagination(pageNo, pageSize, total) {
            return {
                pageNo,
                pageSize,
                total,
                pageRange: [10, 20, 30, 50, 100],
            };
        },
        //工器具类型获取
        async _toolList() {
            const res = await toolList();
            //   console.log(res);
            this.toolOptions = res;
            //    console.log(this.toolOptions)
        },
        //工器具状态获取
        async _toolStatus() {
            const res = await toolStatus();
            // console.log(res);
            this.toolStatusOptions = res;
            //    console.log(this.toolStatusOptions)
        },
        //仓库类型下拉框
        async _storeHouse() {
            const res = await storeHouse();
            //   console.log(res);
            this.storeHouseOptions = res;
            //    console.log(this.storeHouseOptions)
        },
        //送检提醒表格
        async _inspectionWarnPageList(data) {
            // console.log(data);
            const res = await inspectionWarnPageList(data);
            this.content = [];
            this.dataList = res;
            for (let res of this.dataList.records) {
                let obj = {
                    toolId: res.toolId,
                    toolCategoryId: res.toolCategory.toolCategoryId,
                    storeHouse: res.storeHouse,
                    toolCategoryName: res.toolCategory.toolCategoryName,
                    model: res.model,
                    toolAlias: res.toolAlias,
                    rfid: res.rfid,
                    toolStatusName: res.toolStatus.toolStatusName,
                    lastInspectionTime: dateFormatIE(res.lastInspectionTime),
                    nextInspectionTime: dateFormatIE(res.nextInspectionTime),
                    toolAttribute: res.toolAttribute,
                };
                this.content.push(obj);
            }
            // console.log(this.content);
            // this.content = this.dataList;
            //    console.log(res)
        },
        //  发送送检请求
        async _inspectionWarnSave(data) {
            const res = await inspectionWarnSave(data);
            return Promise.resolve(res);
            // console.log(res);
        },
        //搜索
        search() {
            const startInspectionTime = this.valueDate[0];
            const nextInspectionTime = this.valueDate[1];
            const param = {
                nextInspectionTime: nextInspectionTime,
                rfid: this.input,
                startInspectionTime: startInspectionTime,
                statusId: this.toolStatusOptionsValue,
                storehouseId: this.storeHouseOptionsValue,
                toolCategoryId: this.toolOptionsValue,
            };
            this._inspectionWarnPageList({ pageSize: this.pageSize, pageNo: this.pageNo, param });
            // console.log(param);
        },
        //清除下筛选内容
        clearValue() {
            this.toolOptionsValue = "";
            this.toolStatusOptionsValue = "";
            this.storeHouseOptionsValue = "";
            this.input = "";
            this.valueDate = "";
            this._inspectionWarnPageList({ pageSize: this.pageSize, pageNo: this.pageNo });
        },
        //选取的送检信息
        selection(selAll, row) {
            const toolIds = [];
            // console.log(selAll,row);
            for (let item of selAll) {
                toolIds.push(item.toolId);
            }
            this.toolIds = toolIds;
            // this.toolIds = toolIds;
            // console.log({toolIds});
            console.log(this.toolIds);
            //选中的送检信息
            // this.selectionRow = selectionRow;
        },
        //生成送检单弹窗
        open() {
            this.$confirm("确定生成送检单?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(async () => {
                    //发送送检请求
                    let res = await this._inspectionWarnSave({ toolIds: this.toolIds });
                    console.log(res);
                    this.$message({
                        type: "success",
                        message: "送检成功",
                    });
                })
                .catch(() => {
                    this.$message({
                        // 取消请求
                        type: "info",
                        message: "已取消",
                    });
                })
                .finally(() => {
                    this.$refs.table.clearSelection();
                    let storeHouseId = this.$route.query.storehouseId;
                    this._inspectionWarnPageList({ pageNo: this.pageNo, pageSize: this.pageSize, param: { storehouseId: storeHouseId || storeHouseId === 0 ? storeHouseId : undefined } });
                });
        },

        //获取分页信息
        SizeChangeWarn(pageSize) {
            // console.log(pageSize);
            this.pageSize = pageSize;
            this._inspectionWarnPageList({ pageSize: this.pageSize });
            // alert("rrr");
        },
        CurrentChangeWarn(currentPage) {
            // console.log(currentPage)
            this.pageNo = currentPage;
            this._inspectionWarnPageList({ pageNo: this.pageNo });
            // alert("rrr");
        },
    },
};
</script>

<style lang="scss">
.el-input--small .el-input__inner {
    height: 32px;
    line-height: 32px;
    margin-bottom: 8px;
}
.box-input {
    display: inline-block;
}
.date-block {
    display: inline-block;
}
.el-date-editor .el-range-separator {
    padding: 0px 19px;
}

.el-input--mini .el-input__inner {
    height: 28px;
    line-height: 28px;
    margin-bottom: 5px;
}
// .el-input__icon {
//     height: 100%;
//     width: 49px;
// }
.el-input__inner {
    // width: 147px;
    margin-left: 10px;
}
.font-name {
    font-size: 12px;
    margin-left: 14px;
}
.item-date {
    width: 380px;
    height: 48px;
    // border: 1px solid #cccc;
    // display: flex;
    line-height: 47px;
    display: flex;
}
.item-box {
    line-height: 47px;
    width: 227px;
    height: 48px;
    // border: 1px solid #cccc;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    text-align: center;
}
.slect-item {
    margin-bottom: 27px;
}
.all-btn {
    // display: inline-block;
    margin-top: 12px;
    float: right;
    /* position: absolute; */
    /* right: 45px; */
    /* margin-top: -39px; */
    /* margin-right: 32px; */
    line-height: 30px;
}
.btn-b {
    width: 115px;
    height: 24px;
    font-size: 12px;
    padding: 3px;
    border-radius: 23px;
}
// .date-f {
//     position: absolute;
//     top: 199px;
// }
.reset {
    width: 80px;
    height: 24px;
    font-size: 12px;
    padding: 3px;
    border-radius: 23px;
    background: rgb(229, 243, 250);
    border-color: white;
    color: rgb(62, 142, 247);
    border: none;
    // background-color: transparent;
    outline: none;
}
.btn-s {
    width: 80px;
    height: 24px;
    font-size: 12px;
    padding: 3px;
    border-radius: 23px;
    margin-right: 6px;
}
.but-f {
    margin-top: -14px;
    font-size: 12px;
    line-height: 47px;
    width: 100%;
    // border: 1px solid #ccc;
    height: 47px;
    display: flex;
    justify-content: space-between;
}

.makeid-table-select {
    background: rgba(0, 133, 208, 0.1);
}
</style>
