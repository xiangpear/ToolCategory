<template>
    <div id="diglog">
        <el-dialog :visible.sync="dialogVisible" :width="dialogWidth || '70%'" :before-close="handleClose" :show-close="isShowClose === undefined ? true : isShowClose" :close-on-click-modal="false">
            <slot name="top"></slot>
            <slot name="center"></slot>
            <slot name="bottom"></slot>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: ["dialogVisible", "dialogWidth", "isShowClose"],
    data() {
        return {};
    },
    methods: {
        //在弹框时点击关闭按钮
        handleClose() {
            this.$emit("handleClose");
        },
    },
};
</script>

<style scoped>
::v-deep .el-dialog__headerbtn .el-dialog__close {
    position: relative;
    z-index: 999;
}
</style>
