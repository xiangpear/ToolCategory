<template>
    <div id="base-terminal">
        <!-- 表格条件筛选 -->
        <makeid-table-query :handleQuery="handleQuery" :resetQuery="resetQuery">
            <el-form-item label="设备名称:">
                <el-input v-model="queryForm.terminalName" placeholder="设备名称" clearable size="mini" />
            </el-form-item>
            <el-form-item label="所属仓库:">
                <el-select v-model.number="queryForm.storehouseId" clearable placeholder="所属仓库" size="mini">
                    <el-option v-for="item in storehouseList" :key="item.storehouseId" :label="item.storehouseName" :value="item.storehouseId"></el-option>
                </el-select>
            </el-form-item>
            <div class="query-btn" :class="isExpand" style="margin: 15px 190px">
                <el-button type="primary" icon="el-icon-plus" size="mini" round @click="handleAdd">新增设备</el-button>
            </div>
        </makeid-table-query>

        <!-- 表格容器 -->
        <makeid-table-box :pagination="pagination" :handleSizeChange="handleSizeChange" :handleCurrentChange="handleCurrentChange">
            <div slot="content">
                <!-- 表格内容 -->
                <el-table
                    ref="table"
                    v-adaptive="{ type: 'table' }"
                    :header-cell-style="{ background: '#f7f9fb', color: '#606266', border: '.2px solid #ebeef5*', height: '100%' }"
                    border
                    :data="dataList"
                    height="100%"
                    @selection-change="selectionChangeHandle"
                >
                    <el-table-column prop="index" type="index" label="序号" width="50" align="center">
                        <template slot-scope="scope">
                            <span>{{ (pagination.pageNo - 1) * pagination.pageSize + scope.$index + 1 }}</span>
                        </template>
                    </el-table-column>

                    <!-- 动态表格列 -->
                    <el-table-column v-for="item in tableLine" :key="JSON.stringify(item)" :width="item.width" :label="item.label" :prop="item.prop" align="center">
                        <template slot-scope="scope">
                            <span v-if="item.prop == 'isUse'">
                                <template v-if="scope.row.isUse === 1">
                                    <span class="table-status success">正常</span>
                                </template>
                                <template v-else>
                                    <span class="table-status danger">禁用</span>
                                </template>
                            </span>
                            <span v-else-if="item.prop == 'storehouseName'">{{ scope.row.storehouse.storehouseName }}</span>
                            <span v-else-if="item.prop == 'createdTime'"> {{ scope.row.createdTime | timeFormate }}</span>
                            <span v-else-if="item.prop == 'updatedTime'"> {{ scope.row.updatedTime | timeFormate }}</span>
                            <span v-else> {{ scope.row[item.prop] ? scope.row[item.prop] : "-" }}</span>
                        </template>
                    </el-table-column>

                    <!-- 更多操作 -->
                    <el-table-column label="操作" align="center" fixed="right" v-if="checkPermissions(['sys:user:update', 'sys:user:reset', 'sys:user:delete', 'sys:user:unLock'])">
                        <template slot-scope="scope">
                            <div class="func-btns">
                                <el-button v-hasPermi="['sys:user:update']" size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">编辑</el-button>
                                <el-button v-show="!scope.row.accountLock" v-hasPermi="['sys:user:delete']" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                                    >删除</el-button
                                >
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

        <!-- 新增/修改 终端 -->
        <div class="f-dialog add-user">
            <el-drawer :title="title" :close-on-click-modal="false" :visible.sync="open" size="700px">
                <el-form
                    ref="drawerForm"
                    :model="form"
                    :rules="rules"
                    label-width="120px"
                    :style="[{ width: '85%' }, { margin: '0 auto' }, { border: '1px solid #ebeef5' }, { padding: '30px 20px 20px 20px' }]"
                >
                    <el-form-item label="所属仓库" prop="storehouseId">
                        <el-select v-model.number="form.storehouseId" clearable placeholder="请选择所属仓库" size="small" :style="[{ width: '195px !important' }]">
                            <el-option v-for="item in storehouseList" :key="item.storehouseId" :label="item.storehouseName" :value="item.storehouseId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="设备名称" prop="terminalName">
                        <el-input v-model="form.terminalName" placeholder="请输入设备名称" size="small" />
                    </el-form-item>
                    <el-form-item label="设备ID" prop="terminalIdentifier">
                        <el-input v-model="form.terminalIdentifier" placeholder="请输入设备ID" size="small" />
                    </el-form-item>
                    <el-form-item label="IP地址" prop="ipAddr">
                        <el-input v-model="form.ipAddr" placeholder="请输入IP地址" size="small" />
                    </el-form-item>
                    <el-form-item label="状态" prop="isUse">
                        <el-radio v-model="form.isUse" :label="1">正常</el-radio>
                        <el-radio v-model="form.isUse" :label="0">禁用</el-radio>
                    </el-form-item>
                    <span class="dialog-footer">
                        <el-button size="medium" type="default" @click="cancel">取 消</el-button>
                        <el-button size="medium" type="primary" @click="submitForm('drawerForm')" :loading="dialogLoading">确 认 </el-button>
                    </span>
                </el-form>
            </el-drawer>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import * as obj from "@/api/base/base-terminal-api";
