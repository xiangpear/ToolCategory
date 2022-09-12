<template>
    <div id="base-unit">
        <!-- 表格条件筛选 -->
        <makeid-table-query :handleQuery="handleQuery" :resetQuery="resetQuery">
            <el-form-item label="计量单位名称:">
                <el-input v-model="queryForm.itemUnitName" placeholder="计量单位名称" clearable size="mini" />
            </el-form-item>
            <div class="query-btn" :class="isExpand" style="margin: 15px 190px">
                <el-button type="primary" icon="el-icon-plus" size="mini" round @click="handleAdd">新增计量单位</el-button>
                <el-button type="primary" icon="el-icon-download" size="mini" round @click="templateDownload">模板下载</el-button>
                <!-- <el-upload
                    ref="upload"
                    class="upload-button"
                    :action="url"
                    :show-file-list="false"
                    :limit="1"
                    :on-progress="uploadProgress"
                    :on-success="uploadSuccess"
                    :style="[{ display: 'inline-block', marginLeft: '10px' }]"
                >
                    <el-button type="primary" icon="el-icon-upload" size="mini" round="true" :loading="uploadLoading">导入数据</el-button>
                </el-upload> -->
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
                            <span v-if="item.prop == 'createdTime'"> {{ scope.row.createdTime | timeFormate }}</span>
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

        <!-- 新增/修改 计量单位 -->
        <div class="f-dialog add-user">
            <el-drawer :title="title" :close-on-click-modal="false" :visible.sync="open" size="700px">
                <el-form
                    ref="drawerForm"
                    :model="form"
                    :rules="rules"
                    label-width="120px"
                    :style="[{ width: '85%' }, { margin: '0 auto' }, { border: '1px solid #ebeef5' }, { padding: '30px 20px 20px 20px' }]"
                >
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="计量单位" prop="itemUnitName">
                                <el-input v-model="form.itemUnitName" maxlength="11" placeholder="请输入计量单位名称" size="small" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <span class="dialog-footer">
                                <el-button size="medium" type="default" @click="cancel">取 消</el-button>
                                <el-button size="medium" type="primary" @click="submitForm('drawerForm')" :loading="dialogLoading">确 认 </el-button>
                            </span>
                        </el-col>
                    </el-row>
                </el-form>
            </el-drawer>
        </div>
    </div>
</template>

<script>
import * as obj from "@/api/base/base-unit-api";
import { dateFormatIE, downloadFile } from "@/utils/index";
import MakeidTableMixin from "@/components/makeid-table/mixin/makeid-table-mixin";
import { backendIP } from "@/utils/request";
export default {
    name: "base-unit",
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

            // loading标识
            dialogLoading: false,

            // 上传地址
            // url: backendIP + "/itemUnit/dataimport",

            // 上传状态
            // uploadLoading: false,

            isExpand: "",

            // 表单参数
            form: {
                itemUnitId: "",
                itemUnitName: "",
            },

            // 表单校验
            rules: {
                itemUnitName: [{ required: true, message: "计量单位名称不能为空", trigger: "blur" }],
            },

            // 表格字段
            tableLine: [
                {
                    label: "计量单位名称名称",
                    prop: "itemUnitName",
                    width: "725",
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
    methods: {
        // 重置查询
        resetQuery() {
            this.queryForm = this.$options.data().queryForm;
            this.getDataList(1);
        },
        // 表单重置
        reset() {
            this.form = this.$options.data().form;
            setTimeout(() => {
                this.$refs.drawerForm.clearValidate();
            }, 0);
        },
        // 模板下载
        templateDownload() {
            obj.baseUnitTemplateDownload().then((res) => {
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
                obj.baseUnitUpload(form).then((res) => {
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
        // 上传中
        // uploadProgress() {
        //     this.uploadLoading = true;
        // },
        // 上传成功
        // uploadSuccess(response, file, fileList) {
        //     if (response.code === 200) {
        //         this.msgSuccess("上传成功");
        //         this.getDataList(1);
        //     } else {
        //         this.msgWarning(response.message);
        //     }
        //     this.uploadLoading = false;
        // },
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
                .baseUnitPageList(item)
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
        // 新增计量单位按钮
        handleAdd() {
            this.title = "新增";
            this.open = true;
            this.reset();
            this.form.itemUnitId = 1;
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
            this.form.itemUnitId = row.itemUnitId;
            this.form.itemUnitName = row.itemUnitName;
        },
        // 删除按钮
        handleDelete(row) {
            this.deleteHandle((deleteSuccess) => {
                var id = row ? row.itemUnitId : "";
                obj.baseDeleteUnit(id)
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
                        obj.baseAddUnit(item)
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
                        obj.baseUpdateUnit(item)
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
