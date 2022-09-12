<template>
    <div id="inventory">
        <!-- 表格条件筛选 -->
        <makeid-table-query-new :handleQuery="handleQuery" :resetQuery="resetQuery">
            <el-form-item label="单据号：">
                <el-input v-model="queryForm.countTaskIdentifier" clearable placeholder="请输入" />
            </el-form-item>
            <el-form-item label="任务名称：">
                <el-input v-model="queryForm.countTaskName" clearable placeholder="请输入" />
            </el-form-item>
            <el-form-item label="盘点库房：">
                <el-select v-model="queryForm.storehouseId" placeholder="请选择">
                    <el-option v-for="item in options.stores" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态：">
                <el-select v-model="queryForm.countTaskStatus" placeholder="请选择">
                    <el-option v-for="item in options.status" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="日期：" prop="rangeDate">
                <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="queryForm.selectTime"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                />
            </el-form-item>
        </makeid-table-query-new>

        <!-- 表格容器 -->
        <makeid-table-box :pagination="pagination" :handleSizeChange="handleSizeChange" :handleCurrentChange="handleCurrentChange">
            <div slot="btn">
                <el-button type="primary" size="small" icon="el-icon-plus" round @click="addOrUpdateHandle()">新增</el-button>
                <el-button type="primary" size="small" icon="el-icon-s-tools" @click="dialogFormVisible = true" round>自动盘点设置</el-button>
            </div>
            <div slot="content">
                <!-- 表格内容 -->
                <el-table
                    highlight-current-row
                    :header-cell-style="{ background: 'rgb(247, 249, 251)' }"
                    ref="table"
                    border
                    v-adaptive="{ type: 'table' }"
                    v-loading="loading"
                    :data="dataList"
                    height="100%"
                    @selection-change="selectionChangeHandle"
                >
                    <!-- <el-table-column type="selection" width="46" /> -->
                    <el-table-column prop="index" type="index" label="序号" width="50">
                        <template slot-scope="scope">
                            <span>{{ (pagination.pageNo - 1) * pagination.pageSize + scope.$index + 1 }}</span>
                        </template>
                    </el-table-column>

                    <!-- 动态表格列 -->
                    <el-table-column v-for="item in tableLine" :key="JSON.stringify(item)" :width="item.width" :label="item.label" :prop="item.prop" align="center">
                        <template slot-scope="scope">
                            <div>
                                <div v-if="item.prop === 'countTaskStatus'">
                                    <el-button size="mini" plain :type="scope.row[item.prop] ? 'success' : 'warning'" v-text="scope.row[item.prop] ? '已完成' : '进行中'"></el-button>
                                </div>

                                <span v-else>{{ scope.row[item.prop] }}</span>
                            </div>
                        </template>
                    </el-table-column>

                    <!-- 更多操作 -->
                    <el-table-column fixed="right" label="操作" width="240" header-align="center" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" icon="el-icon-more" size="small" @click="getDetail(scope.row)">详情</el-button>
                            <el-button type="text" size="small" :disabled="scope.row['countTaskStatus'] === 1" icon="el-icon-check" @click="endCountTask(scope.row)">结束</el-button>
                            <el-button type="text" size="small" icon="el-icon-upload2" v-if="!scope.row['countTaskStatus']">导入</el-button>
                            <el-button type="text" size="small" icon="el-icon-download" @click="exportData(scope.row)">导出</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </makeid-table-box>
        <!-- 新增、修改弹窗 -->
        <makeid-table-dialog-new width="28%" v-if="tableDialogVisible" ref="makeid-table-dialog" :footer="true" cancelText="取消" submitText="确认">
            <table-form :options="options" title="盘点任务" ref="table-form" @refreshDataList="getDataList"></table-form>
        </makeid-table-dialog-new>

        <!-- 自动盘点配置弹窗 -->
        <el-dialog title="自动盘点设置" :visible.sync="dialogFormVisible" width="28%">
            <el-form>
                <el-form-item label="盘点库房" :label-width="formLabelWidth">
                    <el-input disabled placeholder="全部"></el-input>
                </el-form-item>
                <el-form-item label="盘点类型" :label-width="formLabelWidth">
                    <el-input disabled placeholder="全部"></el-input>
                </el-form-item>
                <el-form-item label="自动盘点时间" :label-width="formLabelWidth">
                    <el-select v-model="autoCountCycle">
                        <el-option v-for="item in options.periods" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="setAutoCountCycle">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 详情 -->
        <el-dialog title="详情" destroy-on-close custom-class="detailDialog" :visible.sync="detailVisible" width="80%" append-to-body top="5vh" style="height: 100vh; overflow: hidden">
            <div slot="title">
                <div class="title">
                    <div></div>
                    <span>详情</span>
                </div>
            </div>
            <detail-table :data="detailTableLine" :countTask="currentCountTask" v-if="detailVisible"></detail-table>
        </el-dialog>
    </div>
</template>

