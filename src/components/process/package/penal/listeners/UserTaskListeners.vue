<template>
    <div class="panel-tab__content">
        <el-table :data="elementListenersList" size="mini" border>
            <el-table-column label="序号" width="50px" type="index" />
            <el-table-column label="事件类型" min-width="80px" show-overflow-tooltip :formatter="(row) => listenerEventTypeObject[row.event]" />
            <!-- <el-table-column label="事件id" min-width="80px" prop="id" show-overflow-tooltip /> -->
            <el-table-column label="监听器类型" min-width="80px" show-overflow-tooltip :formatter="(row) => listenerTypeObject[row.listenerType]" />
            <el-table-column label="操作" width="90px">
                <template slot-scope="{ row, $index }">
                    <el-button :disabled="disabledShow(row)" size="mini" type="text" @click="openListenerForm(row, $index)">编辑</el-button>
                    <el-divider direction="vertical" />
                    <el-button :disabled="disabledShow(row)" size="mini" type="text" :style="{ color: disabledShow(row) ? '' : '#ff4d4f' }" @click="removeListener(row, $index)">移除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="element-drawer__button">
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="openListenerForm(null)">添加监听器</el-button>
        </div>

        <!-- 监听器 编辑/创建 部分 -->
        <el-dialog
            v-adaptive="{ type: 'dialog' }"
            title="任务监听器"
            :close-on-click-modal="false"
            append-to-body
            destroy-on-close
            :visible.sync="listenerFormModelVisible"
            custom-class="makeid-table-dialog"
            class="process-dialog"
        >
            <el-form style="margin-bottom: -15px" size="small" :model="listenerForm" :rules="listenerRule" label-width="96px" ref="listenerFormRef" @submit.native.prevent>
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="事件类型" prop="event">
                            <el-select @change="eventChange" v-model="listenerForm.event">
                                <el-option v-for="i in Object.keys(listenerEventTypeObject)" :key="i" :label="listenerEventTypeObject[i]" :value="i" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="12">
                        <el-form-item label="监听器ID" prop="id">
                            <el-input v-model="listenerForm.id" clearable placeholder="请输入监听器ID" />
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="12">
                        <el-form-item label="监听器类型" prop="listenerType">
                            <el-select @change="listenerTypeChange" v-model="listenerForm.listenerType">
                                <el-option v-for="i in Object.keys(listenerTypeObject)" :key="i" :label="listenerTypeObject[i]" :value="i" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item v-if="listenerForm.listenerType === 'classListener'" label="Java类" prop="class" key="listener-class">
                            <el-input v-model="listenerForm.class" clearable placeholder="请输入Java类" /> </el-form-item
                    ></el-col>
                    <el-col :span="24">
                        <el-form-item v-if="listenerForm.listenerType === 'expressionListener'" label="表达式" prop="expression" key="listener-expression">
                            <el-input v-model="listenerForm.expression" clearable placeholder="请输入表达式" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item v-if="listenerForm.listenerType === 'delegateExpressionListener'" label="代理表达式" prop="delegateExpression" key="listener-delegate">
                            <el-input v-model="listenerForm.delegateExpression" clearable placeholder="请输入代理表达式" /> </el-form-item
                    ></el-col>
                    <template v-if="listenerForm.listenerType === 'scriptListener'">
                        <el-col :span="12">
                            <el-form-item label="脚本格式" prop="scriptFormat" key="listener-script-format">
                                <el-input v-model="listenerForm.scriptFormat" clearable placeholder="请输入脚本格式" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="脚本类型" prop="scriptType" key="listener-script-type">
                                <el-select @change="scriptTypeChange" v-model="listenerForm.scriptType">
                                    <el-option label="内联脚本" value="inlineScript" />
                                    <el-option label="外部脚本" value="externalScript" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item v-if="listenerForm.scriptType === 'inlineScript'" label="脚本内容" prop="value" key="listener-script">
                                <el-input v-model="listenerForm.value" clearable placeholder="请输入脚本内容" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item v-if="listenerForm.scriptType === 'externalScript'" label="资源地址" prop="resource" key="listener-resource">
                                <el-input v-model="listenerForm.resource" clearable placeholder="请输入资源地址" />
                            </el-form-item>
                        </el-col>
                    </template>
                    <template v-if="listenerForm.event === 'timeout'">
                        <el-col :span="24">
                            <el-form-item label="定时器类型" prop="eventDefinitionType" key="eventDefinitionType">
                                <el-select @change="eventDefinitionTypeChange" v-model="listenerForm.eventDefinitionType">
                                    <el-option label="日期" value="date" />
                                    <el-option label="持续时长" value="duration" />
                                    <el-option label="循环" value="cycle" />
                                    <el-option label="无" value="null" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item
                                v-if="!!listenerForm.eventDefinitionType && listenerForm.eventDefinitionType !== 'null'"
                                label="定时器"
                                prop="eventTimeDefinitions"
                                key="eventTimeDefinitions"
                            >
                                <el-input v-model="listenerForm.eventTimeDefinitions" clearable placeholder="请输入定时器" />
                            </el-form-item>
                        </el-col>
                    </template>
                </el-row>
            </el-form>
            <el-divider />
            <p class="listener-filed__title">
                <span><i class="el-icon-menu"></i>注入字段：</span>
                <el-button size="mini" type="primary" @click="openListenerFieldForm(null)">添加字段</el-button>
            </p>
            <el-table :data="fieldsListOfListener" size="mini" max-height="240" border fit style="flex: none">
                <el-table-column label="序号" width="50px" type="index" />
                <el-table-column label="字段名称" min-width="100px" prop="name" />
                <el-table-column label="字段类型" min-width="80px" show-overflow-tooltip :formatter="(row) => fieldTypeObject[row.fieldType]" />
                <el-table-column label="字段值/表达式" min-width="100px" show-overflow-tooltip :formatter="(row) => row.string || row.expression" />
                <el-table-column label="操作" width="100px">
                    <template slot-scope="{ row, $index }">
                        <el-button size="mini" type="text" @click="openListenerFieldForm(row, $index)">编辑</el-button>
                        <el-divider direction="vertical" />
                        <el-button size="mini" type="text" style="color: #ff4d4f" @click="removeListenerField(row, $index)">移除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="listenerFormModelVisible = false">取消</el-button>
                <el-button type="primary" size="medium" @click="saveListenerConfig">保存</el-button>
            </span>
        </el-dialog>

        <!-- 注入西段 编辑/创建 部分 -->
        <el-dialog
            v-adaptive="{ type: 'dialog' }"
            :close-on-click-modal="false"
            custom-class="makeid-table-dialog"
            title="字段配置"
            :visible.sync="listenerFieldFormModelVisible"
            width="600px"
            append-to-body
            destroy-on-close
            class="process-dialog"
        >
            <el-form :model="listenerFieldForm" :rules="listenerRule" size="mini" label-width="96px" ref="listenerFieldFormRef" @submit.native.prevent>
                <el-form-item label="字段名称" prop="name">
                    <el-input v-model="listenerFieldForm.name" clearable placeholder="请输入字段名称" />
                </el-form-item>
                <el-form-item label="字段类型" prop="fieldType">
                    <el-select @change="fieldTypeChange" v-model="listenerFieldForm.fieldType">
                        <el-option v-for="i in Object.keys(fieldTypeObject)" :key="i" :label="fieldTypeObject[i]" :value="i" />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="listenerFieldForm.fieldType === 'string'" label="字段值" prop="string" key="field-string">
                    <el-input v-model="listenerFieldForm.string" clearable placeholder="请输入字段值" />
                </el-form-item>
                <el-form-item v-if="listenerFieldForm.fieldType === 'expression'" label="表达式" prop="expression" key="field-expression">
                    <el-input v-model="listenerFieldForm.expression" clearable placeholder="请输入表达式" />
                </el-form-item>
            </el-form>
            <template slot="footer">
                <el-button size="mini" @click="listenerFieldFormModelVisible = false">取 消</el-button>
                <el-button size="mini" type="primary" @click="saveListenerFiled">确 定</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script>
