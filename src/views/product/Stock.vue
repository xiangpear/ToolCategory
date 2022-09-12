<template>
    <div id="stock">
        <div class="select">
            <el-form :model="formInline" :inline="true" class="el-form">
                <el-form-item label="工器具名称">
                    <el-select v-model="formInline.toolCategoryId" placeholder="工器具名称" size="mini">
                        <el-option :label="toolName.toolCategoryName" :value="toolName.toolCategoryId" v-for="toolName in toolNameList" :key="toolName.toolCategoryId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="规格型号">
                    <el-input v-model="formInline.model" placeholder="规格型号" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="工器具编号">
                    <el-input v-model="formInline.toolAlias" placeholder="工器具编号" size="mini">></el-input>
                </el-form-item>
                <el-form-item label="工器具编码">
                    <el-input v-model="formInline.rfid" placeholder="工器具编码" size="mini">></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="formInline.toolStatusId" placeholder="状态" size="mini">
                        <el-option :label="item.toolStatusName" :value="item.toolStatusId" v-for="item in statusList" :key="item.toolStatusId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属仓库">
                    <el-select v-model="formInline.storehouseId" placeholder="所属仓库" size="mini">
                        <el-option :label="item.storehouseName" :value="item.storehouseId" v-for="item in storehouseList" :key="item.storehouseId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="生产厂家">
                    <el-input v-model="formInline.factory" placeholder="生产厂家" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="上次实验日期：" prop="rangeDate">
                    <el-date-picker
                        :default-time="['00:00:00', '23:59:59']"
                        v-model="formInline.selecteTime"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        class="el-date-picker"
                        size="mini"
                        @change="handlerDate"
                    />
                </el-form-item>
                <el-form-item label="货位">
                    <el-select v-model="formInline.cargoSpaceId" placeholder="货位" size="mini">
                        <el-option :label="item.cargoSpaceNumber" :value="item.cargoSpaceId" v-for="item in cargospaceList" :key="item.cargoSpaceId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="operation">
                    <el-button type="primary" round size="small" icon="el-icon-search" @click="conditionSelece">查询</el-button>
                    <el-button round size="small" icon="el-icon-refresh-left" @click="resetHandle">重置</el-button>
                    <el-button type="primary" round size="small" icon="el-icon-printer" v-show="isPrint" @click="PrintSome">批量打印</el-button>
                    <el-button type="primary" round size="small" icon="el-icon-download" @click="exportClick">导出</el-button>
                </el-form-item>
            </el-form>
        </div>
        <safe-table
            :props="props"
            :isShowCheck="true"
            :pagination="pagination(stockInfo.total, stockInfo.size, stockInfo.current)"
            :tableData="stockInfo.records"
            @handleSelection="isShowPrintButton"
            @handleDetail="handleDetail"
            @handleEdit="handleEdit"
            @handleDelete="handleDelete"
            :handleSizeChange="handleSizeChange"
            :handleCurrentChange="handleCurrentChange"
        ></safe-table>

        <!-- 详情弹框 -->
        <safe-dialog :dialogVisible="detaildialog" @handleClose="handleClose" v-show="dialogInfo">
            <div slot="top" class="diatop">
                <div class="title">
                    <span></span>详情
                    <el-button round size="small" type="primary" @click="editClickButton">编辑</el-button>
                    <div class="hr"></div>

                    <table class="tableInfo">
                        <tr>
                            <td>所属仓库:{{ dialogInfo && dialogInfo.storeHouse.storehouseName }}</td>
                            <td>工器具名称:{{ dialogInfo && dialogInfo.toolCategory.toolCategoryName }}</td>
                        </tr>
                        <tr>
                            <td>规格型号:{{ dialogInfo && dialogInfo.model }}</td>
                            <td>工器具编号:{{ dialogInfo && dialogInfo.toolAlias }}</td>
                        </tr>
                        <tr>
                            <td>工器具编码:{{ dialogInfo && dialogInfo.rfid }}</td>
                            <td>上次实验日期:{{ dialogInfo && dialogInfo.lastInspectionTime }}</td>
                        </tr>
                        <tr>
                            <td>下次实验日期:{{ dialogInfo && dialogInfo.nextInspectionTime }}</td>
                            <td>货位编码:{{ dialogInfo && dialogInfo.cargoSpaceId }}</td>
                        </tr>
                        <tr>
                            <td>状态:{{ dialogInfo && dialogInfo.toolStatus && dialogInfo.toolStatus.toolStatusName }}</td>
                            <td>属性:{{ dialogInfo && dialogInfo.toolAttribute }}</td>
                        </tr>
                        <tr>
                            <td>计量单位:{{ dialogInfo && dialogInfo.toolCategory.itemUnitName }}</td>
                            <td>生产厂家:{{ dialogInfo && dialogInfo.factory }}</td>
                        </tr>
                        <tr>
                            <td>生产日期:{{ dialogInfo && dialogInfo.productTime }}</td>
                            <td>生产编码:{{ dialogInfo && dialogInfo.productNumber }}</td>
                        </tr>
                        <tr>
                            <td>入库时间:{{ dialogInfo && dialogInfo.createdTime }}</td>
                            <td>更新时间:{{ dialogInfo && dialogInfo.updatedTime }}</td>
                        </tr>
                        <tr>
                            <td>报废理由:{{ dialogInfo && dialogInfo.uselessDesc }}</td>
                        </tr>
                    </table>
                </div>
            </div>
            <div slot="center">
                <div class="center"><span></span>操作记录</div>
                <safe-table
                    :props="propsDetail"
                    :isShowCheck="false"
                    :pagination="pagination(stockDetail.total, stockDetail.size, stockDetail.current)"
                    :tableData="stockDetail.records"
                    :isShowOperation="false"
                    :handleSizeChange="handleSizeChangeStockInfo"
                    :handleCurrentChange="handleCurrentChangeStockInfo"
                ></safe-table>
            </div>
        </safe-dialog>

        <!-- 编辑弹框 -->
        <safe-dialog :dialogVisible="editdialog" @handleClose="handleClose">
            <div slot="top">
                <div class="title">
                    <span></span>编辑
                    <div class="hr"></div>
                </div>
            </div>

            <div slot="center">
                <table style="width: 100%; text-align: right" class="editTable">
                    <tr>
                        <td>
                            <i class="requireIcon">*</i>
                            <span>所属仓库</span>
                            <el-select placeholder="所属仓库" size="mini" v-model="editParam.storehouseId">
                                <el-option :label="item.storehouseName" :value="item.storehouseId" v-for="item in storehouseList" :key="item.storehouseId"></el-option>
                            </el-select>
                        </td>
                        <td>
                            <span>工器具名称</span>
                            <el-select placeholder="工器具名称" size="mini" v-model="editParam.toolCategoryId" disabled>
                                <el-option :label="toolName.toolCategoryName" :value="toolName.toolCategoryId" v-for="toolName in toolNameList" :key="toolName.toolCategoryId"></el-option>
                            </el-select>
                        </td>
                        <td>
                            <span>规格型号</span>
                            <el-input placeholder="规格型号" size="mini" v-model="editParam.model"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <i class="requireIcon">*</i>
                            <span>工器具编号</span>
                            <el-input v-model="editParam.toolAlias" placeholder="工器具编号" size="mini" disabled></el-input>
                        </td>
                        <td>
                            <span>工器具编码</span>
                            <el-input v-model="editParam.rfid" placeholder="工器具编码" size="mini" disabled></el-input>
                        </td>
                        <td>
                            <span>上次实验日期</span>
                            <el-date-picker v-model="editParam.lastInspectionTime" type="date" placeholder="选择日期" size="mini" disabled> </el-date-picker>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span>下次实验日期</span>
                            <el-date-picker v-model="editParam.nextInspectionTime" type="date" placeholder="选择日期" size="mini"> </el-date-picker>
                        </td>
                        <td>
                            <span>货位编码</span>
                            <el-select v-model="editParam.cargoSpaceId" placeholder="货位" size="mini">
                                <el-option :label="item.cargoSpaceNumber" :value="item.cargoSpaceId" v-for="item in cargospaceList" :key="item.cargoSpaceId"></el-option>
                            </el-select>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span>属性</span>
                            <el-select v-model="editParam.toolAttribute" placeholder="工器具名称" size="mini">
                                <el-option label="个人器具" value="个人"></el-option>
                            </el-select>
                        </td>
                        <td>
                            <span>计量单位</span>
                            <el-input v-model="editParam.itemUnitName" placeholder="工器具编号" size="mini" disabled></el-input>
                        </td>
                        <td>
                            <span>生产厂家</span>
                            <el-input v-model="editParam.factory" placeholder="工器具编号" size="mini"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span>生产日期</span>
                            <el-date-picker v-model="editParam.produceTime" type="date" placeholder="选择日期" size="mini"> </el-date-picker>
                        </td>
                        <td>
                            <span>生产编码</span>
                            <el-input v-model="editParam.produceNumber" placeholder="工器具编号" size="mini"></el-input>
                        </td>
                        <td>
                            <span>状态</span>
                            <el-select v-model="editParam.toolStatusId" placeholder="状态" size="mini">
                                <el-option
                                    :label="item.toolStatusName"
                                    :value="item.toolStatusId"
                                    v-for="item in statusList"
                                    :key="item.toolStatusId"
                                    :disabled="item.toolStatusName == '报废'"
                                ></el-option>
                            </el-select>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span>入库时间</span>
                            <el-date-picker v-model="editParam.createdTime" type="date" placeholder="选择日期" size="mini" disabled> </el-date-picker>
                        </td>
                        <td>
                            <span>更新时间</span>
                            <el-date-picker v-model="editParam.updatedTime" type="date" placeholder="选择日期" size="mini" disabled> </el-date-picker>
                        </td>
                    </tr>
                </table>
            </div>
            <div slot="bottom">
                <div class="cancelButton">
                    <el-button type="info" round size="small" plain @click="cancelEdit">取消</el-button>
                    <el-popover placement="top" width="160" v-model="popoverVisible" style="margin-left: 10px">
                        <p>确定进行修改吗？</p>
                        <div style="text-align: right; margin: 0">
                            <el-button size="mini" type="text" @click="popoverVisible = false">取消</el-button>
                            <el-button type="primary" size="mini" @click="confirmEdit">确定</el-button>
                        </div>
                        <el-button type="primary" round size="small" slot="reference">保存编辑</el-button>
                    </el-popover>
                </div>
            </div>
        </safe-dialog>

        <!-- 报废弹框 -->
        <safe-dialog :dialogVisible="deletedialog" @handleClose="handleClose" dialogWidth="40%">
            <div slot="top" class="diatop">
                <div class="title">
                    <span></span>报废
                    <div class="hr"></div>
                </div>
            </div>
            <div slot="center">
                <div class="deleteInfo" style="display: flex">
                    <span style="position: relative; top: 20px; right: 10px">
                        <i style="color: red">*</i>
                        报废理由
                    </span>
                    <el-form :model="deteleFrom" :rules="rules" style="flex: 1" class="demo-ruleForm">
                        <el-form-item prop="textarea">
                            <el-input type="textarea" :rows="2" v-model="deteleFrom.textarea" resize="none"> </el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div slot="bottom">
                <div class="cancelButton">
                    <el-button type="info" round size="small" @click="cancelDelete" plain>取消</el-button>
                    <el-button type="primary" round size="small" @click="confirmDelete">确认</el-button>
                </div>
            </div>
        </safe-dialog>
    </div>
