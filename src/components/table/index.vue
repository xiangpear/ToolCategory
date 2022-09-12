<template>
    <makeid-table-box :pagination="pagination" :handleSizeChange="handleSizeChange" :handleCurrentChange="handleCurrentChange">
        <div slot="content">
            <el-table :data="tableData" style="border-radius: 10px" height="100%" v-adaptive="{ type: 'table' }" border @selection-change="handleSelectionChange">
                <!-- 通过设置字段决定它是不是显示 -->
                <el-table-column type="selection" width="55" align="center" min-width="30" v-if="isShowCheck"> </el-table-column>
                <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                <el-table-column :prop="item.prop" :label="item.lable" v-for="(item, index) in props" :key="index" :width="item.width || ''" align="center"> </el-table-column>
                <!-- 操作是需要设置一些字段来表明哪些操作是需要展示，哪些是需要隐藏的 -->
                <el-table-column fixed="right" label="操作" align="center" width="200" v-if="isShowOperation === undefined ? true : isShowOperation">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" icon="el-icon-more" @click="handleDetail(scope.row)">
                            <span>详情</span>
                        </el-button>
                        <el-button type="text" size="small" icon="el-icon-edit" v-if="scope.row.isShowEdit == true" @click="handleEdit(scope.row)">
                            <span>编辑</span>
                        </el-button>
                        <el-button type="text" size="small" icon="el-icon-delete" v-if="scope.row.isShowDelete" @click="handleDelete(scope.row)">
                            <span>报废</span>
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center" width="200" v-if="isShowPrint === undefined ? false : isShowPrint">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" icon="el-icon-printer" @click="handleEdit(scope.row)"> 打印 </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </makeid-table-box>
</template>

<script>
import MakeidTableBox from "@/components/makeid-table/makeid-table-box.vue";
export default {
    props: ["tableData", "props", "isShowCheck", "pagination", "isShowOperation", "handleSizeChange", "handleCurrentChange", "isShowPrint"],
    components: { MakeidTableBox },
    data() {
        return {
            checked: false,
        };
    },
    mounted() {},

    methods: {
        //点击了checkbox框
        handleSelectionChange(select) {
            this.$emit("handleSelection", select);
        },
        handleDetail(row) {
            this.$emit("handleDetail", row);
        },
        handleEdit(row) {
            this.$emit("handleEdit", row);
        },
        handleDelete(row) {
            this.$emit("handleDelete", row);
        },
    },
    watch: {
        tableData(newValue) {
            newValue.forEach((item) => {
                if (item.toolStatus) {
                    item.isShowDelete = true;
                    item.isShowEdit = true;
                    item.isShowDetail = true;
                    if (item.toolStatus.toolStatusName === "送检" || item.toolStatus.toolStatusName === "在用") {
                        item.isShowDelete = false;
                    } else if (item.toolStatus.toolStatusName === "报废") {
                        item.isShowDelete = false;
                        item.isShowEdit = false;
                    }
                }
            });
        },
    },
};
</script>

<style scoped></style>
