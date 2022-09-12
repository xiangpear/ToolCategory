<template>
    <div id="my-process-designer">
        <div class="my-process-designer__header">
            <slot name="control-header"></slot>
            <template v-if="!$slots['control-header']">
                <el-button-group key="file-control">
                    <el-button :size="headerButtonSize" :type="headerButtonType" icon="el-icon-folder-opened" @click="$refs.refFile.click()">打开文件</el-button>
                    <el-tooltip effect="light">
                        <div slot="content">
                            <el-button :size="headerButtonSize" type="text" @click="downloadProcessAsXml()">下载为XML文件</el-button>
                            <br />
                            <el-button :size="headerButtonSize" type="text" @click="downloadProcessAsSvg()">下载为SVG文件</el-button>
                            <br />
                            <el-button :size="headerButtonSize" type="text" @click="downloadProcessAsBpmn()">下载为BPMN文件</el-button>
                        </div>
                        <el-button :size="headerButtonSize" :type="headerButtonType" icon="el-icon-download">下载文件</el-button>
                    </el-tooltip>
                    <el-tooltip effect="light">
                        <div slot="content">
                            <el-button :size="headerButtonSize" type="text" @click="previewProcessXML">预览XML</el-button>
                            <br />
                            <el-button :size="headerButtonSize" type="text" @click="previewProcessJson">预览JSON</el-button>
                        </div>
                        <el-button :size="headerButtonSize" :type="headerButtonType" icon="el-icon-view">预览</el-button>
                    </el-tooltip>
                    <!-- <el-tooltip v-if="simulation" effect="light" :content="this.simulationStatus ? '退出模拟' : '开启模拟'">
                        <el-button :size="headerButtonSize" :type="headerButtonType" icon="el-icon-cpu" @click="processSimulation"> 模拟 </el-button>
                    </el-tooltip> -->
                </el-button-group>
                <!-- <el-button-group key="align-control">
                    <el-tooltip effect="light" content="向左对齐">
                        <el-button :size="headerButtonSize" class="align align-left" icon="el-icon-s-data" @click="elementsAlign('left')" />
                    </el-tooltip>
                    <el-tooltip effect="light" content="向右对齐">
                        <el-button :size="headerButtonSize" class="align align-right" icon="el-icon-s-data" @click="elementsAlign('right')" />
                    </el-tooltip>
                    <el-tooltip effect="light" content="向上对齐">
                        <el-button :size="headerButtonSize" class="align align-top" icon="el-icon-s-data" @click="elementsAlign('top')" />
                    </el-tooltip>
                    <el-tooltip effect="light" content="向下对齐">
                        <el-button :size="headerButtonSize" class="align align-bottom" icon="el-icon-s-data" @click="elementsAlign('bottom')" />
                    </el-tooltip>
                    <el-tooltip effect="light" content="水平居中">
                        <el-button :size="headerButtonSize" class="align align-center" icon="el-icon-s-data" @click="elementsAlign('center')" />
                    </el-tooltip>
                    <el-tooltip effect="light" content="垂直居中">
                        <el-button :size="headerButtonSize" class="align align-middle" icon="el-icon-s-data" @click="elementsAlign('middle')" />
                    </el-tooltip>
                </el-button-group> -->
                <el-button-group key="scale-control">
                    <el-tooltip effect="light" content="缩小视图">
                        <el-button :size="headerButtonSize" :disabled="defaultZoom < 0.2" icon="el-icon-zoom-out" @click="processZoomOut()" />
                    </el-tooltip>
                    <el-button style="height: 28px" :size="headerButtonSize">{{ Math.floor(this.defaultZoom * 10 * 10) + "%" }}</el-button>
                    <el-tooltip effect="light" content="放大视图">
                        <el-button :size="headerButtonSize" :disabled="defaultZoom > 4" icon="el-icon-zoom-in" @click="processZoomIn()" />
                    </el-tooltip>
                    <el-tooltip effect="light" content="重置视图并居中">
                        <el-button :size="headerButtonSize" icon="el-icon-c-scale-to-original" @click="processReZoom()" />
                    </el-tooltip>
                </el-button-group>
                <el-button-group key="stack-control">
                    <el-tooltip effect="light" content="撤销">
                        <el-button :size="headerButtonSize" :disabled="!revocable" icon="el-icon-refresh-left" @click="processUndo()" />
                    </el-tooltip>
                    <el-tooltip effect="light" content="恢复">
                        <el-button :size="headerButtonSize" :disabled="!recoverable" icon="el-icon-refresh-right" @click="processRedo()" />
                    </el-tooltip>
                    <el-tooltip effect="light" content="清空画布">
                        <el-button :size="headerButtonSize" icon="el-icon-refresh" @click="processRestart" />
                    </el-tooltip>
                </el-button-group>
            </template>
            <!-- 用于打开本地文件-->
            <input type="file" id="files" ref="refFile" style="display: none" accept=".xml, .bpmn" @change="importLocalFile" />
        </div>
        <div class="my-process-designer__container">
            <div class="my-process-designer__canvas" ref="bpmn-canvas"></div>
        </div>
        <el-dialog
            :close-on-click-modal="false"
            custom-class="makeid-table-dialog"
            v-adaptive="{ type: 'dialog' }"
            title="预览"
            width="70%"
            :visible.sync="previewModelVisible"
            destroy-on-close
            append-to-body
            class="process-preview-dialog"
        >
            <!-- <highlightjs :language="previewType" :code="previewResult" /> -->
            <el-input :readonly="true" type="textarea" style="height: 100%" v-model="previewResult"> </el-input>

            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="previewModelVisible = false">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import BpmnModeler from "bpmn-js/lib/Modeler";
