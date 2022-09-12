<template>
    <div id="base-huowei">
        <!-- 表格条件筛选 -->
        <makeid-table-query :handleQuery="handleQuery" :resetQuery="resetQuery">
            <div id="seek">
                <el-form-item label="货位编码:">
                    <el-input v-model="queryForm.cargoSpaceIdentifier" placeholder="货位编码" clearable size="mini" />
                </el-form-item>
                <el-form-item label="所属仓库:">
                    <el-select v-model="queryForm.storehouseId" clearable placeholder="所属仓库" size="mini">
                        <el-option v-for="item in storehouseList" :key="item.storehouseId" :label="item.storehouseName" :value="item.storehouseId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="货架号:">
                    <el-input v-model="queryForm.shelveIdentifier" placeholder="货架号" clearable size="mini" />
                </el-form-item>
                <el-form-item label="货位号:">
                    <el-input v-model="queryForm.cargoSpaceNumber" placeholder="货位号" clearable size="mini" />
                </el-form-item>
                <div class="query-btn" :class="isExpand" style="margin: 15px 190px">
                    <el-button type="primary" icon="el-icon-plus" size="mini" round @click="handleAdd">新增货位</el-button>
                </div>
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
                    v-loading="loading"
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
                            <span v-if="item.prop == 'shelveIdentifier'">{{ scope.row.shelve.shelveIdentifier }}</span>
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

        <!-- 新增/修改 货位 -->
        <div class="f-dialog add-user">
            <el-drawer :title="title" :close-on-click-modal="false" :visible.sync="open" size="450px">
                <el-form
                    ref="drawerForm"
                    :model="form"
                    :rules="rules"
                    label-width="120px"
                    :style="[{ width: '90%' }, { margin: '0 auto' }, { border: '1px solid #ebeef5' }, { padding: '30px 20px 20px 20px' }]"
                >
                    <el-form-item label="所属仓库" prop="storehouseId">
                        <el-select v-model.number="form.storehouseId" @change="getHuojiaList($event)" clearable placeholder="请选择所属仓库" size="small">
                            <el-option v-for="item in storehouseList" :key="item.storehouseId" :label="item.storehouseName" :value="item.storehouseId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="货架号" prop="shelveId">
                        <el-select v-model.number="form.shelveId" clearable placeholder="请输入货架号" size="mini">
                            <el-option v-for="item in HuojiaList" :key="item.shelveId" :label="item.shelveIdentifier" :value="item.shelveId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="货位号" prop="cargoSpaceNumber">
                        <el-input v-model="form.cargoSpaceNumber" placeholder="请输入货位号" value="1" size="small" />
                    </el-form-item>
                    <el-form-item label="货位编码" prop="cargoSpaceIdentifier">
                        <el-input v-model="form.cargoSpaceIdentifier" placeholder="请输入货位编码" size="small" />
                    </el-form-item>
                    <el-form-item label="物资类别" prop="toolCategory">
                        <el-input v-model="form.toolCategory" placeholder="请输入物资类别" size="small" />
                    </el-form-item>
                    <el-form-item label="货位容量" prop="cargoSpaceCapacity">
                        <el-input-number v-model.number="form.cargoSpaceCapacity" :min="1" size="small"></el-input-number>
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
import * as obj from "@/api/base/base-huowei-api";
import { dateFormatIE } from "@/utils/index";
import MakeidTableMixin from "@/components/makeid-table/mixin/makeid-table-mixin";
export default {
    name: "base-huowei",
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

            // 表单检验
            rules: {
                storehouseId: [
                    {
                        required: true,
                        message: "所属仓库不能为空",
                        trigger: "blur",
                    },
                ],
                shelveId: [
                    {
                        required: true,
                        message: "货架号不能为空",
                        trigger: "blur",
                    },
                ],
                cargoSpaceNumber: [
                    {
                        required: true,
                        message: "货位号不能为空",
                        trigger: "blur",
                    },
                ],
                cargoSpaceIdentifier: [
                    {
                        required: true,
                        message: "货位编码不能为空",
                        trigger: "blur",
                    },
                ],
            },

            // loading标识
            dialogLoading: false,

            // 货架号下拉列表
            HuojiaList: [],

            // 表单参数
            form: {
                cargoSpaceId: "",
                storehouseId: "",
                shelveId: "",
                cargoSpaceNumber: "",
                cargoSpaceIdentifier: "",
                toolCategory: "",
                cargoSpaceCapacity: "",
            },

            isExpand: "",

            // 列表字段
            options: [],

            // dataList
            dataList: [],

            // 表格字段
            tableLine: [
                {
                    label: "货架号",
                    prop: "shelveIdentifier",
                    width: "107",
                },
                {
                    label: "货位号",
                    prop: "cargoSpaceNumber",
                    width: "103",
                },
                {
                    label: "货位编码",
                    prop: "cargoSpaceIdentifier",
                    width: "103",
                },
                {
                    label: "所属仓库",
                    prop: "storehouseName",
                    width: "103",
                },
                {
                    label: "物资类别",
                    prop: "toolCategory",
                    width: "103",
                },
                {
                    label: "货位容量",
                    prop: "cargoSpaceCapacity",
                    width: "103",
                },
                {
                    label: "当前存放量",
                    prop: "nowcargoSpaceCapacity",
                    width: "103",
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
        };
    },
    created() {},
    mounted() {
        this.$store.dispatch("storehouseList");
    },
    computed: {
        ...mapState({
            storehouseList: (state) => state.storehouse.storehouseList,
        }),
    },
    methods: {
        // 根据仓库获取货架号下拉列表
        getHuojiaList(val) {
            var id = val;
            obj.baseHuojiaList(id)
                .then((res) => {
                    this.HuojiaList = res;
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
            this.getDataList(1);
        },
        // 新增按钮
        handleAdd() {
            this.title = "新增";
            this.open = true;
            this.reset();
            this.form.cargoSpaceId = 1;
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
            this.getHuojiaList(row.storehouse.storehouseId);
            this.form.cargoSpaceId = row.cargoSpaceId;
            this.form.storehouseId = row.storehouse.storehouseId;
            this.form.shelveId = row.shelve.shelveId;
            this.form.cargoSpaceNumber = row.cargoSpaceNumber;
            this.form.cargoSpaceIdentifier = row.cargoSpaceIdentifier;
            this.form.toolCategory = row.toolCategory;
            this.form.cargoSpaceCapacity = row.cargoSpaceCapacity;
        },
        // 提交按钮
        submitForm(forName) {
            this.$refs[forName].validate((valid) => {
                if (valid) {
                    const item = JSON.parse(JSON.stringify(this.form));
                    this.dialogLoading = true;
                    if (this.title === "新增") {
                        obj.baseAddHuowei(item)
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
                        obj.baseUpdateHuowei(item)
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
        // 删除按钮
        handleDelete(row) {
            this.deleteHandle((deleteSuccess) => {
                var id = row ? row.cargoSpaceId : "";
                obj.baseDeleteHuowei(id)
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
                .baseHuoweiPageList(item)
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
                    this.loading = false;
                })
                .catch((error) => {
                    this.loading = false;
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
#seek .el-input {
    width: 140px;
}
</style>
