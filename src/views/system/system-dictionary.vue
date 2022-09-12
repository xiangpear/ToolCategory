<template>
    <!--系统设置-数据字典-->
    <div id="system-dictionary">
        <!-- 表格条件筛选 -->
        <makeid-table-query :handleQuery="handleQuery" :resetQuery="resetQuery">
            <el-form-item label="字典名称：">
                <el-input v-model="queryForm.name" placeholder="请输入字典名称" clearable size="medium" />
            </el-form-item>
            <el-form-item label="字典类型：">
                <el-input v-model="queryForm.type" placeholder="请输入字典类型" clearable size="medium" />
            </el-form-item>
        </makeid-table-query>

        <!-- 表格容器 -->
        <makeid-table-box :pagination="pagination" :handleSizeChange="handleSizeChange" :handleCurrentChange="handleCurrentChange">
            <div slot="btn">
                <el-button v-hasPermi="['sys:dict:save']" type="primary" icon="el-icon-plus" size="medium" @click="handleAdd">新增字典</el-button>
                <el-button v-hasPermi="['sys:dict:down']" type="warning" icon="el-icon-download" size="medium" @click="handleExport">模板下载</el-button>
                <el-upload
                    v-hasPermi="['sys:dict:upload']"
                    class="upload-button"
                    :action="url"
                    :headers="headers"
                    :file-list="fileList"
                    :show-file-list="false"
                    name="file"
                    :on-progress="uploadProgress"
                    :on-success="uploadSuccess"
                >
                    <el-button v-hasPermi="['sys:dict:upload']" type="warning" icon="el-icon-upload2" size="medium" :loading="uploadLoading">导入</el-button>
                </el-upload>
                <el-button v-hasPermi="['sys:dict:delete']" type="danger" icon="el-icon-delete" size="medium" v-show="dataListSelections.length > 0" @click="handleDelete()">批量删除</el-button>
            </div>
            <div slot="content">
                <!-- 自定义列 -->
                <!-- <makeid-table-select :selectedNum="dataListSelections.length" :table-line="tableLine" @refresh="refreshLine" :clear="clearMul"></makeid-table-select> -->

                <!-- 表格内容 -->
                <el-table ref="table" border v-adaptive="{ type: 'table' }" v-loading="loading" :data="dataList" height="100%" @selection-change="selectionChangeHandle" empty-text="该页面暂无数据">
                    <el-table-column type="selection" width="46" />
                    <el-table-column prop="index" type="index" label="序号" width="50">
                        <template slot-scope="scope">
                            <span>{{ (pagination.pageNo - 1) * pagination.pageSize + scope.$index + 1 }}</span>
                        </template>
                    </el-table-column>

                    <!-- 动态表格列 -->
                    <el-table-column
                        :sortable="item.prop == 'type' || item.prop == 'name'"
                        v-for="item in tableLineSelect"
                        :key="JSON.stringify(item)"
                        :width="item.width"
                        :label="item.label"
                        :prop="item.prop"
                    >
                        <template slot-scope="scope">
                            <span> {{ scope.row[item.prop] ? scope.row[item.prop] : "-" }}</span>
                        </template>
                    </el-table-column>

                    <!-- 更多操作 -->
                    <el-table-column label="操作" align="center" width="230" fixed="right" v-if="checkPermissions(['sys:dict:update', 'sys:dict:delete'])">
                        <template slot-scope="scope">
                            <div class="func-btns">
                                <el-button v-hasPermi="['sys:dict:update']" size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">编辑</el-button>
                                <el-button v-hasPermi="['sys:dict:delete']" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
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

        <!-- 新增/修改 字典 -->
        <div class="f-dialog add-dict">
            <el-dialog v-adaptive="{ type: 'dialog' }" :title="title" :close-on-click-modal="false" :visible.sync="open" custom-class="makeid-table-dialog" width="900px">
                <el-form ref="drawerForm" :model="form" :rules="rules" label-width="130px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="字典码" prop="code">
                                <el-input v-model="form.code" placeholder="请输入字典码如：0" maxlength="20" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="字典名称" prop="name">
                                <el-input v-model="form.name" placeholder="请输入字典名称如：性别" maxlength="20" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="字典类型" prop="type">
                                <el-input v-model="form.type" placeholder="请输入字典类型如：sex" maxlength="20" />
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="12">
                            <el-form-item label="字典值" prop="value">
                                <el-input v-model="form.value" placeholder="请输入字典值如：男/女" maxlength="20" />
                            </el-form-item>
                        </el-col> -->
                        <el-col :span="12">
                            <el-form-item label="备注" prop="remark">
                                <el-input v-model="form.remark" placeholder="请输入备注" maxlength="250" />
                            </el-form-item>
                        </el-col>
                    </el-row>
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
import * as that from "@/api/system/system-dictionary-api";
import { downloadFile } from "@/utils/index";
import { getToken } from "@/utils/auth";
import { backendIP } from "@/utils/request.js";
import MakeidTableMixin from "@/components/makeid-table/mixin/makeid-table-mixin";