import DefaultEmptyXML from "./plugins/defaultEmpty";
// 翻译方法
import customTranslate from "./plugins/translate/customTranslate";
import translationsCN from "./plugins/translate/zh";
// 模拟流转流程
import tokenSimulation from "bpmn-js-token-simulation";
// 标签解析构建器
// import bpmnPropertiesProvider from "bpmn-js-properties-panel/lib/provider/bpmn";
// 标签解析 Moddle
import camundaModdleDescriptor from "./plugins/descriptor/camundaDescriptor.json";
import activitiModdleDescriptor from "./plugins/descriptor/activitiDescriptor.json";
import flowableModdleDescriptor from "./plugins/descriptor/flowableDescriptor.json";
// 标签解析 Extension
import camundaModdleExtension from "./plugins/extension-moddle/camunda";
import activitiModdleExtension from "./plugins/extension-moddle/activiti";
import flowableModdleExtension from "./plugins/extension-moddle/flowable";
// 引入json转换与高亮
import X2JS from "x2js";

import { createListenerObject, updateElementExtensions } from "../utils";

import customPalette from "./plugins/palette/index";
import customPad from "./plugins/content-pad/index";

// import PaletteProvider from "bpmn-js/lib/features/palette/PaletteProvider";

// class customPalette extends PaletteProvider {
//     constructor(create, elementFactory, globalConnect, handTool, lassoTool, palette, spaceTool, translate) {
//         super(palette, create, elementFactory, spaceTool, lassoTool, handTool, globalConnect, translate);

//         this.create = create;
//         this.elementFactory = elementFactory;
//         this.translate = translate;
//     }

//     getPaletteEntries(element) {
//         const { create, elementFactory, translate } = this;

//         return Object.assign(super.getPaletteEntries(element), {
//             "create.user-task": {
//                 group: "activity",
//                 className: "bpmn-icon-user-task",
//                 title: "创建用户任务",
//                 action: {
//                     click: function (event) {
//                         var shape = elementFactory.createShape({
//                             type: "bpmn:UserTask",
//                         });
//                         create.start(event, shape);
//                     },
//                 },
//             },
//         });
//     }
// }

// customPalette.$inject = ["create", "elementFactory", "globalConnect", "handTool", "lassoTool", "palette", "spaceTool", "translate"];

