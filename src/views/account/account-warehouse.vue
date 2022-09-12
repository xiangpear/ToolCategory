<template>
    <account-template :tableLine="tableLine" name="warehouse">
        <template v-slot:query="{ queryForm }">
            <el-form-item label="工器具名称：">
                <el-select v-model="queryForm.toolCategoryId" placeholder="工器具名称">
                    <el-option v-for="item in options.toolCategory" :key="JSON.stringify(item)" :label="item.label" :value="item.value"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="规格型号：">
                <el-input v-model="queryForm.model" placeholder="规格型号" clearable />
            </el-form-item>
            <el-form-item label="工器具编码：">
                <el-input v-model="queryForm.rfid" placeholder="工器具编码" clearable />
            </el-form-item>
            <el-form-item label="工器具编号：">
                <el-input v-model="queryForm.toolAlias" placeholder="工器具编号" clearable />
            </el-form-item>
            <el-form-item label="生产厂家：">
                <el-input v-model="queryForm.factory" placeholder="生产厂家" clearable />
            </el-form-item>
            <el-form-item label="下次实验日期：">
                <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="queryForm.nextInspectionTime"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                />
            </el-form-item>
            <el-form-item label="入库时间">
                <el-date-picker :default-time="['00:00:00', '23:59:59']" v-model="queryForm.ioTime" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" />
            </el-form-item>

            <el-form-item label="所属仓库：">
                <el-select v-model="queryForm.toolCategoryId" placeholder="所属仓库">
                    <el-option v-for="item in options.stores" :key="JSON.stringify(item)" :label="item.label" :value="item.value"> </el-option>
                </el-select>
            </el-form-item>
        </template>
    </account-template>
</template>

<script>
import { accountData } from "../../../public/formHeaderConfig";
import AccountTemplate from "./components/account-template.vue";
import * as that from "@/api/account/account";

export default {
    name: "",
    components: { AccountTemplate },
    data() {
        this.tableLine = accountData.tableLine_warehouse;
        return {
            options: {
                toolCategory: [],
                stores: [],
            },
        };
    },
    mounted() {
        this.getSelectData();
    },
    methods: {
        getSelectData() {
            //获取仓库数据
            that.getStores()
                .then((res) => {
                    res.forEach((item) => {
                        let store = {};
                        store.value = item.storehouseId;
                        store.label = item.storehouseName;
                        this.options.stores.push(store);
                    });
                })
                .catch((error) => {
                    this.msgError(error);
                });
            //获取盘点类型数据
            that.getToolCategory()
                .then((res) => {
                    console.log("盘点类型", res);
                    res?.forEach((item) => {
                        let toolCategory = {};
                        toolCategory.value = item.toolCategoryId;
                        toolCategory.label = item.toolCategoryName;
                        this.options.toolCategory.push(toolCategory);
                    });
                })
                .catch((error) => {
                    this.msgError(error);
                });
        },
    },
};
</script>

<style lang="scss" scoped></style>