export default {
    name: "system-dictionary",
    mixins: [MakeidTableMixin],
    data() {
        return {
            // 确认loading
            dialogLoading: false,

            // 上传loading
            uploadLoading: false,

            // 所有的角色
            roleListAll: [],

            // 弹出层标题
            title: "新增",

            // 是否显示弹出层
            open: false,

            // 表单参数
            form: {
                id: "",
                code: "",
                name: "",
                type: "",
                // value: "",
                remark: "",
            },

            // 表单校验
            rules: {
                code: [
                    {
                        required: true,
                        message: "字典码不能为空",
                        trigger: "blur",
                    },
                ],
                name: [
                    {
                        required: true,
                        message: "字典名称不能为空",
                        trigger: "blur",
                    },
                ],
                type: [
                    {
                        required: true,
                        message: "字典类型不能为空",
                        trigger: "blur",
                    },
                ],
                // value: [
                //     {
                //         required: true,
                //         message: "字典值不能为空",
                //         trigger: "blur",
                //     },
                // ],
            },

            // 字典上传
            url: backendIP + "/sysApi/dict/upload",

            // 字典上传headers
            headers: {
                token: getToken(),
            },

            // 上传文件列表
            fileList: [],

            // 条件筛选
            queryForm: {
                name: "",
                type: "",
            },

            // 全部表格字段
            tableLine: [
                { label: "字典码", prop: "code" },
                { label: "字典类型", prop: "type" },
                { label: "字典名称", prop: "name" },
                // { label: "字典值", prop: "value" },
                { label: "备注", prop: "remark" },
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
                var id = row ? row.dictId : "";
                var ids = id
                    ? [id]
                    : this.dataListSelections.map((item) => {
                          return item.dictId;
                      });
                that.sysDictDelete(ids)
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
                param: {
                    name: this.queryForm.name || void 0,
                    type: this.queryForm.type || void 0,
                },
            };
            await that
                .sysDictList(item)
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
            this.title = "编辑";
            this.open = true;
            this.reset();
            this.form = Object.assign({}, row);
            this.form.status = this.form.status + "";
        },

        // 提交按钮
        submitForm(forName) {
            this.$refs[forName].validate((valid) => {
                if (valid) {
                    this.dialogLoading = true;
                    if (this.title === "新增") {
                        that.sysDictSave(this.form)
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
                        that.sysDictUpdate(this.form)
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

        // 模板导出
        handleExport() {
            that.sysDictDownload()
                .then((res) => {
                    if (res) {
                        downloadFile(res, "", "application/vnd.ms-excel");
                    } else {
                        this.msgWarning("数据有误");
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        },

        uploadProgress() {
            console.log("上传中");
            this.uploadLoading = true;
        },
        // 上传成功
        uploadSuccess(response, file, fileList) {
            if (response.code === 200) {
                this.msgSuccess("上传成功");
                this.getDataList(1);
            } else {
                this.msgWarning(response.message);
            }
            this.fileList = [];
            this.uploadLoading = false;
        },
    },
};
</script>
<style lang="scss"></style>