import { createListenerObject, updateElementExtensions } from "../../utils";
import { initListenerForm, initListenerType, eventType, listenerType, fieldType } from "./utilSelf";

export default {
    name: "UserTaskListeners",
    props: {
        id: String,
        type: String,
    },
    inject: {
        prefix: "prefix",
        width: "width",
    },
    data() {
        return {
            elementListenersList: [],
            listenerEventTypeObject: eventType,
            listenerTypeObject: listenerType,
            listenerFormModelVisible: false,
            listenerForm: {},
            listenerRule: {
                id: [
                    {
                        required: true,
                        message: "监听器ID不能为空",
                        trigger: "blur",
                    },
                ],
                event: [
                    {
                        required: true,
                        message: "事件类型不能为空",
                        trigger: "blur",
                    },
                ],
                listenerType: [
                    {
                        required: true,
                        message: "监听器类型不能为空",
                        trigger: "blur",
                    },
                ],
                class: [
                    {
                        required: true,
                        message: "Java类不能为空",
                        trigger: "blur",
                    },
                ],
                expression: [
                    {
                        required: true,
                        message: "表达式不能为空",
                        trigger: "blur",
                    },
                ],
                delegateExpression: [
                    {
                        required: true,
                        message: "代理表达式不能为空",
                        trigger: "blur",
                    },
                ],
                scriptFormat: [
                    {
                        required: true,
                        message: "脚本格式不能为空",
                        trigger: "blur",
                    },
                ],
                scriptType: [
                    {
                        required: true,
                        message: "脚本类型不能为空",
                        trigger: "blur",
                    },
                ],
                value: [
                    {
                        required: true,
                        message: "脚本内容不能为空",
                        trigger: "blur",
                    },
                ],
                resource: [
                    {
                        required: true,
                        message: "资源地址不能为空",
                        trigger: "blur",
                    },
                ],
                name: [
                    {
                        required: true,
                        message: "字段名称不能为空",
                        trigger: "blur",
                    },
                ],
                fieldType: [
                    {
                        required: true,
                        message: "字段类型不能为空",
                        trigger: "blur",
                    },
                ],
                string: [
                    {
                        required: true,
                        message: "字段值不能为空",
                        trigger: "blur",
                    },
                ],
                eventDefinitionType: [
                    {
                        required: true,
                        message: "定时器类型",
                        trigger: "blur",
                    },
                ],
                eventTimeDefinitions: [
                    {
                        required: true,
                        message: "定时器",
                        trigger: "blur",
                    },
                ],
            },
            fieldTypeObject: fieldType,
            fieldsListOfListener: [],
            listenerFieldFormModelVisible: false, // 监听器 注入字段表单弹窗 显示状态
            editingListenerIndex: -1, // 监听器所在下标，-1 为新增
            editingListenerFieldIndex: -1, // 字段所在下标，-1 为新增
            listenerFieldForm: {}, // 监听器 注入字段 详情表单
        };
    },
    watch: {
        id: {
            immediate: true,
            handler(val) {
                val && val.length && this.$nextTick(() => this.resetListenersList());
            },
        },
    },

    methods: {
        // 定时器类型
        eventDefinitionTypeChange(val) {
            if (val == "null") {
                this.listenerForm = Object.assign({}, this.listenerForm, {
                    eventTimeDefinitions: "",
                });
            }
        },

        // 事件类型
        eventChange(val) {
            if (val == "timeout") {
                this.listenerForm = Object.assign({}, this.listenerForm, {
                    eventDefinitionType: "",
                    eventTimeDefinitions: "",
                });
            }
        },

        // 监听器类型改变
        listenerTypeChange() {
            this.listenerForm = Object.assign({}, this.listenerForm, {
                class: "",
                expression: "",
                delegateExpression: "",
                scriptFormat: "",
                scriptType: "内联脚本",
                scriptType: "",
                value: "",
                resource: "",
            });
        },

        // 脚本类型
        scriptTypeChange() {
            this.listenerForm = Object.assign({}, this.listenerForm, {
                value: "",
                resource: "",
            });
        },

        // 字段类型改变
        fieldTypeChange() {
            this.listenerFieldForm = Object.assign({}, this.listenerFieldForm, {
                string: "",
                expression: "",
            });
        },

        disabledShow(row) {
            return row.class == "com.makeid.process.base.listener.TaskCompileListener" || row.class == "com.makeid.process.base.listener.TaskCreateListener";
        },
        resetListenersList() {
            this.bpmnElement = window.bpmnInstances.bpmnElement;
            this.otherExtensionList = [];
            this.bpmnElementListeners = this.bpmnElement.businessObject?.extensionElements?.values?.filter((ex) => ex.$type === `${this.prefix}:TaskListener`) ?? [];
            this.elementListenersList = this.bpmnElementListeners.map((listener) => initListenerType(listener));
            this.elementListenersList = this.elementListenersList.filter((value) => {
                return value.class != "com.makeid.process.base.listener.TaskCompileListener" && value.class != "com.makeid.process.base.listener.TaskCreateListener";
            });
        },
        openListenerForm(listener, index) {
            if (listener) {
                this.listenerForm = initListenerForm(listener);
                this.editingListenerIndex = index;
            } else {
                this.listenerForm = {};
                this.editingListenerIndex = -1; // 标记为新增
            }
            if (listener && listener.fields) {
                this.fieldsListOfListener = listener.fields.map((field) => ({
                    ...field,
                    fieldType: field.string ? "string" : "expression",
                }));
            } else {
                this.fieldsListOfListener = [];
                this.$set(this.listenerForm, "fields", []);
            }
            // 打开侧边栏并清楚验证状态
            this.listenerFormModelVisible = true;
            this.$nextTick(() => {
                if (this.$refs["listenerFormRef"]) this.$refs["listenerFormRef"].clearValidate();
            });
        },
        // 移除监听器
        removeListener(listener, index) {
            this.$confirm("确认移除该监听器吗？", "提示", {
                confirmButtonText: "确 认",
                cancelButtonText: "取 消",
            })
                .then(() => {
                    this.bpmnElementListeners.splice(index + 2, 1);
                    this.elementListenersList.splice(index, 1);
                    this.otherExtensionList = this.bpmnElement.businessObject?.extensionElements?.values?.filter((ex) => ex.$type !== `${this.prefix}:TaskListener`) ?? [];
                    updateElementExtensions(this.bpmnElement, this.otherExtensionList.concat(this.bpmnElementListeners));
                })
                .catch(() => console.info("操作取消"));
        },
        // 保存监听器
        async saveListenerConfig() {
            let validateStatus = await this.$refs["listenerFormRef"].validate();
            if (!validateStatus) return; // 验证不通过直接返回
            const listenerObject = createListenerObject(this.listenerForm, true, this.prefix);
            if (this.editingListenerIndex === -1) {
                this.bpmnElementListeners.push(listenerObject);
                this.elementListenersList.push(this.listenerForm);
            } else {
                this.bpmnElementListeners.splice(this.editingListenerIndex + 2, 1, listenerObject);
                this.elementListenersList.splice(this.editingListenerIndex, 1, this.listenerForm);
            }
            // 保存其他配置
            this.otherExtensionList = this.bpmnElement.businessObject?.extensionElements?.values?.filter((ex) => ex.$type !== `${this.prefix}:TaskListener`) ?? [];
            updateElementExtensions(this.bpmnElement, this.otherExtensionList.concat(this.bpmnElementListeners));
            // 4. 隐藏侧边栏
            this.listenerFormModelVisible = false;
            this.listenerForm = {};
        },
        // 打开监听器字段编辑弹窗
        openListenerFieldForm(field, index) {
            this.listenerFieldForm = field ? JSON.parse(JSON.stringify(field)) : {};
            this.editingListenerFieldIndex = field ? index : -1;
            this.listenerFieldFormModelVisible = true;
            this.$nextTick(() => {
                if (this.$refs["listenerFieldFormRef"]) this.$refs["listenerFieldFormRef"].clearValidate();
            });
        },
        // 保存监听器注入字段
        async saveListenerFiled() {
            let validateStatus = await this.$refs["listenerFieldFormRef"].validate();
            if (!validateStatus) return; // 验证不通过直接返回
            if (this.editingListenerFieldIndex === -1) {
                this.fieldsListOfListener.push(this.listenerFieldForm);
                this.listenerForm.fields.push(this.listenerFieldForm);
            } else {
                this.fieldsListOfListener.splice(this.editingListenerFieldIndex, 1, this.listenerFieldForm);
                this.listenerForm.fields.splice(this.editingListenerFieldIndex, 1, this.listenerFieldForm);
            }
            this.listenerFieldFormModelVisible = false;
            this.$nextTick(() => (this.listenerFieldForm = {}));
        },
        // 移除监听器字段
        removeListenerField(field, index) {
            this.$confirm("确认移除该字段吗？", "提示", {
                confirmButtonText: "确 认",
                cancelButtonText: "取 消",
            })
                .then(() => {
                    this.fieldsListOfListener.splice(index, 1);
                    this.listenerForm.fields.splice(index, 1);
                })
                .catch(() => console.info("操作取消"));
        },
    },
};
</script>