</template>

<script>
// import TemplateTable from "../template/template-table.vue";
import safeTable from "@/components/table/index.vue";
import { getStockInfo, getStockNameList, getStockStoreList, getStockStatusList, getStockDetailInfo, getCargospacePull, deleteTool, updateToolInfo } from "@/api/product/stock";
import safeDialog from "@/components/dialog/dialog.vue";
import selectMixin from "./mixin/select.js";
import storeHouse from "./mixin/getStorehouseList";
import { dateFormatIE } from "@/utils/index";
import print from "@/utils/print";

export default {
    components: { safeTable, safeDialog },
    data() {
        return {
            formInline: {
                toolCategoryId: undefined,
                model: undefined,
                toolAlias: undefined,
                rfid: undefined,
                storehouseId: undefined,
                factory: undefined,
                selecteTime: undefined,
                cargoSpaceId: undefined,
                toolStatusId: undefined,
            },
            props: [
                {
                    prop: "storeHouse",
                    lable: "所属仓库",
                    width: "180",
                },
                {
                    prop: "toolCategory.toolCategoryName",
                    lable: "工具器名称",
                    width: "180",
                },
                {
                    prop: "model",
                    lable: "规格型号",
                    width: "180",
                },
                {
                    prop: "toolAlias",
                    lable: "工具器编号",
                    width: "180",
                },
                {
                    prop: "rfid",
                    lable: "工具器编码",
                    width: "240",
                },
                {
                    prop: "lastInspectionTime",
                    lable: "上次实验日期",
                    width: "180",
                },
                {
                    prop: "nextInspectionTime",
                    lable: "下次实验日期",
                    width: "180",
                },
                {
                    prop: "cargoSpaceIdentifier",
                    lable: "货位编码",
                    width: "180",
                },
                {
                    prop: "toolStatus.toolStatusName",
                    lable: "状态",
                    width: "180",
                },
                {
                    prop: "toolAttribute",
                    lable: "属性",
                    width: "180",
                },
                {
                    prop: "toolCategory.itemUnitName",
                    lable: "计量单位",
                    width: "80",
                },
                {
                    prop: "createdTime",
                    lable: "入库时间",
                    width: "180",
                },
                {
                    prop: "updatedTime",
                    lable: "更新时间",
                    width: "180",
                },
            ],
            propsDetail: [
                {
                    prop: "operationCategory",
                    lable: "类型",
                },
                {
                    prop: "createdName",
                    lable: "操作人",
                },
                {
                    prop: "createdTime",
                    lable: "操作时间",
                },
            ],
            stockInfo: {},
            isPrint: false,
            detaildialog: false,
            dialogInfo: null,
            stockDetail: {},
            toolNameList: [],
            statusList: [],
            cargospaceList: [],
            requestParam: {},
            toolId: null,
            editdialog: false,
            editfrom: null,
            editParam: {},
            popoverVisible: false,
            deletedialog: false,
            deteleFrom: { textarea: "" },
            rules: {
                textarea: [{ required: true, message: "请填写活动形式", trigger: "blur" }],
            },
            allSelect: [],
        };
    },
    created() {
        this._getStockInfo({});
        this._getStockNameList();
        this._getStockStatusList();
        this._getCargospacePull();
    },

    //混入查询和重置
    mixins: [selectMixin, storeHouse],
    methods: {
        _getStockInfo(data) {
            data = data || {};
            getStockInfo(data).then((res) => {
                this.stockInfo = res;
            });
        },

        //获取下拉工具器名称列表
        async _getStockNameList() {
            let data = await getStockNameList();
            this.toolNameList = data;
        },

        //获取下拉工器具状态列表
        _getStockStatusList() {
            getStockStatusList().then((res) => {
                this.statusList = res;
            });
        },
        _getCargospacePull() {
            getCargospacePull().then((res) => {
                this.cargospaceList = res;
            });
        },

        isShowPrintButton(val) {
            //这里的val是需要被打印的所有的数据的对象组成的数组
            this.allSelect = val;
            if (val.length > 0) {
                this.isPrint = true;
            } else {
                this.isPrint = false;
            }
        },
        handleDetail(row) {
            this.detaildialog = true;
            this.dialogInfo = row;
            this.toolId = row.toolId;
            this._getStockDetailInfo({ pageSize: this.stockDetail.size, pageNo: this.stockDetail.current, param: { toolId: this.toolId } });
        },
        _getStockDetailInfo(data) {
            getStockDetailInfo(data).then((res) => {
                this.stockDetail = res;
                this.stockDetail.records.forEach((item) => {
                    item.createdTime = dateFormatIE(item.createdTime);
                });
            });
        },
        //点击编辑按钮触发
        handleEdit(row) {
            this.editdialog = true;
            console.log(row);
            let {
                storeHouse,
                storehouseId,
                toolAlias,
                model,
                toolCategoryId,
                toolCategory,
                rfid,
                lastInspectionTime,
                nextInspectionTime,
                cargoSpaceId,
                toolAttribute,
                factory,
                produceTime,
                produceNumber,
                toolStatus,
                createdTime,
                updatedTime,
                toolId,
            } = row;
            this.editParam = {
                toolId,
                cargoSpaceId: cargoSpaceId,
                model: model,
                toolCategoryId: toolCategory.toolCategoryId,
                toolAlias: toolAlias,
                factory: factory,
                toolStatusId: toolStatus.toolStatusId,
                rfid: rfid,
                storehouseId: storehouseId,
                storeHouse,
                lastInspectionTime,
                nextInspectionTime,
                toolAttribute,
                itemUnitName: toolCategory.itemUnitName,
                produceNumber,
                createdTime,
                updatedTime,
            };
        },
        //点击删除按钮触发
        handleDelete(row) {
            this.deletedialog = true;
            this.toolId = row.toolId;
        },

        //从详情弹框点击编辑然后进行跳转到编辑弹框
        editClickButton() {
            this.detaildialog = false;
            this.editdialog = true;
            let {
                storeHouse,
                storehouseId,
                toolAlias,
                model,
                toolCategoryId,
                toolCategory,
                rfid,
                lastInspectionTime,
                nextInspectionTime,
                cargoSpaceId,
                toolAttribute,
                factory,
                produceTime,
                produceNumber,
                toolStatus,
                createdTime,
                updatedTime,
            } = this.dialogInfo;
            this.editParam = {
                cargoSpaceId: cargoSpaceId,
                model: model,
                toolCategoryId: toolCategoryId,
                toolAlias: toolAlias,
                factory: factory,
                toolStatusId: toolStatus.toolStatusId,
                rfid: rfid,
                storehouseId: storehouseId,
                storeHouse,
                lastInspectionTime,
                nextInspectionTime,
                toolAttribute,
                itemUnitName: toolCategory.itemUnitName,
                produceNumber,
                createdTime,
                updatedTime,
            };
        },
        //点击对话框dialog的关闭图标时触发
        handleClose() {
            this.dialogInfo = null;
            this.detaildialog = false;
            this.deletedialog = false;
            this.editdialog = false;
        },

        //请求的分页器
        pagination(total, pageSize, current) {
            return {
                total,
                pageNo: current,
                pageRange: [10, 20, 30, 50, 100],
                pageSize,
            };
        },

        //分页器的每页的条数改变时触发
        handleSizeChange(size) {
            let that = this;
            that.requestParam.pageSize = size;
            that._getStockInfo(that.requestParam);
        },
        //stock分页器的当前页改变时触发
        handleCurrentChange(page) {
            let that = this;
            that.requestParam.pageNo = page;
            that._getStockInfo(this.requestParam);
        },

        //时间改变
        handlerDate(time) {
            this.formInline.startTime = time[0];
            this.formInline.endTime = time[1];
        },

        //stock详情页的分页器
        handleSizeChangeStockInfo(size) {
            this._getStockDetailInfo({ pageSize: size, pageNo: this.stockDetail.current, param: { toolId: this.toolId } });
        },

        handleCurrentChangeStockInfo(page) {
            this._getStockDetailInfo({ pageSize: this.stockDetail.size, pageNo: page, param: { toolId: this.toolId } });
        },

        //调用请求的请求的函数
        callRequestfunc(data) {
            this._getStockInfo(data);
        },

        //报废处理的函数；
        cancelDelete() {
            this.deletedialog = false;
        },

        confirmDelete() {
            if (this.deteleFrom.textarea.length <= 0) return;
            this.$confirm("是否确认报废？", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    let data = {
                        uselessDesc: this.deteleFrom.textarea,
                        toolId: this.toolId,
                    };
                    deleteTool(data)
                        .then((res) => {
                            this.$message({
                                type: "success",
                                message: "删除成功!",
                            });
                        })
                        .catch((err) => {
                            this.$message({
                                type: "error",
                                message: "删除失败!",
                            });
                        })
                        .finally(() => {
                            this.deletedialog = false;
                        });
                })
                .catch((err) => {
                    this.deletedialog = false;
                });
        },

        //编辑处理的函数
        cancelEdit() {
            this.editdialog = false;
        },

        confirmEdit() {
            //发送请求
            updateToolInfo(this.editParam)
                .then(() => {
                    this.$message({
                        message: "更新成功",
                        type: "success",
                    });
                })
                .catch((err) => {
                    this.$message.error("系统错误请稍后再试!");
                })
                .finally(() => {
                    this.editdialog = false;
                    this.popoverVisible = false;
                    this._getStockInfo(this.requestParam);
                });
        },
        exportClick() {},

        //批量打印点击
        PrintSome() {
            print(this.allSelect);
        },
    },
};
</script>

