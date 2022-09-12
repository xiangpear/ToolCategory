<template>
    <div id="processLeave">
        <!-- 表格条件筛选 -->
        <makeid-table-query :handleQuery="handleQuery" :resetQuery="resetQuery">
            <el-form-item label="标题：">
                <el-input v-model="queryForm.title" placeholder="请输入标题" clearable size="medium" />
            </el-form-item>
        </makeid-table-query>
        <!-- 表格容器 -->
        <makeid-table-box :isPaginationShow="true" :pagination="pagination" :handleSizeChange="handleSizeChange" :handleCurrentChange="handleCurrentChange">
            <div slot="btn">
                <el-button v-show="true" type="primary" size="medium" @click="addOrUpdateHandle()">新增</el-button>
                <el-button v-show="dataListSelections.length > 0" type="danger" size="medium" @click="handleDelete">批量删除</el-button>
            </div>

            <div slot="content">
                <!-- 自定义列 -->
                <makeid-table-select :selectedNum="dataListSelections.length" :table-line="tableLine" @refresh="refreshLine" :clear="clearMul"></makeid-table-select>

                <!-- 表格内容 -->
                <el-table
                    :stripe="false"
                    :border="false"
                    :default-sort="{ prop: 'createdTime', order: 'descending' }"
                    ref="table"
                    v-adaptive="{ type: 'table' }"
                    v-loading="loading"
                    :data="dataList"
                    height="100%"
                    @selection-change="selectionChangeHandle"
                >
                    <el-table-column type="selection" width="46" />
                    <el-table-column prop="index" type="index" label="序号" width="50">
                        <template slot-scope="scope">
                            <span>{{ (pagination.pageNo - 1) * pagination.pageSize + scope.$index + 1 }}</span>
                        </template>
                    </el-table-column>

                    <!-- 动态表格列 -->
                    <el-table-column
                        v-for="item in tableLineSelect"
                        :key="JSON.stringify(item)"
                        :sortable="item.sortable"
                        :align="item.align"
                        :width="item.width"
                        :label="item.label"
                        :prop="item.prop"
                    >
                        <template slot-scope="scope">
                            <span>{{ scope.row[item.prop] ? scope.row[item.prop] : "—" }}</span>
                        </template>
                    </el-table-column>

                    <!-- 更多操作 -->
                    <el-table-column label="操作" align="center" width="230" fixed="right">
                        <template slot-scope="scope">
                            <div class="func-btns">
                                <!-- <el-button v-hasPermi="['process:instance:suspendState']" v-show="scope.row.suspendState == 1" type="text" size="mini" @click="handleSuspend(scope.row.instanceId, 2)"
                                    >挂起</el-button
                                >
                                <el-button v-hasPermi="['process:instance:suspendState']" v-show="scope.row.suspendState == 2" type="text" size="mini" @click="handleSuspend(scope.row.instanceId, 1)"
                                    >激活</el-button
                                >
                                <el-button v-hasPermi="['process:instance:history']" v-show="scope.row.instanceId != null" type="text" size="mini" @click="handleHistory(scope.row)">历史</el-button>
                                <el-button v-hasPermi="['process:instance:resource']" v-show="scope.row.instanceId != null" type="text" size="mini" @click="handleImage(scope.row)">进度</el-button> -->
                                <el-button v-show="scope.row.instanceId == null || scope.row.taskDefinitionKey == 'initSubmitTaskId'" type="text" size="mini" @click="handleSubmit(scope.row)"
                                    >提交</el-button
                                >
                                <el-button type="text" size="mini" @click="handleDelete(scope.row)">删除</el-button>
                                <!-- <el-button v-show="scope.row.taskDefinitionKey == 'initSubmitTaskId'" type="text" size="mini" @click="handleSubmit(scope.row)">提交申请</el-button>
                                <el-button v-show="scope.row.instanceId == null || scope.row.taskDefinitionKey == 'initSubmitTaskId'" type="text" size="mini" @click="addOrUpdateHandle(scope.row)"
                                    >编辑</el-button
                                >
                                <el-button
                                    v-hasPermi="['process:instance:cancel']"
                                    v-show="scope.row.suspendState == 1 || scope.row.suspendState == 2"
                                    type="text"
                                    size="mini"
                                    @click="handleRevoke(scope.row)"
                                    >撤销</el-button
                                > -->
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </makeid-table-box>

        <!-- 新增、修改弹窗 -->
        <makeid-table-dialog v-if="tableDialogVisible" ref="makeid-table-dialog" :footer="true" cancelText="取消" submitText="确认">
            <add-or-update title="请假" ref="table-form" @refreshDataList="getDataList" />
        </makeid-table-dialog>

        <image-schedule v-if="imageScheduleVisible" ref="imageSchedule" @refreshDataList="getDataList" />
        <process-history v-if="processHistoryVisible" ref="processHistory" @refreshDataList="getDataList" />
    </div>
