<template>
    <div id="base-storehouse">
        <!-- 表格条件筛选 -->
        <makeid-table-query :handleQuery="handleQuery" :resetQuery="resetQuery">
            <el-form-item label="仓库名称:">
                <el-input v-model="queryForm.storehouseName" placeholder="请输入仓库名称" clearable size="mini" />
            </el-form-item>
            <el-form-item label="部门名称：" class="treeSelect">
                <el-popover ref="deptListQueryPopover" v-model="showQueryDept" width="408" placement="bottom-start" trigger="click">
                    <el-input v-model="filterTextQuery" placeholder="输入关键字进行过滤" style="margin-bottom: 10px" size="medium" />
                    <el-tree
                        ref="deptTreeQuery"
                        class="dept-tree"
                        :data="deptList"
                        :props="deptListProps"
                        node-key="deptId"
                        :default-expand-all="false"
                        :highlight-current="true"
                        :expand-on-click-node="false"
                        :filter-node-method="filterNode"
                        @current-change="deptListQueryChangeHandle"
                    />
                </el-popover>
                <el-input v-model="deptNameQuery.queryName" v-popover:deptListQueryPopover :readonly="true" placeholder="请选择部门" size="medium" />
            </el-form-item>
            <div class="query-btn" :class="isExpand" style="margin: 15px 190px">
                <el-button type="primary" icon="el-icon-plus" size="mini" round @click="handleAdd">新增仓库</el-button>
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
                            <span v-else-if="item.prop == 'name'">{{ scope.row.sysDeptDO.name }}</span>
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

        <!-- 新增/修改 仓库 -->
        <div class="f-dialog add-user">
            <el-drawer :title="title" :close-on-click-modal="false" :visible.sync="open" size="700px">
                <el-form
                    ref="drawerForm"
                    :model="form"
                    :rules="rules"
                    label-width="120px"
                    :style="[{ width: '85%' }, { margin: '0 auto' }, { border: '1px solid #ebeef5' }, { padding: '30px 20px 20px 20px' }]"
                >
                    <el-form-item label="所属仓库" prop="storehouseName">
                        <el-input v-model="form.storehouseName" placeholder="请输入仓库名称" size="small" />
                    </el-form-item>
                    <el-form-item ref="storehouseDept" label="部门名称" prop="storehouseDept">
                        <el-popover ref="deptListPopover" v-model="showDialogDept" width="408" placement="bottom-start" trigger="click">
                            <el-input v-model="filterText" placeholder="输入关键字进行过滤" style="margin-bottom: 10px" />
                            <el-tree
                                ref="deptTree"
                                class="dept-tree"
                                :data="deptList"
                                :props="deptListProps"
                                node-key="deptId"
                                :default-expand-all="false"
                                :highlight-current="true"
                                :expand-on-click-node="false"
                                :filter-node-method="filterNode"
                                @current-change="deptListTreeCurrentChangeHandle"
                            />
                        </el-popover>
                        <el-input v-model="deptNameCurrent.currentName" v-popover:deptListPopover :readonly="true" placeholder="请选择部门" size="small" />
                    </el-form-item>
                    <el-form-item label="中间件ID" prop="storehouseMqId">
                        <el-input v-model="form.storehouseMqId" placeholder="请输入中间件ID" size="small" />
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
import * as obj from "@/api/base/base-storehouse-api";
import { sysDeptList } from "@/api/system/system-department-api";
import { dateFormatIE } from "@/utils/index";
import MakeidTableMixin from "@/components/makeid-table/mixin/makeid-table-mixin";
export default {
    name: "base-storehouse",
    filters: {
        // 兼容ie的时间格式化
        timeFormate: (value) => {
            return dateFormatIE(value);
        },
    },
    mixins: [MakeidTableMixin],
    data() {
        return {
            deptNameQuery: {
                queryName: "",
            },
            deptNameCurrent: {
                currentName: "",
            },

            // 查询参数
            queryForm: {},

            // 表单参数
            form: {
                storehouseDept: "",
                storehouseId: "",
                storehouseMqId: "",
                storehouseName: "",
                isUse: 1,
            },

            // 表单检验
            rules: {
                storehouseName: [
                    {
                        required: true,
                        message: "仓库名称不能为空",
                        trigger: "blur",
                    },
                ],
                storehouseDept: [
                    {
                        required: true,
                        message: "部门不能为空",
                        trigger: "change",
                    },
                ],
                storehouseMqId: [
                    {
                        required: true,
                        message: "中间件ID不能为空",
                        trigger: "blur",
                    },
                ],
            },

            // 表格字段
            tableLine: [
                {
                    label: "仓库名称",
                    prop: "storehouseName",
                    width: "185",
                },
                {
                    label: "部门名称",
                    prop: "name",
                    width: "185",
                },
                {
                    label: "状态",
                    prop: "isUse",
                    width: "185",
                },
                {
                    label: "中间件ID",
                    prop: "storehouseMqId",
                    width: "185",
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

            // dataList
            dataList: [],

            // 查询部门选择组件显示
            showQueryDept: false,

            // 下拉树过滤文字
            filterText: "",
            filterTextQuery: "",

            // 菜单表格树数据
            deptList: [],

            // 下拉树配置
            deptListProps: {
                label: "name",
                children: "childDepts",
            },

            // 弹出层标题
            title: "新增",

            // 是否显示弹出层
            open: false,

            // 弹窗部门选择组件显示
            showDialogDept: false,
        };
    },
    created() {
        this.getDeptList();
    },
    watch: {
        filterText(val) {
            this.$refs.deptTree.filter(val);
        },
        filterTextQuery(val) {
            this.$refs.deptTreeQuery.filter(val);
        },
    },
    methods: {
        // 获取部门列表
        getDeptList() {
            sysDeptList()
                .then((res) => {
                    this.deptList = res;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
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
            this.filterTextQuery = "";
            this.$refs.deptTreeQuery.setCurrentKey(null);
            this.setAllExpand("deptTreeQuery", false);
            this.getDataList(1);
        },
        // 手动折叠/展开部门tree
        setAllExpand(type, state) {
            var nodes = this.$refs[type].store.nodesMap;
            for (var i in nodes) {
                nodes[i].expanded = state;
            }
        },
        // 取消按钮
        cancel() {
            this.open = false;
        },
        // 新增按钮
        handleAdd() {
            this.title = "新增";
            this.open = true;
            this.reset();
            this.$nextTick(() => {
                this.$refs.deptTree.setCurrentKey(null);
                this.setAllExpand("deptTree", false);
            });
            this.form.storehouseId = 1;
        },
        // 编辑按钮
        handleUpdate(row) {
            this.title = "编辑";
            this.open = true;
            this.reset();
            this.form.storehouseId = row.storehouseId;
            this.form.storehouseDept = row.sysDeptDO.deptId;
            this.deptNameCurrent.currentName = row.sysDeptDO.name;
            this.form.storehouseMqId = row.storehouseMqId;
            this.form.storehouseName = row.storehouseName;
            this.form.isUse = row.isUse;
            this.filterText = "";
            this.filterTextQuery = "";
            this.$nextTick(() => {
                this.$refs.deptTree.setCurrentKey(this.form.storehouseDept);
                this.expandParents(this.$refs.deptTree.store.nodesMap[this.form.deptId].parent);
            });
        },
        // 删除按钮
        handleDelete(row) {
            this.deleteHandle((deleteSuccess) => {
                var id = row ? row.storehouseId : "";
                obj.baseDelStorehouse(id)
                    .then((res) => {
                        deleteSuccess();
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            });
        },
        // 提交按钮
        submitForm(forName) {
            this.$refs[forName].validate((valid) => {
                if (valid) {
                    const item = JSON.parse(JSON.stringify(this.form));
                    this.dialogLoading = true;
                    if (this.title === "新增") {
                        obj.baseAddStorehouse(item)
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
                        obj.baseUpdateStorehouse(item)
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
        // 查询框下拉树节点选择
        deptListQueryChangeHandle(event) {
            this.queryForm.storehouseDept = event.deptId;
            this.deptNameQuery.queryName = event.name;
            this.filterText = "";
            this.filterTextQuery = "";
            this.showQueryDept = false;
        },
        // 弹出框下拉树节点选择
        deptListTreeCurrentChangeHandle(event) {
            this.deptNameCurrent.currentName = event.name;
            this.form.storehouseDept = event.deptId;
            this.filterText = "";
            this.filterTextQuery = "";
            this.showDialogDept = false;
        },
        // 递归展开父节点
        expandParents(node) {
            node.expanded = true;
            if (node.parent) {
                this.expandParents(node.parent);
            }
        },
        // 下拉树节点过滤
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
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
                .baseStorehousePageList(item)
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
