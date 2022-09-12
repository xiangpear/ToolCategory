<template>
    <div id="template-table">
        <!-- 表格条件筛选 -->
        <makeid-table-query-new :handleQuery="handleQuery" :resetQuery="resetQuery">
            <slot name="query" :queryForm="queryForm"></slot>
        </makeid-table-query-new>

        <!-- 表格容器 -->
        <makeid-table-box :pagination="pagination" :handleSizeChange="handleSizeChange" :handleCurrentChange="handleCurrentChange">
            <div slot="btn"></div>
            <div slot="content">
                <!-- 表格内容 -->
                <el-table
                    border
                    ref="table"
                    v-adaptive="{ type: 'table' }"
                    v-loading="loading"
                    :data="dataList"
                    height="100%"
                    highlight-current-row
                    :header-cell-style="{ background: 'rgb(247, 249, 251)', color: '#000' }"
                    @selection-change="selectionChangeHandle"
                >
                    <el-table-column prop="index" type="index" label="序号" width="50">
                        <template slot-scope="scope">
                            <span>{{ (pagination.pageNo - 1) * pagination.pageSize + scope.$index + 1 }}</span>
                        </template>
                    </el-table-column>

                    <!-- 动态表格列 -->
                    <el-table-column v-for="item in tableLine" :key="JSON.stringify(item)" :width="item.width" :label="item.label" :prop="item.prop" :align="item.align"> </el-table-column>
                </el-table>
            </div>
        </makeid-table-box>
    </div>
</template>

<script>
import MakeidTableMixin from "@/components/makeid-table/mixin/makeid-table-mixin";
import MakeidTableQueryNew from "@/components/makeid-table/makeid-table-query-new.vue";
import { clone, unfold } from "@/utils";
let getTableList = null;
export default {
    name: "account-template",
    components: {
        MakeidTableQueryNew,
    },
    mixins: [MakeidTableMixin],
    props: {
        tableLine: Array,
        name: String,
    },
    data() {
        // this.tableLine = accountData.tableLine;
        return {
            // 是否执行mixin中mounted初始化的getDataList获取列表函数
            mixinMounted: true,
            queryForm: {
                nextInspectionTime: [],
                ioTime: [],
            },
            tableLineSelect: [],
        };
    },
    created() {},
    mounted() {},
    computed: {
        //生成请求参数，将开始结束时间拆分
        queryParam() {
            let param = clone(this.queryForm);
            param.nextInspectionStartTime = param.nextInspectionTime[0];
            param.nextInspectionEndTime = param.nextInspectionTime[1];
            param.startTime = param.ioTime[0];
            param.endTime = param.ioTime[1];
            delete param.nextInspectionTime;
            delete param.ioTime;
            return param;
        },
    },
    methods: {
        // 获取数据列表
        async getDataList(pageNo) {
            this.loading = true;
            this.pagination.pageNo = pageNo || this.pagination.pageNo;
            const item = {
                pageNo: this.pagination.pageNo,
                pageSize: this.pagination.pageSize,
                param: this.queryParam,
            };
            //查询功能
            let res = await import("@/api/account/account");
            getTableList = res[this.name];
            await getTableList(item)
                .then((res) => {
                    this.loading = false;
                    this.pagination.total = res.total;
                    this.pagination.pageNo = res.current;
                    this.pagination.pageSize = res.size;
                    this.dataList = [];
                    res.records.forEach((item) => {
                        this.dataList.push(unfold(item));
                    });
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

<style lang="scss"></style>
