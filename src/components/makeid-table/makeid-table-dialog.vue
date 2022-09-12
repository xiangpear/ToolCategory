<template>
    <!-- 弹窗容器 -->
    <div class="f-dialog">
        <el-dialog
            custom-class="makeid-table-dialog"
            v-adaptive="{ type: 'dialog' }"
            :title="$attrs.title ? $attrs.title : (!row ? '新增' : '编辑') + subTitle"
            :visible.sync="visible"
            v-bind="$attrs"
            v-on="$listeners"
        >
            <slot />
            <span slot="footer" class="dialog-footer" v-if="$attrs.footer == false ? false : true">
                <el-button v-if="$attrs.showCancel == false ? false : true" size="medium" @click="visible = false">{{ $attrs.cancelText || "取消" }}</el-button>
                <el-button v-if="$attrs.showSubmit == false ? false : true" type="primary" size="medium" @click="tableFormSubmit()" :loading="dialogLoading">{{
                    $attrs.submitText || "确定"
                }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "MakeidTableDialog",
    data() {
        return {
            // 弹窗显示
            visible: false,

            // 确认loading
            dialogLoading: false,

            // 弹窗表单
            formRefs: null,

            // 表格行数据
            row: "",

            // 弹窗标题
            subTitle: "",

            // 关闭弹窗信号
            closeDialogSign: [],
        };
    },
    created() {},
    methods: {
        // 弹窗初始化
        tableDialogInit(row) {
            this.visible = true;
            this.row = row || "";
            this.formRefs =
                Object.getOwnPropertyNames(this.$slots).length != 0
                    ? this.$slots.default.filter((value) => {
                          return value.data && value.data.ref && value.data.ref.indexOf("table-form") != -1;
                      })
                    : null;
            this.formRefs = this.formRefs && Array.isArray(this.formRefs) && this.formRefs.length == 0 ? null : this.formRefs;
            this.$nextTick(() => {
                this.tableFormFunc("tableFormInit");
            });
        },

        // 表单提交
        tableFormSubmit() {
            this.dialogLoading = true;
            this.tableFormFunc("tableFormSubmit");
        },

        // 表单函数调用
        tableFormFunc(type) {
            if (!this.formRefs) {
                this.closeDialog(type, "close");
                return;
            }
            this.closeDialogSign = [];
            this.doTableFormFunc(type, this.formRefs, 0, "", (funcBack) => {
                this.closeDialog(type, funcBack);
            });
        },

        // 递归表格函数
        doTableFormFunc(type, formRefs, index, funcBack, func) {
            if (index == formRefs.length) {
                func && func(this.closeDialogSign.indexOf("no") == -1 ? funcBack : "no");
                return;
            }
            var formItem = this.formRefs[index];
            this.subTitle = formItem.componentInstance.$attrs.title || "";
            if (type == "tableFormInit") {
                formItem.componentInstance.tableFormInit(this.row);
                index++;
                this.doTableFormFunc(type, formRefs, index, 0, func);
            }
            if (type == "tableFormSubmit") {
                formItem.componentInstance.tableFormSubmit((funcBack) => {
                    this.closeDialogSign.push(funcBack ? funcBack : "no");
                    index++;
                    this.doTableFormFunc(type, formRefs, index, funcBack, func);
                });
            }
        },

        // 关闭弹窗
        closeDialog(type, funcBack) {
            if (type == "tableFormSubmit") {
                this.dialogLoading = false;
                funcBack == "close" ? (this.visible = false) : "";
            }
        },
    },
};
</script>
