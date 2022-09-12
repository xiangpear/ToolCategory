<template>
    <div id="approve-window">
        <el-dialog
            v-adaptive="{ type: 'dialog' }"
            width="70%"
            :title="rowData.applyUser + '提交的' + rowData.processDefinitionName"
            :close-on-click-modal="footershow ? false : true"
            :visible.sync="visible"
            :custom-class="'activity-dialog'"
            @closed="closed"
            @open="open"
            :destroy-on-close="true"
        >
            <div class="window-body" :style="`max-height:` + (footershow ? windowHeight - 350 : windowHeight - 120) + `px;`">
                <div class="header-title clearfix">
                    <div class="title-left"></div>
                </div>
                <div>
                    <el-collapse v-model="activeNames" @change="handleCollapseChange">
                        <el-collapse-item title="提交的单据" name="1">
                            <div class="form-collapseItem">
                                <div class="formdialog"></div>
                                <!-- 此处为每个流程的提交单据 -->
                                <template v-if="(rowData.processCode = 'xxx')">
                                    <!-- <leaveForm ref="leaveForm"></leaveForm> -->
                                </template>
                                <component :ref="componentName + '-ref'" :is="componentName"></component>
                            </div>
                        </el-collapse-item>
                        <el-collapse-item title="审批记录" name="2">
                            <el-timeline>
                                <el-timeline-item
                                    v-for="(activity, index) in activities"
                                    :key="index"
                                    :hide-timestamp="true"
                                    :timestamp="activity.endTime"
                                    type="primary"
                                    placement="top"
                                    icon="el-icon-check"
                                >
                                    <template v-if="activity.comment == '已提交,,'">
                                        <div>
                                            发起人：<span class="activityUser">{{ activity.assigneeName }}</span>
                                        </div>
                                        <div style="color: #b3b3b3; font-size: 12px">发起申请</div>
                                        <div style="font-size: 12px; color: #c5c5c5">{{ activity.endTime }}</div>
                                    </template>
                                    <template v-else>
                                        <template v-if="activity.activityName != '结束'">
                                            <div>
                                                {{ activity.result == "已撤销" ? " 发起人:" : " 审批人:"
                                                }}<span class="activityUser">
                                                    {{ activity.assigneeName }}
                                                </span>
                                                <template v-if="activity.result == '已同意'">
                                                    <span style="font-weight: 800">（{{ activity.result }}）</span>
                                                </template>
                                                <template v-else>
                                                    <span style="font-weight: 800; color: #df6d6d">（{{ activity.result }}）</span>
                                                </template>
                                            </div>
                                            <div v-show="activity.remarks != ''" style="font-size: 12px; color: #878484">
                                                评论：<span>{{ activity.remarks }}</span>
                                            </div>
                                            <div style="font-size: 12px; color: #c5c5c5">{{ activity.endTime }}</div>
                                        </template>
                                        <template v-else> <span style="font-weight: 800">结束</span> </template>
                                    </template>
                                </el-timeline-item>
                            </el-timeline>
                        </el-collapse-item>
                        <el-collapse-item title="流程图" name="3" style="background: #fff">
                            <!-- <img :src="imageUrl" style="margin: 0 auto; display: block; width: 98%" /> -->
                            <div v-html="processData.svg" ref="bpmnItem"></div>
                        </el-collapse-item>
                    </el-collapse>
                </div>
            </div>
            <div slot="footer" class="dialog-footer" v-show="footershow">
                <el-form ref="form">
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="评论" label-width="3rem">
                                <el-input
                                    type="textarea"
                                    placeholder="请输入评论"
                                    v-model="comment"
                                    :rows="3"
                                    class="comment-value"
                                    :autosize="false"
                                    resize="none"
                                    :disabled="false"
                                    :show-word-limit="false"
                                >
                                </el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="24">
                            <el-form-item label="抄送" label-width="3rem">
                                <el-select v-model="sendUsers" placeholder="请选择用户" class="select-value" :filterable="true" multiple clearable>
                                    <el-option v-for="item in sendUserList" :key="item.userId" :label="item.userName" :value="item.userName"> </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-button type="primary" @click="approve(1)">同意</el-button>
                <el-button type="primary" @click="approve(2)">驳回</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Vue from "vue";
