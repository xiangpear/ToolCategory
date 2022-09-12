<template>
    <!--系统设置-系统日志-->
    <div id="system-log">
        <!-- 表格条件筛选 -->
        <makeid-table-query :handleQuery="handleQuery" :resetQuery="resetQuery">
            <el-form-item label="操作用户名：">
                <el-input v-model="queryForm.userName" size="medium" placeholder="请输入操作用户名" />
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
        </makeid-table-query>

        <!-- 表格容器 -->
        <makeid-table-box :pagination="pagination" :handleSizeChange="handleSizeChange" :handleCurrentChange="handleCurrentChange">
            <div slot="content">
                <!-- 自定义列 -->
                <!-- <makeid-table-select :isSelectShow="false" :selectedNum="dataListSelections.length" :table-line="tableLine" @refresh="refreshLine" :clear="clearMul"></makeid-table-select> -->

                <!-- 表格内容 -->
                <el-table ref="table" empty-text="该页面暂无数据" border v-adaptive="{ type: 'table' }" v-loading="loading" :data="dataList" height="100%" @selection-change="selectionChangeHandle">
                    <!-- <el-table-column type="selection" width="46" /> -->
                    <el-table-column prop="index" type="index" label="序号" width="50">
                        <template slot-scope="scope">
                            <span>{{ (pagination.pageNo - 1) * pagination.pageSize + scope.$index + 1 }}</span>
                        </template>
                    </el-table-column>

                    <!-- 动态表格列 -->
                    <el-table-column :sortable="item.prop != 'params'" v-for="item in tableLineSelect" :key="JSON.stringify(item)" :width="item.width" :label="item.label" :prop="item.prop">
                        <template slot-scope="scope">
                            <span v-copy="{ text: scope.row[item.prop] }" v-if="item.prop == 'createdTime'"> {{ scope.row.createdTime | timeFormate }}</span>
                            <span v-copy="{ text: scope.row[item.prop] }" v-else-if="item.prop == 'method'">{{ scope.row[item.prop] }}</span>
                            <span v-copy="{ text: scope.row[item.prop] }" v-else-if="item.prop == 'params'">{{ scope.row[item.prop] }}</span>
                            <span v-copy="{ text: scope.row[item.prop] }" v-else> {{ scope.row[item.prop] != 0 ? (scope.row[item.prop] ? scope.row[item.prop] : "-") : scope.row[item.prop] }}</span>
                        </template>
                    </el-table-column>

                    <!-- 缺省页 -->
                    <div slot="empty" class="makeid-empty-svg">
                        <svg-icon :icon-class="defaultType" style="height: 30px; width: 16px" />
                    </div>
                </el-table>
            </div>
        </makeid-table-box>
    </div>
</template>

<script>
import * as that from "@/api/system/system-log-api";
import MakeidTableMixin from "@/components/makeid-table/mixin/makeid-table-mixin";

export default {
    name: "system-log",
    mixins: [MakeidTableMixin],
    data() {
        return {
            // 弹出层标题
            title: "新增",

            // 是否显示弹出层
            open: false,

            // 是否显示日志弹出层
            dialogOpen: false,

            // 条件筛选
            queryForm: {},

            // 全部表格字段
            tableLine: [
                { label: "源IP", prop: "ip" },
                { label: "请求方法", prop: "method" },
                { label: "请求参数", prop: "params" },
                { label: "用户操作", prop: "operation" },
                { label: "执行时间(ms)", prop: "time" },
                { label: "操作用户名", prop: "username" },
                { label: "创建时间", prop: "createdTime" },
            ],

            // 自定义表格字段
            tableLineSelect: [],
        };
    },
    mounted() {
        this.tableLineSelect = this.tableLine;
    },
    methods: {
        // 查询列表
        async getDataList(pageNo) {
            this.loading = true;
            this.pagination.pageNo = pageNo || this.pagination.pageNo;
            if (this.queryForm.selecteTime) {
                this.queryForm.beginDate = this.queryForm.selecteTime[0];
                this.queryForm.endDate = this.queryForm.selecteTime[1];
            } else {
                this.queryForm.beginDate = "";
                this.queryForm.endDate = "";
            }
            const item = {
                pageNo: this.pagination.pageNo,
                pageSize: this.pagination.pageSize,
                param: this.queryForm,
            };
            await that
                .sysLogList(item)
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
    },
};
</script>
<style lang="scss">
</style>