</template>

<script>
import AddOrUpdate from "./process-leave-modify";
import imageSchedule from "./process-leave-schedule";
import processHistory from "./process-leave-history";
import MakeidTableMixin from "@/components/makeid-table/mixin/makeid-table-mixin";

import * as BizLeaveController from "@/api/process/process-leave-api";
import { processInstanceSuspendState, processInstanceRevoke } from "@/api/process/process-instance-api";
import { todoTaskAudit } from "@/api/process/process-audit-api";

export default {
    name: "processLeave",
    components: {
        AddOrUpdate,
        imageSchedule,
        processHistory,
    },
    mixins: [MakeidTableMixin],
    data() {
        return {
            imageScheduleVisible: false,
            processHistoryVisible: false,
            queryForm: {},
            tableLine: [
                { label: "标题", prop: "title", width: "", align: "center", sortable: false },
                { label: "原因", prop: "reason", width: "", align: "center", sortable: false },
                { label: "当前任务名称", prop: "taskName", width: "", align: "center", sortable: false },
                { label: "流程实例ID", prop: "instanceId", width: "", align: "center", sortable: false },
                { label: "申请人", prop: "applyUserName", width: "", align: "center", sortable: false },
                { label: "申请时间", prop: "applyTime", width: "", align: "center", sortable: false },
            ],
            tableLineSelect: [],
        };
    },
    created() {},
    mounted() {
        this.tableLineSelect = this.tableLine;
    },
    methods: {
        // 获取数据列表
        getDataList(pageNo) {
            this.loading = true;
            this.pagination.pageNo = pageNo || this.pagination.pageNo;
            const item = {
                pageNo: this.pagination.pageNo,
                pageSize: this.pagination.pageSize,
                param: this.queryForm,
            };
            //查询功能
            BizLeaveController.bizLeaveList(item)
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
                this.loading = true;
                BizLeaveController.bizLeaveDelete(ids)
                    .then((res) => {
                        this.msgSuccess("删除成功");
                        this.getDataList(this.pagination.pageNo);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            });
        },

        // 历史
        handleHistory(row) {
            this.processHistoryVisible = true;
            this.$nextTick(() => {
                this.$refs.processHistory.init(row.instanceId);
            });
        },

        // 进度
        handleImage(row) {
            this.imageScheduleVisible = true;
            this.$nextTick(() => {
                this.$refs.imageSchedule.init(row.instanceId);
            });
        },

        // 撤销
        handleRevoke(row) {
            if (!row.instanceId) {
                this.msgWarning("流程定义ID错误");
                return;
            }
            processInstanceRevoke({ instanceId: row.instanceId })
                .then((res) => {
                    console.log(res);
                    this.msgSuccess("操作成功");
                    this.getDataList(this.pagination.pageNo);
                })
                .catch((error) => {
                    console.log(error);
                });
        },

        // 挂起、激活
        handleSuspend(instanceId, status) {
            if (!instanceId) {
                this.msgWarning("流程定义ID错误");
                return;
            }
            processInstanceSuspendState({ instanceId: instanceId, suspendState: status })
                .then((res) => {
                    console.log(res);
                    this.msgSuccess("操作成功");
                    this.getDataList(this.pagination.pageNo);
                })
                .catch((error) => {
                    console.log(error);
                });
        },

        // 提交申请
        handleSubmit(row) {
            BizLeaveController.bizLeaveSubmit({ id: row.id })
                .then((res) => {
                    console.log(res);
                    this.msgSuccess("操作成功");
                    this.getDataList(this.pagination.pageNo);
                })
                .catch((error) => {
                    console.log(error);
                });
        },

        // 表单提交
        dataFormSubmit(row) {
            todoTaskAudit({ taskId: row.taskId, flag: "1" })
                .then((res) => {
                    this.getDataList(this.pagination.pageNo);
                })
                .catch((error) => {
                    console.log(error);
                    this.visible = false;
                });
        },

        // 刷新表格动态列
        refreshLine(line) {
            this.tableLineSelect = this.tableLine.filter((value) => {
                return line.includes(value.label);
            });
            this.$nextTick(() => {
                this.$refs.table.doLayout();
                var funcBtns = document.getElementsByClassName("func-btns");
                for (let i = 0; i < funcBtns.length; i++) {
                    const element = funcBtns[i];
                    element.parentNode.style.width = "230px";
                }
            });
        },

        // 清除表格多选
        clearMul() {
            this.$refs.table.clearSelection();
        },
    },
};
</script>

<style lang="scss">
#template-table {
}
</style>
