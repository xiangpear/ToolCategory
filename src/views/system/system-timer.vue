<template>
    <!--系统设置-定时任务-->
    <div id="system-timer">
        <!-- 表格条件筛选 -->
        <makeid-table-query :handleQuery="handleQuery" :resetQuery="resetQuery">
            <el-form-item label="bean名称：">
                <el-input v-model="queryForm.param" placeholder="请输入bean名称" clearable size="medium" />
            </el-form-item>
        </makeid-table-query>

        <!-- 表格容器 -->
        <makeid-table-box :pagination="pagination" :handleSizeChange="handleSizeChange" :handleCurrentChange="handleCurrentChange">
            <div slot="btn">
                <el-button v-hasPermi="['sys:schedule:save']" type="primary" icon="el-icon-plus" size="medium" @click="handleAdd">新增定时任务</el-button>
                <el-button v-hasPermi="['sys:schedule:log']" class="add-btn" type="warning" icon="el-icon-date" size="medium" @click="openLog">日志列表</el-button>
                <el-button v-hasPermi="['sys:schedule:delete']" type="danger" size="medium" v-show="dataListSelections.length > 0">批量删除</el-button>
            </div>
            <div slot="content">
                <!-- 自定义列 -->
                <!-- <makeid-table-select :isSelectShow="false" :selectedNum="dataListSelections.length" :table-line="tableLine" @refresh="refreshLine" :clear="clearMul"></makeid-table-select> -->

                <!-- 表格内容 -->
                <el-table border empty-text="该页面暂无数据" ref="table" v-adaptive="{ type: 'table' }" v-loading="loading" :data="dataList" height="100%" @selection-change="selectionChangeHandle">
                    <!-- <el-table-column type="selection" width="46" /> -->
                    <el-table-column prop="index" type="index" label="序号" width="50">
                        <template slot-scope="scope">
                            <span>{{ (pagination.pageNo - 1) * pagination.pageSize + scope.$index + 1 }}</span>
                        </template>
                    </el-table-column>

                    <!-- 动态表格列 -->
                    <el-table-column
                        :sortable="item.prop == 'beanName' || item.prop == 'status'"
                        v-for="item in tableLineSelect"
                        :key="JSON.stringify(item)"
                        :width="item.width"
                        :label="item.label"
                        :prop="item.prop"
                    >
                        <template slot-scope="scope">
                            <span v-if="item.prop == 'status'">
                                <template v-if="scope.row.status">
                                    <span class="table-status danger">暂停</span>
                                </template>
                                <template v-else>
                                    <span class="table-status success">正常</span>
                                </template>
                            </span>
                            <span v-else> {{ scope.row[item.prop] ? scope.row[item.prop] : "-" }}</span>
                        </template>
                    </el-table-column>

                    <!-- 更多操作 -->
                    <el-table-column label="操作" align="center" width="230" fixed="right" v-if="checkPermissions(['sys:schedule:update', 'sys:schedule:delete'])">
                        <template slot-scope="scope">
                            <div class="func-btns">
                                <el-button v-hasPermi="['sys:schedule:update']" size="mini" type="text" icon="el-icon-video-play" @click="handleStart(scope.row)">启动</el-button>
                                <el-button v-hasPermi="['sys:schedule:update']" size="mini" type="text" icon="el-icon-video-pause" @click="handleStop(scope.row)">停止</el-button>
                                <el-popover title="更多">
                                    <div class="more-func-btns">
                                        <el-button v-hasPermi="['sys:schedule:update']" size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">编辑</el-button>
                                        <el-button v-hasPermi="['sys:schedule:delete']" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
                                    </div>
                                    <el-button slot="reference" size="mini" type="text" icon="el-icon-more">更多</el-button>
                                </el-popover>
                            </div>
                        </template>
                    </el-table-column>
                    <!-- 缺省页 -->
                    <div slot="empty" class="makeid-empty-svg">
                        <svg-icon :icon-class="defaultType" style="height: 30px; width: 16px" />
                    </div>
                </el-table>
            </div>
        </makeid-table-box>

        <!-- 日志列表弹窗 -->
        <div class="f-dialog log-list">
            <el-dialog v-adaptive="{ type: 'dialog' }" title="日志列表" :visible.sync="dialog.open" custom-class="makeid-table-dialog" width="1000px">
                <div class="search">
                    <el-form :inline="true" class="f-query">
                        <el-form-item label="bean名称：">
                            <el-input v-model="dialog.beanName" size="medium" placeholder="请输入bean名称" />
                        </el-form-item>
                        <el-form-item class="btns">
                            <el-button type="primary" icon="el-icon-search" size="medium" @click="logQuery">查询</el-button>
                            <el-button icon="el-icon-refresh-left" size="medium" @click="logRest">重置</el-button>
                        </el-form-item>
                    </el-form>
                    <div class="table">
                        <el-table border v-loading="dialog.loading" :data="dialog.logList" height="400px">
                            <el-table-column prop="logId" label="日志ID" />
                            <el-table-column prop="beanName" label="bean名称" width="380" />
                            <el-table-column prop="error" label="失败信息" />
                            <el-table-column prop="times" label="耗时" />
                            <el-table-column prop="status" label="执行结果">
                                <template slot-scope="scope">
                                    {{ scope.row.status ? "失败" : "成功" }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="createdTime" label="创建时间" width="200">
                                <template slot-scope="scope">
                                    {{ scope.row.createdTime | timeFormate }}
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="pagination">
                            <el-pagination
                                background
                                :current-page="dialog.pagination.pageNo"
                                :page-sizes="[10, 20, 30, 50]"
                                :page-size="dialog.pagination.pageSize"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="dialog.pagination.total"
                                @size-change="dialogHandleSizeChange"
                                @current-change="dialogHandleCurrentChange"
                            />
                        </div>
                    </div>
                </div>
            </el-dialog>
        </div>

        <!-- 新增/修改 定时任务 -->
        <div class="f-dialog add-timer">
            <el-dialog v-adaptive="{ type: 'dialog' }" :title="title" :close-on-click-modal="false" :visible.sync="open" custom-class="makeid-table-dialog" width="900px">
                <el-form ref="drawerForm" :model="form" :rules="rules" label-width="130px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="bean名称" prop="beanName">
                                <el-input v-model="form.beanName" placeholder="请输入bean名称" maxlength="20" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="cron表达式" prop="cronExpression">
                                <el-input v-model="form.cronExpression" placeholder="请输入cron表达式" maxlength="20" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="参数" prop="params">
                                <el-input v-model="form.params" placeholder="请输入参数" maxlength="20" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="任务备注" prop="remark">
                                <el-input v-model="form.remark" placeholder="请输入任务备注" maxlength="250" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!-- <el-col :span="12">
                        <el-form-item label="状态" prop="status">
                            <el-radio v-model="form.status" label="0">正常</el-radio>
                            <el-radio v-model="form.status" label="1">暂停</el-radio>
                        </el-form-item>
                    </el-col> -->
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button size="medium" @click="cancel">取 消</el-button>
                    <el-button size="medium" type="primary" @click="submitForm('drawerForm')" :loading="dialogLoading">确 认</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import * as that from "@/api/system/system-timer-api";
import { dateFormatIE } from "@/utils/index";
import MakeidTableMixin from "@/components/makeid-table/mixin/makeid-table-mixin";

export default {
    name: "system-timer",
    filters: {
        timeFormate: function (value) {
            return dateFormatIE(value);
        },
    },
    mixins: [MakeidTableMixin],
    data() {
        return {
            // 确认loading
            dialogLoading: false,

            // 弹出层标题
            title: "新增",

            // 是否显示弹出层
            open: false,

            // 新增定时任务表单参数
            form: {
                jobId: "",
                beanName: "",
                cronExpression: "",
                params: "",
                remark: "",
                status: "0",
            },

            // 新增定时任务表单校验
            rules: {
                beanName: [
                    {
                        required: true,
                        message: "bean名称不能为空",
                        trigger: "change",
                    },
                ],
                cronExpression: [
                    {
                        required: true,
                        message: "cron表达式不能为空",
                        trigger: "change",
                    },
                ],
            },

            //日志列表弹窗参数
            dialog: {
                open: false,
                beanName: "",
                logList: [],
                loading: false,
                pagination: {
                    pageNo: 1,
                    pageSize: 10,
                    total: 0,
                },
            },

            // 条件筛选
            queryForm: {},

            // 全部表格字段
            tableLine: [
                { label: "bean名称", prop: "beanName" },
                { label: "参数", prop: "params" },
                { label: "cron表达式", prop: "cronExpression" },
                { label: "备注", prop: "remark" },
                { label: "状态", prop: "status" },
            ],

            // 自定义表格字段
            tableLineSelect: [],
        };
    },
    mounted() {
        this.tableLineSelect = this.tableLine;
    },
    methods: {
        // 删除
        handleDelete(row) {
            this.deleteHandle((deleteSuccess) => {
                that.jobDeleteJobId({ jobId: row.jobId })
                    .then((res) => {
                        deleteSuccess();
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            });
        },

        // 查询列表
        async getDataList(pageNo) {
            this.loading = true;
            this.pagination.pageNo = pageNo || this.pagination.pageNo;
            const item = {
                pageNo: this.pagination.pageNo,
                pageSize: this.pagination.pageSize,
                param: this.queryForm.param,
            };
            await that
                .jobList(item)
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

        // 取消按钮
        cancel() {
            this.open = false;
        },

        // 表单重置
        reset() {
            this.form = this.$options.data().form;
            setTimeout(() => {
                this.$refs.drawerForm.clearValidate();
            }, 0);
        },

        // 新增按钮操作
        handleAdd(row) {
            this.open = true;
            this.title = "新增";
            this.reset();
        },

        // 修改按钮操作
        handleUpdate(row) {
            this.open = true;
            this.title = "编辑";
            this.reset();
            this.form = Object.assign({}, row);
        },

        // 提交按钮
        submitForm(forName) {
            this.$refs[forName].validate((valid) => {
                if (valid) {
                    this.dialogLoading = true;
                    if (this.title === "新增") {
                        that.jobSave(this.form)
                            .then((res) => {
                                this.dialogLoading = false;
                                this.open = false;
                                this.msgSuccess("新增成功");
                                this.getDataList(1);
                            })
                            .catch((error) => {
                                this.dialogLoading = false;
                                console.log(error);
                            });
                    } else if (this.title === "编辑") {
                        that.jobUpdate(this.form)
                            .then((res) => {
                                this.dialogLoading = false;
                                this.open = false;
                                this.msgSuccess("编辑成功");
                                this.getDataList();
                            })
                            .catch((error) => {
                                this.dialogLoading = false;
                                console.log(error);
                            });
                    }
                } else {
                    console.log("error");
                }
            });
        },

        // 启动任务
        handleStart(row) {
            that.jobStart({ jobId: row.jobId })
                .then((res) => {
                    this.getDataList();
                    this.msgSuccess("启动成功");
                })
                .catch((error) => {
                    console.log(error);
                });
        },

        // 停止任务
        handleStop(row) {
            that.jobStop({ jobId: row.jobId })
                .then((res) => {
                    this.getDataList();
                    this.msgSuccess("停止成功");
                })
                .catch((error) => {
                    console.log(error);
                });
        },

        // ===============================================================
        // 日志列表
        // ===============================================================

        // 打开日志列表
        openLog() {
            this.dialog.open = true;
            this.getLoglist(1);
        },

        // 查询日志
        logQuery() {
            this.getLoglist(1);
        },

        // 日志列表分页查询
        getLoglist(pageNo) {
            this.dialog.loading = true;
            let item = {};
            item = {
                pageNo: pageNo || this.dialog.pagination.pageNo,
                pageSize: this.dialog.pagination.pageSize,
                param: this.dialog.beanName,
            };
            that.sysScheduleLogList(item)
                .then((res) => {
                    this.dialog.loading = false;
                    this.dialog.pagination.total = res.total;
                    this.dialog.pagination.pageNo = res.current;
                    this.dialog.pagination.pageSize = res.size;
                    this.dialog.logList = res.records;
                })
                .catch((error) => {
                    this.dialog.loading = false;
                    console.log(error);
                });
        },

        // 日志重置查询
        logRest() {
            this.dialog.beanName = "";
            this.getLoglist(1);
        },

        // 分页大小选择
        dialogHandleSizeChange(val) {
            this.dialog.pagination.pageSize = val;
            this.getLoglist(1);
        },

        // 分页页面跳转
        dialogHandleCurrentChange(val) {
            this.dialog.pagination.pageNo = val;
            this.getLoglist(val);
        },
    },
};
</script>
<style lang="scss">
</style>
