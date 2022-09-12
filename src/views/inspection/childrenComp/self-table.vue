<template>
    <!-- 普通表格表单模板 -->
    <div id="template-table">
        <!-- 表格条件筛选 -->
        <makeid-table-box :pagination="pagination(tableResult.current, tableResult.size, tableResult.total)" :handleSizeChange="tableSizeChange" :handleCurrentChange="tableCurrentChange">
            <div slot="content">
                <!-- 表格条件筛选 -->
                <div class="tow-slect">
                    <span class="tow-content">单据号</span>
                    <div><el-input v-model="inputData" placeholder="单据号" class="input-f" size="small" style="width: 165px"></el-input></div>
                    <span class="tow-content">所属仓库：</span>
                    <div>
                        <el-select v-model="storeHouseOptionsValue" placeholder="所属仓库" class="select-f" size="small">
                            <el-option v-for="item in storeHouseOptions" :key="item.storehouseId" :label="item.storehouseName" :value="item.storehouseId"> </el-option>
                        </el-select>
                    </div>
                    <span class="tow-content">状态：</span>
                    <div>
                        <el-select v-model="toolStatusOptionsValue" placeholder="请选择状态" class="select-f" size="small">
                            <el-option v-for="item in toolStatusOptions" :key="item.toolStatusId" :label="item.toolStatusName" :value="item.toolStatusId"> </el-option>
                        </el-select>
                    </div>
                    <span class="tow-content"> 完成时间：</span>
                    <div>
                        <el-date-picker v-model="valueDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" class="date-f-t" size="small">
                        </el-date-picker>
                    </div>
                    <div class="all-btn-t">
                        <el-button type="primary" class="btn-s" @click="search" icon="el-icon-search">搜索</el-button>
                        <el-button class="reset" @click="clearValue" icon="el-icon-refresh-left">重置</el-button>
                    </div>
                </div>
                <!-- 表格内容 -->
                <el-table ref="table" v-adaptive="{ type: 'table' }" :data="content" height="100%" :border="true">
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
                    <!-- 更多操作 -->
                    <el-table-column label="操作" align="center" width="200" fixed="right" v-if="checkPermissions(['sys:user:update'])">
                        <template slot-scope="scope">
                            <div class="func-btns">
                                <el-button size="mini" type="text" icon="el-icon-more" @click="sendMsg(scope.row)">查看详情</el-button>
                                <el-button size="mini" type="text" icon="el-icon-more" @click="finishMsg(scope.row)" v-show="scope.row.finishShow">完成送检</el-button>
                                <!-- <el-button size="mini" type="text" icon="el-icon-more" @click="cancelMsg(scope.row)">取消送检</el-button> -->
                            </div>
                        </template>
                    </el-table-column>
                    <div slot="empty" class="makeid-empty-svg">
                        <svg-icon :icon-class="defaultType" style="height: 30px; width: 16px" />
                    </div>
                </el-table>
            </div>
        </makeid-table-box>

        <!-- 新增、修改弹窗 -->
        <!-- <makeid-table-dialog v-if="tableDialogVisible" ref="makeid-table-dialog" :footer="true" cancelText="取消" submitText="确认">
            <template-table-form title="用户" ref="table-form" @refreshDataList="getDataList" />
        </makeid-table-dialog> -->
        <!-- 查看详情的弹出框 -->
        <div class="open-details">
            <el-dialog title="" :visible.sync="detailsTableVisible" width="1100px">
                <span class="details-span">送检单详情</span>
                <div class="details-span-div"></div>
                <div class="open-details-head">
                    <div>送检单编号:SJ202207280004</div>
                    <div>
                        状态：
                        <el-select v-model="detailsValue" placeholder="请选择" :popper-append-to-body="false" popper-class="daypartingSel" @change="changeStatus">
                            <el-option v-for="item in detailsOptions" :key="item.inspectionStatusId" :label="item.inspectionStatusName" :value="item.inspectionStatusName"> </el-option>
                        </el-select>
                    </div>
                    <div>
                        <div>
                            <el-button type="primary" class="btn-search" @click="detailSearch" icon="el-icon-search">查询</el-button>
                            <el-button class="btn-search" @click="clearValue" icon="el-icon-refresh-left">重置</el-button>
                        </div>
                    </div>
                </div>
                <div class="open-details-tab">
                    <el-table :data="DetailList" border style="width: 100%">
                        <el-table-column prop="index" type="index" label="序号" width="50"> </el-table-column>
                        <el-table-column prop="storeHouse" label="所属仓库" width="120"> </el-table-column>
                        <el-table-column prop="toolCategory.toolCategoryName" label="工器具名称" width="120"> </el-table-column>
                        <el-table-column prop="model" label="规格型号" width="120"> </el-table-column>
                        <el-table-column prop="toolAlias" label="工器具编号" width="300"> </el-table-column>
                        <el-table-column prop="toolStatus.toolStatusName" label="状态" width="120"> </el-table-column>
                        <el-table-column prop="rfid" label="工器具编码" width="300"> </el-table-column>
                        <el-table-column prop="lastInspectionTime" label="上次试验日期" width="120"> </el-table-column>
                        <el-table-column prop="nextInspectionTime" label="下次试验日期" width="120"> </el-table-column>
                        <el-table-column prop="toolAttribute" label="属性" width="120"> </el-table-column>
                        <el-table-column prop="toolCategory.itemUnitName" label="计量单位" width="120"> </el-table-column>
                        <el-table-column prop="factory" label="生产厂家" width="120"> </el-table-column>
                        <el-table-column prop="produceTime" label="生产日期" width="120"> </el-table-column>
                        <el-table-column prop="produceNumber" label="生产编码" width="120"> </el-table-column>
                        <el-table-column fixed="right" label="操作" width="100">
                            <template slot-scope="scope">
                                <el-button @click="handleClick(scope.row)" type="text" size="small">打印</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <!-- 分页器 -->
                <makeid-table-box
                    :pagination="pagination(detailResult.current, detailResult.size, detailResult.total)"
                    :handleSizeChange="detailSizeChange"
                    :handleCurrentChange="detailCurrentChange"
                    class="page-open"
                >
                    <div slot="content"></div>
                </makeid-table-box>
            </el-dialog>
        </div>
        <!-- 完成送检的弹出框 -->
        <div class="open-finished">
            <el-dialog title="" :visible.sync="finishedTableVisible" width="1100px">
                <span class="details-span">送检单详情</span>
                <div class="details-span-div"></div>
                <div class="open-details-head">
                    <div>送检单编号：SJ202207280004</div>
                    <div>
                        <div class="tow-date">
                            <span class="tow-content">本次试验日期：</span>
                            <el-date-picker type="date" v-model="detailsValue" placeholder="选择试验日期" size="small"> </el-date-picker>
                        </div>
                    </div>
                    <div>
                        <div class="">
                            <el-button type="primary" class="btn-finish" @click="finishInspection">完成送检</el-button>
                        </div>
                    </div>
                </div>
                <div class="open-details-tab">
                    <el-table :data="finishTable" border style="width: 100%">
                        <el-table-column prop="index" type="index" label="序号" width="50"> </el-table-column>
                        <el-table-column prop="storeHouse" label="所属仓库" width="120"> </el-table-column>
                        <el-table-column prop="toolCategory.toolCategoryName" label="工器具名称" width="120"> </el-table-column>
                        <el-table-column prop="model" label="规格型号" width="120"> </el-table-column>
                        <el-table-column prop="toolAlias" label="工器具编号" width="300"> </el-table-column>
                        <el-table-column prop="toolStatus.toolStatusName" label="状态" width="120"> </el-table-column>
                        <el-table-column prop="rfid" label="工器具编码" width="300"> </el-table-column>
                        <el-table-column prop="lastInspectionTime" label="上次试验日期" width="120"> </el-table-column>
                        <el-table-column prop="nextInspectionTime" label="下次试验日期" width="120"> </el-table-column>
                        <el-table-column prop="toolAttribute" label="属性" width="120"> </el-table-column>
                        <el-table-column prop="toolCategory.itemUnitName" label="计量单位" width="120"> </el-table-column>
                        <el-table-column prop="factory" label="生产厂家" width="120"> </el-table-column>
                        <el-table-column prop="produceTime" label="生产日期" width="120"> </el-table-column>
                        <el-table-column prop="produceNumber" label="生产编码" width="120"> </el-table-column>
                        <el-table-column fixed="right" label="操作" width="100">
                            <template slot-scope="scope">
                                <el-button @click="handleClick(scope.row)" type="text" size="small">打印</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <!-- 分页器 -->
                <makeid-table-box
                    :pagination="pagination(finishResult.current, finishResult.size, finishResult.total)"
                    :handleSizeChange="finishSizeChange"
                    :handleCurrentChange="finishCurrentChange"
                    class="page-open"
                >
                    <div slot="content"></div> </makeid-table-box
            ></el-dialog>
        </div>
    </div>
