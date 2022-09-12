<template>
    <el-form ref="table-form" :model="dataForm" :rules="dataRule" label-width="110px" title="盘点任务">
        <el-row :gutter="22" align="middle" type="block">
            <el-col :span="22">
                <el-form-item label="任务名称" prop="countTaskName">
                    <el-input v-model="dataForm.countTaskName" placeholder="请输入任务名称" maxlength="40" />
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="22">
            <el-col :span="22">
                <el-form-item label="盘点库房" prop="storeHouseId">
                    <el-select v-model="dataForm.storeHouseId" placeholder="请选择盘点库房">
                        <el-option v-for="item in options.stores" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="22">
            <el-col :span="22">
                <el-form-item label="盘点类型" prop="toolCategoryIds">
                    <el-select multiple v-model="dataForm.toolCategoryIds" placeholder="请选择盘点类型">
                        <el-option v-for="item in options.toolCategory" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script>
import * as that from "@/api/system/system-user-api";
import { addCountTask } from "@/api/inventory/inventory";
export default {
    props: ["options"],
    data() {
        return {
            dataForm: {
                countTaskName: "",
                storeHouseId: null,
                toolCategoryIds: [],
            },
            dataRule: {
                countTaskName: [
                    {
                        required: true,
                        message: "任务名称不能为空",
                        trigger: "change",
                    },
                ],
                storeHouseId: [
                    {
                        required: true,
                        message: "盘点库房不能为空",
                        trigger: "blur",
                    },
                ],
                // toolCategoryIds: [
                //     {
                //         required: false,
                //         message: "请输入正确的邮箱",
                //         trigger: "blur",
                //     },
                // ],
            },
        };
    },
    methods: {
        // 表单初始化
        tableFormInit(row) {
            this.dataForm.userId = (row && row.userId) || 0;
            this.$refs["table-form"].resetFields();
        },

        // 表单提交
        tableFormSubmit(func) {
            //校验表单
            this.$refs["table-form"].validate((valid) => {
                if (valid) {
                    addCountTask(this.dataForm)
                        .then((res) => {
                            this.$emit("refreshDataList", 0);
                            func && func("close");
                            this.$message({
                                message: "添加成功",
                                type: "success",
                            });
                        })
                        .catch((error) => {
                            this.$message({
                                message: `${res}`,
                                type: "error",
                            });
                            func && func("close");
                            console.log(error);
                        });
                } else {
                    func && func();
                }
            });
        },
    },
};
</script>

<style></style>
