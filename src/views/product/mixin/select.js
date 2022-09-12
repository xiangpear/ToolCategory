export default {
    methods: {
        //点击查询，需要去整理参数
        conditionSelece() {
            this.requestParam.pageSize = this.requestParam.pageSize ? this.requestParam.pageSize : this.stockInfo.size;
            this.requestParam.pageNo = this.requestParam.pageNo ? this.requestParam.pageNo : this.stockInfo.current;
            this.requestParam.param = this.formInline;
            this.callRequestfunc(this.requestParam);
        },
        //点击重置按钮
        resetHandle() {
            Object.keys(this.formInline).forEach((key) => {
                this.formInline[key] = undefined;
            });
            this.callRequestfunc();
        },
    },
};
