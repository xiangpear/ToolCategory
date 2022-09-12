<template>
    <el-form ref="table-form" size="medium" :model="dataForm" :rules="dataRule" label-width="120px">
        <el-row :gutter="10">
            <el-col class="input-normal class_title" :span="12">
                <el-form-item label="标题:" prop="title">
                    <el-input v-model="dataForm.title" type="text" placeholder="请输入" :clearable="false" :disabled="false" :show-word-limit="false" :maxlength="30"></el-input>
                </el-form-item>
            </el-col>
            <el-col class="input-normal class_reason" :span="12">
                <el-form-item label="原因:" prop="reason">
                    <el-input v-model="dataForm.reason" type="text" placeholder="请输入" :clearable="false" :disabled="false" :show-word-limit="false" :maxlength="30"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script>
import * as BizLeaveController from "@/api/process/process-leave-api";

export default {
    name: "",
    components: {},
    data() {
        return {
            dataForm: {
                title: "",
                reason: "",
                type: 0,
            },
            dataRule: {
                title: [
                    {
                        required: true,
                        message: "标题不能为空",
                        trigger: "blur",
                    },
                ],
                reason: [
                    {
                        required: true,
                        message: "原因不能为空",
                        trigger: "change",
                    },
                ],
            },
        };
    },
    created() {},
    mounted() {},
    methods: {
        // 初始化
        tableFormInit(row) {
            this.dataForm.id = (row && row.id) || 0;
            this.$nextTick(() => {
                this.$refs["table-form"].resetFields();
                if (this.dataForm.id) {
                    // 调用获取详情函数
                    // 测试---
                    // return;
                    // 测试---
                    BizLeaveController.bizLeaveInfo({ id: this.dataForm.id })
                        .then((res) => {
                            Object.assign(this.dataForm, res);
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
            this.$refs["table-form"].validate((valid) => {
                if (valid) {
                    var dataFormTemp = this.dataForm;

                    if (!this.dataForm.id) {
                        // 新增功能
                        BizLeaveController.bizLeaveSave(dataFormTemp)
                            .then((res) => {
                                this.msgSuccess("新增成功");
                                this.$emit("refreshDataList", 1);
                                func && func("close");
                            })
                            .catch((error) => {
                                console.log(error);
                                func && func();
                            });
                    } else {
                        // 编辑功能
                        BizLeaveController.bizLeaveUpdate(dataFormTemp)
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
                } else {
                    func && func();
                }
            });
        },
    },
};
</script>
<style lang="scss"></style>
