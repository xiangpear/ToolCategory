<template>
    <!--系统设置-系统配置-->
    <div id="system-config">
        <makeid-table-box :isPaginationShow="false">
            <div slot="content">
                <el-tabs :stretch="false" v-model="activeTab">
                    <!-- 常规配置 -->
                    <el-tab-pane label="常规配置" name="basicTab">
                        <el-form class="demo-form-inline" ref="dataFormBasic" :model="dataForm" :rules="basicRule" :label-width="`140px`">
                            <el-row :gutter="10">
                                <el-col class="input-number class_accountLockCount" :span="8">
                                    <el-form-item label="账号无效登录次数:" prop="accountLockCount">
                                        <el-input v-model.number="dataForm.accountLockCount" placeholder="请输入" :disabled="false" :clearable="false" type="number" :min="0" :step="1" />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="10">
                                <el-col class="input-number class_accountLockTime" :span="8">
                                    <el-form-item label="账号锁定时长:" prop="accountLockTime">
                                        <el-input v-model.number="dataForm.accountLockTime" placeholder="请输入" :disabled="false" :clearable="false" type="number" :min="0" :step="1">
                                            <i slot="suffix" style="font-style: normal; margin-right: 5px">分</i>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="10">
                                <el-col class="input-number class_ipLockCount" :span="8">
                                    <el-form-item label="IP无效登录次数:" prop="ipLockCount">
                                        <el-input v-model.number="dataForm.ipLockCount" placeholder="请输入" :disabled="false" :clearable="false" type="number" :min="0" :step="1" />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="10">
                                <el-col class="input-number class_ipLockTime" :span="8">
                                    <el-form-item label="IP锁定时长:" prop="ipLockTime">
                                        <el-input v-model.number="dataForm.ipLockTime" placeholder="请输入" :disabled="false" :clearable="false" type="number" :min="0" :step="1">
                                            <i slot="suffix" style="font-style: normal; margin-right: 5px">分</i>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="10">
                                <el-col class="input-number class_sameOriginAccess" :span="4">
                                    <el-form-item label="同源访问:" prop="sameOriginAccess">
                                        <el-switch v-model="dataForm.sameOriginAccess" :active-value="true" :inactive-value="false" />
                                    </el-form-item>
                                </el-col>
                                <el-col class="input-number class_singleLoginAccess" :span="4">
                                    <el-form-item label="单一登录:" prop="singleLoginAccess">
                                        <el-switch v-model="dataForm.singleLoginAccess" :active-value="true" :inactive-value="false" />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <div style="margin-left: 140px">
                                <el-button type="primary" size="small" @click="dataFormSubmit(1)" :loading="dialogLoading">保存</el-button>
                                <el-button type="primary" plain size="small" @click="flushData()">刷新</el-button>
                            </div>
                        </el-form>
                    </el-tab-pane>

                    <!-- 密码策略 -->
                    <el-tab-pane label="密码策略" name="passwordTab">
                        <el-form class="demo-form-inline" ref="dataFormPwd" :model="dataForm" :rules="passwordRule" :label-width="`120px`">
                            <el-row :gutter="10">
                                <el-col class="input-number class_pwdLength" :span="24">
                                    <el-form-item label="密码组成:" prop="pwdStrategy">
                                        <el-checkbox-group v-model="dataForm.pwdStrategy">
                                            <el-checkbox label="1" key="1">小写字母</el-checkbox>
                                            <el-checkbox label="2">大写字母</el-checkbox>
                                            <el-checkbox label="3">数字</el-checkbox>
                                            <el-checkbox label="4">特殊字符（!@#$%^&*?）</el-checkbox>
                                        </el-checkbox-group>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="10">
                                <el-col class="input-number class_pwdLength" :span="8">
                                    <el-form-item label="密码长度:" prop="pwdLength">
                                        <el-input v-model.number="dataForm.pwdLength" placeholder="请输入" :disabled="false" :clearable="false" type="number" :min="6" :max="32" :step="1">
                                            <i slot="suffix" style="font-style: normal; margin-right: 5px">至32位</i>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="10">
                                <el-col class="input-number class_pwdCycle" :span="8">
                                    <el-form-item label="密码更换周期:" prop="pwdCycle">
                                        <el-input v-model.number="dataForm.pwdCycle" placeholder="请输入" :disabled="false" :clearable="false" type="number" :min="0" :step="1">
                                            <i slot="suffix" style="font-style: normal; margin-right: 5px">天</i>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <div style="margin-left: 120px">
                                <el-button type="primary" size="small" @click="dataFormSubmit(2)" :loading="dialogLoading">保存</el-button>
                                <el-button type="primary" plain size="small" @click="flushData()">刷新</el-button>
                            </div>
                        </el-form>
                    </el-tab-pane>

                    <!-- 锁定IP -->
                    <el-tab-pane label="锁定IP" name="ipTab">
                        <el-form class="demo-form-inline" ref="dataFormIp" :model="dataForm" :label-width="`100px`">
                            <el-row :gutter="10">
                                <el-col class="input-number class_pwdLength" :span="24">
                                    <el-form-item label="锁定IP:" prop="pwdStrategy">
                                        <el-select v-model="dataForm.selectLockIp" multiple placeholder="请选择锁定IP">
                                            <el-option v-for="item in dataForm.ips" :key="item" :label="item" :value="item"> </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <div style="margin-left: 100px">
                                <el-button type="primary" size="small" @click="dataFormSubmit(3)" :loading="dialogLoading">解锁</el-button>
                                <el-button type="primary" plain size="small" @click="flushData()">刷新</el-button>
                            </div>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </makeid-table-box>
    </div>
