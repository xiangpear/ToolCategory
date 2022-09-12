<template>
    <!-- 流程设计界面 -->
    <div id="system-process-desiger">
        <!-- 流程设计画布面板 -->
        <my-process-designer
            ref="processDesigner"
            class="process-designer"
            :class="!isExpand ? 'expand' : ''"
            :events="processEvent"
            :key="`designer-${reloadIndex}`"
            v-model="xmlString"
            v-bind="controlForm"
            keyboard
            @element-event="elementEvent"
            @init-finish="initDesignerFinished"
            @globalAdvancedSetup="globalAdvancedSetup"
            @getAddListener="getAddListener"
        />

        <!-- 流程设计属性面板 -->
        <my-properties-panel
            ref="processPanel"
            class="process-panel"
            :key="`penal-${reloadIndex}`"
            :bpmn-modeler="modeler"
            :prefix="controlForm.prefix"
            @element-event="elementEvent"
            @init-finish="initPanelFinished"
            @expand-panel="expandPanel"
        />

        <!-- 流程操作按钮 -->
        <div class="processButton">
            <el-button size="mini" icon="el-icon-back" @click="backList">返回</el-button>
            <el-button size="mini" type="success" icon="el-icon-folder-checked" @click="saveProcess" :loading="dialogLoading">保存流程</el-button>
        </div>
    </div>
</template>

<script>
import CustomContentPadProvider from "@/components/process/package/designer/plugins/content-pad";
import * as that from "@/api/process/process-api";

export default {
    name: "system-process-desiger",
    data() {
        return {
            // 确认loading
            dialogLoading: false,

            // 默认流程xml数据
            xmlString: "",

            // bpmn对象
            modeler: null,

            // 流程key索引
            reloadIndex: 0,

            // 流程设计画布面板数据
            controlForm: {
                processId: "",
                processName: "",
                simulation: true,
                labelEditing: false,
                labelVisible: false,
                prefix: "activiti",
                headerButtonSize: "mini",
                // additionalModel: []
                additionalModel: [CustomContentPadProvider],
            },

            // 流程自定义事件
            processEvent: ["element.click"],

            // 流程设计画布展开
            isExpand: true,

            // 流程设计id
            designerId: "",

            // 初始流程属性
            dataForm: {
                name: "",
                desp: "",
                content: "",
            },
        };
    },
    created() {},
    methods: {
        // 组件初始化
        init(row) {
            this.designerId = row ? row.designerId : "";
        },

        // 流程设计画布初始化完成
        initDesignerFinished(modeler) {
            this.modeler = modeler;
        },

        // 流程设计属性面板初始化完成
        initPanelFinished() {
            if (this.designerId) {
                showLoading();
                that.sysProcessInfo({
                    id: this.designerId,
                })
                    .then((res) => {
                        clearLoading();
                        console.log("sysProcessInfo", res);
                        this.dataForm = {
                            name: res.name,
                            desp: res.desp,
                            content: res.content,
                        };
                        if (this.dataForm.content) {
                            this.$refs.processDesigner.createNewDiagram(this.dataForm.content);
                            setTimeout(() => {
                                for (let i = 0; i < 2; i++) {
                                    this.$refs.processDesigner.processReZoom();
                                }
                            }, 300);
                        }
                    })
                    .catch((error) => {
                        clearLoading();
                        console.log(error);
                    });
            } else {
                // 创建默认开始节点和用户任务节点（发起人），不可删除
                this.$refs.processDesigner.createDefaultDiagram();
            }
        },

        // 流程画布事件回调
        elementEvent(eventName, element, eventObj) {
            // console.log("elementEvent", eventName, element, eventObj);
            switch (eventName) {
                case "":
                    break;
            }
        },

        // 刷新监听器
        getAddListener() {
            this.$refs.processPanel.getAddListener();
        },

        // 关闭流程设计页面
        backList() {
            this.$emit("backList");
        },

        // 展开/折叠属性面板
        expandPanel(isExpand) {
            this.isExpand = isExpand;
            this.$nextTick(() => {
                setTimeout(() => {
                    for (let i = 0; i < 2; i++) {
                        this.$refs.processDesigner.processReZoom();
                    }
                }, 300);
            });
        },

        // 设置流程设计全局节点属性
        globalAdvancedSetup(advancedSetupArr) {
            this.$refs.processPanel.setAdvancedSetupArr(advancedSetupArr);
        },

        // 保存流程
        saveProcess() {
            var endEvent = window.bpmnInstances.elementRegistry.find((el) => el.type === "bpmn:EndEvent");
            if (!endEvent) {
                this.msgError("流程中没有结束节点！请添加后保存");
                return;
            }
            showLoading();
            this.modeler
                .saveXML({ format: true })
                .then(({ xml }) => {
                    this.modeler
                        .saveSVG({ format: true })
                        .then(({ svg }) => {
                            var rootElement =
                                window.bpmnInstances.elementRegistry.find((el) => el.type === "bpmn:Process") ?? window.bpmnInstances.elementRegistry.find((el) => el.type === "bpmn:Collaboration");

                            xml = xml.replace(/color:background-color="#fff"/g, "").replace(/color:border-color="#000"/g, "");
                            this.dataForm = {
                                name: rootElement.businessObject.name,
                                desp: rootElement.businessObject.desp,
                                content: xml,
                                svg: svg,
                            };

                            console.log(this.dataForm);

                            this.dialogLoading = true;
                            if (this.designerId) {
                                // 流程修改
                                this.dataForm.designerId = this.designerId;
                                that.sysProcessUpdate(this.dataForm)
                                    .then((res) => {
                                        this.dialogLoading = false;
                                        clearLoading();
                                        this.msgSuccess("修改成功");
                                        this.backList();
                                        this.$emit("refreshDataList", 1);
                                    })
                                    .catch((error) => {
                                        this.dialogLoading = false;
                                        console.log(error);
                                        clearLoading();
                                    });
                            } else {
                                // 流程新增
                                that.sysProcessSave(this.dataForm)
                                    .then((res) => {
                                        this.dialogLoading = false;
                                        clearLoading();
                                        this.msgSuccess("新增成功");
                                        this.backList();
                                        this.$emit("refreshDataList", 1);
                                    })
                                    .catch((error) => {
                                        this.dialogLoading = false;
                                        console.log(error);
                                        clearLoading();
                                    });
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            clearLoading();
                        });
                })
                .catch((error) => {
                    console.log(error);
                    clearLoading();
                });
        },

        // 根据所需类型进行转码并返回下载地址
        setEncoded(type, filename = "diagram", data) {
            const encodedData = encodeURIComponent(data);
            return {
                filename: `${filename}.${type}`,
                href: `data:application/${type === "svg" ? "text/xml" : "bpmn20-xml"};charset=UTF-8,${encodedData}`,
                data: data,
            };
        },
    },
};
</script>

<style lang="scss">
#system-process-desiger {
    position: relative;
    width: 100%;
    height: calc(100vh - 120px);
    .process-designer {
        .my-process-designer__container {
            transition: all 0.3s;
        }
        &.expand {
            .my-process-designer__container {
                width: 100% !important;
            }
        }
    }
    .el-collapse {
        border-top: 0px !important;
        border-bottom: 0px !important;
    }
    .processButton {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 999;
    }
}
</style>
