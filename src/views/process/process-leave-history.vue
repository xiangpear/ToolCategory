<template>
    <div class="f-dialog">
        <el-dialog v-adaptive="{ type: 'dialog' }" title="审批记录" :close-on-click-modal="false" :visible.sync="visible" custom-class="makeid-table-dialog" width="40%">
            <!--      <div>-->
            <!--         <span>物资编号：{{stock.code}}</span>-->
            <!--         <span class="code-content">物资名称：{{stock.name}}</span>-->
            <!--      </div>-->
            <div class="content">
                <div class="detail-line"></div>
                <div class="content-list">
                    <div class="list-item" v-for="(item, index) in dataList" :key="index">
                        <div class="item-header"></div>
                        <div class="item-detail">{{ item.activityName }},{{ item.assigneeName }},{{ item.comment }}, {{ item.endTime }}</div>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { processInstanceHistory } from "@/api/process/process-instance-api";

export default {
    name: "",
    data() {
        return {
            visible: false,
            dataList: [],
        };
    },
    methods: {
        init(instanceId) {
            this.visible = true;
            this.dataList = [];
            processInstanceHistory({ processInstanceId: instanceId })
                .then((res) => {
                    this.dataList = res;
                })
                .catch((error) => {
                    console.log(error);
                    this.visible = false;
                });
        },
    },
};
</script>

<style>
.content {
    position: relative;
    width: 100%;
    margin: 20px auto;
    overflow: hidden;
}

.content .detail-line {
    position: absolute;
    left: 7px;
    top: 0;
    width: 2px;
    height: 9999px;
    background: #77787b;
}

.content .content-list {
    margin-top: 40px;
}

.content .content-list .list-item {
    display: flex;
    margin-bottom: 20px;
}

.content .item-header {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #00a6ac;
    position: absolute;
    z-index: 10;
}

.content .item-detail {
    flex-grow: 1;
    margin-left: 30px;
}

.code-content {
    margin-left: 100px;
}
</style>
