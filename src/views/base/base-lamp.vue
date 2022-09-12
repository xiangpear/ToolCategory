<template>
    <div id="base-lamp">
        <!-- 表格条件筛选 -->
        <makeid-table-query :handleQuery="handleQuery" :resetQuery="resetQuery">
            <div id="seek">
                <el-form-item label="货架号:">
                    <el-input v-model="queryForm.shelveId" placeholder="货架号" clearable size="mini" />
                </el-form-item>
                <el-form-item label="货位号:">
                    <el-input v-model="queryForm.cargoSpaceId" placeholder="货位号" clearable size="mini" />
                </el-form-item>
                <el-form-item label="类型:">
                    <el-select v-model="queryForm.indicatorLightCategory" clearable placeholder="类型" size="mini">
                        <el-option v-for="item in lampTypeList" :key="item.id" :label="item.label" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属仓库:">
                    <el-select v-model="queryForm.storehouseId" clearable placeholder="所属仓库" size="mini">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <div class="query-btn" :class="isExpand" style="margin: 15px 190px">
                    <el-button type="primary" icon="el-icon-plus" size="mini" round="true" @click="handleAdd">新增指示灯</el-button>
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
                            <span v-if="item.prop == 'indicatorLightCategory'">
                                <template v-if="scope.row.indicatorLightCategory === '0'">
                                    <span>货架灯</span>
                                </template>
                                <template v-else>
                                    <span>货位灯</span>
                                </template>
                            </span>
                            <span v-else-if="item.prop == 'isUse'">
                                <template v-if="scope.row.isUse === '1'">
                                    <span class="table-status success">启用</span>
                                </template>
                                <template v-else>
                                    <span class="table-status danger">禁用</span>
                                </template>
                            </span>
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

        <!-- 新增/修改 指示灯 -->
        <div class="f-dialog add-user">
            <el-drawer :title="title" :close-on-click-modal="false" :visible.sync="open" size="700px">
                <el-form
                    ref="drawerForm"
                    :model="form"
                    :rules="rules"
                    label-width="120px"
                    :style="[{ width: '85%' }, { margin: '0 auto' }, { border: '1px solid #ebeef5' }, { padding: '30px 20px 20px 20px' }]"
                >
                    <el-form-item label="指示灯类型" prop="indicatorLightCategory">
                        <el-radio v-model="form.indicatorLightCategory" label="0">货架灯</el-radio>
                        <el-radio v-model="form.indicatorLightCategory" label="1">货位灯</el-radio>
                    </el-form-item>
                    <el-form-item label="指示灯状态" prop="isUse">
                        <el-radio v-model="form.isUse" label="1">启用</el-radio>
                        <el-radio v-model="form.isUse" label="0">禁用</el-radio>
                    </el-form-item>
                    <el-form-item label="所属仓库" prop="storehouseId">
                        <el-select v-model="form.storehouseId" clearable placeholder="请选择所属仓库" size="small" :style="[{ width: '195px !important' }]">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="货架号" prop="shelveId">
                        <!-- <el-input v-model="form.shelveId" placeholder="请输入货架号" size="small" /> -->
                        <el-select v-model="form.shelveId" clearable placeholder="请选择货架号" size="small" :style="[{ width: '195px !important' }]">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-show="form.indicatorLightCategory == '1'" label="货位号" prop="cargoSpaceId">
                        <!-- <el-input v-model="form.cargoSpaceId" placeholder="请输入货位号" size="small" /> -->
                        <el-select v-model="form.cargoSpaceId" clearable placeholder="请选择货位号" size="small" :style="[{ width: '195px !important' }]">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="指示灯编码" prop="indicatorLightIdentifier">
                        <el-input v-model="form.indicatorLightIdentifier" placeholder="请输入指示灯编码" size="small" />
                    </el-form-item>
                    <el-form-item label="设备ID" prop="teminalId">
                        <el-input v-model="form.teminalId" placeholder="请输入设备ID" size="small" />
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
import { dateFormatIE } from "@/utils/index";
import MakeidTableMixin from "@/components/makeid-table/mixin/makeid-table-mixin";
export default {
    name: "base-lamp",
    mixins: [MakeidTableMixin],
    filters: {
        // 兼容ie的时间格式化
        timeFormate: (value) => {
            return dateFormatIE(value);
        },
    },
    data() {
        return {
            // 弹出层标题
            title: "新增",

            // 是否显示弹出层
            open: false,

            // 表单参数
            form: {
                indicatorLightCategory: "0",
                isUse: "1",
                storehouseId: "",
                shelveId: "",
                cargoSpaceId: "",
                indicatorLightIdentifier: "",
                teminalId: "",
            },

            // 指示灯类型列表
            lampTypeList: [
                {
                    id: "0",
                    label: "货架灯",
                },
                {
                    id: "1",
                    label: "货位灯",
                },
            ],

            // 表单检验
            rules: {
                storehouseId: [{ required: true, message: "所属仓库不能为空", trigger: "blur" }],
                shelveId: [{ required: true, message: "货架号不能为空", trigger: "blur" }],
                indicatorLightIdentifier: [{ required: true, message: "指示灯编码不能为空", trigger: "blur" }],
                teminalId: [{ required: true, message: "设备ID不能为空", trigger: "blur" }],
            },

            // 查询参数
            queryForm: {},

            // 表格字段
            tableLine: [
                {
                    label: "指示灯类型",
                    prop: "indicatorLightCategory",
                    width: "107",
                },
                {
                    label: "指示灯编码",
                    prop: "indicatorLightIdentifier",
                    width: "103",
                },
                {
                    label: "货架号",
                    prop: "shelveId",
                    width: "103",
                },
                {
                    label: "货位号",
                    prop: "cargoSpaceId",
                    width: "103",
                },
                {
                    label: "所属仓库",
                    prop: "storehouseId",
                    width: "103",
                },
                {
                    label: "状态",
                    prop: "isUse",
                    width: "103",
                },
                {
                    label: "设备ID",
                    prop: "teminalId",
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
            // test-data
            dataList: [
                {
                    indicatorLightCategory: "0",
                    indicatorLightIdentifier: "0001",
                    shelveId: "A1",
                    cargoSpaceId: "A1",
                    storehouseId: "二楼仓库",
                    isUse: "1",
                    teminalId: "11384697",
                    createdTime: "2022-03-16 15:28:52",
                    updatedTime: "2022-03-16 15:28:52",
                },
            ],
        };
    },
    mounted() {
        this.$store.dispatch("storehouseList");
    },
    computed: {
        ...mapState({
            storehouseList: (state) => state.storehouse,
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
            this.form.indicatorLightCategory = row.indicatorLightCategory;
            this.form.isUse = row.isUse;
            this.form.storehouseId = row.storehouseId;
            this.form.shelveId = row.shelveId;
            this.form.cargoSpaceId = row.cargoSpaceId;
            this.form.indicatorLightIdentifier = row.indicatorLightIdentifier;
            this.form.teminalId = row.teminalId;
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
                .baseLampPageList(item)
                .then((res) => {
                    this.pagination.total = res.totalPages;
                    this.pagination.pageNo = res.pageable.pageNumber;
                    this.pagination.pageSize = res.pageable.pageSize;
                    this.dataList = res.content;
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
