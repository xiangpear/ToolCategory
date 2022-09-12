<template>
    <div id="intostork">
        <div class="select">
            <el-form :model="formInline" :inline="true">
                <el-form-item label="单据号">
                    <el-input v-model="formInline.instockIdentifier" placeholder="单据号" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="操作人">
                    <el-input v-model="formInline.userName" placeholder="操作人" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="所属仓库">
                    <el-select v-model="formInline.instockStorehouseId" placeholder="所属仓库" size="mini">
                        <el-option :label="item.storehouseName" :value="item.storehouseId" v-for="item in storehouseList" :key="item.storehouseId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="归还时间" prop="rangeDate">
                    <el-date-picker
                        :default-time="['00:00:00', '23:59:59']"
                        v-model="formInline.selecteTime"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        class="el-date-picker"
                        size="mini"
                        @change="intoStockTime"
                    />
                </el-form-item>
                <el-form-item class="operation">
                    <el-button type="primary" round size="small" icon="el-icon-search" @click="conditionSelece">查询</el-button>
                    <el-button round size="small" icon="el-icon-refresh-left" @click="resetHandle">重置</el-button>
                    <!-- <el-button type="primary" round>导出</el-button> -->
                </el-form-item>
            </el-form>
        </div>
        <safe-table
            :props="props"
            :isShowCheck="false"
            :pagination="pagination(returnInfo.total, returnInfo.size, returnInfo.current)"
            :tableData="returnInfo.records"
            @handleDetail="handleDetail"
            :handleSizeChange="handleSizeChange"
            :handleCurrentChange="handleCurrentChange"
        ></safe-table>

        <into-stock-detail
            :detailData="detailData"
            :isShowCheck="false"
            :isShowPrint="false"
            :isShowPrintSome="false"
            :detailDialogVisible="detailDialogVisible"
            @handleClose="handleClose"
            :detailInfo="returnDetailInfo"
            :handleSizeChange="handleSizeChangeStockInfo"
            :handleCurrentChange="handleCurrentChangeStockInfo"
        ></into-stock-detail>
    </div>
</template>

<script>
import safeTable from "@/components/table/index.vue";
// import safeDialog from "@/components/dialog/dialog.vue";
import { getReturnIndex, getReturnDetailInfo } from "@/api/product/return.js";
import selectMixin from "./mixin/select.js";
import storeHouse from "./mixin/getStorehouseList";
// import intoStockDetail from "./childrenComp/intoStockDetail.vue";
import IntoStockDetail from "./childrenComp/intoStockDetail.vue";

export default {
    components: { safeTable, IntoStockDetail },
    data() {
        return {
            requestParam: {
                pageSize: 10,
                pageNo: 1,
            },
            formInline: {
                revertIdentifier: undefined,
                userName: undefined,
                storehouseId: undefined,
                selecteTime: undefined,
                startTime: undefined,
                endTime: undefined,
            },
            props: [
                {
                    lable: "单据号",
                    prop: "revertIdentifier",
                },
                {
                    lable: "操作人",
                    prop: "userName",
                },
                {
                    lable: "所属仓库",
                    prop: "storehouseName",
                },
                {
                    lable: "归还时间",
                    prop: "createdTime",
                },
            ],
            returnInfo: {},
            detailDialogVisible: false,
            detailData: {},
            detailParams: { pageSize: 10, pageNo: 1, id: null },
            returnDetailInfo: {},
        };
    },

    created() {
        this._getReturnIndex();
    },
    mixins: [selectMixin, storeHouse],
    methods: {
        //用于请求入库的首页的数据
        _getReturnIndex() {
            this.requestParam.param = this.formInline;
            getReturnIndex(this.requestParam)
                .then((res) => {
                    this.returnInfo = res;
                })
                .catch((err) => {
                    this.$message.error("系统错误，请稍后重试！");
                });
        },

        //用于请求详情的表格数据
        _getReturnDetailInfo() {
            getReturnDetailInfo(this.detailParams)
                .then((res) => {
                    this.returnDetailInfo = res;
                })
                .catch((err) => {
                    console.log(err);
                });
        },

        //调用请求的函数
        callRequestfunc() {
            this._getReturnIndex();
        },

        //监听入库时间选择的改变
        intoStockTime() {
            this.formInline.startTime = this.formInline.selecteTime[0];
            this.formInline.endTime = this.formInline.selecteTime[1];
        },

        //分页器
        //分页器的每页的条数改变时触发
        //点击详情
        handleDetail(row) {
            this.detailDialogVisible = true;
            this.detailData = row;
            this.detailParams.id = +row.receiveId;
            this._getReturnDetailInfo();
        },
        handleClose() {
            this.detailDialogVisible = false;
        },

        //分页
        pagination(total, pageSize, current) {
            return {
                total,
                pageNo: current,
                pageRange: [10, 20, 30, 50, 100],
                pageSize,
            };
        },

        //分页器改变
        //分页器的每页的条数改变时触发
        handleSizeChange(size) {
            let that = this;
            that.requestParam.pageSize = size;
            that._getReturnIndex();
        },
        //stock分页器的当前页改变时触发
        handleCurrentChange(page) {
            let that = this;
            that.requestParam.pageNo = page;
            that._getReturnIndex();
        },

        //stock详情页的分页器
        handleSizeChangeStockInfo(size) {
            this.detailParams.pageSize = size;
            this._getReturnDetailInfo();
        },

        handleCurrentChangeStockInfo(page) {
            this.detailParams.pageNo = page;
            this._getReturnDetailInfo();
        },
    },
};
</script>

<style scoped>
#intostork {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #fff;
}

div {
    background-color: #fff;
}
.operation {
    float: right;
}
.el-form {
    overflow: hidden;
    position: relative;
}
.el-form-item {
    margin-bottom: 3px;
}

/* dialog */
.select {
    padding: 0 20px;
}
.diatop {
    display: flex;
    justify-content: space-between;
    position: relative;
    bottom: 20px;
    flex-flow: wrap;
}
.el-button--mini {
    position: relative;
    bottom: 12px;
}

/* 弹出框 */
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