</template>

<script>
import tableMix from "../mixin/tableMix";
import { dateFormatIE } from "@/utils/index";
import print from "@/utils/print";
// import MakeidTableMixin from "@/components/makeid-table/mixin/makeid-table-mixin";
import {
    toolStatus,
    storeHouse,
    inspectionPageList,
    selectDownAllInspectionStatus,
    inspectionDetailPageList,
    inspectionCompletePageList,
    inspectionDelete,
    inspectionComplete,
    inspectionDeleteCancel,
} from "@/utils/self-request/inspection";

export default {
    name: "template-table",
    mixins: [tableMix],
    data() {
        return {
            //一条单据信息
            oneMsg: {},
            oneMsgFin: {},
            oneMsgCan: {},
            //详情
            // detailShow: true,
            // finishShow: true,
            // cancelShow: true,
            //弹出框日期选择
            valueDate: "",
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
            inspectionId: 1,
            //状态
            inspectionStatusName: "",
            //工器具类型下拉框
            toolStatusOptions: [],
            toolStatusOptionsValue: "",
            //仓库
            storeHouseOptions: [],
            storeHouseOptionsValue: "",
            storehouseId: undefined,
            //筛选下拉框
            options: [],
            value4: "",
            value: "",
            //单据号
            inputData: "",
            // 是否执行mixin中mounted初始化的getDataList获取列表函数
            mixinMounted: true,
            //查看详情
            detailsValue: "",
            //查看详情状态下拉框
            detailsOptions: [],
            statusId: undefined,
            //查看详情表格
            DetailList: [],
            queryForm: {},
            //主页面表格
            tableLine: [
                { label: "单据号", prop: "inspectionIdentifier" },
                { label: "状态", prop: "inspectionStatusName" },
                { label: "所属仓库", prop: "storehouseName" },
                { label: "创建人", prop: "userName" },
                { label: "生成时间", prop: "createdTime" },
                { label: "完成时间", prop: "finishTime" },
            ],
            tableLineSelect: [],
            //表格数据
            content: [],
            //弹出框表格数据

            //查看详情弹出框是否显示
            detailsTableVisible: false,
            //完成送检的弹窗是否显示
            finishedTableVisible: false,
            //取消送检的弹出框是否显示
            cancelTableVisible: false,
            //送检完成表格数据
            finishTable: [],
            //取消送检的表格数据
            cancelTable: [],
            //表格result
            tableResult: {},
            detailResult: {},
            finishResult: {},
            cancelResult: {},
            //详情分页
            detailPageSize: 10,
            detailPageNo: 1,
            //完成分页
            finishPageSize: 10,
            finishPageNo: 1,
            //取消分页
            cancelPageSize: 0,
            cancelPageNo: 0,
        };
    },
    mounted() {
        this.tableLineSelect = this.tableLine;
        this._toolStatus();
        this._storeHouse();
        // 列表数据获取
        this._inspectionPageList({ pageNo: this.pageNo, pageSize: this.pageSize });
        //详情列表获取
        // this._inspectionDetailPageList({ pageNo: this.pageNo, pageSize: this.pageSize, param: { inspectionStatusId: this.statusId } });
    },
    methods: {
        //分页器参数
        pagination(pageNo, pageSize, total) {
            return {
                pageNo,
                pageSize,
                total,
                pageRange: [10, 20, 30, 50, 100],
            };
        },
        //完成送检
        finishInspection() {
            this._inspectionComplete({ inspectionId: this.oneMsgFin.inspectionId })
                .then((res) => {
                    this.$message({
                        message: "完成送检",
                        type: "success",
                    });
                })
                .catch(() => {
                    this.$message.error("完成送检失败");
                })
                .finally(() => {
                    const createdTime = this.valueDate[0];
                    const finishTime = this.valueDate[1];
                    const param = {
                        createdTime: createdTime,
                        finishTime: finishTime,
                        inspectionIdentifier: this.inputData,
                        statusId: this.statusId,
                        storehouseId: this.storehouseId,
                    };
                    this._inspectionPageList({ pageSize: this.pageSize, pageNo: this.pageNo, param });
                    this.finishedTableVisible = false;
                });
        },
        //工器具状态获取
        async _toolStatus() {
            const res = await toolStatus();
            //   console.log(res);
            this.toolStatusOptions = res;
            // console.log(this.toolStatusOptions);
        },
        //仓库类型下拉框
        async _storeHouse() {
            const res = await storeHouse();
            //   console.log(res);
            this.storeHouseOptions = res;
            //    console.log(this.storeHouseOptions)
        },
        //表格信息
        async _inspectionPageList(data) {
            const res = await inspectionPageList(data);
            this.content = res.records;
            this.tableResult = res;
            this.content.forEach((item) => {
                if (item.inspectionStatusName == "送检中") {
                    item.finishShow = true;
                    // console.log(item);
                    // this.cancelShow = false;
                } else if (item.inspectionStatusName == "已完成") {
                    item.finishShow = false;
                    // this.cancelShow = false;
                }
            });
        },
        //搜索
        search() {
            const createdTime = this.valueDate[0];
            const finishTime = this.valueDate[1];
            const param = {
                createdTime: createdTime,
                finishTime: finishTime,
                inspectionIdentifier: this.inputData,
                statusId: this.statusId,
                storehouseId: this.storehouseId,
            };
            this._inspectionPageList({ pageSize: this.pageSize, pageNo: this.pageNo, param });
        },
        //点击详情
        sendMsg(row) {
            this.oneMsg = row;
            // console.log(row);
            // console.log(this.oneMsg);
            (this.detailsTableVisible = true),
                //详情下拉框
                this._selectDownAllInspectionStatus();
            //详情表格
            this._inspectionDetailPageList({ pageNo: this.detailPageNo, pageSize: this.detailPageSize, param: { inspectionId: row.inspectionId } });
        },
        //详情状态下拉框
        async _selectDownAllInspectionStatus() {
            const res = await selectDownAllInspectionStatus();
            // console.log(res);
            this.detailsOptions = res;
        },
        //详情表格
        async _inspectionDetailPageList(data) {
            const res = await inspectionDetailPageList(data);
            // console.log(res);
            this.detailResult = res;
            // console.log(res);
            // console.log(this.detailSearch)
            res.records.forEach((item) => {
                item.lastInspectionTime = dateFormatIE(item.lastInspectionTime);
                item.nextInspectionTime = dateFormatIE(item.nextInspectionTime);
                item.produceTime = dateFormatIE(item.produceTime);
            });
            this.DetailList = res.records;
            // console.log(this.DetailList);
            // console.log(selAll,row);
        },
        //详情搜索
        changeStatus(val) {
            // console.log(val);
            this.detailsOptions.forEach((item) => {
                if (item.inspectionStatusName == val) {
                    this.statusId = item.inspectionStatusId;
                }
            });
        },
        //送检完成表格
        async _inspectionCompletePageList(data) {
            const res = await inspectionCompletePageList(data);
            console.log(res);
            this.finishResult = res;
            this.finishTable = res.records;
            // console.log(this.finishTable);
        },
        //点击完成送检
        finishMsg(row) {
            this.oneMsgFin = row;
            this.finishedTableVisible = true;
            this._inspectionCompletePageList({ pageNo: this.finishPageNo, pageSize: this.finishPageSize, param: { inspectionId: row.inspectionId } });
        },
        //进行送检请求
        async _inspectionComplete(data) {
            const res = await inspectionComplete(data);
        },
        //点击取消送检
        async _inspectionDelete(data) {
            const res = await inspectionDelete(data);
            this.cancelTable = res.records;
            this.cancelResult = res;
            // console.log(this.cancelTable);
        },
        //点击取消送检获取表格
        cancelMsg(row) {
            this.oneMsgCan = row;
            this.cancelTableVisible = true;
            this._inspectionDelete();
        },
        //取消送检的请求
        async _inspectionDeleteCancel(data) {
            const res = await inspectionDeleteCancel(data);
            // console.log(res);
        },
        //取消送检
        cancelInspection() {
            this._inspectionDeleteCancel(this.oneMsgCan.inspectionId);
        },
        //生成送检单弹窗
        open() {
            this.$confirm("确定生成送检单?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.$message({
                        type: "success",
                        message: "",
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消",
                    });
                });
        },
        //详情的弹出框
        handleClick(row) {
            print(row);
        },
        //清除下筛选内容
        clearValue() {
            this.inputData = "";
            this.toolStatusOptionsValue = "";
            this.storeHouseOptionsValue = "";
            this.detailsValue = "";
            this.valueDate = "";
            this._inspectionPageList({ pageSize: this.pageSize, pageNo: this.pageNo });
        },
        //详情搜索
        detailSearch() {
            this._inspectionDetailPageList({ pageNo: this.detailPageNo, pageSize: this.detailPageSize, param: { inspectionId: this.oneMsg.inspectionId, inspectionStatusId: this.statusId } });
        },
        //详情分页
        detailSizeChange(pageSize) {
            this.detailPageSize = pageSize;
            this._inspectionDetailPageList({ pageNo: this.pageNo, pageSize: this.detailPageSize, param: { inspectionStatusId: this.statusId } });
        },
        detailCurrentChange(pageNo) {
            this.detailPageNo = pageNo;
            this._inspectionDetailPageList({ pageNo: this.detailPageNo, pageSize: this.detailPageSize, param: { inspectionStatusId: this.statusId } });
        },
        //完成分页
        finishSizeChange(pageSize) {
            this.finishPageSize = pageSize;
            this._inspectionDetailPageList({ pageNo: this.finishPageNo, pageSize: this.finishPageSize, param: { inspectionStatusId: this.statusId } });
        },
        finishCurrentChange(pageNo) {
            this.finishPageNo = pageNo;
            this._inspectionDetailPageList({ pageNo: this.finishPageNo, pageSize: this.finishPageSize, param: { inspectionStatusId: this.statusId } });
        },
        //取消分页
        cancelSizeChange() {
            this.cancelPageSize = pageSize;
            this._inspectionDetailPageList({ pageNo: this.cancelPageNo, pageSize: this.cancelPageSize, param: { inspectionStatusId: this.statusId } });
        },
        cancelCurrentChange(pageNo) {
            this.cancelPageNo = pageNo;
            this._inspectionDetailPageList({ pageNo: this.cancelPageNo, pageSize: this.cancelPageSize, param: { inspectionStatusId: this.statusId } });
        },
        //获取分页信息
        tableSizeChange(pageSize) {
            // console.log(pageSize);
            this.pageSize = pageSize;
            const createdTime = this.valueDate[0];
            const finishTime = this.valueDate[1];
            const param = {
                createdTime: createdTime,
                finishTime: finishTime,
                inspectionIdentifier: this.inputData,
                statusId: this.statusId,
                storehouseId: this.storehouseId,
            };
            // console.log(param);
            this._inspectionPageList({ pageSize: this.pageSize, pageNo: this.pageNo, param });
        },
        tableCurrentChange(currentPage) {
            // console.log(currentPage)
            this.pageNo = currentPage;
            // this.pageSize = pageSize;
            const createdTime = this.valueDate[0];
            const finishTime = this.valueDate[1];
            const param = {
                createdTime: createdTime,
                finishTime: finishTime,
                inspectionIdentifier: this.inputData,
                statusId: this.statusId,
                storehouseId: this.storehouseId,
            };
            this._inspectionPageList({ pageSize: this.pageSize, pageNo: this.pageNo, param });
        },
    },
};
</script>

