<template>
    <!-- 流程设计 -->
    <div id="system-process">
        <div class="mainView">
            <!-- 表格条件筛选 -->
            <makeid-table-query :handleQuery="handleQuery" :resetQuery="resetQuery">
                <el-form-item label="流程名称：">
                    <el-input v-model="queryForm.name" placeholder="请输入" clearable size="medium" />
                </el-form-item>
            </makeid-table-query>

            <!-- 表格容器 -->
            <makeid-table-box :pagination="pagination" :handleSizeChange="handleSizeChange" :handleCurrentChange="handleCurrentChange">
                <div slot="btn">
                    <el-button v-hasPermi="['process:designer:save']" type="primary" size="medium" icon="el-icon-plus" @click="addProcess()">新增</el-button>
                    <el-button v-hasPermi="['process:designer:delete']" type="danger" size="medium" icon="el-icon-delete" v-show="dataListSelections.length > 0" @click="handleDelete"
                        >批量删除</el-button
                    >
                </div>
                <div slot="content">
                    <!-- 自定义列 -->
                    <!-- <makeid-table-select :selectedNum="dataListSelections.length" :table-line="tableLine" @refresh="refreshLine" :clear="clearMul"></makeid-table-select> -->

                    <!-- 表格内容 -->
                    <el-table ref="table" border v-adaptive="{ type: 'table' }" v-loading="loading" :data="dataList" height="100%" @selection-change="selectionChangeHandle">
                        <el-table-column type="selection" width="46" />
                        <el-table-column prop="index" type="index" label="序号" width="50">
                            <template slot-scope="scope">
                                <span>{{ (pagination.pageNo - 1) * pagination.pageSize + scope.$index + 1 }}</span>
                            </template>
                        </el-table-column>

                        <!-- 动态表格列 -->
                        <el-table-column v-for="item in tableLineSelect" :key="JSON.stringify(item)" :width="item.width" :label="item.label" :prop="item.prop" :align="item.align">
                            <template slot-scope="scope">
                                <span> {{ scope.row[item.prop] ? scope.row[item.prop] : "-" }}</span>
                            </template>
                        </el-table-column>

                        <!-- 更多操作 -->
                        <el-table-column
                            label="操作"
                            align="center"
                            width="230"
                            fixed="right"
                            v-if="checkPermissions(['process:designer:update', 'process:designer:deployment', 'process:designer:delete', 'process:definition:list'])"
                        >
                            <template slot-scope="scope">
                                <div class="func-btns">
                                    <el-button v-hasPermi="['process:designer:update']" size="mini" type="text" icon="el-icon-edit" @click="addProcess(scope.row)">编辑</el-button>
                                    <el-button v-hasPermi="['process:designer:deployment']" size="mini" type="text" icon="el-icon-data-line" @click="startProcess(scope.row.designerId)"
                                        >发布</el-button
                                    >
                                    <el-popover title="更多">
                                        <div class="more-func-btns">
                                            <el-button v-hasPermi="['process:definition:list']" size="mini" type="text" icon="el-icon-location-outline" @click="handleDefinition(scope.row)"
                                                >发布记录</el-button
                                            >
                                            <el-button size="mini" type="text" icon="el-icon-view" @click="previewProcess(scope.row.designerId)">预览</el-button>
                                            <el-button v-hasPermi="['process:designer:delete']" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
                                        </div>
                                        <el-button slot="reference" size="mini" type="text" icon="el-icon-more">更多</el-button>
                                    </el-popover>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </makeid-table-box>
        </div>

        <!-- 流程设计界面 -->
        <div v-if="mainviewShow" class="process-box">
            <processDesigner ref="processRef" @backList="backList" @refreshDataList="getDataList" />
        </div>

        <!-- 预览流程图界面 -->
        <el-dialog custom-class="makeid-table-dialog" v-adaptive="{ type: 'dialog' }" title="预览" width="70%" :visible.sync="previewModelVisible" destroy-on-close append-to-body>
            <div v-html="previewResult" style="text-align: center"></div>

            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="previewModelVisible = false">关闭</el-button>
            </span>
        </el-dialog>

        <!-- 流程定义弹窗 -->
        <process-definition v-if="definitionVisible" ref="processDefinition" @refreshDataList="getDataList" />
    </div>