<script>
import detailTable from "./detailTable.vue";
import MakeidTableMixin from "@/components/makeid-table/mixin/makeid-table-mixin-new";
import { exportData, getInventoryList, getStores, getToolCategory, setAutoCountCycle, endCountTask } from "@/api/inventory/inventory";
import { clone } from "@/utils/index";
import { inventoryData } from "../../../public/formHeaderConfig";
import tableForm from "./add-table-form.vue";
import MakeidTableBox from "@/components/makeid-table/makeid-table-box.vue";
export default {
    name: "inventory-records",
    components: { tableForm, detailTable, MakeidTableBox },
    mixins: [MakeidTableMixin],
    data() {
        this.tableLine = inventoryData.tableLine;
        this.detailTableLine = inventoryData.detailTableLine;
        return {
            formLabelWidth: "120px",
            dialogFormVisible: false,
            detailVisible: false,
            // 筛选数据
            queryForm: {
                instockStorehouseId: null,
                countTaskIdentifier: null,
                countTaskStatus: null,
                selectTime: [],
                countTaskName: "",
            },

            //下拉框选项
            options: {
                periods: [
                    {
                        label: "从不",
                        value: 1,
                    },
                    {
                        label: "每天",
                        value: 2,
                    },
                    {
                        label: "每周",
                        value: 3,
                    },
                    {
                        label: "每月",
                        value: 4,
                    },
                ],
                status: [
                    {
                        value: 0,
                        label: "进行中",
                    },
                    {
                        value: 1,
                        label: "已完成",
                    },
                ],
                stores: [],
                toolCategory: [],
            },
            //详情表格数据
            detaiTableList: [],
            //当前盘点任务详情ID
            currentCountTask: null,
            //表格数据
            dataList: [],
            //自动盘点时间
            autoCountCycle: 2,
        };
    },
    mounted() {
        this.getSelectData();
    },
    computed: {
        //生成请求参数，将开始结束时间拆分
        queryParam() {
            let param = clone(this.queryForm);
            if (param.selectTime) {
                param.startTime = param?.selectTime[0];
                param.endTime = param?.selectTime[1];
            }
            delete param.selectTime;
            return param;
        },
    },
    methods: {
        //导出
        exportData(row) {
            exportData({ id: row.countTaskId }).then((res) => {
                let fileName = row.storehouseName + "-" + row.countTaskName + "-" + row.countTaskIdentifier;
                console.log(res);
                const link = document.createElement("a");
                // let blob = new Blob([res], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                link.href = URL.createObjectURL(res);
                link.download = fileName;
                document.body.appendChild(link);
                console.log(link);
                link.click();
                document.body.removeChild(link);
            });
        },
        //查看盘点详情
        getDetail(row) {
            this.currentCountTask = row;
            this.detailVisible = true;
        },
        // 结束盘点任务
        endCountTask(task) {
            this.$confirm(`是否确认结束盘点任务：${task.countTaskName}?`, "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    endCountTask({ id: task.countTaskId }).then((res) => {
                        task.countTaskStatus = 1;
                        this.msgSuccess("操作成功");
                    });
                })
                .catch((error) => {
                    this.msgError(error);
                });
        },
        //设置自动盘点时间
        setAutoCountCycle() {
            setAutoCountCycle({ type: this.autoCountCycle })
                .then((res) => {
                    this.dialogFormVisible = false;
                    this.$message({
                        message: "设置成功",
                        type: "success",
                    });
                })
                .catch((error) => {
                    // this.msgError(error);
                });
        },
        //获取下拉框数据
        getSelectData() {
            //获取仓库数据
            getStores()
                .then((res) => {
                    res.forEach((item) => {
                        let store = {};
                        store.value = item.storehouseId;
                        store.label = item.storehouseName;
                        this.options.stores.push(store);
                    });
                })
                .catch((error) => {
                    this.msgError(error);
                });
            //获取盘点类型数据
            getToolCategory()
                .then((res) => {
                    console.log("盘点类型", res);
                    res?.forEach((item) => {
                        let toolCategory = {};
                        toolCategory.value = item.toolCategoryId;
                        toolCategory.label = item.toolCategoryName;
                        this.options.toolCategory.push(toolCategory);
                    });
                })
                .catch((error) => {
                    this.msgError(error);
                });
        },
        // 获取数据列表
        getDataList(pageNo) {
            this.loading = true;
            this.pagination.pageNo = pageNo; // this.pagination.pageNo;
            const item = {
                pageNo: this.pagination.pageNo,
                pageSize: this.pagination.pageSize,
                param: this.queryParam,
            };
            getInventoryList(item)
                .then((res) => {
                    console.log("获取列表", res);
                    this.loading = false;
                    this.pagination.total = res.total;
                    this.pagination.pageNo = res.current;
                    this.pagination.pageSize = res.size;

                    this.dataList = res.records;

                    this.$nextTick(() => {
                        if (!this.$refs.table) return;
                        this.$refs.table.bodyWrapper.scrollTop = 0;
                        this.$refs.table.doLayout();
                    });
                })
                .catch((error) => {
                    this.loading = false;
                    console.log(error);
                });
        },

        // 删除
        handleDelete(row) {
            this.deleteHandle(() => {
                //删除功能
                var id = row ? row.userId : "";
                var ids = id
                    ? [id]
                    : this.dataListSelections.map((item) => {
                          return item.userId;
                      });
                // that.sysUserDelete(ids)
                //     .then((res) => {
                //         this.msgSuccess("删除成功");
                //         this.getDataList(1);
                //     })
                //     .catch((error) => {
                //         console.log(error);
                //     });
            });
        },
        //审批
    },
};
</script>
<style lang="scss">
.el-dialog__body {
    padding: 10px 20px;
    border-top: 1px solid #eee;
}
.detailDialog {
    height: 91%;
}
.title {
    div {
        background-color: rgb(62, 142, 247);
        height: 20px;
        width: 5px;
        display: inline-block;
        margin-right: 10px;
    }
    span {
        vertical-align: 11%;
    }
}
// .el-table thead.is-group th {
//     background: #f5f7fa;
// }
</style>
