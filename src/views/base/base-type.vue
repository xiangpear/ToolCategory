<template>
    <div id="base-type">
        <!-- 表格条件筛选 -->
        <makeid-table-query :handleQuery="handleQuery" :resetQuery="resetQuery">
            <el-form-item label="工器具名称:">
                <el-select v-model="queryForm.toolCategoryId" clearable placeholder="工器具名称" size="mini">
                    <el-option v-for="item in toolCategoryNameList" :key="item.toolCategoryId" :label="item.toolCategoryName" :value="item.toolCategoryId"></el-option>
                </el-select>
            </el-form-item>
            <div class="query-btn" :class="isExpand" style="width: 360px; margin: 15px 190px">
                <el-button type="primary" icon="el-icon-plus" size="mini" round @click="handleAdd">新增工器具类型</el-button>
                <el-button type="primary" icon="el-icon-download" size="mini" round @click="templateDownload">模板下载</el-button>
                <el-upload ref="upload" class="upload-button" action="" :show-file-list="false" :http-request="uploadFile" :limit="1" :style="[{ display: 'inline-block', marginLeft: '10px' }]">
                    <el-button type="primary" icon="el-icon-upload" size="mini" round>导入数据</el-button>
                </el-upload>
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
                            <span class="el-img" style="width: 50px; height: 50px" v-if="item.prop == 'imgUrl'">
                                <template v-if="scope.row.imgUrl">
                                    <img :src="scope.row.imgUrl" alt="" width="100%" height="100%" />
                                </template>
                                <template v-else>
                                    <span>未上传</span>
                                </template>
                            </span>
                            <span v-else-if="item.prop == 'toolStatusId'">
                                <template v-if="scope.row.toolStatus.toolStatusId === 1">
                                    <span class="table-status success">正常</span>
                                </template>
                                <template v-else>
                                    <span class="table-status danger">禁用</span>
                                </template>
                            </span>
                            <span v-else-if="item.prop == 'itemUnitId'">{{ scope.row.itemUnit.itemUnitName }}</span>
                            <span v-else-if="item.prop == 'createdTime'"> {{ scope.row.createdTime | timeFormate }}</span>
                            <span v-else-if="item.prop == 'updatedTime'"> {{ scope.row.updatedTime | timeFormate }}</span>
                            <span v-else> {{ scope.row[item.prop] ? scope.row[item.prop] : "-" }}</span>
                        </template>
                    </el-table-column>

                    <!-- 更多操作 -->
                    <el-table-column label="操作" align="center" width="230" fixed="right" v-if="checkPermissions(['sys:user:update', 'sys:user:reset', 'sys:user:delete', 'sys:user:unLock'])">
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

        <!-- 新增/修改 工器具类型 -->
        <div class="f-dialog add-user">
            <el-drawer :title="title" :close-on-click-modal="false" :visible.sync="open" size="700px">
                <div class="drawer-content">
                    <el-form ref="drawerForm" v-adaptive="{ type: 'form' }" :model="form" :rules="rules" label-width="140px" :style="[{ padding: '30px 20px 20px 20px' }]">
                        <el-row>
                            <el-col :span="22">
                                <el-form-item label="工器具名称" prop="toolCategoryName">
                                    <el-input v-model="form.toolCategoryName" placeholder="请输入工器具名称" size="small"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="15">
                                <el-form-item label="计量单位" prop="itemUnitId">
                                    <el-select v-model.number="form.itemUnitId" placeholder="请选择计量单位" size="small">
                                        <el-option v-for="item in itemUnitList" :key="item.itemUnitId" :label="item.itemUnitName" :value="item.itemUnitId"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="22">
                                <el-form-item label="库存告警数量" prop="alarmStockNumber">
                                    <el-input type="number" v-model.number="form.alarmStockNumber" controls-position="right" size="small"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="22">
                                <el-form-item label="试验周期（月）" prop="inspectionCycle">
                                    <el-input type="number" v-model.number="form.inspectionCycle" placeholder="请输入试验周期（月）" controls-position="right" size="small"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="22">
                                <el-form-item label="使用周期（月）" prop="useCycle">
                                    <el-input type="number" v-model.number="form.useCycle" placeholder="请输入使用周期（月）" controls-position="right" size="small"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="22">
                                <el-form-item label="电压等级（KV）" prop="voltageLevel">
                                    <el-input type="number" v-model.number="form.voltageLevel" placeholder="请输入电压等级（KV）" controls-position="right" size="small"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="22">
                                <el-form-item label="试验电压（KV）" prop="testVoltage">
                                    <el-input type="number" v-model.number="form.testVoltage" placeholder="请输入试验电压（KV）" controls-position="right" size="small"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="22">
                                <el-form-item label="耐压时间(分钟)" prop="voltageTime">
                                    <el-input type="number" v-model.number="form.voltageTime" placeholder="请输入耐压时间（分钟）" controls-position="right" size="small"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="22">
                                <el-form-item label="状态" prop="toolStatusId">
                                    <el-radio v-model.number="form.toolStatusId" :label="1">正常</el-radio>
                                    <el-radio v-model.number="form.toolStatusId" :label="0">禁用</el-radio>
                                </el-form-item>
                            </el-col>
                            <el-col>
                                <el-form-item label="已上传图片" prop="imgUrl">
                                    <span v-if="form.imgUrl === ''">未上传</span>
                                    <div class="el-img-drawer" v-else>
                                        <img :src="form.imgUrl" width="100%" height="100%" />
                                    </div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="22">
                                <el-form-item>
                                    <el-upload ref="upload1" :http-request="uploadImg" class="upload-demo" action="" :limit="1" :show-file-list="false">
                                        <el-button size="small" type="primary">点击上传</el-button>
                                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                                    </el-upload>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <span class="dialog-footer">
                        <el-button size="medium" type="default" @click="cancel">取 消</el-button>
                        <el-button size="medium" type="primary" @click="submitForm('drawerForm')" :loading="dialogLoading">确 认 </el-button>
                    </span>
                </div>
            </el-drawer>
        </div>
    </div>
    <!-- </div> -->