</template>

<script>
import MakeidTableMixin from "@/components/makeid-table/mixin/makeid-table-mixin";
import processDesigner from "./process-desiger.vue";
import processDefinition from "./process-definition";
import * as that from "@/api/process/process-api";

export default {
    name: "system-process",
    mixins: [MakeidTableMixin],
    components: { processDesigner, processDefinition },
    data() {
        return {
            queryForm: {},
            tableLine: [
                { label: "流程编号", prop: "code", align: "center", sortable: false },
                { label: "流程名称", prop: "name", align: "center", sortable: false },
                { label: "描述", prop: "desp", align: "center", sortable: false },
                { label: "状态", prop: "status", align: "center", sortable: false },
                { label: "创建时间", prop: "createdTime", align: "center", sortable: false },
                { label: "创建用户", prop: "createdUser", align: "center", sortable: false },
            ],
            tableLineSelect: [],

            // 流程设计界面
            mainviewShow: false,

            // 预览流程图界面
            previewModelVisible: false,

            // 预览流程图界面数据
            previewResult: "",

            // 流程定义弹窗
            definitionVisible: false,
        };
    },
    created() {},
    watch: {
        $route: "fetchData",
    },
    mounted() {
        this.tableLineSelect = this.tableLine;
    },
    methods: {
        // 路由切换刷新
        fetchData() {
            this.$nextTick(() => {
                let height = window.innerHeight - document.querySelector(".el-table").getBoundingClientRect().top - 75;
                // 控制表格最低高度
                if (height < 300) {
                    height = 300;
                }
                this.$refs.table.layout.setHeight(height);
                this.$refs.table.doLayout();
            });
        },

        // 获取数据列表
        getDataList(pageNo) {
            this.loading = true;
            this.pagination.pageNo = pageNo || this.pagination.pageNo;
            const item = {
                pageNo: this.pagination.pageNo,
                pageSize: this.pagination.pageSize,
                param: this.queryForm,
            };
            //查询功能
            that.sysProcessPagelist(item)
                .then((res) => {
                    this.loading = false;
                    this.pagination.total = res.total;
                    this.pagination.pageNo = res.current;
                    this.pagination.pageSize = res.size;
                    this.dataList = res.records;
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

        // 删除
        handleDelete(row) {
            this.deleteHandle(() => {
                //删除功能
                var id = row ? row.designerId : "";
                var ids = id
                    ? [id]
                    : this.dataListSelections.map((item) => {
                          return item.designerId;
                      });
                that.sysProcessDelete(ids)
                    .then((res) => {
                        this.msgSuccess("删除成功");
                        this.getDataList(1);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            });
        },

        // 详情
        handleDefinition(row) {
            this.definitionVisible = true;
            this.$nextTick(() => {
                this.$refs.processDefinition.init(row.designerId);
            });
        },

        //新增流程
        addProcess(row) {
            this.mainviewShow = true;

            this.$nextTick(() => {
                this.$refs.processRef.init(row);
            });
        },

        // 部署流程
        startProcess(id) {
            this.deleteHandle(() => {
                showLoading();
                that.sysProcessStart({
                    designerId: id,
                })
                    .then((res) => {
                        clearLoading();
                        this.msgSuccess("发布成功");
                        this.getDataList();
                    })
                    .catch((error) => {
                        clearLoading();
                        console.log(error);
                    });
            }, "是否确定发布？");
        },

        // 预览流程
        previewProcess(id) {
            showLoading();
            that.sysProcessInfo({
                id: id,
            })
                .then((res) => {
                    clearLoading();
                    console.log("previewProcess", res);
                    this.previewModelVisible = true;
                    this.previewResult = res.svg;
                })
                .catch((error) => {
                    clearLoading();
                    console.log(error);
                });
        },

        // 关闭流程设计页面
        backList() {
            this.mainviewShow = false;
        },
    },
};
</script>

<style lang="scss">
#system-process {
    position: relative;
    .process-box {
        overflow: hidden;
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        z-index: 1500;
        background: #f3f3f3;
        padding: 10px;
        box-sizing: border-box;
    }
    .func-btns-table-column {
        .el-tooltip {
            width: 250px !important;
        }
    }
}
</style>