</template>

<script>
// 系统配置接口
import * as SysConfigController from "@/api/system/system-config-api";

export default {
    name: "system-config",
    components: {},
    mixins: [],
    data() {
        return {
            // 确认loading
            dialogLoading: false,

            // 激活面板
            activeTab: "basicTab",

            // 表单数据
            dataForm: {
                selectLockIp: [],
                accountLockCount: 0,
                accountLockTime: 0,
                ipLockCount: 0,
                ipLockTime: 0,
                sameOriginAccess: null,
                singleLoginAccess: null,
                pwdLength: 0,
                pwdStrategy: [],
                pwdCycle: 0,
                type: 0,
                ips: [],
            },

            // 常规配置校验
            basicRule: {
                accountLockCount: [
                    { required: true, message: "无效登录次数不能为空", trigger: "blur" },
                    { pattern: /^\+?[0-9]\d*$/, message: "请输入自然数", rigger: "blur" },
                ],
                accountLockTime: [
                    { required: true, message: "锁定时长不能为空", trigger: "blur" },
                    { pattern: /^\+?[0-9]\d*$/, message: "请输入自然数", rigger: "blur" },
                ],
                ipLockCount: [
                    { required: true, message: "无效登录次数不能为空", trigger: "blur" },
                    { pattern: /^\+?[0-9]\d*$/, message: "请输入自然数", rigger: "blur" },
                ],
                ipLockTime: [
                    { required: true, message: "锁定时长不能为空", trigger: "blur" },
                    { pattern: /^\+?[0-9]\d*$/, message: "请输入自然数", rigger: "blur" },
                ],
            },

            // 密码策略校验
            passwordRule: {
                pwdCycle: [
                    { required: true, message: "密码更换周期不能为空", trigger: "blur" },
                    { pattern: /^\+?[0-9]\d*$/, message: "请输入自然数", rigger: "blur" },
                ],
                pwdLength: [
                    { required: true, message: "密码长度不能为空", trigger: "blur" },
                    {
                        type: "number",
                        message: "请输入6-32位之间得整数",
                        trigger: "blur",
                        transform(value) {
                            if (value) {
                                var val = Number(value);
                                if (val >= 6 && val <= 32) {
                                    return val;
                                }
                                return false;
                            }
                            return false;
                        },
                    },
                ],
                pwdStrategy: [{ required: true, message: "密码策略不能为空", trigger: "blur" }],
            },
        };
    },
    created() {},
    mounted() {
        this.init();
    },
    methods: {
        // 初始化
        init() {
            SysConfigController.sysConfigInfo()
                .then((res) => {
                    Object.assign(this.dataForm, res);
                    this.dataForm.selectLockIp = [];
                    // if(!this.dataForm.ips){
                    //   location.reload();
                    // }
                })
                .catch((error) => {
                    console.log(error);
                });
        },

        // 表单提交
        dataFormSubmit(type) {
            this.dataForm.type = type;
            if (type == 1) {
                this.$refs["dataFormBasic"].validate((valid) => {
                    if (valid) {
                        this.dialogLoading = true;
                        SysConfigController.sysConfigUpdte(this.dataForm)
                            .then((res) => {
                                this.dialogLoading = false;
                                this.msgSuccess("保存成功");
                            })
                            .catch((error) => {
                                this.dialogLoading = false;
                                console.log(error);
                            });
                    }
                });
            } else if (type == 2) {
                this.$refs["dataFormPwd"].validate((valid) => {
                    if (valid) {
                        this.dialogLoading = true;
                        SysConfigController.sysConfigUpdte(this.dataForm)
                            .then((res) => {
                                this.dialogLoading = false;
                                this.msgSuccess("保存成功");
                            })
                            .catch((error) => {
                                this.dialogLoading = false;
                                console.log(error);
                            });
                    }
                });
            } else if (type == 3) {
                if (this.dataForm.selectLockIp.length == 0) {
                    this.msgWarning("选中IP不能为空");
                    return;
                }
                this.dialogLoading = true;
                SysConfigController.sysConfigUpdte(this.dataForm)
                    .then((res) => {
                        this.dialogLoading = false;
                        this.msgSuccess("解锁成功");
                        this.flushData();
                    })
                    .catch((error) => {
                        this.dialogLoading = false;
                        console.log(error);
                    });
            }
        },

        // 刷新锁定IP
        flushData() {
            this.init();
        },
    },
};
</script>
<style lang="scss">
#system-config {
    height: 100%;
    .makeid-table-box {
        height: 100%;
        .box-content {
            overflow: hidden;
        }
    }
    .el-tab-pane {
        padding: 15px;
        box-sizing: border-box;
    }
}
</style>
