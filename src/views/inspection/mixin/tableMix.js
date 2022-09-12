export default {
    data() {
        return {
            dataListSelections:[],
            defaultType: "空数据",
        }
    },
    methods: {
        clearMul() {
            this.$refs.table.clearSelection();
        },
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
        // 多选
        selectionChangeHandle(val) {
            this.dataListSelections = val;
        },
    },
}