import * as that from "@/api/approve/approve";
import { sysUserList } from "@/api/system/system-user-api";
import { backendIP } from "@/utils/request";
// import xxxForm from ""; 引用业务表单组件

export default {
    data() {
        return {
            //控制弹窗是否关闭
            visible: false,
            //评论文本域存储变量
            comment: "",
            //默认打开折叠卡设置
            activeNames: ["1", "2", "3"],
            //时间线事件对象
            activities: [],
            //传入弹窗的数据对象
            rowData: {},
            //可选抄送人
            sendUserList: [],
            //选择的抄送人
            sendUsers: [],
            //表单
            form: {},
            imageUrl: "",
            windowHeight: window.innerHeight,
            processData: [],
            userName: "",

            componentName: "",
        };
    },
    props: ["footershow"],
    components: {
        // xxxxForm,业务表单组件
    },
    mounted() {
        console.log(this.footershow);
    },
    methods: {
        // 初始化
        init(row) {
            if (false) {
                this.visible = true;
                this.$axios
                    .get("./test/YemianController.js")
                    .then((controller) => {
                        this.$axios
                            .get("./test/yemian-table-form.vue")
                            .then((response) => {
                                var util = require("@/utils/index");
                                var utilRequest = require("@/utils/request");
                                var request = utilRequest.default;
                                var backendIP = utilRequest.backendIP;
                                var axios = require("axios");
                                var getToken = require("@/utils/auth").getToken;
                                var md5 = require("js-md5");

                                var randomComponent = util.randomString(10);

                                var publicStrArr = "axios, backendIP, util, getToken, md5";
                                var publicObjectArr = [axios, backendIP, util, getToken, md5];

                                // api-------------------------------------------------
                                var otherControllerStrArr = "";
                                var otherControllerObjectArr = [];

                                otherControllerStrArr += ", YemianController";

                                var apiEjsData = controller.data;
                                var apiStr = apiEjsData.replace(/export /g, "");
                                apiStr = apiStr.replace(`import request, { backendIP } from "@/utils/request";`, ``).replace(`/*return`, `return`).replace(`};return*/`, `};`);
                                apiStr = "function apiStrFunc(request, backendIP){" + apiStr + "}";
                                var apiStrFunc = new Function("return " + apiStr);
                                var Controller = apiStrFunc()(request, backendIP);

                                otherControllerObjectArr.push(Controller);

                                // 表单页-------------------------------------------------
                                var dialogEjsData = response.data;
                                var dialogTemplate = dialogEjsData.substring(dialogEjsData.indexOf(`<template>&&&makeid&&&`) + 22, dialogEjsData.indexOf(`</template>&&&makeid&&&`));
                                var backDialogScript =
                                    `function backDialogScript(${publicStrArr}${otherControllerStrArr}){return ` +
                                    dialogEjsData.substring(dialogEjsData.indexOf(`export default`) + 14, dialogEjsData.indexOf(`<\/script>`)) +
                                    "}";
                                var backDialogScriptFunc = new Function("return " + backDialogScript);
                                var backDialogScriptFuncJson = backDialogScriptFunc()(...publicObjectArr, ...otherControllerObjectArr);

                                Vue.component("generate-template-table-page-" + randomComponent, {
                                    template: dialogTemplate,
                                    ...backDialogScriptFuncJson,
                                });

                                this.componentName = "generate-template-table-page-" + randomComponent;

                                console.log("this.componentName", this.componentName);

                                this.$nextTick(() => {
                                    console.log(this.$refs[this.componentName + "-ref"].tableFormInit());
                                });
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
            this.rowData = row;
            this.visible = true;
            this.getUserList();
            this.getdrawing();
            this.getHistoryList();
            this.imageUrl = backendIP + "/process/readResource?processInstanceId=" + this.rowData.processInstanceId + "&time=" + new Date();
        },
        //处理折叠面板状态变化
        handleCollapseChange(val) {
            console.log(val);
        },

        open() {
            this.$nextTick(() => {
                this.getFormData(this.rowData.businessKey);
            });
        },

        //关闭弹窗动画结束时的回调
        closed() {
            this.form = {};
            this.activeNames = ["1", "2", "3"];
            this.$emit("refreshDataList", 1);
        },

        //同意或驳回操作方法
        approve(flag) {
            this.loading = true;
            const item = {
                comment: this.comment,
                flag: flag + "",
                sendUsers: this.sendUsers,
                taskId: this.rowData.taskId,
            };
            that.completeApply(item)
                .then((res) => {
                    this.msgSuccess("审核成功");
                    this.visible = false;
                    this.$store.dispatch("gethint").then((res) => {});
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        //获取流程信息
        getdrawing() {
            let data = {
                processCode: this.rowData.processCode,
                processInstanceId: this.rowData.processInstanceId,
            };
            let _this = this;
            that.getdrawing(data)
                .then((res) => {
                    this.processData = res;
                    this.processData.highLightedNodes == null ? (this.processData.highLightedNodes = [""]) : "";
                    this.$nextTick(() => {
                        let element = this.$refs.bpmnItem.getElementsByClassName("djs-element");
                        let bohuiArr = [];
                        for (let index = 0; index < element.length; index++) {
                            const item = element[index].getAttribute("data-element-id");
                            // setTimeout(() => {
                            if (element[index].getElementsByClassName("djs-hit-all")[0]) {
                                element[index].getElementsByClassName("djs-hit-all")[0].onclick = function () {
                                    if (item.indexOf("Acti") != -1) {
                                        that.getActivityUser({
                                            activityId: item,
                                            processInstanceId: data.processInstanceId,
                                        })
                                            .then((res) => {
                                                _this.$alert(res.toString(), "当前节点的审批用户", {
                                                    confirmButtonText: "确定",
                                                    callback: (action) => {},
                                                });
                                            })
                                            .catch((res) => {
                                                console.log(res);
                                            });
                                    }
                                };
                            }
                            // }, 50);
                            if (this.processData.highLightedActivitis.indexOf(item) > -1) {
                                element[index].setAttribute("class", "djs-element djs-connection makeid-highLightedActivitis ");
                                bohuiArr.push(element[index]);
                            }
                            if (this.processData.highLightedNodes.indexOf(item) > -1) {
                                element[index].setAttribute("class", "djs-element djs-connection makeid-highLightedNodes");
                            }
                            if (this.processData.highLightedFlows.indexOf(item) > -1) {
                                element[index].setAttribute("class", "djs-element djs-connection makeid-highLightedFlows ");
                            }
                        }
                    });
                })
                .catch((error) => {});
        },
        // 获取用户信息
        getUserList() {
            sysUserList()
                .then((res) => {
                    this.sendUserList = res;
                })
                .catch((error) => {
                    console.log(error);
                });
        },

        // 获取历史审批信息
        getHistoryList() {
            const item = {
                activityName: "",
                assignee: "",
                processInstanceId: this.rowData.processInstanceId,
            };
            that.historyList(item)
                .then((res) => {
                    // this.activities = res;
                    let newActivities = [];
                    res.forEach((element, index) => {
                        let comment = element.comment.split(",");
                        let result = comment[0];
                        let remarks = comment[comment.length - 1];
                        newActivities.push({
                            activityName: element.activityName,
                            assignee: element.assignee,
                            assigneeName: element.assigneeName,
                            comment: element.comment,
                            result: result,
                            remarks: remarks,
                            durationInMillis: element.durationInMillis,
                            endTime: element.endTime,
                            startTime: element.startTime,
                        });
                    });
                    this.activities = newActivities;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        // 获取表单数据
        getFormData() {
            if (this.rowData.processCode == "xxx") {
                // this.rowData.id = this.rowData.businessKey;业务键
                // this.$refs.leaveForm.tableFormInit(this.rowData);
            }
        },
    },
};
</script>
<style lang="scss">
#approve-window .activity-dialog {
    position: absolute;
    left: 50%;
    top: 50%;
    margin: 0 !important;
    max-height: 95%;
    height: auto !important;
    overflow: hidden;
    transform: translate(-50%, -50%);
    .el-dialog__body {
        padding: 10px 20px;
        background: #fafafb;
        overflow: auto;
    }
    .el-dialog__header {
        text-align: center;
    }
    .header-title {
        width: 100%;
        margin-bottom: 20px;
    }
    .title-left {
        float: left;
        line-height: 26px;
    }

    .body-info {
        display: flex;
        justify-content: space-around;
    }
    .body-comment {
        display: flex;
        margin: 0 0 10px 0;
    }
    .body-comment .comment-label {
        width: 60px;
        text-align: center;
    }

    .activityUser {
        font-weight: 800;
    }
    .el-collapse {
        margin-top: -10px;
        border: 0;
    }
    .el-collapse-item__header {
        padding-left: 20px;
    }
    .el-collapse-item {
        margin-bottom: 12px;
        border-radius: 20px;
    }
    .formdialog {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 222;
    }
    .form-collapseItem {
        position: relative;
        padding-right: 20px;
    }
    .select-value {
        width: 100%;
    }
    .prcessImg {
        position: absolute;
        right: 35px;
        top: 12px;
        img {
            width: 20px;
            cursor: pointer;
        }
    }
    .el-collapse-item__arrow {
        margin: 0 20px 6px auto;
    }
    .el-collapse-item__header {
        height: 60px;
        line-height: 60px;
        font-size: 16px;
        font-weight: 600;
    }
    .el-collapse-item__wrap {
        overflow: inherit;
    }
    .el-timeline-item__wrapper {
        padding-left: 20px;
        top: -7px;
    }
    .approve-items {
        display: flex;
        align-items: center;
        justify-content: center;
        .approve-item:first-child {
            width: 350px;
        }
        .approve-item:last-child {
            margin: 12px;
        }
    }
    svg {
        width: 100% !important;
    }
    .djs-element {
        .djs-visual {
            rect,
            circle,
            polygon,
            path {
                stroke: #a9a9a9 !important;
            }
        }
    }
    marker[id="conditional-flow-marker-white-black-26nx45yzcz6vps9j2swuxpvgd"] {
        path {
            stroke: #525252 !important;
        }
    }
    marker[id="sequenceflow-end-white-black-26nx45yzcz6vps9j2swuxpvgd"] {
        path {
            stroke: #525252 !important;
            fill: #525252 !important;
        }
    }
    .djs-element.makeid-highLightedActivitis {
        .djs-visual {
            rect,
            circle,
            polygon {
                fill: rgba($themeColor, 0) !important;
                stroke: $themeColor !important;
            }
        }
    }
    .djs-element.makeid-highLightedNodes {
        rect,
        circle,
        polygon {
            fill: rgba($themeColor, 0.2) !important;
            stroke: $themeColor !important;
        }
    }
    .djs-element.makeid-highLightedNodesRed {
        rect,
        circle,
        polygon {
            fill: rgba($themeColor, 1) !important;
            stroke: $themeColor !important;
        }
    }
    .djs-element.makeid-highLightedFlows {
        path {
            stroke: $themeColor !important;
        }
    }
    .djs-group {
        cursor: pointer;
    }
}
</style>
