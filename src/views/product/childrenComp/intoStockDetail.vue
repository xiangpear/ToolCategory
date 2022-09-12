<template>
    <safe-dialog :dialogVisible="detailDialogVisible" @handleClose="handleClose">
        <div slot="top" class="diatop">
            <div class="title">
                <span></span>详情
                <div class="hr"></div>
            </div>
            <div class="titleInfo">
                <span>单据号:{{ detailData.instockIdentifier }}</span>
                <span>操作人:{{ detailData.userName }}</span>
                <span>入库时间:{{ detailData.createdTime }}</span>
            </div>
        </div>
        <div slot="center">
            <div style="margin: 10px 0">
                <el-button
                    type="primary"
                    round
                    size="mini"
                    icon="el-icon-printer"
                    ref="printSome"
                    :disabled="isDsiable"
                    v-if="isShowPrintSome === undefined ? true : isShowPrintSome"
                    @click="PrintSome"
                    >批量打印</el-button
                >
            </div>
            <safe-table
                :props="props"
                :pagination="pagination(detailInfo.total, detailInfo.size, detailInfo.current)"
                :isShowCheck="isShowCheck === undefined ? true : isShowCheck"
                :isShowOperation="false"
                :isShowPrint="isShowPrint === undefined ? true : isShowPrint"
                :tableData="detailInfo.records"
                @handleSelection="handleSelection"
                @handleEdit="handlePrint"
                :handleSizeChange="handleSizeChange"
                :handleCurrentChange="handleCurrentChange"
            >
            </safe-table>
        </div>
    </safe-dialog>
</template>

<script>
import safeDialog from "@/components/dialog/dialog.vue";
import safeTable from "@/components/table/index.vue";
import print from "@/utils/print";

export default {
    components: { safeDialog, safeTable },
    props: ["detailData", "detailDialogVisible", "detailInfo", "handleSizeChange", "handleCurrentChange", "isShowCheck", "isShowPrint", "isShowPrintSome"],
    data() {
        return {
            props: [
                {
                    prop: "storeHouse",
                    lable: "所属仓库",
                    width: "180",
                },
                {
                    prop: "toolCategory.toolCategoryName",
                    lable: "工具器名称",
                    width: "180",
                },
                {
                    prop: "model",
                    lable: "规格型号",
                    width: "180",
                },
                {
                    prop: "toolAlias",
                    lable: "工具器编号",
                    width: "180",
                },
                {
                    prop: "rfid",
                    lable: "工具器编码",
                    width: "240",
                },
                {
                    prop: "lastInspectionTime",
                    lable: "上次实验日期",
                    width: "180",
                },
                {
                    prop: "nextInspectionTime",
                    lable: "下次实验日期",
                    width: "180",
                },
                {
                    prop: "cargoSpaceId",
                    lable: "货位编码",
                    width: "180",
                },
                {
                    prop: "toolAttribute",
                    lable: "属性",
                    width: "180",
                },
                {
                    prop: "toolCategory.itemUnitName",
                    lable: "计量单位",
                    width: "80",
                },
                {
                    prop: "factory",
                    lable: "生产厂家",
                    width: "180",
                },
                {
                    prop: "produceTime",
                    lable: "生产日期",
                    width: "180",
                },
                {
                    prop: "produceNumber",
                    lable: "生产编码",
                    width: "180",
                },
            ],
            selectLength: 0,
            allSelect: [],
        };
    },
    computed: {
        isDsiable() {
            return this.selectLength > 0 ? false : true;
        },
    },
    methods: {
        //点击关闭对话框的按钮
        handleClose() {
            this.$emit("handleClose");
        },
        handleSelection(select) {
            this.allSelect = select;
            this.selectLength = select.length;
        },
        PrintSome() {
            print(this.allSelect);
        },
        handlePrint(row) {
            print(row);
        },
        //请求的分页器
        pagination(total, pageSize, current) {
            return {
                total,
                pageNo: current,
                pageRange: [10, 20, 30, 50, 100],
                pageSize,
            };
        },
    },
};
</script>

<style>
.title {
    position: relative;
    bottom: 20px;
    font-size: 16px;
    width: 100%;
    display: block;
}

.title span {
    padding-left: 10px;
    border-left: 5px solid #78aef9;
}
.hr {
    border-bottom: 1px solid rgb(221, 221, 221);
    margin-top: 10px;
    width: 100%;
}

.titleInfo {
    width: 100%;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
}
</style>