<style lang="scss">
.el-range-editor.el-input__inner {
    width: 203px;
}
.el-date-editor--daterange.el-input,
.el-date-editor--daterange.el-input__inner,
.el-date-editor--timerange.el-input,
.el-date-editor--timerange.el-input__inner {
    width: 254px;
}
.tow-content {
    font-size: 14px;
    margin-left: 12px;
}
.el-date-editor .el-range-separator {
    padding: 0px 19px;
}
.el-input__inner {
    // width: 147px;
    margin-left: 10px;
}
.tow-date {
    width: 380px;
    height: 48px;
    line-height: 47px;
    display: flex;
}
.all-btn-t {
    margin-left: 7px;
    margin-top: 6px;
    /* margin-top: 11px; */
    line-height: 30px;
}
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
    margin-top: 7px;
    font-size: 12px;
    line-height: 47px;
    width: 100%;
    // border: 1px solid #ccc;
    height: 47px;
    display: flex;
    justify-content: space-between;
}
.tow-slect {
    width: 100%;
    line-height: 39px;
    height: 50px;
    display: -webkit-box;
    display: -ms-flexbox;
    font-size: 12px;
    margin-bottom: 27px;
    flex-wrap: wrap;
}

.makeid-table-select {
    background: rgba(0, 133, 208, 0.1);
}
//弹框样式
.page-open {
    -webkit-box-shadow: 1px 1px 1px rgb(255, 255, 255);
    box-shadow: 1px 1px 1px rgb(255, 255, 255);
}
.details-span {
    margin-top: -38px;
    padding-left: 10px;
    border-left: 5px solid #78aef9;
    position: absolute;
    font-size: 15px;
}
.details-span-div {
    width: 1100px;
    border-bottom: 1px solid #cccc;
    margin-top: -11px;
    margin-left: -20px;
}
.open-details-head {
    width: 74%;
    height: 60px;
    // border: 1px solid #ccc;
    display: -webkit-box;
    justify-content: space-between;
    align-items: center;
    display: -ms-flexbox;
    display: flex;
}
.btn-search {
    width: 72px;
    height: 24px;
    font-size: 12px;
    padding: 3px;
    // border-radius: 23px;
    margin-right: 6px;
}
.btn-finish {
    margin-left: -101px;
    width: 80px;
    height: 30px;
    font-size: 12px;
    padding: 3px;
    margin-right: 6px;
}
</style>
