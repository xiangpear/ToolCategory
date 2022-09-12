<template>
    <div class="process-panel__container" :style="{ width: `${this.width}px` }" :class="isExpand ? 'expand' : ''">
        <!-- <div class="expand" @click="expandPanel"><i :class="isExpand ? 'el-icon-arrow-right' : 'el-icon-arrow-left'"></i></div> -->
        <div class="expand" @click="expandPanel"><i class="el-icon-arrow-left" :class="isExpand ? 'expandi' : ''"></i></div>
        <div class="box">
            <el-collapse v-model="activeTab">
                <el-collapse-item name="base">
                    <div slot="title" class="panel-tab__title"><i class="el-icon-info"></i>常规</div>
                    <element-base-info :id-edit-disabled="idEditDisabled" :business-object="elementBusinessObject" :type="elementType" />
                </el-collapse-item>
                <el-collapse-item name="advancedSetup" key="advancedSetup" v-if="elementType == 'Process'">
                    <div slot="title" class="panel-tab__title"><i class="el-icon-s-claim"></i>高级审批</div>
                    <el-form style="margin-top: 20px" size="small" :model="globalAdvancedSetupForm" label-width="96px" ref="globalAdvancedSetupRef" @submit.native.prevent>
                        <el-form-item label="" label-width="10px" style="margin-left: 20px; margin-top: -10px">
                            <el-checkbox-group v-model="globalAdvancedSetupForm.advancedSetup" @change="updateElementTask('advancedSetup')">
                                <el-checkbox label="1" key="1">审批人为空时结束流程</el-checkbox>
                                <el-checkbox label="0" key="0">相邻节点审批者相同时，自动审批</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="全局驳回设置：" label-width="110px" style="margin-left: 20px; margin-top: -10px">
                            <el-radio-group v-model="globalAdvancedSetupForm.rejectStatus" @change="updateElementTask('rejectStatus')">
                                <el-radio label="1">发起人</el-radio>
                                <el-radio label="2">上一节点</el-radio>
                                <el-radio label="3">结束</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-form>
                </el-collapse-item>
                <!-- <el-collapse-item name="condition" v-if="elementType === 'Process'" key="message">
                    <div slot="title" class="panel-tab__title"><i class="el-icon-s-comment"></i>消息与信号</div>
                    <signal-and-massage />
                </el-collapse-item> -->
                <el-collapse-item name="condition" v-if="conditionFormVisible" key="condition">
                    <div slot="title" class="panel-tab__title"><i class="el-icon-s-promotion"></i>流转条件</div>
                    <flow-condition :business-object="elementBusinessObject" :type="elementType" />
                </el-collapse-item>
                <!-- <el-collapse-item name="condition" v-if="elementType.indexOf('Task') !== -1" key="form">
                    <div slot="title" class="panel-tab__title"><i class="el-icon-s-order"></i>表单</div>
                    <element-form :id="elementId" :type="elementType" />
                </el-collapse-item> -->
                <el-collapse-item name="task" v-if="elementType.indexOf('Task') !== -1" key="task">
                    <div slot="title" class="panel-tab__title"><i class="el-icon-s-claim"></i>审批设置</div>
                    <element-task
                        :userData="userData"
                        :roleData="roleData"
                        :deptList="deptList"
                        :deptData="deptData"
                        :id="elementId"
                        :type="elementType"
                        ref="taskRef"
                        :settingType="'task'"
                        @getAddListener="getAddListener"
                    />
                </el-collapse-item>
                <el-collapse-item name="carboncopy" v-if="elementType.indexOf('Task') !== -1 && bpmnElement.businessObject.elementType != 'default'" key="carboncopy">
                    <div slot="title" class="panel-tab__title"><i class="el-icon-s-claim"></i>抄送设置</div>
                    <element-task
                        :userData="userData"
                        :roleData="roleData"
                        :deptList="deptList"
                        :deptData="deptData"
                        :id="elementId"
                        :type="elementType"
                        ref="carboncopyRef"
                        :settingType="'carboncopy'"
                        @getAddListener="getAddListener"
                    />
                </el-collapse-item>
                <!-- <el-collapse-item name="multiInstance" v-if="elementType.indexOf('Task') !== -1" key="multiInstance">
                    <div slot="title" class="panel-tab__title"><i class="el-icon-s-help"></i>多实例</div>
                    <element-multi-instance :business-object="elementBusinessObject" :type="elementType" />
                </el-collapse-item> -->
                <el-collapse-item name="listeners" key="listeners">
                    <div slot="title" class="panel-tab__title"><i class="el-icon-message-solid"></i>执行监听器</div>
                    <element-listeners :id="elementId" :type="elementType" ref="elementListenersRef" />
                </el-collapse-item>
                <el-collapse-item name="taskListeners" v-if="elementType === 'UserTask'" key="taskListeners">
                    <div slot="title" class="panel-tab__title"><i class="el-icon-message-solid"></i>任务监听器</div>
                    <user-task-listeners :id="elementId" :type="elementType" ref="userTaskListenersRef" />
                </el-collapse-item>
                <!-- <el-collapse-item name="extensions" key="extensions" v-if="elementType.indexOf('Task') !== -1">
                    <div slot="title" class="panel-tab__title"><i class="el-icon-circle-plus"></i>扩展属性</div>
                    <element-properties :id="elementId" :type="elementType" />
                </el-collapse-item> -->
                <!-- <el-collapse-item name="other" key="other">
                    <div slot="title" class="panel-tab__title"><i class="el-icon-s-promotion"></i>其他</div>
                    <element-other-config :id="elementId" />
                </el-collapse-item> -->
            </el-collapse>
        </div>
    </div>
