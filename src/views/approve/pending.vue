<template>
    <div id="pendding">
        <!-- 表格条件筛选 -->
        <makeid-table-query :handleQuery="handleQuery" :resetQuery="resetQuery">
            <el-form-item label="流程名称：">
                <el-input v-model="queryForm.processDefinitionName" clearable size="medium" placeholder="请输入流程名称" />
            </el-form-item>
            <el-form-item label="发起人：">
                <el-input v-model="queryForm.applyUser" clearable size="medium" placeholder="请输入发起人" />
            </el-form-item>
        </makeid-table-query>

        <!-- 表格容器 -->
        <makeid-table-box :pagination="pagination" :handleSizeChange="handleSizeChange" :handleCurrentChange="handleCurrentChange">
            <div slot="content">
                <!-- 表格内容 -->
                <el-table ref="table" v-adaptive="{ type: 'table' }" v-loading="loading" :data="dataList" height="100%" @selection-change="selectionChangeHandle">
                    <el-table-column type="selection" width="46" />
                    <el-table-column prop="index" type="index" label="序号" width="50">
                        <template slot-scope="scope">
                            <span>{{ (pagination.pageNo - 1) * pagination.pageSize + scope.$index + 1 }}</span>
                        </template>
                    </el-table-column>

                    <!-- 动态表格列 -->
                    <el-table-column sortable v-for="item in tableLineSelect" :key="JSON.stringify(item)" :width="item.width" :label="item.label" :prop="item.prop" align="center"> </el-table-column>

                    <!-- 更多操作 -->
                    <el-table-column label="操作" align="center" width="230" fixed="right">
                        <template slot-scope="scope">
                            <div class="func-btns">
                                <el-button size="mini" type="text" @click="addOrUpdateHandle(scope.row)">审核</el-button>
                                <!-- <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button> -->
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </makeid-table-box>

        <!-- 流程弹框 -->
        <approveDialog v-if="approveVisable" ref="approve" :footershow="true" @refreshDataList="getDataList"> </approveDialog>
    </div>
</template>

<script>
import * as that from "@/api/approve/approve";

import MakeidTableMixin from "@/components/makeid-table/mixin/makeid-table-mixin";
import approveDialog from "@/views/approve/approve-dialog.vue";

export default {
    name: "pendding",
    components: {
        approveDialog,
    },
    mixins: [MakeidTableMixin],
    data() {
        return {
            // 弹窗初始是否可见
            approveVisable: false,

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
                    label: "执行任务",
                    prop: "taskName",
                    align: "center",
                },
                {
                    label: "状态",
                    prop: "auditState",
                    align: "center",
                },
                {
                    label: "审批编号",
                    prop: "auditCode",
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

        // this.approveVisable = true;
        // this.$nextTick(() => {
        //     this.$refs.approve.init();
        // });
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
            that.getPendingList(item)
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
        addOrUpdateHandle(row) {
            row.id = true;
            row.name = this.name;
            this.approveVisable = true;
            this.$nextTick(() => {
                this.$refs.approve.init(row);
            });
        },
    },
};
</script>
