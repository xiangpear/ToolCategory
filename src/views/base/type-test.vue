<template>
    <el-select v-model.number="form.id" @change="getList($event)" placeholder="请选择">
        <el-option v-for="item in options" :key="item.id" :label="item.label" :value="item.id"> </el-option>
    </el-select>
    <!-- <el-select v-model="form.id">
        <el-option v-for="item in options" :key="item.id" :label="item.label" :value="item.label"></el-option>
    </el-select> -->
    <!-- <el-time-picker
        v-model="form.autoTime"
        :picker-options="{
            selectableRange: '00:00:00 - 23:59:59',
        }"
        placeholder="选择盘点时间"
        size="small"
        clearable
        value-format="HH:mm:ss"
        @change="changeTime($event)"
    >
    </el-time-picker> -->
    <!-- <el-input v-model="form.aa" @change="changeA($event)"></el-input> -->
</template>

<script>
export default {
    data() {
        return {
            itemUnitList: [
                {
                    itemUnitId: 1,
                    itemUnitName: "aaa",
                },
                {
                    itemUnitId: 2,
                    itemUnitName: "bbb",
                },
            ],
            options: [
                {
                    id: 1,
                    label: "一楼仓库",
                },
                {
                    id: 2,
                    label: "二楼仓库",
                },
                {
                    id: 3,
                    label: "三楼仓库",
                },
            ],
            form: {
                id: "",
                autoTime: "",
                aa: "",
            },
            form1: {
                autoTime: "",
            },
            formA: {
                aa: "",
            },
            dataList: {
                id: "2",
                autoTime: "01-12-10",
                aa: 1,
            },
        };
    },
    methods: {
        getList(val) {
            console.log(val);
        },
        changeTime(time) {
            this.form1.autoTime = time.replaceAll(":", "-");
        },
        changeA(val) {
            this.formA.aa = this.dataList.aa;
            console.log(this.formA);
        },
    },
    mounted() {
        this.form.aa = this.dataList.aa;
        this.form.autoTime = this.dataList.autoTime.replaceAll("-", ":");
    },
};
</script>

<style></style>
