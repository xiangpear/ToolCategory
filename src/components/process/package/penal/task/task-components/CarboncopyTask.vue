<template>
    <!-- 抄送设置 -->
    <div style="margin-top: 16px" class="carboncopy-task">
        <el-form style="margin-top: 20px" size="small" :model="userTaskForm" label-width="96px" ref="userTaskFormRef" @submit.native.prevent>
            <el-form-item label="指定用户">
                <el-select v-model="userTaskForm.candidateUsers" multiple @change="updateElementTask">
                    <el-option v-for="uk in userData" :key="uk.userId" :label="`${uk.realName}`" :value="`U_${uk.userName}`" />
                </el-select>
            </el-form-item>
            <el-form-item label="指定角色">
                <el-select v-model="userTaskForm.roleCandidateGroups" multiple @change="updateElementTask">
                    <el-option v-for="uk in roleData" :key="'R_' + uk.roleId" :label="`${uk.roleName}`" :value="`R_${uk.roleId}`" />
                </el-select>
            </el-form-item>
            <el-form-item label="指定部门">
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
            <el-form-item label="发起人">
                <el-checkbox v-model="userTaskForm.selfUser" @change="updateElementTask"></el-checkbox>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { isJSON } from "@/utils/index";

export default {
    name: "CarboncopyTask",
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
            userTaskForm: {
                candidateUsers: [],
                candidateGroups: [],
                roleCandidateGroups: [],
                deptCandidateGroups: [],
                deptCheckedKeys: [],
                selfUser: false,
            },

            // 下拉树配置
            deptListProps: {
                label: "name",
                children: "childDepts",
            },

            // 下拉树过滤文字
            filterText: "",

            // 查询部门选择组件显示
            showQueryDept: false,
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
            this.updateElementTask();
        },

        // 重置属性面板
        resetTaskForm() {
            Object.assign(this.$data, this.$options.data());

            var carbonCopyListeners = this.bpmnElement.businessObject?.extensionElements?.values?.filter((ex) => ex.$type === `${this.prefix}:TaskListener`) ?? [];
            var carbonCopyFields = carbonCopyListeners.filter((value) => {
                return value.class == "com.makeid.process.base.listener.TaskCompileListener";
            });
            if (carbonCopyFields.length != 0) {
                carbonCopyFields = carbonCopyFields[0].fields;
                var carbonCopyArrTemp = carbonCopyFields.filter((value) => {
                    return value.name == "carbonCopy";
                });
                var carbonCopy = carbonCopyArrTemp.length != 0 ? carbonCopyArrTemp[0].expression : "";

                var carbonCopyArr = carbonCopy.split(",");
                if (carbonCopyArr.indexOf("S_applyUser") != -1) {
                    this.$set(this.userTaskForm, "selfUser", true);
                }
                this.$set(
                    this.userTaskForm,
                    "candidateUsers",
                    carbonCopyArr.filter((value) => {
                        return value.indexOf("U_") != -1;
                    })
                );
                this.$set(
                    this.userTaskForm,
                    "roleCandidateGroups",
                    carbonCopyArr.filter((value) => {
                        return value.indexOf("R_") != -1;
                    })
                );
                this.$set(
                    this.userTaskForm,
                    "deptCandidateGroups",
                    carbonCopyArr.filter((value) => {
                        return value.indexOf("D_") != -1;
                    })
                );
            }
        },

        // 更新属性
        updateElementTask() {
            console.log(this.userTaskForm);

            var carbonCopyArr = [...this.userTaskForm.candidateUsers, ...this.userTaskForm.roleCandidateGroups, ...this.userTaskForm.deptCandidateGroups];
            if (this.userTaskForm.selfUser) {
                carbonCopyArr.push("S_applyUser");
            }

            updateListenerProp("TaskListener", "com.makeid.process.base.listener.TaskCompileListener", "carbonCopy", carbonCopyArr.join(","));
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
