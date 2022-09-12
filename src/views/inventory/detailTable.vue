<template>
    <div>
        <div class="top">
            <div class="top-item">单据号：{{ countTask.countTaskIdentifier }}</div>
            <div class="top-item">操作人：{{ countTask.operationUserName }}</div>
            <div class="top-item">盘点时间：{{ countTask.createdTime }}</div>
        </div>
        <makeid-table-box :pagination="pagination" :handleSizeChange="handleSizeChange" :handleCurrentChange="handleCurrentChange">
            <div slot="btn"></div>
            <div slot="content">
                <el-table
                    :data="detailTableList"
                    width="80%"
                    highlight-current-row
                    :header-cell-style="{ background: 'rgb(247, 249, 251)', color: '#000' }"
                    ref="detailTable"
                    border
                    v-loading="loading"
                    style="height: 450px"
                >
                    <el-table-column prop="index" type="index" label="序号" width="50">
                        <template slot-scope="scope">
                            <span>{{ (pagination.pageNo - 1) * pagination.pageSize + scope.$index + 1 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column v-for="col in data" :key="JSON.stringify(col)" :prop="col.prop" :label="col.label" :width="col.width" :align="col.align"></el-table-column>
                    <!-- 更多操作 -->
                    <el-table-column fixed="right" label="操作" width="140" header-align="center" align="center">
                        <template slot-scope="scope">
                            <el-button
                                type="text"
                                :disabled="scope.row.countTaskToolResult === 1 || scope.row.countTaskToolResult === '正常'"
                                icon="el-icon-printer"
                                size="small"
                                @click="collection(scope.row)"
                                >补录</el-button
                            >
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </makeid-table-box>
    </div>
</template>

<script>
import { getDetailList, collectionTool } from "@/api/inventory/inventory";
import { unfold } from "@/utils";
export default {
    name: "",
    components: {},
    props: {
        countTask: Object,
        data: {
            type: Array,
            require: true,
            default: function () {
                return [];
            },
        },
    },

    data() {
        return {
            // 分页
            pagination: {
                pageNo: 1,
                pageSize: 10,
                total: 0,
                pageRange: [10, 20, 30, 50, 100],
            },
            loading: true,
            detailTableList: [],
            // 是否执行mixin中mounted初始化的getDataList获取列表函数
            mixinMounted: true,
        };
    },
    mounted() {
        this.mixinMounted ? this.getDataList?.(1) : "";
    },
    computed: {},
    destroyed() {},
    methods: {
        //补录
        collection(row) {
            let param = {};
            param.countTaskId = this.countTask.countTaskId;
            param.countTaskResultId = row.countTaskResultId;

            this.$confirm(`确认补录该物资，并将物资盘点结果修改为正常？`, "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    collectionTool(param)
                        .then((res) => {
                            row.countTaskToolResult = 1;
                            row.countTaskResultWay = 1;
                        })
                        .catch((error) => {
                            this.msgError(error);
                        });
                })
                .catch((error) => {
                    console.log("取消");
                });
        },
        // 分页大小选择
        handleSizeChange(val) {
            this.pagination.pageSize = val;
            this.getDataList(1);
        },

        // 分页页面跳转
        handleCurrentChange(val) {
            this.pagination.pageNo = val;
            this.getDataList(val);
        },
        //调整数据，展示正确形式
        adjustDataList() {
            this.detailTableList.map((item) => {
                // this.$set(item, "countTaskToolResultString", item.countTaskToolResult === 1 ? "正常" : "未盘");
                // this.$set(item, "countTaskResultWayString", item.countTaskResultWay === 1 ? "手动" : "自动");
                Object.defineProperties(item, {
                    countTaskToolResultString: {
                        get() {
                            return item.countTaskToolResult === 1 ? "正常" : "未盘";
                        },
                    },
                    countTaskResultWayString: {
                        get() {
                            return item.countTaskResultWay === 1 ? "手动" : "自动";
                        },
                    },
                });
                console.log(item);
            });
        },
        // 获取数据列表
        getDataList(pageNo) {
            this.loading = true;
            this.pagination.pageNo = pageNo; // this.pagination.pageNo;
            const item = {
                pageNo: this.pagination.pageNo,
                pageSize: this.pagination.pageSize,
                countTaskId: this.countTask.countTaskId,
            };
            getDetailList(item)
                .then((res) => {
                    console.log("获取列表", res);
                    this.loading = false;
                    this.pagination.total = res.total;
                    this.pagination.pageNo = res.current;
                    this.pagination.pageSize = res.size;
                    this.detailTableList = [];
                    res.records.forEach((item) => {
                        this.detailTableList.push(unfold(item));
                    });
                    this.adjustDataList();
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
    },
};
</script>

<style lang="scss" scoped>
.top {
    display: flex;
    justify-content: space-between;
    font-size: 15px;
    margin-bottom: 10px;
    .top-item {
    }
}
</style>