</template>
<script>
import ElementBaseInfo from "./base/ElementBaseInfo";
// import ElementOtherConfig from "./other/ElementOtherConfig";
import ElementTask from "./task/ElementTask";
// import ElementMultiInstance from "./multi-instance/ElementMultiInstance";
import FlowCondition from "./flow-condition/FlowCondition";
// import SignalAndMassage from "./signal-message/SignalAndMessage";
import ElementListeners from "./listeners/ElementListeners";
// import ElementProperties from "./properties/ElementProperties";
// import ElementForm from "./form/ElementForm";
import UserTaskListeners from "./listeners/UserTaskListeners";

import { sysDeptListAll, sysDeptAll } from "@/api/system/system-department-api";
import { sysUserRoleList } from "@/api/system/system-role-api";
import { sysUserList } from "@/api/system/system-user-api";

import { createListenerObject, updateElementExtensions } from "../utils";

// 侧边栏
export default {
    name: "MyPropertiesPanel",
    components: {
        UserTaskListeners,
        // ElementForm,
        // ElementProperties,
        ElementListeners,
        // SignalAndMassage,
        FlowCondition,
        // ElementMultiInstance,
        ElementTask,
        // ElementOtherConfig,
        ElementBaseInfo,
    },
    componentName: "MyPropertiesPanel",
    props: {
        bpmnModeler: Object,
        prefix: {
            type: String,
            default: "camunda",
        },
        width: {
            type: Number,
            default: 450,
        },
        idEditDisabled: {
            type: Boolean,
            default: false,
        },
    },
    provide() {
        return {
            prefix: this.prefix,
            width: this.width,
        };
    },
    data() {
        return {
            activeTab: [],
            elementId: "",
            elementType: "",
            elementBusinessObject: {}, // 元素 businessObject 镜像，提供给需要做判断的组件使用
            conditionFormVisible: false, // 流转条件设置
            formVisible: false, // 表单配置
            isExpand: true,
            userData: [],
            roleData: [],
            deptData: [],
            deptList: [],

            // 总节点配置
            globalAdvancedSetupForm: {
                advancedSetup: [],
            },

            // name重复校验
            allElementNames: "",
            elementNameTemp: "",
        };
    },
    watch: {
        elementId: {
            handler() {
                this.activeTab = ["base", "condition", "task", "advancedSetup"];
            },
        },
    },
    created() {
        this.initModels();
        this.getUserRoleList();
        this.getUserDeptList();
        this.getUserList();
        window.updateListenerProp = this.updateListenerProp;
        window.getListenerProp = this.getListenerProp;
        window.initFormOnChanged = this.initFormOnChanged;
    },
    methods: {
        // 更新全局节点高级审批属性
        updateElementTask(key) {
            // 所有用户任务节点
            const userTaskList = window.bpmnInstances.elementRegistry.filter((item) => item.type === "bpmn:UserTask");

            // 高级审批
            if (key == "advancedSetup") {
                // 相邻节点用户自动审批
                updateListenerProp(
                    "ExecutionListener",
                    "com.makeid.process.base.listener.GlobalExecutionListener",
                    "relyAutoAudit",
                    this.globalAdvancedSetupForm[key].indexOf("0") != -1 ? "true" : "false"
                );

                // 更新所有用户任务节点
                for (let i = 0; i < userTaskList.length; i++) {
                    const element = userTaskList[i];
                    if (element.businessObject.elementType != "default") {
                        updateListenerProp(
                            "TaskListener",
                            "com.makeid.process.base.listener.TaskCreateListener",
                            "relyAutoAudit",
                            this.globalAdvancedSetupForm[key].indexOf("0") != -1 ? "true" : "false",
                            element
                        );
                    }
                }

                // 审批人为空时结束流程
                updateListenerProp("ExecutionListener", "com.makeid.process.base.listener.GlobalExecutionListener", "pause", this.globalAdvancedSetupForm[key].indexOf("1") != -1 ? "true" : "false");

                this.getAddListener();
            }

            // 驳回设置
            if (key == "rejectStatus") {
                window.bpmnInstances.modeling.updateProperties(window.bpmnInstances.bpmnElement, {
                    rejectStatus: this.globalAdvancedSetupForm.rejectStatus,
                });

                // 更新所有用户任务节点
                for (let i = 0; i < userTaskList.length; i++) {
                    const element = userTaskList[i];
                    if (element.businessObject.elementType != "default") {
                        // 驳回设置
                        var elExtensionElements = element.businessObject.get("extensionElements");
                        // 获取元素表单配置 或者 创建新的表单配置
                        var formData = elExtensionElements.values.filter((ex) => ex.$type === `${this.prefix}:FormProperty`);
                        window.bpmnInstances.modeling.updateModdleProperties(window.bpmnInstances.bpmnElement, formData[0], {
                            expression: this.globalAdvancedSetupForm.rejectStatus,
                            name: "",
                        });
                    }
                }
            }
        },

        // 设置总节点高级审批
        setAdvancedSetupArr(advancedSetupArr) {
            this.globalAdvancedSetupForm.advancedSetup = advancedSetupArr;
            this.globalAdvancedSetupForm.rejectStatus = window.bpmnInstances.bpmnElement.businessObject.rejectStatus;
        },

        // 获取角色信息
        getUserRoleList() {
            sysUserRoleList()
                .then((res) => {
                    this.roleData = res;
                })
                .catch((error) => {
                    console.log(error);
                });
        },

        // 获取部门信息
        getUserDeptList() {
            sysDeptListAll()
                .then((res) => {
                    this.deptList = res;
                })
                .catch((error) => {
                    console.log(error);
                });
            sysDeptAll()
                .then((res) => {
                    this.deptData = res;
                })
                .catch((error) => {
                    console.log(error);
                });
        },

        // 获取用户信息
        getUserList() {
            sysUserList()
                .then((res) => {
                    this.userData = res;
                })
                .catch((error) => {
                    console.log(error);
                });
        },

        // 展开/折叠属性面板
        expandPanel() {
            this.isExpand = !this.isExpand;
            this.$emit("expand-panel", this.isExpand);
        },

        // 刷新监听器
        getAddListener(updatelistenners) {
            this.$refs.elementListenersRef ? this.$refs.elementListenersRef.resetListenersList() : "";
            this.$refs.userTaskListenersRef ? this.$refs.userTaskListenersRef.resetListenersList() : "";
            this.$refs.taskRef ? this.$refs.taskRef.resetListenersList() : "";
        },

        // 更新监听器字段
        updateListenerProp(listenerRoot, listenerName, propName, propNewValue, element) {
            var element = element ? element : this.bpmnElement;
            var listeners = element.businessObject?.extensionElements?.values?.filter((ex) => ex.$type === `${this.prefix}:${listenerRoot}`) ?? [];
            var listenerTemp = listeners.filter((value) => {
                return value.class == listenerName;
            });
            if (listenerTemp.length != 0) {
                var propName = listenerTemp[0].fields.filter((value) => {
                    return value.name == propName;
                });
                if (propName.length != 0) {
                    propName[0].expression = propNewValue;
                    var otherExtensionList = element.businessObject?.extensionElements?.values?.filter((ex) => ex.$type !== `${this.prefix}:${listenerRoot}`) ?? [];
                    updateElementExtensions(element, otherExtensionList.concat(listeners));
                }
            }
        },

        // 获取监听器字段
        getListenerProp(listenerRoot, listenerName, propName, element) {
            var element = element ? element : this.bpmnElement;
            var TaskListeners = element.businessObject?.extensionElements?.values?.filter((ex) => ex.$type === `${this.prefix}:${listenerRoot}`) ?? [];
            var listenerFields = TaskListeners.filter((value) => {
                return value.class == listenerName;
            });
            if (listenerFields.length != 0) {
                listenerFields = listenerFields[0].fields;

                return listenerFields.filter((value) => {
                    return value.name == propName;
                }).length != 0
                    ? listenerFields.filter((value) => {
                          return value.name == propName;
                      })[0].expression
                    : "";
            }
            return "";
        },

        // 初始化 modeler 以及其他 moddle
        initModels() {
            if (!this.bpmnModeler) {
                // 避免加载时 流程图 并未加载完成
                this.timer = setTimeout(() => this.initModels(), 10);
                return;
            }
            if (this.timer) clearTimeout(this.timer);
            window.bpmnInstances = {
                modeler: this.bpmnModeler,
                modeling: this.bpmnModeler.get("modeling"),
                moddle: this.bpmnModeler.get("moddle"),
                eventBus: this.bpmnModeler.get("eventBus"),
                bpmnFactory: this.bpmnModeler.get("bpmnFactory"),
                elementFactory: this.bpmnModeler.get("elementFactory"),
                elementRegistry: this.bpmnModeler.get("elementRegistry"),
                replace: this.bpmnModeler.get("replace"),
                selection: this.bpmnModeler.get("selection"),
            };
            this.getActiveElement();
        },

        // 初始化默认节点及事件
        getActiveElement() {
            // 初始第一个选中元素 bpmn:Process
            this.initFormOnChanged(null, "init");
            this.bpmnModeler.on("import.done", (e) => {
                this.initFormOnChanged(null);
            });
            // 监听选择事件，修改当前激活的元素以及表单
            this.bpmnModeler.on("selection.changed", ({ newSelection }) => {
                document.body.style.cursor = "default";
                window.bpmnInstances.bpmnElementAll = newSelection;
                this.initFormOnChanged(newSelection.length == 1 ? newSelection[0] : null);
            });
            this.bpmnModeler.on("drag.move", (res) => {
                this.allElementNames = "";
                this.elementNameTemp = "";
            });
            this.bpmnModeler.on("element.changed", ({ element }) => {
                if (this.elementNameTemp != element.businessObject.name && !!this.allElementNames && this.allElementNames.indexOf(element.businessObject.name) != -1) {
                    this.msgError("节点名称不能重复");
                    this.allElementNames.splice(this.allElementNames.indexOf(this.elementNameTemp), 1);
                    window.bpmnInstances.modeling.updateProperties(element, { name: this.elementNameTemp });
                    return;
                }

                // 保证 修改 "默认流转路径" 类似需要修改多个元素的事件发生的时候，更新表单的元素与原选中元素不一致。
                if (element && element.id === this.elementId) {
                    this.initFormOnChanged(element);
                }
            });
            this.bpmnModeler.on("element.dblclick", (res) => {
                this.elementNameTemp = res.element.businessObject.name;
                var allElement = window.bpmnInstances.elementRegistry._elements;
                var ids = [],
                    names = [];
                Object.keys(allElement).forEach((key) => {
                    const element = allElement[key].element;
                    if (element.businessObject.name) {
                        ids.push(element.id);
                        names.push(element.businessObject.name);
                    }
                });
                this.allElementNames = names;
            });
        },

        // 初始化数据
        initFormOnChanged(element, type) {
            let activatedElement = element;
            if (!activatedElement) {
                // 总节点
                activatedElement = window.bpmnInstances.elementRegistry.find((el) => el.type === "bpmn:Process") ?? window.bpmnInstances.elementRegistry.find((el) => el.type === "bpmn:Collaboration");

                if (type == "init") {
                    var otherExtensionList = activatedElement.businessObject?.extensionElements?.values?.filter((ex) => ex.$type !== `${this.prefix}:ExecutionListener`) ?? [];
                    updateElementExtensions(
                        activatedElement,
                        otherExtensionList.concat([
                            createListenerObject(
                                JSON.parse(
                                    `{"$type":"activiti:ExecutionListener","event":"start","class":"com.makeid.process.base.listener.GlobalExecutionListener","fields":[{"$type":"activiti:Field","name":"relyAutoAudit","expression":"false"},{"$type":"activiti:Field","name":"pause","expression":"false"}]}`
                                ),
                                false,
                                this.prefix
                            ),
                        ])
                    );
                    this.$emit("init-finish");
                }
            }
            if (!activatedElement) return;
            window.bpmnInstances.bpmnElement = activatedElement;
            this.bpmnElement = activatedElement;
            this.elementId = activatedElement.id;
            this.elementType = activatedElement.type.split(":")[1] || "";
            this.elementBusinessObject = JSON.parse(JSON.stringify(activatedElement.businessObject));
            this.conditionFormVisible = !!(this.elementType === "SequenceFlow" && activatedElement.source && activatedElement.source.type.indexOf("StartEvent") === -1);
            this.formVisible = this.elementType === "UserTask" || this.elementType === "StartEvent";
        },
    },
};
</script>
<style lang="scss">
.process-dialog {
    .el-select {
        width: 100% !important;
    }
}
.process-panel__container {
    right: -460px !important;
    transition: all 0.3s;
    &.expand {
        right: 0px !important;
    }
    .expand {
        position: absolute;
        width: 40px;
        height: 40px;
        left: -40px;
        top: 0px;
        background: #fff;
        box-shadow: -5px 0px 10px rgba(0, 0, 0, 0.05);
        cursor: pointer;
        border-right: 1px solid #eee;
        i {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 26px;
            transition: all 0.3s;
            &.expandi {
                transform: translate(-50%, -50%) rotate(180deg);
                transform-origin: 50% 50%;
            }
        }
    }
    .box {
        overflow-y: scroll;
        height: 99%;
        padding: 0 8px;
    }
}
</style>
