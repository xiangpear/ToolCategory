<template>
    <div style="margin-top: 16px" class="user-task">
        <el-radio-group :disabled="elementBaseInfo.elementType == 'default'" v-model="userTaskForm.userRadio" @change="updateElementTask">
            <el-radio :label="'candidateUsers'">用户</el-radio>
            <el-radio :label="'roleCandidateGroups'">角色/部门</el-radio>
            <!-- <el-radio :label="'deptCandidateGroups'">部门</el-radio> -->
            <el-radio :label="'selfUser'">发起人</el-radio>
        </el-radio-group>
        <el-form style="margin-top: 20px" size="small" :model="userTaskForm" label-width="100px" ref="userTaskFormRef" @submit.native.prevent>
            <el-form-item label="指定用户" v-if="userTaskForm.userRadio == 'candidateUsers'">
                <el-select v-model="userTaskForm.candidateUsers" multiple @change="updateElementTask('candidateUsers')">
                    <el-option v-for="uk in userData" :key="uk.userId" :label="`${uk.realName}`" :value="`${uk.userName}`" />
                </el-select>
            </el-form-item>
            <el-form-item label="指定角色" v-if="userTaskForm.userRadio == 'roleCandidateGroups'">
                <el-select v-model="userTaskForm.roleCandidateGroups" multiple @change="updateElementTask('roleCandidateGroups')">
                    <el-option v-for="uk in roleData" :key="'R_' + uk.roleId" :label="`${uk.roleName}`" :value="`R_${uk.roleId}`" />
                </el-select>
            </el-form-item>
            <el-form-item label="指定部门" v-if="userTaskForm.userRadio == 'roleCandidateGroups'">
                <el-popover ref="deptListPopover" v-model="showQueryDept" width="408" placement="bottom-start" trigger="click">
                    <el-input v-model="filterText" placeholder="输入关键字进行过滤" style="margin-bottom: 10px" size="medium" />
                    <el-tree
                        ref="deptTree"
                        class="dept-tree"
                        :data="deptList"
                        :props="deptListProps"
                        node-key="deptId"
                        show-checkbox
                        :check-strictly="true"
                        :default-expand-all="false"
                        :default-checked-keys="userTaskForm.deptCheckedKeys"
                        :highlight-current="true"
                        :expand-on-click-node="false"
                        :filter-node-method="filterNode"
                        @check="deptListChangeHandle"
                    />
                </el-popover>
                <el-select @change="deptListSelectChange" v-model="userTaskForm.deptCandidateGroups" v-popover:deptListPopover :readonly="true" multiple popper-class="user-task-group">
                    <el-option v-for="uk in deptData" :key="'D_' + uk.deptId" :label="`${uk.name}`" :value="`D_${uk.deptId}`" />
                </el-select>
            </el-form-item>
            <el-form-item
                label="多人审批方式"
                label-width="100px"
                v-if="
                    (userTaskForm.userRadio == 'candidateUsers' && userTaskForm.candidateUsers && userTaskForm.candidateUsers.length >= 2) ||
                    userTaskForm.userRadio == 'roleCandidateGroups' ||
                    userTaskForm.userRadio == 'deptCandidateGroups'
                "
            >
                <el-radio-group v-model="userTaskForm.moreusertask" @change="updateElementTask('moreusertask')">
                    <el-radio label="1" style="margin-bottom: 5px">会签（需要所有审批人同意）</el-radio>
                    <el-radio label="0" style="margin-top: 5px">或签（一名审批人同意即可）</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="高级审批" label-width="100px">
                <el-checkbox-group v-model="userTaskForm.advancedSetup" @change="updateElementTask('advancedSetup')">
                    <el-checkbox :disabled="elementBaseInfo.elementType == 'default'" label="0" key="0">发起人为当前节点审批者时，自动审批</el-checkbox>
                    <el-form size="small">
                        <el-form-item v-if="userTaskForm.advancedSetup.indexOf('0') != -1" label="">
                            <div>审批条件(格式<span style="color: rgb(49, 191, 119)">json</span>; 示例: <span style="color: rgb(49, 191, 119)">{"flag":"1"}</span>)</div>
                            <el-input v-model="userTaskForm.condition" clearable @change="updateElementTask('condition')" placeholder='请输入审批条件(示例：{"flag":"1"})' />
                        </el-form-item>
                    </el-form>
                    <!-- <el-checkbox label="1" key="1">审批人为空时，流程结束</el-checkbox> -->
                    <el-checkbox label="1" key="1">相邻节点审批者相同时，自动审批</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item v-if="bpmnElement.businessObject.elementType != 'default'" label="驳回设置" label-width="100px">
                <el-radio-group v-model="userTaskForm.rejectStatus" @change="updateElementTask('rejectStatus')">
                    <div style="margin-bottom: 10px">
                        <el-radio label="1">发起人</el-radio>
                        <el-radio label="2">上一节点</el-radio>
                    </div>
                    <el-radio label="3" style="margin-right: 44px">结束</el-radio>
                    <el-radio label="4">任意节点</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item v-if="userTaskForm.rejectStatus == '4'" label="选择驳回节点">
                <el-select v-model="userTaskForm.rejectElement" clearable @change="updateElementTask('rejectElement')">
                    <el-option v-for="ele in userTaskList" :key="ele.id" :label="`${ele.businessObject.name}`" :value="`${ele.id}`" />
                </el-select>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { createListenerObject, updateElementExtensions } from "../../../utils";
