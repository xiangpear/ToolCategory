<template>&&&makeid&&&
    <div>
        <el-form ref="table-form" label-position="right" size="medium" :model="dataForm" :rules="handleDetailStatus ? {} : dataRule" label-width="120px">
            <el-row :gutter="0">
                <el-col class="input-normal class_name" :span="12">
                    <el-form-item v-if="true" label="用户名:" prop="name">
                        <el-input
                            class="input-word-padding"
                            v-model="dataForm.name"
                            :type="'text'"
                            placeholder="请输入用户名"
                            :clearable="false"
                            :disabled="handleDetailStatus || false"
                            :show-word-limit="true"
                            :maxlength="255"
                        ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>&&&makeid&&&

<script>
import axios from "axios";
import { backendIP } from "@/utils/request";
import * as util from "@/utils/index";
import { getToken } from "@/utils/auth";
import md5 from "js-md5";

import * as YemianController from "@/api/fenzu1/yemian/YemianController.js";

export default {
    name: "yemian-table-form",
    components: {},
    data() {
        return {
            // 动态页面id
            pageId: "",

            // 是否是详情功能
            handleDetailStatus: false,

            // 表单数据
            dataForm: {
                name: "",
            },

            // 表单规则
            dataRule: {
                name: [{ required: true, message: "用户名不能为空", trigger: "change" }],
            },
        };
    },
    watch: {},
    created() {
        this.pageId = this.$route.path.substring(this.$route.path.lastIndexOf("/") + 1);
    },
    mounted() {},
    methods: {
        // 表单初始化
        tableFormInit(row) {
            console.log(row);
            this.dataForm = this.$options.data().dataForm;
            this.handleDetailStatus = (row && row.handleDetailStatus) || false;

            this.dataForm.yemianId = (row && row.yemianId) || 0;

            this.$nextTick(() => {
                this.$refs["table-form"].resetFields();

                if (this.dataForm.yemianId) {
                    // 调用获取详情函数
                    YemianController.yemianInfo({ id: this.dataForm.yemianId })
                        .then((res) => {
                            Object.assign(this.dataForm, res);

                            util.handleDataForm(this.dataForm);
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                } else {
                }
            });
        },

        // 表单提交
        tableFormSubmit(func) {
            this.$refs["table-form"].validate((valid_table_form) => {
                if (valid_table_form) {
                    try {
                        var dataFormTemp = Object.assign({}, this.dataForm, {
                            createdBy: null,
                            createdTime: null,
                            updatedBy: null,
                            updatedTime: null,
                        });

                        // 数组类型字段转字符串
                        util.dataFormArrayToString(dataFormTemp);

                        if (!this.dataForm.yemianId) {
                            // 新增功能
                            YemianController.yemianSave(dataFormTemp)
                                .then((res) => {
                                    this.msgSuccess("新增成功");
                                    this.$emit("refreshDataList");
                                    func && func("close");
                                })
                                .catch((error) => {
                                    console.log(error);
                                    func && func();
                                });
                        } else {
                            // 编辑功能
                            YemianController.yemianUpdate(dataFormTemp)
                                .then((res) => {
                                    this.msgSuccess("编辑成功");
                                    this.$emit("refreshDataList");
                                    func && func("close");
                                })
                                .catch((error) => {
                                    console.log(error);
                                    func && func();
                                });
                        }
                    } catch (error) {
                        func && func();
                    }
                } else {
                    func & func();
                }
            });
        },
    },
};
</script>
<style lang="scss"></style>