import { dateFormatIE } from "@/utils/index";
import MakeidTableMixin from "@/components/makeid-table/mixin/makeid-table-mixin";
export default {
    name: "base-terminal",
    filters: {
        // 兼容ie的时间格式化
        timeFormate: (value) => {
            return dateFormatIE(value);
        },
    },
    mixins: [MakeidTableMixin],
    data() {
        return {
            // 弹出层标题
            title: "新增",

            // 是否显示弹出层
            open: false,

            // 查询参数
            queryForm: {},

            // 表单参数
            form: {
                terminalId: "",
                storehouseId: "",
                terminalName: "",
                terminalIdentifier: "",
                ipAddr: "",
                isUse: 1,
            },

            // 表单检验
            rules: {
                storehouseId: [{ required: true, message: "所属仓库不能为空", trigger: "change" }],
                terminalName: [{ required: true, message: "设备名称不能为空", trigger: "blur" }],
                ipAddr: [{ required: true, message: "IP地址不能为空", trigger: "blur" }],
            },

            // 表格字段
            tableLine: [
                {
                    label: "设备名称",
                    prop: "terminalName",
                    width: "145",
                },
                {
                    label: "设备ID",
                    prop: "terminalIdentifier",
                    width: "145",
                },
                {
                    label: "IP地址",
                    prop: "ipAddr",
                    width: "145",
                },
                {
                    label: "所属仓库",
                    prop: "storehouseName",
                    width: "145",
                },
                {
                    label: "状态",
                    prop: "isUse",
                    width: "145",
                },
                {
                    label: "创建时间",
                    prop: "createdTime",
                    width: "200",
                },
                {
                    label: "更新时间",
                    prop: "updatedTime",
                    width: "200",
                },
            ],

            isExpand: "",

            //dataList
            dataList: [],
        };
    },
    mounted() {
        this.$store.dispatch("storehouseList");
    },
    computed: {
        ...mapState({
            storehouseList: (state) => state.storehouse.storehouseList,
        }),
    },
    methods: {
        // 表单重置
        reset() {
            this.form = this.$options.data().form;
            setTimeout(() => {
                this.$refs.drawerForm.clearValidate();
            }, 0);
        },
        // 重置查询
        resetQuery() {
            this.queryForm = this.$options.data().queryForm;
            this.getDataList(1);
        },
        // 新增按钮
        handleAdd() {
            this.title = "新增";
            this.open = true;
            this.reset();
            this.form.terminalId = 1;
        },
        // 取消按钮
        cancel() {
            this.open = false;
        },
        // 编辑按钮
        handleUpdate(row) {
            this.title = "编辑";
            this.open = true;
            this.reset();
            this.form.terminalId = row.terminalId;
            this.form.storehouseId = row.storehouse.storehouseId;
            this.form.terminalName = row.terminalName;
            this.form.terminalIdentifier = row.terminalIdentifier;
            this.form.ipAddr = row.ipAddr;
            this.form.isUse = row.isUse;
        },
        // 删除按钮
        handleDelete(row) {
            this.deleteHandle((deleteSuccess) => {
                var id = row ? row.terminalId : "";
                obj.baseDeleteTerminal(id)
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
                param: this.queryForm,
            };
            await obj
                .baseTerminalPageList(item)
                .then((res) => {
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
                    console.log(error);
                });
        },
        // 提交按钮
        submitForm(forName) {
            this.$refs[forName].validate((valid) => {
                if (valid) {
                    const item = JSON.parse(JSON.stringify(this.form));
                    this.dialogLoading = true;
                    if (this.title === "新增") {
                        obj.baseAddTerminal(item)
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
                        obj.baseUpdateTerminal(item)
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
    },
};
</script>

<style>
.dialog-footer {
    display: inline-block;
    width: 100%;
    height: 36px;
    text-align: right;
    padding-right: 10px;
}
</style>
