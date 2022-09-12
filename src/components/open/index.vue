<template>
    <div class="open-container">
        <el-button type="text" @click="dialogTableVisible = true">打开嵌套表格的 Dialog</el-button>
        <el-dialog title="收货地址" :visible.sync="dialogTableVisible">
            <el-table :data="gridData">
                <el-table :data="tableData" border style="width: 100%">
                    <el-table-column fixed prop="date" label="日期" width="150"> </el-table-column>
                    <el-table-column prop="name" label="姓名" width="120"> </el-table-column>
                    <el-table-column prop="province" label="省份" width="120"> </el-table-column>
                    <el-table-column prop="city" label="市区" width="120"> </el-table-column>
                    <el-table-column prop="address" label="地址" width="300"> </el-table-column>
                    <el-table-column prop="zip" label="邮编" width="120"> </el-table-column>
                    <el-table-column fixed="right" label="操作" width="100">
                        <template slot-scope="scope">
                            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                            <el-button type="text" size="small">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
export default {
    components: {},
    data() {
        return {
            //表格数据
            tableData: [
                {
                    date: "2016-05-02",
                    name: "王小虎",
                    province: "上海",
                    city: "普陀区",
                    address: "上海市普陀区金沙江路 1518 弄",
                    zip: 200333,
                },
                {
                    date: "2016-05-04",
                    name: "王小虎",
                    province: "上海",
                    city: "普陀区",
                    address: "上海市普陀区金沙江路 1517 弄",
                    zip: 200333,
                },
                {
                    date: "2016-05-01",
                    name: "王小虎",
                    province: "上海",
                    city: "普陀区",
                    address: "上海市普陀区金沙江路 1519 弄",
                    zip: 200333,
                },
                {
                    date: "2016-05-03",
                    name: "王小虎",
                    province: "上海",
                    city: "普陀区",
                    address: "上海市普陀区金沙江路 1516 弄",
                    zip: 200333,
                },
            ],
            //弹出框是否显示
            dialogTableVisible: false,
        };
    },
    methods: {
        handleClick(row) {
            console.log(row);
        },
    },
};
</script>

<style></style>