// import { initListenerType, initListenerForm, listenerType, fieldType } from "./utilSelf";
import { isJSON } from "@/utils/index";

export default {
    name: "UserTask",
    props: {
        id: String,
        type: String,
        userData: {
            type: Array,
            default: () => {
                return [];
            },
        },
        roleData: {
            type: Array,
            default: () => {
                return [];
            },
        },
        deptData: {
            type: Array,
            default: () => {
                return [];
            },
        },
        deptList: {
            type: Array,
            default: () => {
                return [];
            },
        },
    },
    inject: {
        prefix: "prefix",
    },
    data() {
        return {
            defaultTaskForm: {
                assignee: "${signer}",
                candidateUsers: [],
                candidateGroups: [],
                roleCandidateGroups: [],
                deptCandidateGroups: [],
                deptCheckedKeys: [],
                userRadio: "candidateUsers",
                moreusertask: "",
                advancedSetup: [],
                rejectStatus: "",
                rejectElement: "",
            },
            userTaskForm: {
                advancedSetup: [],
            },
            elementBaseInfo: {},

            // 下拉树配置
            deptListProps: {
                label: "name",
                children: "childDepts",
            },

            // 下拉树过滤文字
            filterText: "",

            // 查询部门选择组件显示
            showQueryDept: false,

            userTaskList: [],
        };
    },
    watch: {
        id: {
            immediate: true,
            handler() {
                this.bpmnElement = window.bpmnInstances.bpmnElement;
                this.$nextTick(() => this.resetTaskForm());
            },
        },
        filterText(val) {
            this.$refs.deptTree.filter(val);
        },
    },
    created() {},
    methods: {
        // 下拉树节点过滤
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },

        // 部门下拉框变更
        deptListSelectChange(event) {
            this.userTaskForm.deptCandidateGroups = event;
            var checkArr = event.map((value) => {
                return value.replace("D_", "");
            });
            this.$refs.deptTree.setCheckedKeys(checkArr);
            this.updateElementTask("deptCandidateGroups");
        },

        // 查询框下拉树节点选择
        deptListChangeHandle(event) {
            var index = this.userTaskForm.deptCandidateGroups.indexOf("D_" + event.deptId);
            if (index == -1) {
                this.userTaskForm.deptCandidateGroups.push("D_" + event.deptId);
            } else {
                this.userTaskForm.deptCandidateGroups.splice(index, 1);
            }
            this.updateElementTask("deptCandidateGroups");
        },

        // 重置属性面板
        resetTaskForm() {
            Object.assign(this.$data, this.$options.data());

            // 所有用户任务节点
            this.userTaskList = window.bpmnInstances.elementRegistry.filter((item) => item.type === "bpmn:UserTask");
            this.userTaskList = this.userTaskList.filter((value) => {
                return value.id != this.bpmnElement.id;
            });

            for (let key in this.defaultTaskForm) {
                let value;

                if (key === "candidateGroups") {
                    // 角色/部门
                    value = this.bpmnElement?.businessObject[key] ? this.bpmnElement.businessObject[key].split(",") : [];
                    if (value.length > 0) {
                        let userValue = [];
                        let groupValue = [];
                        let groupKeysValue = [];
                        for (let index in value) {
                            if (value[index].slice(0, 1) == "R") {
                                userValue.push(value[index]);
                            }
                            if (value[index].slice(0, 1) == "D") {
                                groupValue.push(value[index]);
                                groupKeysValue.push(value[index].replace("D_", ""));
                            }
                        }
                        if (userValue.length > 0) {
                            this.$set(this.defaultTaskForm, "roleCandidateGroups", userValue);
                        }
                        if (groupValue.length > 0) {
                            this.$set(this.defaultTaskForm, "deptCandidateGroups", groupValue);
                            this.$set(this.defaultTaskForm, "deptCheckedKeys", groupKeysValue);
                        }
                    }
                } else if (key === "candidateUsers") {
                    // 用户
                    value = this.bpmnElement?.businessObject[key] ? this.bpmnElement.businessObject[key].split(",") : [];
                    this.$set(this.userTaskForm, key, value);
                } else if (key === "moreusertask") {
                    // 多人审批方式
                    var moreusertaskListeners = this.bpmnElement.businessObject?.extensionElements?.values?.filter((ex) => ex.$type === `${this.prefix}:TaskListener`) ?? [];
                    var moreusertaskFields = moreusertaskListeners.filter((value) => {
                        return value.class == "com.makeid.process.base.listener.TaskCompileListener";
                    });
                    if (moreusertaskFields.length != 0) {
                        moreusertaskFields = moreusertaskFields[0].fields;
                        var percent = moreusertaskFields.filter((value) => {
                            return value.name == "percent";
                        })[0].expression;
                        this.$set(this.userTaskForm, key, percent);
                    }
                } else if (key == "advancedSetup") {
                    // 高级审批
                    var advancedSetupArr = [];

                    var TaskListeners = this.bpmnElement.businessObject?.extensionElements?.values?.filter((ex) => ex.$type === `${this.prefix}:TaskListener`) ?? [];
                    var TaskListenerFields = TaskListeners.filter((value) => {
                        return value.class == "com.makeid.process.base.listener.TaskCreateListener";
                    });
                    if (TaskListenerFields.length != 0) {
                        TaskListenerFields = TaskListenerFields[0].fields;

                        // 当发起人为下一节点审批者时，自动审批
                        TaskListenerFields.filter((value) => {
                            return value.name == "autoAudit";
                        }).length != 0 &&
                        TaskListenerFields.filter((value) => {
                            return value.name == "autoAudit";
                        })[0].expression == "true"
                            ? advancedSetupArr.push("0")
                            : "";

                        // 相邻节点用户自动审批
                        TaskListenerFields.filter((value) => {
                            return value.name == "relyAutoAudit";
                        }).length != 0 &&
                        TaskListenerFields.filter((value) => {
                            return value.name == "relyAutoAudit";
                        })[0].expression == "true"
                            ? advancedSetupArr.push("1")
                            : "";
                    }
                    this.$set(
                        this.userTaskForm,
                        "condition",
                        TaskListenerFields.filter((value) => {
                            return value.name == "condition";
                        }).length != 0
                            ? TaskListenerFields.filter((value) => {
                                  return value.name == "condition";
                              })[0].expression
                            : "{}"
                    );

                    // 审批人为空时，流程结束
                    // var ExecutionListeners = this.bpmnElement.businessObject?.extensionElements?.values?.filter((ex) => ex.$type === `${this.prefix}:ExecutionListener`) ?? [];
                    // var ExecutionListenerFields = ExecutionListeners.filter((value) => {
                    //     return value.class == "com.makeid.process.base.listener.ExecutionCreateListener";
                    // });
                    // if (ExecutionListenerFields.length != 0) {
                    //     ExecutionListenerFields = ExecutionListenerFields[0].fields;
                    //     ExecutionListenerFields.filter((value) => {
                    //         return value.name == "pause";
                    //     })[0].expression == "true"
                    //         ? advancedSetupArr.push("1")
                    //         : "";
                    // }

                    this.$set(this.userTaskForm, key, advancedSetupArr);
                } else if (key === "rejectStatus") {
                    if (this.bpmnElement.businessObject.elementType != "default") {
                        // 驳回设置
                        var elExtensionElements = this.bpmnElement.businessObject.get("extensionElements");
                        if (elExtensionElements) {
                            // 获取元素表单配置 或者 创建新的表单配置
                            var formData = elExtensionElements.values.filter((ex) => ex.$type === `${this.prefix}:FormProperty`);
                            this.$set(this.userTaskForm, key, formData[0].$attrs.expression);
                        }
                    }
                } else if (key === "rejectElement") {
                    if (this.bpmnElement.businessObject.elementType != "default") {
                        // 驳回设置
                        var elExtensionElements = this.bpmnElement.businessObject.get("extensionElements");
                        if (elExtensionElements) {
                            // 获取元素表单配置 或者 创建新的表单配置
                            var formData = elExtensionElements.values.filter((ex) => ex.$type === `${this.prefix}:FormProperty`);
                            this.$set(this.userTaskForm, key, formData[0].$attrs.name);
                        }
                    }
                } else {
                    value = this.bpmnElement?.businessObject[key] || this.defaultTaskForm[key];
                    this.$set(this.userTaskForm, key, value);
                }
            }
            this.elementBaseInfo = JSON.parse(JSON.stringify(this.bpmnElement.businessObject));
        },

        // 创建多实例
        createMultiInstanceLoopCharacteristics(type) {
            var multiLoopInstance = window.bpmnInstances.moddle.create("bpmn:MultiInstanceLoopCharacteristics");
            window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
                loopCharacteristics: multiLoopInstance,
            });
            var completionCondition = window.bpmnInstances.moddle.create("bpmn:FormalExpression", { body: "${nrOfCompletedInstances/nrOfInstances >= " + type + "}" });
            window.bpmnInstances.modeling.updateModdleProperties(this.bpmnElement, multiLoopInstance, {
                completionCondition,
                collection: "${signList}",
                elementVariable: "signer",
                isSequential: false,
            });
        },

        // 更新属性
        updateElementTask(key) {
            const taskAttr = Object.create(null);
            let updatelistenners = {};

            if (key == "candidateUsers" || key == "roleCandidateGroups" || key == "deptCandidateGroups" || key == "selfUser") {
                taskAttr["candidateUsers"] = "";
                taskAttr["candidateGroups"] = "";
                taskAttr["userRadio"] = key;
                if (key == "deptCandidateGroups") {
                    taskAttr["userRadio"] = "roleCandidateGroups";
                }
            }

            if (this.userTaskForm.userRadio == "selfUser") {
                taskAttr["assignee"] = "${applyUserId}";
                window.bpmnInstances.modeling.updateProperties(this.bpmnElement, { loopCharacteristics: null });
            } else {
                taskAttr["assignee"] = "${signer}";
                this.createMultiInstanceLoopCharacteristics(this.userTaskForm["moreusertask"] ? this.userTaskForm["moreusertask"] : 0);
            }

            switch (key) {
                case "candidateUsers":
                    taskAttr["candidateUsers"] = this.userTaskForm[key].join();
                    break;
                case "roleCandidateGroups":
                    var combineGroups = this.userTaskForm["deptCandidateGroups"].length != 0 ? this.userTaskForm["deptCandidateGroups"].join() : [];
                    taskAttr["candidateGroups"] =
                        combineGroups.length == 0 ? this.userTaskForm[key].join() : this.userTaskForm[key].length == 0 ? combineGroups : combineGroups + "," + this.userTaskForm[key].join();
                    break;
                case "deptCandidateGroups":
                    var combineGroups = this.userTaskForm["roleCandidateGroups"].length != 0 ? this.userTaskForm["roleCandidateGroups"].join() : [];
                    taskAttr["candidateGroups"] =
                        combineGroups.length == 0 ? this.userTaskForm[key].join() : this.userTaskForm[key].length == 0 ? combineGroups : combineGroups + "," + this.userTaskForm[key].join();
                    break;
                case "moreusertask":
                    updateListenerProp("TaskListener", "com.makeid.process.base.listener.TaskCompileListener", "percent", this.userTaskForm[key]);
                    window.bpmnInstances.modeling.updateProperties(this.bpmnElement, { loopCharacteristics: null });
                    this.createMultiInstanceLoopCharacteristics(this.userTaskForm[key]);
                    this.$emit("getAddListener", updatelistenners);
                    break;
                case "advancedSetup":
                    // 当发起人为下一节点审批者时，自动审批
                    updateListenerProp("TaskListener", "com.makeid.process.base.listener.TaskCreateListener", "autoAudit", this.userTaskForm[key].indexOf("0") != -1 ? "true" : "false");

                    // 审批人为空时，流程结束
                    // updateListenerProp("ExecutionListener","com.makeid.process.base.listener.ExecutionCreateListener", "pause", this.userTaskForm[key].indexOf("1") != -1 ? "true" : "false");

                    // 相邻节点用户自动审批
                    updateListenerProp("TaskListener", "com.makeid.process.base.listener.TaskCreateListener", "relyAutoAudit", this.userTaskForm[key].indexOf("1") != -1 ? "true" : "false");

                    this.$emit("getAddListener", updatelistenners);
                    break;

                case "condition":
                    var funcStr = `function getJson(){return ${this.userTaskForm[key]};}`;
                    var funcStrFunc = new Function(`return ${funcStr}`);
                    // 审批条件
                    if (isJSON(JSON.stringify(funcStrFunc()()))) {
                        updateListenerProp("TaskListener", "com.makeid.process.base.listener.TaskCreateListener", "condition", JSON.stringify(funcStrFunc()()));
                    } else {
                        this.msgError("审批条件格式不正确，请重新填写");
                    }
                    break;

                case "rejectStatus":
                    // 驳回设置
                    var elExtensionElements = this.bpmnElement.businessObject.get("extensionElements");
                    // 获取元素表单配置 或者 创建新的表单配置
                    var formData = elExtensionElements.values.filter((ex) => ex.$type === `${this.prefix}:FormProperty`);
                    if (this.userTaskForm.rejectStatus != "4") {
                        window.bpmnInstances.modeling.updateModdleProperties(window.bpmnInstances.bpmnElement, formData[0], {
                            expression: this.userTaskForm.rejectStatus,
                            name: "",
                        });
                    } else {
                        window.bpmnInstances.modeling.updateModdleProperties(window.bpmnInstances.bpmnElement, formData[0], {
                            expression: this.userTaskForm.rejectStatus,
                        });
                    }
                    break;

                case "rejectElement":
                    var elExtensionElements = this.bpmnElement.businessObject.get("extensionElements");
                    // 获取元素表单配置 或者 创建新的表单配置
                    var formData = elExtensionElements.values.filter((ex) => ex.$type === `${this.prefix}:FormProperty`);
                    window.bpmnInstances.modeling.updateModdleProperties(window.bpmnInstances.bpmnElement, formData[0], {
                        name: this.userTaskForm.rejectElement,
                    });
                    break;
            }

            window.bpmnInstances.modeling.updateProperties(this.bpmnElement, taskAttr);
        },
    },
    beforeDestroy() {
        this.bpmnElement = null;
    },
};
</script>
<style lang="scss">
.user-task-group {
    display: none;
}
</style>
