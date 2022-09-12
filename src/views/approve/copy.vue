<template>
    <div id="launched">
        <!-- 表格条件筛选 -->
        <makeid-table-query :handleQuery="handleQuery" :resetQuery="resetQuery">
            <el-form-item label="流程名称：">
                <el-input v-model="queryForm.processDefinitionName" clearable size="medium" placeholder="请输入流程名称" />
            </el-form-item>
            <el-form-item label="发起人：">
                <el-input v-model="queryForm.applyUser" clearable size="medium" placeholder="请输入发起人" />
            </el-form-item>
            <el-form-item label="审批人：">
                <el-input v-model="queryForm.auditUser" clearable size="medium" placeholder="请输入审批人" />
            </el-form-item>
        </makeid-table-query>

        <!-- 表格容器 -->
        <makeid-table-box :pagination="pagination" :handleSizeChange="handleSizeChange" :handleCurrentChange="handleCurrentChange">
            <div slot="btn">
                <el-button type="danger" size="medium" v-show="dataListSelections.length > 0" @click="handleDelete">批量删除</el-button>
            </div>
            <div slot="content">
                <!-- 自定义列 -->
                <makeid-table-select :selectedNum="dataListSelections.length" :table-line="tableLine" @refresh="refreshLine" :clear="clearMul"></makeid-table-select>

                <el-table ref="table" v-adaptive="{ type: 'table' }" v-loading="loading" :data="dataList" height="100%" @selection-change="selectionChangeHandle">
                    <el-table-column type="selection" width="46" />
                    <el-table-column prop="index" type="index" label="序号" width="50">
                        <template slot-scope="scope">
                            <span>{{ (pagination.pageNo - 1) * pagination.pageSize + scope.$index + 1 }}</span>
                        </template>
                    </el-table-column>
                    <!-- 动态表格列 -->
                    <el-table-column sortable v-for="item in tableLineSelect" :key="JSON.stringify(item)" :width="item.width" :label="item.label" :prop="item.prop" align="center">
                        <template slot-scope="scope">
                            <span v-if="item.prop == 'preview'"> {{ scope.row.preview ? "已查看" : "未查看" }}</span>
                            <span v-else>{{ scope.row[item.prop] ? scope.row[item.prop] : "-" }}</span>
                        </template>
                    </el-table-column>
                    <!-- 更多操作 -->
                    <el-table-column label="操作" align="center" width="230" fixed="right">
                        <template slot-scope="scope">
                            <div class="func-btns">
                                <el-button size="mini" type="text" icon="el-icon-view" @click="addOrUpdateHandle(scope.row)">查看</el-button>
                                <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </makeid-table-box>

        <!-- 流程弹框 -->
        <approveDialog v-if="approveVisable" ref="approve" @refreshDataList="getDataList" :footershow="false"> </approveDialog>
    </div>
</template>

<script>
import * as that from "@/api/approve/approve";
import MakeidTableMixin from "@/components/makeid-table/mixin/makeid-table-mixin";
import approveDialog from "@/views/approve/approve-dialog.vue";
export default {
    name: "launched",
    mixins: [MakeidTableMixin],
    components: {
        approveDialog,
    },
    data() {
        return {
            // 弹窗初始是否可见
            approveVisable: false,

            // 遮罩层
            loading: true,

            // 表单参数
            form: {},

            // 条件筛选
            queryForm: {},

            // 全部表格字段
            tableLine: [
                {
                    label: "流程名称",
                    prop: "processDefinitionName",
                    align: "center",
                },
                {
                    label: "任务名称",
                    prop: "taskName",
                    align: "center",
                },
                {
                    label: "任务状态",
                    prop: "auditState",
                    align: "center",
                },
                {
                    label: "浏览状态",
                    prop: "preview",
                    align: "center",
                },
                {
                    label: "审批编号",
                    prop: "auditCode",
                    align: "center",
                },
                {
                    label: "审核人",
                    prop: "auditUser",
                    align: "center",
                },
                {
                    label: "审批时间",
                    prop: "copyTime",
                    align: "center",
                },
                {
                    label: "发起人",
                    prop: "applyUser",
                    align: "center",
                },
                {
                    label: "发起时间",
                    prop: "applyTime",
                    align: "center",
                },
            ],

            // 自定义表格字段
            tableLineSelect: [],

            testdata: [
                {
                    processDefinitionName: 1,
                    processCode: 2,
                },
            ],
        };
    },
    mounted() {
        this.tableLineSelect = this.tableLine;
        this.$store.dispatch("gethint").then((res) => {});
    },
    methods: {
        addOrUpdateHandle(row) {
            this.carbonCopy(row);
            row.id = false;
            this.approveVisable = true;
            this.$nextTick(() => {
                this.$refs.approve.init(row);
            });
        },
        //撤回流程
        revoke(row) {
            let data = { processInstanceId: row.processInstanceId };
            let _this = this;
            this.$confirm(`是否撤销发起的${row.taskName}流程?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    that.cancelApply(data)
                        .then((res) => {
                            _this.getDataList();
                        })
                        .catch((error) => {});
                })
                .catch(function () {});
        },
        getDataList(pageNo) {
            this.loading = true;
            this.pagination.pageNo = pageNo || this.pagination.pageNo;
            const item = {
                pageNo: this.pagination.pageNo,
                pageSize: this.pagination.pageSize,
                param: this.queryForm,
            };
            that.getCopyList(item)
                .then((res) => {
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
        carbonCopy(row) {
            that.carbonCopy({ carbonCopyId: row.carbonCopyId })
                .then((res) => {})
                .catch((error) => {
                    console.log(error);
                });
        },
        // 删除
        handleDelete(row) {
            this.deleteHandle(() => {
                //删除功能
                var id = row ? row.id : "";
                var ids = id
                    ? [id]
                    : this.dataListSelections.map((item) => {
                          return item.id;
                      });
                that.copyDelete(ids)
                    .then((res) => {
                        this.msgSuccess("删除成功");
                        this.getDataList(1);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            });
        },
    },
};
</script>
