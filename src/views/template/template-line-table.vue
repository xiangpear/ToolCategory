<template>
    <!-- 行内编辑模板 -->
    <div id="template-line-table">
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
            <el-form-item label="邮箱：">
                <el-input v-model="queryForm.email" placeholder="请输入" clearable size="medium" />
            </el-form-item>
        </makeid-table-query>

        <!-- 表格容器 -->
        <makeid-table-box :pagination="pagination" :handleSizeChange="handleSizeChange" :handleCurrentChange="handleCurrentChange">
            <div slot="btn">
                <el-button type="primary" size="medium" @click="addData()">新增</el-button>
                <el-button type="danger" size="medium" v-show="dataListSelections.length > 0" @click="handleDelete()">批量删除</el-button>
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
                            <template v-if="item.prop == 'deptName'">
                                <el-select v-show="scope.row.show" v-model="scope.row.deptName" clearable placeholder="请选择">
                                    <el-option v-for="item in deptNameOptions" :key="item.value" :label="item.label" :value="item.value" />
                                </el-select>
                                <span v-show="!scope.row.show">{{ scope.row.deptName }}</span>
                            </template>
                            <template v-else>
                                <el-input v-show="scope.row.show" v-model="scope.row[item.prop]" placeholder="请输入内容" />
                                <span v-copy="{ text: scope.row[item.prop] }" v-show="!scope.row.show">{{ scope.row[item.prop] ? scope.row[item.prop] : "-" }}</span>
                            </template>
                        </template>
                    </el-table-column>

                    <!-- 更多操作 -->
                    <el-table-column label="操作" align="center" width="230" fixed="right">
                        <template slot-scope="scope">
                            <div class="func-btns">
                                <el-button v-show="!scope.row.show" size="mini" type="text" icon="el-icon-edit" @click="editData(scope.row)">编辑</el-button>
                                <el-button v-show="scope.row.show" size="mini" type="text" @click="saveData(scope.row)">保存</el-button>
                                <el-button v-show="scope.row.show" size="mini" type="text" @click="cancelData(scope.row)">取消</el-button>
                                <el-popconfirm title="确定删除吗？" icon="el-icon-info" icon-color="#FAAD14" cancel-button-type="default" @onConfirm="handleDelete(scope.row)">
                                    <el-button slot="reference" style="margin-left: 10px" size="mini" type="text" icon="el-icon-delete">删除</el-button>
                                </el-popconfirm>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </makeid-table-box>
    </div>
</template>

<script>
import * as that from "@/api/system/system-user-api";

import MakeidTableMixin from "@/components/makeid-table/mixin/makeid-table-mixin";

export default {
    name: "template-line-table",
    mixins: [MakeidTableMixin],
    data() {
        return {
            deptNameOptions: [
                { label: "部门1", value: "1" },
                { label: "部门2", value: "2" },
                { label: "部门3", value: "3" },
                { label: "部门4", value: "4" },
            ],
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
        getDataList(pageNo) {
            this.loading = true;
            this.pagination.pageNo = pageNo || this.pagination.pageNo;
            const item = {
                pageNo: this.pagination.pageNo,
                pageSize: this.pagination.pageSize,
                param: this.queryForm,
            };
            //查询功能
            that.sysUserPagelist(item)
                .then((res) => {
                    this.loading = false;
                    this.pagination.total = res.total;
                    this.pagination.pageNo = res.current;
                    this.pagination.pageSize = res.size;
                    this.dataList = res.records;
                    this.dataList = res.records.map((value) => {
                        value["show"] = false;
                        return value;
                    });
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
        // 新增行编辑
        addData() {
            for (let i = 0; i < this.dataList.length; i++) {
                const element = this.dataList[i];
                if (!element.userId) {
                    this.$message.error("有未保存的记录，请先保存");
                    return;
                }
            }
            this.dataList.unshift({
                userName: "",
                realName: "",
                deptName: "",
                phone: "",
                email: "",
                show: true,
            });
        },
        // 编辑行
        editData(row) {
            row.show = true;
            this.dataList.unshift({});
            this.dataList.shift();
            this.$nextTick(() => {
                this.$refs.table.doLayout();
            });
        },
        // 保存行编辑
        saveData(row) {
            if (row.userName == "") {
                this.$message.error("用户名不能为空");
                return;
            }
            if (row && !row.userId) {
                // 新增功能
                // that.func(row)
                //     .then((res) => {
                //         this.msgSuccess("新增成功");
                //         this.getDataList(1);
                //     })
                //     .catch((error) => {
                //         console.log(error);
                //     });
            } else {
                // 编辑功能
                // that.func(row)
                //     .then((res) => {
                //         this.msgSuccess("编辑成功");
                //         this.getDataList();
                //     })
                //     .catch((error) => {
                //         console.log(error);
                //     });
            }
        },
        // 取消行编辑
        cancelData(row) {
            row.show = false;
            if (row && !row.userId) {
                this.dataList.shift();
                return;
            }
            this.getDataList();
        },
        // 删除
        handleDelete(row) {
            if (row) {
                if (!row.userId) {
                    this.dataList.shift();
                    return;
                }
                this.deleteData([row.userId]);
            } else {
                //批量删除
                this.deleteHandle(() => {
                    var idArr = [];
                    var noidArr = [];
                    for (let i = 0; i < this.dataListSelections.length; i++) {
                        const element = this.dataListSelections[i];
                        if (element.userId) {
                            idArr.push(element);
                        } else {
                            noidArr.push(element);
                        }
                    }
                    if (noidArr.length > 0) {
                        this.dataList.shift();
                    }
                    var ids = idArr.map((item) => {
                        return item.userId;
                    });
                    this.deleteData(ids);
                });
            }
        },
        // 删除数据
        deleteData(ids) {
            // 删除功能
            console.log(ids);
            // that.sysUserDelete(ids)
            //     .then((res) => {
            //         this.msgSuccess("删除成功");
            //         this.getDataList(1);
            //     })
            //     .catch((error) => {
            //         console.log(error);
            //     });
        },
    },
};
</script>

<style lang="scss"></style>
