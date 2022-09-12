<template>
    <div class="panel-tab__content">
        <el-form size="mini" label-width="90px" @submit.native.prevent>
            <!-- <el-form-item label="异步延续">
                <el-checkbox v-model="taskConfigForm.asyncBefore" label="异步前" @change="changeTaskAsync" />
                <el-checkbox v-model="taskConfigForm.asyncAfter" label="异步后" @change="changeTaskAsync" />
                <el-checkbox v-model="taskConfigForm.exclusive" v-if="taskConfigForm.asyncAfter || taskConfigForm.asyncBefore" label="排除" @change="changeTaskAsync" />
            </el-form-item>
            <component :is="witchTaskComponent" v-bind="$props" /> -->
            <UserTask
                v-if="settingType == 'task'"
                :userData="userData"
                :roleData="roleData"
                :deptList="deptList"
                :deptData="deptData"
                :id="id"
                :type="type"
                ref="userTask"
                @getAddListener="getAddListener"
            ></UserTask>
            <CarboncopyTask
                v-if="settingType == 'carboncopy'"
                :userData="userData"
                :roleData="roleData"
                :deptList="deptList"
                :deptData="deptData"
                :id="id"
                :type="type"
                ref="carboncopyTask"
                @getAddListener="getAddListener"
            ></CarboncopyTask>
        </el-form>
    </div>
</template>

<script>
import UserTask from "./task-components/UserTask";
import CarboncopyTask from "./task-components/CarboncopyTask";

export default {
    name: "ElementTaskConfig",
    components: { UserTask, CarboncopyTask },
    props: {
        id: String,
        type: String,
        settingType: String,
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
    data() {
        return {
            taskConfigForm: {
                asyncAfter: false,
                asyncBefore: false,
                exclusive: false,
            },
            witchTaskComponent: "",
            installedComponent: {
                // 手工任务与普通任务一致，不需要其他配置
                // 接收消息任务，需要在全局下插入新的消息实例，并在该节点下的 messageRef 属性绑定该实例
                // 发送任务、服务任务、业务规则任务共用一个相同配置
                UserTask: "UserTask", // 用户任务配置
            },
        };
    },
    watch: {
        id: {
            immediate: true,
            handler() {
                this.bpmnElement = window.bpmnInstances.bpmnElement;
                this.taskConfigForm.asyncBefore = this.bpmnElement?.businessObject?.asyncBefore;
                this.taskConfigForm.asyncAfter = this.bpmnElement?.businessObject?.asyncAfter;
                this.taskConfigForm.exclusive = this.bpmnElement?.businessObject?.exclusive;
            },
        },
        type: {
            immediate: true,
            handler() {
                this.witchTaskComponent = this.installedComponent[this.type];
            },
        },
    },
    methods: {
        resetListenersList() {
            this.$refs.userTask ? this.$refs.userTask.resetTaskForm() : "";
            this.$refs.carboncopyTask ? this.$refs.carboncopyTask.resetTaskForm() : "";
        },
        getAddListener(updatelistenners) {
            this.$emit("getAddListener", updatelistenners);
        },
        changeTaskAsync() {
            if (!this.taskConfigForm.asyncBefore && !this.taskConfigForm.asyncAfter) {
                this.taskConfigForm.exclusive = false;
            }
            window.bpmnInstances.modeling.updateProperties(window.bpmnInstances.bpmnElement, {
                ...this.taskConfigForm,
            });
        },
    },
};
</script>
