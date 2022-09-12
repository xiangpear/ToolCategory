<template>
    <!-- 普通表格表单模板 -->
    <div id="template-table">
        <!-- 表格条件筛选 -->
        <makeid-table-query :handleQuery="handleQuery" :resetQuery="resetQuery">
            <el-form-item label="用户名：">
                <el-input v-model="queryForm.userName" placeholder="请输入" clearable size="medium" />
            </el-form-item>
            <el-form-item label="账号：">
                <el-input v-model="queryForm.realName" placeholder="请输入" clearable size="medium" />
            </el-form-item>
            <el-form-item label="日期：" prop="rangeDate">
                <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="queryForm.selecteTime"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                />
            </el-form-item>
            <el-form-item label="手机号：">
                <el-input v-model="queryForm.phone" placeholder="请输入" clearable size="medium" />
            </el-form-item>
        </makeid-table-query>

        <!-- 表格容器 -->
        <makeid-table-box :pagination="pagination" :handleSizeChange="handleSizeChange" :handleCurrentChange="handleCurrentChange">
            <div slot="btn">
                <el-button type="primary" size="medium" @click="addOrUpdateHandle()">新增</el-button>
                <el-button type="warning" size="medium">导入</el-button>
                <el-button type="warning" size="medium">导出</el-button>
                <el-button type="danger" size="medium" v-show="dataListSelections.length > 0">批量删除</el-button>
            </div>
            <div slot="content">
                <!-- 自定义列 -->
                <makeid-table-select :selectedNum="dataListSelections.length" :table-line="tableLine" @refresh="refreshLine" :clear="clearMul"></makeid-table-select>

                <!-- 表格内容 -->
                <el-table ref="table" v-adaptive="{ type: 'table' }" v-loading="loading" :data="dataList" height="100%" @selection-change="selectionChangeHandle">
                    <el-table-column type="selection" width="46" />
                    <el-table-column prop="index" type="index" label="序号" width="50">
                        <template slot-scope="scope">
                            <span>{{ (pagination.pageNo - 1) * pagination.pageSize + scope.$index + 1 }}</span>
                        </template>
                    </el-table-column>

                    <!-- 动态表格列 -->
                    <el-table-column v-for="item in tableLineSelect" :key="JSON.stringify(item)" :width="item.width" :label="item.label" :prop="item.prop">
                        <template slot-scope="scope">
                            <span v-if="item.prop == 'status'"> {{ scope.row.status ? "暂停" : "正常" }}</span>
                            <span v-copy="{ text: scope.row[item.prop] }" v-else> {{ scope.row[item.prop] ? scope.row[item.prop] : "-" }}</span>
                        </template>
                    </el-table-column>

                    <!-- 更多操作 -->
                    <el-table-column label="操作" align="center" width="230" fixed="right" v-if="checkPermissions(['sys:user:update'])">
                        <template slot-scope="scope">
                            <div class="func-btns">
                                <el-button size="mini" type="text" icon="el-icon-edit" @click="addOrUpdateHandle(scope.row)">编辑</el-button>
                                <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
                                <el-popover title="更多">
                                    <div class="more-func-btns">
                                        <el-button size="mini" type="text" icon="el-icon-view">详情</el-button>
                                        <el-button size="mini" type="text" icon="el-icon-upload2">出库</el-button>
                                        <el-button size="mini" type="text" icon="el-icon-download">入库</el-button>
                                        <el-button size="mini" type="text" icon="el-icon-video-play">开始考核</el-button>
                                        <el-button size="mini" type="text" icon="el-icon-monitor">盘点</el-button>
                                    </div>
                                    <el-button slot="reference" size="mini" type="text" icon="el-icon-more">更多</el-button>
                                </el-popover>
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
        <makeid-table-dialog v-if="tableDialogVisible" ref="makeid-table-dialog" :footer="true" cancelText="取消" submitText="确认">
            <template-table-form title="用户" ref="table-form-1" @refreshDataList="getDataList" />
            <template-table-form title="用户" ref="table-form-2" @refreshDataList="getDataList" />
        </makeid-table-dialog>
    </div>
</template>

<script>
import * as that from "@/api/system/system-user-api";
import MakeidTableMixin from "@/components/makeid-table/mixin/makeid-table-mixin";

import TemplateTableForm from "./template-table-form";

export default {
    name: "template-table",
    components: {
        TemplateTableForm,
    },
    mixins: [MakeidTableMixin],
    data() {
        return {
            // 是否执行mixin中mounted初始化的getDataList获取列表函数
            mixinMounted: true,

            queryForm: {},
            tableLine: [
                { label: "用户名", prop: "userName" },
                { label: "账号", prop: "realName" },
                { label: "部门", prop: "deptName" },
                { label: "手机号", prop: "phone" },
                { label: "邮箱", prop: "email" },
            ],
            tableLineSelect: [],
        };
    },
    mounted() {
        this.tableLineSelect = this.tableLine;
    },
    methods: {
        // 获取数据列表
        async getDataList(pageNo) {
            this.loading = true;
            this.pagination.pageNo = pageNo || this.pagination.pageNo;
            const item = {
                pageNo: this.pagination.pageNo,
                pageSize: this.pagination.pageSize,
                param: this.queryForm,
            };
            //查询功能
            await that
                .sysUserPagelist(item)
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
    },
};
</script>

<style lang="scss"></style>