</template>

<script>
import { backendIP } from "@/utils/request";
import * as obj from "@/api/base/base-type-api";
import MakeidTableMixin from "@/components/makeid-table/mixin/makeid-table-mixin";
import { dateFormatIE, downloadFile } from "@/utils/index";
export default {
    name: "base-type",
    filters: {
        // 兼容ie的时间格式化
        timeFormate: (value) => {
            return dateFormatIE(value);
        },
    },
    mixins: [MakeidTableMixin],
    data() {
        return {
            // 是否显示弹出层
            open: false,

            // 弹出层标题
            title: "新增",

            // 查询参数
            queryForm: {},

            // 工器具名称下拉列表
            toolCategoryNameList: [],

            isExpand: "",

            // 计量单位下拉列表
            itemUnitList: [],

            // loading标识
            dialogLoading: false,

            // 表单参数
            form: {
                toolCategoryId: "",
                toolCategoryName: "",
                itemUnitId: "",
                alarmStockNumber: 0,
                inspectionCycle: 1,
                useCycle: 1,
                voltageLevel: "",
                testVoltage: "",
                voltageTime: "",
                imgUrl: "",
                toolStatusId: 1,
            },

            // 表单检验
            rules: {
                toolCategoryName: [
                    {
                        required: true,
                        message: "工器具名称不能为空",
                        trigger: "blur",
                    },
                ],
                itemUnitId: [
                    {
                        required: true,
                        message: "计量单位不能为空",
                        trigger: "blur",
                    },
                ],
                inspectionCycle: [
                    {
                        required: true,
                        message: "试验周期不能为空",
                        trigger: "blur",
                    },
                ],
                useCycle: [
                    {
                        required: true,
                        message: "使用周期不能为空",
                        trigger: "blur",
                    },
                ],
            },

            // 表格字段
            tableLine: [
                {
                    label: "工器具名称",
                    prop: "toolCategoryName",
                    width: "160",
                },
                {
                    label: "计量单位",
                    prop: "itemUnitId",
                    width: "100",
                },
                {
                    label: "库存告警数量",
                    prop: "alarmStockNumber",
                    width: "160",
                },
                {
                    label: "试验周期（月）",
                    prop: "inspectionCycle",
                    width: "160",
                },
                {
                    label: "使用周期（月）",
                    prop: "useCycle",
                    width: "160",
                },
                {
                    label: "电压等级（KV）",
                    prop: "voltageLevel",
                    width: "160",
                },
                {
                    label: "试验电压（KV）",
                    prop: "testVoltage",
                    width: "160",
                },
                {
                    label: "耐压时间（分钟）",
                    prop: "voltageTime",
                    width: "160",
                },
                {
                    label: "工器具图片",
                    prop: "imgUrl",
                    width: "160",
                },
                {
                    label: "状态",
                    prop: "toolStatusId",
                    width: "100",
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

            // dataList
            dataList: [],
        };
    },
    created() {
        this.getToolCategoryNameList();
        this.getItemUnitList();
    },
    computed: {},
    methods: {
        // 获取工器具名称下拉列表
        getToolCategoryNameList() {
            obj.baseToolCategoryNameList()
                .then((res) => {
                    this.toolCategoryNameList = res;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        // 获取计量单位下拉列表
        getItemUnitList() {
            obj.baseItemUnitList()
                .then((res) => {
                    this.itemUnitList = res;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        // 重置查询
        resetQuery() {
            this.queryForm = this.$options.data().queryForm;
            this.getDataList(1);
        },
        // 表单重置
        reset() {
            this.form = this.$options.data().form;
            setTimeout(() => {
                // 移除表单校验结果
                this.$refs.drawerForm.clearValidate();
            }, 0);
        },
        // 模板下载
        templateDownload() {
            obj.baseToolCategoryTemplateDownload().then((res) => {
                downloadFile(res, "", "application/vnd.ms-excel");
            });
        },
        // 导入数据
        uploadFile(file) {
            this.$refs.upload.clearFiles();
            let xls = "application/vnd.ms-excel";
            let xlsx = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            if (file.file.type === xls || file.file.type === xlsx) {
                let form = new FormData();
                form.append("file", file.file);
                obj.baseToolCategoryUpload(form).then((res) => {
                    if (res && res.size > 0) {
                        downloadFile(res, "", "application/vnd.ms-excel");
                    } else {
                        this.msgSuccess("操作成功");
                    }
                    this.getDataList(1);
                });
            } else {
                this.msgError("文件必须为.xls .xlsx");
            }
        },
        // 上传图片
        uploadImg(file) {
            this.$refs.upload1.clearFiles();
            if (file.file.type === "image/jpeg" || file.file.type === "image/jpg" || file.file.type === "image/png") {
                let form = new FormData();
                form.append("file", file.file);
                console.log(form.get("file"));
                obj.baseToolCategoryImg(form).then((res) => {
                    this.msgSuccess("上传成功");
                    this.form.imgUrl = backendIP + "/file/" + res;
                });
            } else {
                this.msgError("文件必须为.jpg .png");
            }
        },
        // 新增工器具按钮
        handleAdd() {
            this.title = "新增";
            this.open = true;
            this.reset();
            this.form.toolCategoryId = 1;
        },
        // 编辑按钮操作
        handleUpdate(row) {
            this.title = "编辑";
            this.open = true;
            this.reset();
            this.form.toolCategoryId = row.toolCategoryId;
            this.form.toolCategoryName = row.toolCategoryName;
            this.form.itemUnitId = row.itemUnit.itemUnitId;
            this.form.alarmStockNumber = row.alarmStockNumber;
            this.form.inspectionCycle = row.inspectionCycle;
            this.form.useCycle = row.useCycle;
            this.form.voltageLevel = row.voltageLevel;
            this.form.testVoltage = row.testVoltage;
            this.form.voltageTime = row.voltageTime;
            this.form.toolStatusId = row.toolStatus.toolStatusId;
            this.form.imgUrl = row.imgUrl;
        },
        // 删除按钮
        handleDelete(row) {
            this.deleteHandle((deleteSuccess) => {
                var id = row ? row.toolCategoryId : "";
                obj.baseDeleteToolCategory(id)
                    .then((res) => {
                        deleteSuccess();
                        this.getDataList(1);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            });
        },
        // 取消按钮
        cancel() {
            this.open = false;
        },
        // 提交按钮
        submitForm(forName) {
            this.$refs[forName].validate((valid) => {
                if (valid) {
                    const item = JSON.parse(JSON.stringify(this.form));
                    this.dialogLoading = true;
                    if (this.title === "新增") {
                        obj.baseAddToolCategory(item)
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
                        obj.baseUpdateToolCategory(item)
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
                .baseToolCategoryPageList(item)
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
.el-img {
    position: relative;
    top: 5px;
    display: inline-block;
    overflow: hidden;
    line-height: 50px;
}
.el-img-drawer {
    position: relative;
    display: inline-block;
    overflow: hidden;
}
.dialog-footer {
    display: inline-block;
    width: 100%;
    height: 36px;
    text-align: right;
    padding-right: 10px;
}
::-webkit-scrollbar {
    /* width: 10px; */
    height: 10px;
    background-color: transparent;
}
.add-user .drawer-content {
    width: 90%;
    margin: 0 auto;
    box-sizing: border-box;
    padding: 20px 15px;
    border: 1px solid #e8e8e8;
    max-height: calc(100vh - 108px);
    overflow: scroll;
}
</style>
