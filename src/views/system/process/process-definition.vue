<template>
    <!-- 流程定义 -->
    <div id="system-process-definition" class="f-dialog">
        <el-dialog :title="'发布记录'" :close-on-click-modal="false" :visible.sync="visible" custom-class="makeid-table-dialog" width="80%">
            <!-- 表格条件筛选 -->
            <makeid-table-query :handleQuery="handleQuery" :resetQuery="resetQuery">
                <el-form-item label="流程名称：">
                    <el-input v-model="queryForm.name" placeholder="请输入名称" clearable size="medium" />
                </el-form-item>
            </makeid-table-query>
            <!-- 表格容器 -->
            <makeid-table-box :pagination="pagination" :handleSizeChange="handleSizeChange" :handleCurrentChange="handleCurrentChange">
                <div slot="content">
                    <!-- 表格内容 -->
                    <el-table :stripe="false" :border="false" :default-sort="{ prop: 'createdTime', order: 'descending' }" ref="table" v-loading="loading" :data="dataList" height="100%">
                        <el-table-column prop="index" type="index" label="序号" width="50" align="center">
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
                                <span v-if="item.prop == 'resourceName'">
                                    <el-button type="text" @click="handleLink(scope.row)">{{ scope.row[item.prop] ? scope.row[item.prop] : "-" }}</el-button>
                                </span>
                                <span v-else>{{ scope.row[item.prop] ? scope.row[item.prop] : "-" }}</span>
                            </template>
                        </el-table-column>

                        <!-- 更多操作 -->
                        <el-table-column label="操作" align="center" width="180" fixed="right" v-if="checkPermissions(['process:definition:suspendState', 'process:definition:remove'])">
                            <template slot-scope="scope">
                                <div class="func-btns">
                                    <el-button v-hasPermi="['process:definition:suspendState']" v-show="scope.row.suspendState == 1" type="text" size="mini" @click="hahdleSuspend(scope.row.id, 2)">
                                        挂起
                                    </el-button>
                                    <el-button v-hasPermi="['process:definition:suspendState']" v-show="scope.row.suspendState == 2" type="text" size="mini" @click="hahdleSuspend(scope.row.id, 1)">
                                        激活
                                    </el-button>
                                    <el-button v-hasPermi="['process:definition:remove']" v-show="true" type="text" size="mini" @click="handleDelete(scope.row)">删除</el-button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </makeid-table-box>
        </el-dialog>
    </div>
</template>

<script>
// 流程定义接口
import { processDefinitionDelete, processDefinitionDown, processDefinitionList, processDefinitionSuspendState } from "@/api/process/process-definition-api";

export default {
    name: "system-process-definition",
    components: {},
    data() {
        return {
            visible: false,
            queryForm: {
                name: null,
            },
            tableLine: [
                { label: "流程ID", prop: "id", width: "150", align: "center", sortable: false },
                { label: "流程KEY", prop: "key", width: "100", align: "center", sortable: false },
                { label: "流程名称", prop: "name", width: "150px", align: "center", sortable: false },
                { label: "版本", prop: "version", width: "50", align: "center", sortable: false },
                { label: "所属分类", prop: "category", width: "240px", align: "center", sortable: false },
                { label: "发布时间", prop: "deploymentTime", width: "200", align: "center", sortable: false },
                { label: "流程定义", prop: "resourceName", width: "100", align: "center", sortable: false },
                { label: "定义状态", prop: "suspendStateName", width: "", align: "center", sortable: false },
            ],
            tableLineSelect: [],

            // 分页
            pagination: {
                pageNo: 1,
                pageSize: 10,
                total: 0,
                pageRange: [10, 20, 30, 50, 100],
            },
            // 表格加载
            loading: true,
            // 表格list
            dataList: [],
            // 弹窗
            tableDialogVisible: false,
            //多选数组
            dataListSelections: [],

            // 流程id
            designerId: null,
        };
    },
    created() {},
    mounted() {
        this.tableLineSelect = this.tableLine;
    },
    methods: {
        // 初始化
        init(designerId) {
            this.designerId = designerId;
            this.visible = true;
            this.getDataList(1);
        },

        // 获取数据列表
        getDataList(pageNo) {
            this.loading = true;
            this.pagination.pageNo = pageNo || this.pagination.pageNo;
            this.queryForm.designerId = this.designerId;
            const item = {
                pageNo: this.pagination.pageNo,
                pageSize: this.pagination.pageSize,
                param: this.queryForm,
            };
            //查询功能
            processDefinitionList(item)
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
                var id = row ? row.deploymentId : "";
                var ids = id
                    ? [id]
                    : this.dataListSelections.map((item) => {
                          return item.deploymentId;
                      });
                var item = {
                    deploymentIds: ids,
                    designerId: this.designerId,
                };
                this.loading = true;
                processDefinitionDelete(item)
                    .then((res) => {
                        this.msgSuccess("删除成功");
                        this.getDataList(this.pagination.pageNo);
                    })
                    .catch((error) => {
                        console.log(error);
                        this.loading = false;
                    });
            });
        },

        // 下载
        handleLink(row) {
            const loading = this.$loading({
                lock: true,
                text: "正在下载，请耐心等待",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)",
            });
            let item = {
                processDefinitionId: row.id,
                resourceName: row.resourceName,
            };
            processDefinitionDown(item)
                .then((res) => {
                    if (res) {
                        this.downloadFile(res, row.resourceName);
                        loading.close();
                    }
                })
                .catch((error) => {
                    console.log(error);
                    loading.close();
                });
        },

        // 下载流程文件
        downloadFile(data, name) {
            if (!data) {
                return;
            }
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement("a");
            link.style.display = "none";
            link.href = url;
            link.setAttribute("download", name);
            document.body.appendChild(link);
            link.click();
        },

        // 挂起、激活
        hahdleSuspend(id, status) {
            this.deleteHandle(() => {
                if (!id) {
                    this.msgWarning("流程定义ID错误");
                    return;
                }
                processDefinitionSuspendState({ id: id, suspendState: status })
                    .then((res) => {
                        console.log(res);
                        this.msgSuccess("操作成功");
                        this.getDataList(this.pagination.pageNo);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }, `是否${status == 1 ? "激活" : "挂起"}该流程?`);
        },

        // 查询
        handleQuery() {
            this.getDataList(1);
        },

        // 重置查询
        resetQuery() {
            this.queryForm = this.$options.data().queryForm;
            this.getDataList(1);
        },

        // 多选
        selectionChangeHandle(val) {
            this.dataListSelections = val;
        },

        // 分页大小选择
        handleSizeChange(val) {
            this.pagination.pageSize = val;
            this.getDataList(1);
        },

        // 分页页面跳转
        handleCurrentChange(val) {
            this.pagination.pageNo = val;
            this.getDataList(val);
        },

        // 编辑
        addOrUpdateHandle(id) {
            this.tableDialogVisible = true;
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(id);
            });
        },

        // 删除
        deleteHandle(func, msg) {
            this.$confirm(msg ? msg : `是否确定删除?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    func ? func() : "";
                })
                .catch(function () {});
        },
    },
};
</script>
<style lang="scss">
#system-process-definition {
    .el-table__body-wrapper {
        height: 400px;
    }
}
</style>
