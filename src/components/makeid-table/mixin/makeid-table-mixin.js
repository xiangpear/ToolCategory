export default {
    data() {
        return {
            // 分页
            pagination: {
                pageNo: 1,
                pageSize: 10,
                total: 0,
                pageRange: [10, 20, 30, 50, 100],
            },
            // 表格加载
            loading: true,
            // 表格list
            dataList: [],
            // 弹窗
            tableDialogVisible: false,
            //多选数组
            dataListSelections: [],
            defaultType: "空数据",

            // 是否执行mixin中mounted初始化的getDataList获取列表函数
            mixinMounted: true,
        };
    },
    mounted() {
        this.mixinMounted ? this.getDataList?.(1) : "";
    },
    methods: {
        // 查询
        handleQuery() {
            this.getDataList(1);
            this.defaultType = "暂无搜索内容";
        },

        // 重置查询
        resetQuery() {
            this.queryForm = this.$options.data().queryForm;
            this.getDataList(1);
            this.defaultType = "空数据";
        },

        // 多选
        selectionChangeHandle(val) {
            this.dataListSelections = val;
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

        // 编辑
        addOrUpdateHandle(row) {
            this.tableDialogVisible = true;
            this.$nextTick(() => {
                this.$refs["makeid-table-dialog"].tableDialogInit(row);
            });
        },

        /**
         * @author: pxt
         * @param {*} func 删除时调用接口函数
         * @param {*} tipMsg 删除时提示语 默认：是否确定删除
         * @param {*} successMsg 删除成功提示语 默认：删除成功
         * @return {*}
         * @description: 列表删除函数
         */
        deleteHandle(func, tipMsg, successMsg) {
            // 正常情况下刷新当前页，如果当前列只有一条数据且不再第一页，刷新到上一页
            const deleteSuccess = () => {
                this.msgSuccess(successMsg || "删除成功");
                if (this.dataList.length === 1 && this.pagination.pageNo !== 1) {
                    this.pagination.pageNo -= 1;
                    this.getDataList().then((res) => {
                        if (this.dataList.length == 0) {
                            this.defaultType = "空数据";
                        }
                    });
                } else {
                    this.getDataList().then((res) => {
                        if (this.dataList.length == 0) {
                            this.defaultType = "空数据";
                        }
                    });
                }
            };

            this.$confirm(tipMsg ? tipMsg : `是否确定删除?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    func ? func(deleteSuccess) : "";
                })
                .catch(function () {});
        },

        //刷新表格动态列
        refreshLine(line) {
            this.tableLineSelect = this.tableLine.filter((value) => {
                return line.includes(value.label);
            });
            this.$nextTick(() => {
                this.$refs.table.doLayout();
                var funcBtns = document.getElementsByClassName("func-btns");
                for (let i = 0; i < funcBtns.length; i++) {
                    const element = funcBtns[i];
                    element.parentNode.style.width = "230px";
                }
            });
        },

        //清除表格多选
        clearMul() {
            this.$refs.table.clearSelection();
        },
    },
};