export default {
    name: "MyProcessDesigner",
    componentName: "MyProcessDesigner",
    props: {
        value: String, // xml 字符串
        processId: String,
        processName: String,
        processDesp: String,
        translations: Object, // 自定义的翻译文件
        additionalModel: [Object, Array], // 自定义model
        moddleExtension: Object, // 自定义moddle
        onlyCustomizeAddi: {
            type: Boolean,
            default: false,
        },
        onlyCustomizeModdle: {
            type: Boolean,
            default: false,
        },
        simulation: {
            type: Boolean,
            default: true,
        },
        keyboard: {
            type: Boolean,
            default: true,
        },
        prefix: {
            type: String,
            default: "camunda",
        },
        events: {
            type: Array,
            default: () => [],
        },
        headerButtonSize: {
            type: String,
            default: "small",
            validator: (value) => ["default", "medium", "small", "mini"].indexOf(value) !== -1,
        },
        headerButtonType: {
            type: String,
            default: "primary",
            validator: (value) => ["default", "primary", "success", "warning", "danger", "info"].indexOf(value) !== -1,
        },
    },
    data() {
        return {
            defaultZoom: 1,
            previewModelVisible: false,
            simulationStatus: false,
            previewResult: "",
            previewType: "xml",
            recoverable: false,
            revocable: false,
            bpmnElementListeners: [],

            isRedoing: false,
            isUndoing: false,
        };
    },
    computed: {
        additionalModules() {
            const Modules = [];
            // 仅保留用户自定义扩展模块
            if (this.onlyCustomizeAddi) {
                if (Object.prototype.toString.call(this.additionalModel) === "[object Array]") {
                    return this.additionalModel || [];
                }
                return [this.additionalModel];
            }

            // 插入用户自定义扩展模块
            if (Object.prototype.toString.call(this.additionalModel) === "[object Array]") {
                Modules.push(...this.additionalModel);
            } else {
                this.additionalModel && Modules.push(this.additionalModel);
            }

            // 翻译模块
            const TranslateModule = {
                translate: ["value", customTranslate(this.translations || translationsCN)],
            };
            Modules.push(TranslateModule);

            // 模拟流转模块
            if (this.simulation) {
                Modules.push(tokenSimulation);
            }

            // 根据需要的流程类型设置扩展元素构建模块
            // if (this.prefix === "bpmn") {
            //   Modules.push(bpmnModdleExtension);
            // }
            if (this.prefix === "camunda") {
                Modules.push(camundaModdleExtension);
            }
            if (this.prefix === "flowable") {
                Modules.push(flowableModdleExtension);
            }
            if (this.prefix === "activiti") {
                Modules.push(activitiModdleExtension);
            }

            // Modules.push({
            //     __init__: ["customPalette"],
            //     customPalette: ["type", customPalette],
            // });

            Modules.push(customPalette);
            Modules.push(customPad);

            return Modules;
        },
        moddleExtensions() {
            const Extensions = {};
            // 仅使用用户自定义模块
            if (this.onlyCustomizeModdle) {
                return this.moddleExtension || null;
            }

            // 插入用户自定义模块
            if (this.moddleExtension) {
                for (let key in this.moddleExtension) {
                    Extensions[key] = this.moddleExtension[key];
                }
            }

            // 根据需要的 "流程类型" 设置 对应的解析文件
            if (this.prefix === "activiti") {
                Extensions.activiti = activitiModdleDescriptor;
            }
            if (this.prefix === "flowable") {
                Extensions.flowable = flowableModdleDescriptor;
            }
            if (this.prefix === "camunda") {
                Extensions.camunda = camundaModdleDescriptor;
            }

            return Extensions;
        },
    },
    destroyed() {
        document.onkeydown = null;
    },
    mounted() {
        this.initBpmnModeler();
        this.createNewDiagram(this.value);
        this.$once("hook:beforeDestroy", () => {
            if (this.bpmnModeler) this.bpmnModeler.destroy();
            this.$emit("destroy", this.bpmnModeler);
            this.bpmnModeler = null;
        });
        this.initHotkey();
    },
    methods: {
        // 初始化bpmn模块
        initBpmnModeler() {
            if (this.bpmnModeler) return;
            this.bpmnModeler = new BpmnModeler({
                container: this.$refs["bpmn-canvas"],
                // keyboard: this.keyboard ? { bindTo: document } : null,
                additionalModules: this.additionalModules,
                moddleExtensions: this.moddleExtensions,
            });
            this.$emit("init-finish", this.bpmnModeler);
            this.initModelListeners();
        },

        // 初始化bpmn事件
        initModelListeners() {
            const EventBus = this.bpmnModeler.get("eventBus");
            const that = this;
            // 注册需要的监听事件, 将. 替换为 - , 避免解析异常
            this.events.forEach((event) => {
                EventBus.on(event, function (eventObj) {
                    let eventName = event.replace(/\./g, "-");
                    let element = eventObj ? eventObj.element : null;
                    that.$emit("element-event", eventName, element, eventObj);
                });
            });
            // 监听图形改变返回xml
            EventBus.on("commandStack.changed", async (event) => {
                try {
                    var _stack = this.bpmnModeler.get("commandStack")._stack;
                    var _stackIdx = this.bpmnModeler.get("commandStack")._stackIdx;
                    if (this.isUndoing) {
                        if (_stack[_stackIdx + 1] && _stack[_stackIdx + 1].context.oldProperties) {
                            this.processUndo();
                        } else {
                            this.isUndoing = false;
                        }
                    }
                    if (this.isRedoing) {
                        if (_stack[_stackIdx + 1] && _stack[_stackIdx + 1].context.oldProperties) {
                            this.processRedo();
                        } else {
                            this.isRedoing = false;
                        }
                    }

                    this.recoverable = this.bpmnModeler.get("commandStack").canRedo();
                    this.revocable = this.bpmnModeler.get("commandStack").canUndo();
                    let { xml } = await this.bpmnModeler.saveXML({ format: true });
                    this.$emit("commandStack-changed", event);
                    this.$emit("input", xml);
                    this.$emit("change", xml);
                } catch (e) {
                    console.error(`[Process Designer Warn]: ${e.message || e}`);
                }
            });

            // 监听视图缩放变化
            EventBus.on("canvas.viewbox.changed", ({ viewbox }) => {
                const { scale } = viewbox;
                this.defaultZoom = Math.floor(scale * 100) / 100;
            });

            // 监听视图缩放变化
            EventBus.on("keyboard.keydown", (res) => {
                console.log(res);
            });

            // 添加元素
            EventBus.on("shape.added", (event, element) => {
                // 开始事件节点
                if (element.element.type.indexOf("StartEvent") != -1) {
                    this.shapeAddedInterval ? clearInterval(this.shapeAddedInterval) : "";
                    this.shapeAddedInterval = setInterval(() => {
                        if (window.bpmnInstances.bpmnElement) {
                            clearInterval(this.shapeAddedInterval);
                            if (window.bpmnInstances.bpmnElement.type.indexOf("StartEvent") != -1) {
                                window.bpmnInstances.modeling.updateProperties(window.bpmnInstances.bpmnElement, {
                                    initiator: "applyUserId",
                                });
                            }
                        }
                    }, 0);
                }

                // 用户任务节点
                if (element.element.type.indexOf("Task") != -1) {
                    this.userTaskCreateInit(element.element);
                }
            });
        },

        // 初始化快捷键
        initHotkey() {
            document.onkeydown = (e) => {
                // console.log(e);

                // 删除 del
                if (e.keyCode == 46) {
                    for (let i = window.bpmnInstances.bpmnElementAll.length - 1; i >= 0; i--) {
                        const element = window.bpmnInstances.bpmnElementAll[i];
                        if (element && element.businessObject.elementType != "default") {
                            window.bpmnInstances.modeling.removeElements([element]);
                        }
                    }
                }

                // 撤销 ctrl+z
                if (e.keyCode == 90 && e.ctrlKey) {
                    this.processUndo();
                }

                // 恢复 ctrl+y
                if (e.keyCode == 89 && e.ctrlKey) {
                    this.processRedo();
                }

                // // 复制 ctrl+c
                // if (e.keyCode == 67 && e.ctrlKey) {
                // }

                // // 粘贴 ctrl+v
                // if (e.keyCode == 86 && e.ctrlKey) {
                // }
            };
        },

        // 用户任务节点初始化
        userTaskCreateInit(element, bpmnElement, custom) {
            this.bpmnElementListeners = [];

            // 执行监听器
            var ExecutionListenerTemp = element.businessObject?.extensionElements?.values?.filter((ex) => ex.$type === `${this.prefix}:ExecutionListener`) ?? [];
            if (ExecutionListenerTemp.length == 0) {
                this.createExecutionListener();
            } else {
                var ExecutionCreateListenerTemp = ExecutionListenerTemp.filter((value) => {
                    return value.class == "com.makeid.process.base.listener.ExecutionCreateListener";
                });
                if (ExecutionCreateListenerTemp.length == 0) {
                    this.createExecutionListener();
                }
                this.bpmnElementListeners = ExecutionListenerTemp.concat(this.bpmnElementListeners);
            }

            // 任务监听器
            var TaskListenerTemp = element.businessObject?.extensionElements?.values?.filter((ex) => ex.$type === `${this.prefix}:TaskListener`) ?? [];
            if (TaskListenerTemp.length == 0) {
                this.createTaskListener("TaskCompileListener", custom);
                this.createTaskListener("TaskCreateListener", custom);
            } else {
                var TaskCompileListenerTemp = TaskListenerTemp.filter((value) => {
                    return value.class == "com.makeid.process.base.listener.TaskCompileListener";
                });
                if (TaskCompileListenerTemp.length == 0) {
                    this.createTaskListener("TaskCompileListener", custom);
                }

                var TaskCreateListenerTemp = TaskListenerTemp.filter((value) => {
                    return value.class == "com.makeid.process.base.listener.TaskCreateListener";
                });
                if (TaskCreateListenerTemp.length == 0) {
                    this.createTaskListener("TaskCreateListener", custom);
                }
                this.bpmnElementListeners = TaskListenerTemp.concat(this.bpmnElementListeners);
            }

            if (!bpmnElement) {
                this.shapeAddedInterval ? clearInterval(this.shapeAddedInterval) : "";
                this.shapeAddedInterval = setInterval(() => {
                    if (window.bpmnInstances.bpmnElement) {
                        clearInterval(this.shapeAddedInterval);
                        if (window.bpmnInstances.bpmnElement.type.indexOf("Task") != -1) {
                            window.bpmnInstances.modeling.updateProperties(window.bpmnInstances.bpmnElement, {
                                name: `用户任务_${new Date().getTime()}`,
                                candidateUsers: "",
                                candidateGroups: "",
                                userRadio: "candidateUsers",
                                assignee: "${signer}",
                            });
                            updateElementExtensions(window.bpmnInstances.bpmnElement, this.bpmnElementListeners);

                            // multiInstanceLoopCharacteristics
                            this.createMultiInstanceLoopCharacteristics();
                            this.createFormProperty();

                            this.$emit("getAddListener");
                        }
                    }
                }, 0);
            } else {
                window.bpmnInstances.modeling.updateProperties(bpmnElement, {
                    id: "initSubmitTaskId",
                    name: "提交申请",
                    elementType: "default",
                    candidateUsers: "",
                    candidateGroups: "",
                    userRadio: "selfUser",
                    assignee: "${applyUserId}",
                });
                updateElementExtensions(bpmnElement, this.bpmnElementListeners);
            }
        },

        // 创建多实例
        createMultiInstanceLoopCharacteristics() {
            var multiLoopInstance = window.bpmnInstances.moddle.create("bpmn:MultiInstanceLoopCharacteristics");
            window.bpmnInstances.modeling.updateProperties(window.bpmnInstances.bpmnElement, {
                loopCharacteristics: multiLoopInstance,
            });
            var completionCondition = window.bpmnInstances.moddle.create("bpmn:FormalExpression", { body: "${nrOfCompletedInstances/nrOfInstances >= 0}" });
            window.bpmnInstances.modeling.updateModdleProperties(window.bpmnInstances.bpmnElement, multiLoopInstance, {
                completionCondition,
                collection: "${signList}",
                elementVariable: "signer",
                isSequential: false,
            });
        },

        // 创建表单属性
        createFormProperty() {
            var otherExtensionList = [];
            window.bpmnInstances.bpmnElement.businessObject?.extensionElements?.values?.filter((ex) => {
                if (ex.$type !== `${this.prefix}:Properties`) {
                    otherExtensionList.push(ex);
                }
                return ex.$type === `${this.prefix}:Properties`;
            });

            var formProperty = window.bpmnInstances.moddle.create(this.prefix + ":FormProperty");
            const Process = window.bpmnInstances.elementRegistry.filter((item) => item.type === "bpmn:Process");
            window.bpmnInstances.modeling.updateModdleProperties(window.bpmnInstances.bpmnElement, formProperty, {
                id: "rejectType",
                type: "string",
                name: "",
                expression: Process[0].businessObject.rejectStatus,
                writable: "false",
                required: "true",
            });

            const extensions = window.bpmnInstances.moddle.create("bpmn:ExtensionElements", {
                values: otherExtensionList.concat([formProperty]),
            });
            window.bpmnInstances.modeling.updateProperties(window.bpmnInstances.bpmnElement, {
                extensionElements: extensions,
            });
        },

        // 创建默认执行监听器
        createExecutionListener() {
            // {"$type":"activiti:Field","name":"pause","expression":"false"}
            this.bpmnElementListeners.push(
                createListenerObject(
                    JSON.parse('{"$type":"activiti:ExecutionListener","event":"start","class":"com.makeid.process.base.listener.ExecutionCreateListener","fields":[]}'),
                    false,
                    this.prefix
                )
            );
        },

        // 创建默认任务监听器
        createTaskListener(type, custom) {
            if (type == "TaskCompileListener") {
                this.bpmnElementListeners.push(
                    createListenerObject(
                        JSON.parse(
                            `{"$type":"activiti:TaskListener","event":"complete","class":"com.makeid.process.base.listener.TaskCompileListener","fields":[{"$type":"activiti:Field","name":"percent","expression":"0"},{"$type":"activiti:Field","name":"carbonCopy","expression":""}]}`
                        ),
                        true,
                        this.prefix
                    )
                );
            }
            if (type == "TaskCreateListener") {
                const Process = window.bpmnInstances.elementRegistry.filter((item) => item.type === "bpmn:Process");
                var relyAutoAudit = getListenerProp("ExecutionListener", "com.makeid.process.base.listener.GlobalExecutionListener", "relyAutoAudit", Process[0]);
                if (!custom) {
                    this.bpmnElementListeners.push(
                        createListenerObject(
                            JSON.parse(
                                `{"$type":"activiti:TaskListener","event":"create","class":"com.makeid.process.base.listener.TaskCreateListener","fields":[{"$type":"activiti:Field","name":"autoAudit","expression":"false"},{"$type":"activiti:Field","name":"condition","expression":"{}"},{"$type":"activiti:Field","name":"relyAutoAudit","expression":"${relyAutoAudit}"}]}`
                            ),
                            true,
                            this.prefix
                        )
                    );
                } else {
                    this.bpmnElementListeners.push(
                        createListenerObject(
                            JSON.parse(
                                `{"$type":"activiti:TaskListener","event":"create","class":"com.makeid.process.base.listener.TaskCreateListener","fields":[{"$type":"activiti:Field","name":"autoAudit","expression":"true"},{"$type":"activiti:Field","name":"condition","expression":"{}"},{"$type":"activiti:Field","name":"relyAutoAudit","expression":"false"}]}`
                            ),
                            true,
                            this.prefix
                        )
                    );
                }
            }
        },

        // 创建默认开始节点和用户任务节点（发起人），不可删除
        createDefaultDiagram() {
            // 总节点
            var ProcessElement = window.bpmnInstances.elementRegistry.find((el) => el.type === "bpmn:Process") ?? window.bpmnInstances.elementRegistry.find((el) => el.type === "bpmn:Collaboration");

            var startEvent = window.bpmnInstances.elementFactory.createShape({
                type: "bpmn:StartEvent",
                x: 0,
                y: 0,
            });

            var userTask = window.bpmnInstances.elementFactory.createShape({
                type: "bpmn:UserTask",
                x: 0,
                y: 0,
            });

            window.bpmnInstances.modeling.createShape(startEvent, { x: 200, y: 200 }, ProcessElement);
            window.bpmnInstances.modeling.createShape(userTask, { x: 350, y: 200 }, ProcessElement);
            var connectLine = window.bpmnInstances.modeling.connect(startEvent, userTask);

            window.bpmnInstances.modeling.updateProperties(startEvent, {
                name: "流程开始",
                elementType: "default",
                initiator: "applyUserId",
            });
            window.bpmnInstances.modeling.updateProperties(connectLine, {
                elementType: "default",
            });
            this.userTaskCreateInit(userTask, userTask, "custom");

            setTimeout(() => {
                this.processReZoom();
                this.recoverable = false;
                this.revocable = false;
                this.bpmnModeler.get("commandStack").clear();
                this.$emit("globalAdvancedSetup", []);
            }, 200);
        },

        // 创建新的流程图
        async createNewDiagram(xml, func) {
            // 将字符串转换成图显示出来
            let newId = this.processId || `Process_${new Date().getTime()}`;
            let newName = this.processName || `业务流程名称_${new Date().getTime()}`;
            let newDesp = this.processDesp || `业务流程描述_${new Date().getTime()}`;
            let rejectStatus = "1";
            let xmlString = xml || DefaultEmptyXML(newId, newName, newDesp, rejectStatus, this.prefix);
            try {
                let { warnings } = await this.bpmnModeler.importXML(xmlString);
                if (warnings && warnings.length) {
                    warnings.forEach((warn) => console.warn(warn));
                }
                if (window.bpmnInstances) {
                    var advancedSetupArr = [];
                    var TaskListeners = window.bpmnInstances.bpmnElement.businessObject?.extensionElements?.values?.filter((ex) => ex.$type === `${this.prefix}:ExecutionListener`) ?? [];
                    var globalExecutionListenerFields = TaskListeners.filter((value) => {
                        return value.class == "com.makeid.process.base.listener.GlobalExecutionListener";
                    });
                    if (globalExecutionListenerFields.length != 0) {
                        globalExecutionListenerFields = globalExecutionListenerFields[0].fields;

                        // 审批人为空时结束流程
                        globalExecutionListenerFields.filter((value) => {
                            return value.name == "pause";
                        }).length != 0 &&
                        globalExecutionListenerFields.filter((value) => {
                            return value.name == "pause";
                        })[0].expression == "true"
                            ? advancedSetupArr.push("1")
                            : "";

                        // 相邻节点用户自动审批
                        globalExecutionListenerFields.filter((value) => {
                            return value.name == "relyAutoAudit";
                        }).length != 0 &&
                        globalExecutionListenerFields.filter((value) => {
                            return value.name == "relyAutoAudit";
                        })[0].expression == "true"
                            ? advancedSetupArr.push("0")
                            : "";

                        this.$emit("globalAdvancedSetup", advancedSetupArr);
                    }
                }
                this.bpmnModeler.get("commandStack").clear();
                func ? func() : "";
            } catch (e) {
                console.error(`[Process Designer Warn]: ${e?.message || e}`);
            }
        },

        // 下载流程图到本地
        async downloadProcess(type, name) {
            try {
                const _this = this;
                // 按需要类型创建文件并下载
                if (type === "xml" || type === "bpmn") {
                    const { err, xml } = await this.bpmnModeler.saveXML();
                    // 读取异常时抛出异常
                    if (err) {
                        console.error(`[Process Designer Warn ]: ${err.message || err}`);
                    }
                    let { href, filename } = _this.setEncoded(type.toUpperCase(), name, xml);
                    downloadFunc(href, filename);
                } else {
                    const { err, svg } = await this.bpmnModeler.saveSVG();
                    // 读取异常时抛出异常
                    if (err) {
                        return console.error(err);
                    }
                    let { href, filename } = _this.setEncoded("SVG", name, svg);
                    downloadFunc(href, filename);
                }
            } catch (e) {
                console.error(`[Process Designer Warn ]: ${e.message || e}`);
            }
            // 文件下载方法
            function downloadFunc(href, filename) {
                if (href && filename) {
                    let a = document.createElement("a");
                    a.download = filename; //指定下载的文件名
                    a.href = href; //  URL对象
                    a.click(); // 模拟点击
                    URL.revokeObjectURL(a.href); // 释放URL 对象
                }
            }
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

        // 加载本地文件
        importLocalFile() {
            const that = this;
            const file = this.$refs.refFile.files[0];
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function () {
                let xmlStr = this.result;
                that.createNewDiagram(xmlStr, () => {
                    that.processReZoom();
                    document.getElementById("files").value = "";
                });
            };
        },
        /* ------------------------------------------------ refs methods ------------------------------------------------------ */
        downloadProcessAsXml() {
            this.downloadProcess("xml");
        },
        downloadProcessAsBpmn() {
            this.downloadProcess("bpmn");
        },
        downloadProcessAsSvg() {
            this.downloadProcess("svg");
        },
        processSimulation() {
            this.simulationStatus = !this.simulationStatus;
            this.simulation && this.bpmnModeler.get("toggleMode").toggleMode();
        },
        processRedo() {
            this.isRedoing = true;
            this.bpmnModeler.get("commandStack").redo();
        },
        processUndo() {
            this.isUndoing = true;
            this.bpmnModeler.get("commandStack").undo();
        },
        processZoomIn(zoomStep = 0.1) {
            let newZoom = Math.floor(this.defaultZoom * 100 + zoomStep * 100) / 100;
            if (newZoom > 4) {
                throw new Error("[Process Designer Warn ]: The zoom ratio cannot be greater than 4");
            }
            this.defaultZoom = newZoom;
            this.bpmnModeler.get("canvas").zoom(this.defaultZoom);
        },
        processZoomOut(zoomStep = 0.1) {
            let newZoom = Math.floor(this.defaultZoom * 100 - zoomStep * 100) / 100;
            if (newZoom < 0.2) {
                throw new Error("[Process Designer Warn ]: The zoom ratio cannot be less than 0.2");
            }
            this.defaultZoom = newZoom;
            this.bpmnModeler.get("canvas").zoom(this.defaultZoom);
        },
        processZoomTo(newZoom = 1) {
            if (newZoom < 0.2) {
                throw new Error("[Process Designer Warn ]: The zoom ratio cannot be less than 0.2");
            }
            if (newZoom > 4) {
                throw new Error("[Process Designer Warn ]: The zoom ratio cannot be greater than 4");
            }
            this.defaultZoom = newZoom;
            this.bpmnModeler.get("canvas").zoom(newZoom);
        },
        processReZoom() {
            this.defaultZoom = 1;
            this.bpmnModeler.get("canvas").zoom("fit-viewport", "auto");
            this.bpmnModeler.get("canvas").zoom(this.defaultZoom);
        },
        processRestart() {
            this.$confirm("是否清空画布(不可撤销)？", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                this.recoverable = false;
                this.revocable = false;
                this.createNewDiagram(null, () => {
                    this.createDefaultDiagram();
                });
            });
        },
        elementsAlign(align) {
            const Align = this.bpmnModeler.get("alignElements");
            const Selection = this.bpmnModeler.get("selection");
            const SelectedElements = Selection.get();
            if (!SelectedElements || SelectedElements.length <= 1) {
                this.$message.warning("请按住 Shift 键选择多个元素对齐");
                return;
            }
            this.$confirm("自动对齐可能造成图形变形，是否继续？", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => Align.trigger(SelectedElements, align));
        },
        /*-----------------------------    方法结束     ---------------------------------*/
        previewProcessXML() {
            this.bpmnModeler.saveXML({ format: true }).then(({ xml }) => {
                this.previewResult = xml;
                this.previewType = "xml";
                this.previewModelVisible = true;
            });
        },
        previewProcessJson() {
            const newConvert = new X2JS();
            this.bpmnModeler.saveXML({ format: true }).then(({ xml }) => {
                const { definitions } = newConvert.xml2js(xml);
                if (definitions) {
                    this.previewResult = JSON.stringify(definitions, null, 4);
                } else {
                    this.previewResult = "";
                }

                this.previewType = "json";
                this.previewModelVisible = true;
            });
        },
    },
};
</script>
<style lang="scss">
#my-process-designer {
    overflow: hidden;
}
.my-process-designer__canvas {
    .bjs-container {
        border: none;
    }
}
.process-preview-dialog {
    .el-dialog {
        height: 90% !important;
        .el-dialog__body {
            textarea {
                height: 100%;
                border: 1px solid #ddd;
            }
        }
    }
}
</style>
