<template>
    <div class="f-dialog">
        <el-dialog v-adaptive="{ type: 'dialog' }" :title="'进度'" :close-on-click-modal="false" :visible.sync="visible" custom-class="makeid-table-dialog" width="800px">
            <img :src="imageUrl" />
        </el-dialog>
    </div>
</template>

<script>
import { backendIP } from "@/utils/request";

export default {
    name: "",
    components: {},
    mixins: [],
    data() {
        return {
            visible: false,
            imageUrl: "",
        };
    },
    created() {},
    mounted() {},
    methods: {
        // 初始化
        init(instanceId) {
            this.visible = true;
            this.getImageUrl(instanceId);
        },

        getImageUrl(instanceId) {
            this.imageUrl = backendIP + "/process/readResource?processInstanceId=" + instanceId + "&time=" + new Date();
        },
    },
};
</script>
<style lang="scss"></style>
