<template>
    <div>
        <div class="intoStoreAndAdd">
            <div class="select">
                <el-form :model="ruleForm" :rules="rules" ref="formName" class="demo-ruleForm" inline>
                    <el-form-item prop="addIntoStockStoreId" label="入库仓库">
                        <el-select v-model="ruleForm.addIntoStockStoreId" placeholder="入库仓库" size="mini">
                            <el-option :label="item.storehouseName" :value="item.storehouseId" v-for="item in storehouseList" :key="item.storehouseId"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <div class="button">
                <el-button type="primary" round icon="el-icon-plus" size="small" @click="addTool">添加</el-button>
            </div>
        </div>
        <el-table :data="tableData" style="border-radius: 10px" height="100%" v-adaptive="{ type: 'table' }" border>
            <el-table-column label="工器具名称" width="180" align="center">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.tool.toolCategoryId" placeholder="工器具名称" size="mini" v-show="!scope.row.isShowText" @change="calculateItemUnitAndName(scope.row)">
                        <el-option :label="toolName.toolCategoryName" :value="toolName.toolCategoryId" v-for="toolName in toolNameList" :key="toolName.toolCategoryId"></el-option>
                    </el-select>
                    <span v-show="scope.row.isShowText">{{ scope.row.toolCategoryName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="规格型号" width="180" align="center">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.tool.model" placeholder="请输入内容" v-show="!scope.row.isShowText" size="mini"></el-input>
                    <span v-show="scope.row.isShowText">{{ scope.row.tool.model }}</span>
                </template>
            </el-table-column>
            <el-table-column label="计量单位" width="180" align="center">
                <template slot-scope="scope">
                    <el-input disabled v-show="!scope.row.isShowText" size="mini" :value="scope.row.itemUnit"></el-input>
                    <span v-show="scope.row.isShowText">个</span>
                </template>
            </el-table-column>
            <el-table-column label="数量" width="180" align="center">
                <template slot-scope="scope">
                    <el-input min="1" type="number" v-model="scope.row.toolNumbers" v-show="!scope.row.isShowText" size="mini"></el-input>
                    <span v-show="scope.row.isShowText">{{ scope.row.toolNumbers }}</span>
                </template>
            </el-table-column>
            <el-table-column label="上次实验日期" width="260" align="center">
                <template slot-scope="scope">
                    <el-date-picker
                        v-model="scope.row.tool.lastInspectionTime"
                        align="right"
                        type="date"
                        placeholder="选择日期"
                        :picker-options="pickerOptions"
                        size="mini"
                        :disabled="scope.row.isShowText"
                    >
                    </el-date-picker>
                </template>
            </el-table-column>
            <el-table-column label="货位编码" width="180" align="center">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.tool.cargoSpaceId" placeholder="货位编码" size="mini" v-show="!scope.row.isShowText" @change="calculateCargospaceName(scope.row)">
                        <el-option :label="item.cargoSpaceNumber" :value="item.cargoSpaceId" v-for="item in cargospaceList" :key="item.cargoSpaceId"></el-option>
                    </el-select>
                    <span v-show="scope.row.isShowText">{{ scope.row.cargoSpaceNumber }}</span>
                </template>
            </el-table-column>
            <el-table-column label="属性" width="180" align="center">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.tool.toolAttribute" placeholder="属性" size="mini" v-show="!scope.row.isShowText">
                        <el-option label="个人器具" value="个人器具"></el-option>
                        <el-option label="公用器具" value="公用器具"></el-option>
                    </el-select>
                    <span v-show="scope.row.isShowText">{{ scope.row.tool.toolAttribute }}</span>
                </template>
            </el-table-column>
            <el-table-column label="生产厂家" width="180" align="center">
                <template slot-scope="scope">
                    <el-input type="text" v-model="scope.row.tool.factory" v-show="!scope.row.isShowText" size="mini"></el-input>
                    <span v-show="scope.row.isShowText">{{ scope.row.tool.factory }}</span>
                </template>
            </el-table-column>
            <el-table-column label="生产日期" width="260" align="center">
                <template slot-scope="scope">
                    <el-date-picker v-model="scope.row.tool.produceTime" align="right" type="date" placeholder="选择日期" size="mini" :disabled="scope.row.isShowText"> </el-date-picker>
                </template>
            </el-table-column>
            <el-table-column label="生产编码" width="180" align="center">
                <template slot-scope="scope">
                    <el-input type="text" v-model="scope.row.tool.produceNumber" v-show="!scope.row.isShowText" size="mini"></el-input>
                    <span v-show="scope.row.isShowText">{{ scope.row.tool.produceNumber }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200" fixed="right" align="center">
                <template slot-scope="scope">
                    <el-button type="text" v-show="!scope.row.isShowText" @click="saveData(scope.row)">保存</el-button>
                    <el-button type="text" icon="el-icon-edit" v-show="scope.row.isShowText" @click="editData(scope.row)">编辑</el-button>
                    <el-popconfirm
                        confirm-button-text="确定"
                        cancel-button-text="取消"
                        icon="el-icon-info"
                        icon-color="red"
                        title="确定删除吗？"
                        style="margin-left: 20px"
                        @onConfirm="deleteData(scope.row)"
                    >
                        <el-button type="text" slot="reference" icon="el-icon-delete">删除</el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <div class="cancelButton">
            <el-popover placement="top" width="160" v-model="cancelVisible">
                <p>取消后未提交内容不会保存，是否确认取消？</p>
                <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="cancelVisible = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="cancelIntoStock">确定</el-button>
                </div>
                <el-button type="info" round size="small" plain slot="reference">取消</el-button>
            </el-popover>
            <el-button type="primary" round size="small" @click="confirmClick">确认</el-button>
        </div>
    </div>
</template>

<script>
import { getStockNameList, getCargospacePull } from "@/api/product/stock.js";
import { postAddInfoIntoStock } from "@/api/product/intoStock";
import storeHouse from "../mixin/getStorehouseList";
export default {
    props: ["DataArr", "outerAddIntoStockStoreId"],
    data() {
        return {
            tableData: [],
            toolNameList: [], //工器具名称列表
            cargospaceList: [], //货位列表
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
            },
            ruleForm: {
                addIntoStockStoreId: "",
            },
            rules: {
                addIntoStockStoreId: [{ required: true, message: "请选择活动区域", trigger: "blur" }],
            },
            // addIntoStockStoreId: "",
            cancelVisible: false,
        };
    },
    mixins: [storeHouse],
    created() {
        this._getStockNameList(); //获取工器具列表数据
        this._getCargospacePull();
        this.ruleForm.addIntoStockStoreId = this.outerAddIntoStockStoreId;
    },
    methods: {
        handleData() {
            if (this.DataArr.length <= 0) return;
            //导入的数据中有数据
            //将toolCategoryName换成toolCategoryId。
            this.DataArr.forEach((item) => {
                this.toolNameList.forEach((toolName) => {
                    // console.log(toolName.toolCategoryName);
                    if (toolName.toolCategoryName == item.toolCategoryName) {
                        item.toolCategoryId = toolName.toolCategoryId;
                    }
                });
                let toolObj = {
                    tool: {
                        toolCategoryId: item.toolCategoryId,
                        model: item.model,
                        lastInspectionTime: item.lastInspectionTime,
                        cargoSpaceId: null,
                        toolAttribute: item.toolAttribute,
                        factory: item.factory,
                        produceTime: item.produceTime,
                        produceNumber: item.produceNumber,
                    },
                    toolNumbers: item.toolNumbers,
                    isShowText: false,
                    isComplete: "",
                    itemUnit: "",
                    cargoSpaceNumber: "",
                    toolCategoryName: item.toolCategoryName,
                };
                // console.log(toolObj);
                this.tableData.push(toolObj);
                this.saveData(toolObj);
            });
        },
        //获取下拉工具器名称列表
        async _getStockNameList() {
            let data = await getStockNameList();
            this.toolNameList = data;
        },
        _getCargospacePull() {
            getCargospacePull().then((res) => {
                this.cargospaceList = res;
            });
        },

        saveData(row) {
            row.isComplete = null;
            if (!row.tool.toolCategoryId) {
                row.isComplete = "工器具名称";
            } else if (!row.tool.model) {
                row.isComplete = "规格型号";
            } else if (!row.toolNumbers) {
                row.isComplete = "数量";
            } else if (!row.tool.lastInspectionTime) {
                row.isComplete = "上次实验日期";
            }

            if (row.isComplete) {
                this.$message({
                    message: `请填写${row.isComplete}`,
                    type: "warning",
                });
                return;
            }
            row.isShowText = true;
        },
        editData(row) {
            row.isShowText = false;
            // console.log(row);
        },

        deleteData(row) {
            this.tableData.splice(this.tableData.indexOf(row), 1);
        },

        //验证表单
        validate() {
            this.$refs.formName.validate((valid) => {
                if (!valid) {
                    return;
                }
            });
        },

        //向入库单中添加工器具
        addTool() {
            this.validate();
            if (!this.ruleForm.addIntoStockStoreId) return;
            let toolInfo = {
                tool: {
                    toolCategoryId: null,
                    model: "",
                    lastInspectionTime: null,
                    cargoSpaceId: null,
                    toolAttribute: "",
                    factory: "",
                    produceTime: null,
                    produceNumber: "",
                },
                toolNumbers: 1,
                isShowText: false,
                isComplete: "",
                itemUnit: "",
                cargoSpaceNumber: "",
                toolCategoryName: "",
            };
            this.tableData.push(toolInfo);
        },
        calculateItemUnitAndName(row) {
            this.toolNameList.forEach((item) => {
                if (item.toolCategoryId === row.tool.toolCategoryId) {
                    row.itemUnit = item.itemUnit.itemUnitName;
                    row.toolCategoryName = item.toolCategoryName;
                }
            });
        },
        calculateCargospaceName(row) {
            this.cargospaceList.forEach((item) => {
                if (item.cargoSpaceId === row.tool.cargoSpaceId) {
                    row.cargoSpaceNumber = item.cargoSpaceNumber;
                }
            });
        },
        cancelIntoStock() {
            this.cancelVisible = false;
            this.$emit("cancelIntoStock");
        },

        confirmClick() {
            this.validate();
            if (!this.ruleForm.addIntoStockStoreId) return;
            if (this.tableData.length <= 0) {
                this.$message({
                    message: "请添加记录后再提交",
                    type: "warning",
                });
                return;
            }
            let filterTable = this.tableData.filter((item) => {
                return item.isShowText === false;
            });
            if (filterTable.length > 0) {
                this.$message({
                    message: "填写完成后请添加保存",
                    type: "warning",
                });
                return;
            }
            //该发起请求了，发起请求前需要去处理数据
            this.tableData.forEach((item) => {
                // item.tool.storehouseId = ;
                item.isShowText = undefined;
                item.isComplete = undefined;
                item.itemUnit = undefined;
                item.cargoSpaceNumber = undefined;
                item.toolCategoryName = undefined;
            });
            postAddInfoIntoStock({ storehouseId: this.ruleForm.addIntoStockStoreId, tools: this.tableData })
                .then((res) => {
                    this.$message({
                        message: "入库成功",
                        type: "success",
                    });
                })
                .catch((err) => {
                    this.$message.error("入库出现错误，请稍后再试");
                })
                .finally(() => {
                    this.tableData = [];
                    this.ruleForm.addIntoStockStoreId = "";
                    this.cancelIntoStock();
                });
        },
    },
    watch: {
        toolNameList(newValue) {
            if (newValue.length > 0) {
                this.handleData();
            }
        },
    },
};
</script>

<style scoped>
.intoStoreAndAdd {
    display: flex;
    justify-content: space-between;
}
.intoStoreAndAdd .select {
    /* transform: translateX(10px); */
    margin-left: 10px;
}

.intoStoreAndAdd .select span {
    padding-right: 10px;
}

.cancelButton {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
</style>