<style scoped>
#stock {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #fff;
}
.el-form-item {
    margin-bottom: 0;
}

.select {
    padding: 0 20px;
}
.operation {
    float: right;
}
.el-form {
    overflow: hidden;
    position: relative;
}

/* dialog */
.select {
    padding: 0 20px;
}
.diatop {
    display: flex;
    justify-content: space-between;
    position: relative;
    bottom: 20px;
}

.title {
    position: relative;
    bottom: 20px;
    font-size: 16px;
    width: 100%;
    display: block;
}

.title span,
.center span {
    padding-left: 10px;
    border-left: 5px solid #78aef9;
}
.hr {
    border-bottom: 1px solid rgb(221, 221, 221);
    margin-top: 10px;
    width: 100%;
}

.tableInfo {
    width: 100%;
    height: 400px;
    font-size: 14px;
    margin-top: 15px;
}

.center {
    font-size: 18px;
    margin-bottom: 20px;
}
.cancelButton {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
::v-deep .el-form-item__error {
    position: relative;
    bottom: 10px;
}
.requireIcon {
    color: red;
}
.editTable {
    height: 350px;
}

.editTable span {
    margin-right: 5px;
}
.editTable .el-input,
.editTable .el-select {
    width: 50%;
    margin-right: 10px;
}
</style>
