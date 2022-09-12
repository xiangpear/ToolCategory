<template>
    <div id="base-system">
        <div class="container">
            <div>
                <el-form ref="form1" :model="form" :rules="rules" label-width="210px" class="demo-ruleForm">
                    <el-form-item label="待送检工器具提前提醒天数：" prop="laterDays">
                        <el-input type="number" @change="changeDay" clearable v-model="form.laterDays" size="small" :style="[{ width: '140px' }]"></el-input>
                    </el-form-item>
                    <el-form-item :style="[{ float: 'right', marginRight: '10px' }]">
                        <el-button type="primary" size="mini" round @click="submitForm('form1')">设置</el-button>
                    </el-form-item>
                </el-form>
                <el-form ref="form2" :model="form" :rules="rules" label-width="159px" class="demo-ruleForm">
                    <el-form-item label="RFID提交间隔时间：" prop="intervalTime">
                        <el-input type="number" @change="changeIntTime" v-model="form.intervalTime" clearable size="small" :style="[{ width: '140px' }]"></el-input>
                    </el-form-item>
                    <el-form-item :style="[{ float: 'right', marginRight: '10px' }]">
                        <el-button type="primary" size="mini" round @click="submitForm('form2')">设置</el-button>
                    </el-form-item>
                </el-form>
                <el-form ref="form3" :model="form" :rules="rules" label-width="auto" class="demo-ruleForm">
                    <el-form-item label="温度正常范围（℃）" prop="temperature1">
                        <el-input type="number" @change="changeTemp" min="0" v-model="form.temperature1" clearable size="small" :style="[{ width: '140px' }]"></el-input>--
                    </el-form-item>
                    <el-form-item prop="temperature2" class="demo">
                        <el-input type="number" @change="changeTemp" min="0" v-model="form.temperature2" clearable size="small" :style="[{ width: '140px' }]"></el-input>
                    </el-form-item>
                    <el-form-item :style="[{ float: 'right', marginRight: '10px' }]">
                        <el-button type="primary" size="mini" round @click="submitForm('form3')">设置</el-button>
                    </el-form-item>
                </el-form>
                <el-form ref="form4" :model="form" :rules="rules" label-width="155px" class="demo-ruleForm">
                    <el-form-item label="湿度正常范围（%）" prop="humidity1">
                        <el-input type="number" @change="changeHumidity" min="0" v-model="form.humidity1" clearable size="small" :style="[{ width: '140px' }]"></el-input>--
                    </el-form-item>
                    <el-form-item prop="humidity2" class="demo">
                        <el-input type="number" @change="changeHumidity" min="0" v-model="form.humidity2" clearable size="small" :style="[{ width: '140px' }]"></el-input>
                    </el-form-item>
                    <el-form-item :style="[{ float: 'right', marginRight: '10px' }]">
                        <el-button type="primary" size="mini" round @click="submitForm('form4')">设置</el-button>
                    </el-form-item>
                </el-form>
                <el-form ref="form5" :model="form" :rules="rules" label-width="128px" class="demo-ruleForm">
                    <el-form-item label="自动盘点时间：" prop="autoTime">
                        <el-time-picker
                            v-model="form.autoTime"
                            :picker-options="{
                                selectableRange: '00:00:00 - 23:59:59',
                            }"
                            placeholder="选择盘点时间"
                            size="small"
                            clearable
                            value-format="HH:mm:ss"
                            @change="changeAutoTime()"
                        >
                        </el-time-picker>
                    </el-form-item>
                    <el-form-item :style="[{ float: 'right', marginRight: '10px' }]">
                        <el-button type="primary" size="mini" round @click="submitForm('form5')">设置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import * as obj from "@/api/base/base-sys-api";
export default {
    name: "base-system",
    data() {
        var validate1 = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("待送检工器具提前提醒天数不能为空"));
            } else if (value <= 0 || value > 100) {
                callback(new Error("待送检工器具提前提醒天数在1~100之间"));
            } else {
                callback();
            }
        };
        var validate2 = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("提交间隔时间不能为空"));
            } else if (value <= 0 || value > 100) {
                callback(new Error("提交间隔时间在1~9999之间"));
            } else {
                callback();
            }
        };

        return {
            rules: {
                laterDays: [{ validator: validate1, required: true, trigger: ["blur", "change"] }],
                intervalTime: [{ validator: validate2, required: true, trigger: ["blur", "change"] }],
                temperature1: [{ required: true, message: "温度正常范围不能为空", trigger: ["blur", "change"] }],
                temperature2: [{ required: true, message: "温度正常范围不能为空", trigger: ["blur", "change"] }],
                humidity1: [{ required: true, message: "湿度正常范围不能为空", trigger: ["blur", "change"] }],
                humidity2: [{ required: true, message: "湿度正常范围不能为空", trigger: ["blur", "change"] }],
                autoTime: [{ required: true, message: "自动盘点时间不能为空", trigger: ["blur", "change"] }],
            },
            // dataList
            dataList: [],
            // 表单参数
            form: {
                laterDays: "",
                intervalTime: "",
                temperature1: "",
                temperature2: "",
                humidity1: "",
                humidity2: "",
                autoTime: "",
            },
            form1: {
                propertyId: "",
                propertyValue: "",
            },
            form2: {
                propertyId: "",
                propertyValue: "",
            },
            form3: {
                propertyId: "",
                propertyValue: "",
            },
            form4: {
                propertyId: "",
                propertyValue: "",
            },
            form5: {
                propertyId: "",
                propertyValue: "",
            },
        };
    },
    async created() {
        await obj
            .baseSysPageList()
            .then((res) => {
                this.dataList = res;
            })
            .catch((error) => {
                console.log(error);
            });
        this.form.laterDays = this.dataList[0].propertyValue;
        this.form.intervalTime = this.dataList[1].propertyValue;
        this.form.temperature1 = this.dataList[2].propertyValue.split("-")[0];
        this.form.temperature2 = this.dataList[2].propertyValue.split("-")[1];
        this.form.humidity1 = this.dataList[3].propertyValue.split("-")[0];
        this.form.humidity2 = this.dataList[3].propertyValue.split("-")[1];
        this.form.autoTime = this.dataList[4].propertyValue.replaceAll("-", ":");
        this.form1.propertyId = this.dataList[0].propertyId;
        this.form1.propertyValue = this.dataList[0].propertyValue;
        this.form2.propertyId = this.dataList[1].propertyId;
        this.form2.propertyValue = this.dataList[1].propertyValue;
        this.form3.propertyId = this.dataList[2].propertyId;
        this.form3.propertyValue = this.dataList[2].propertyValue;
        this.form4.propertyId = this.dataList[3].propertyId;
        this.form4.propertyValue = this.dataList[3].propertyValue;
        this.form5.propertyId = this.dataList[4].propertyId;
        this.form5.propertyValue = this.dataList[4].propertyValue;
    },
    mounted() {},
    methods: {
        changeDay() {
            this.form1.propertyId = this.dataList[0].propertyId;
            this.form1.propertyValue = this.form.laterDays;
        },
        changeIntTime() {
            this.form2.propertyId = this.dataList[1].propertyId;
            this.form2.propertyValue = this.form.intervalTime;
        },
        changeTemp() {
            this.form3.propertyId = this.dataList[2].propertyId;
            this.form3.propertyValue = this.form.temperature1 + "-" + this.form.temperature2;
        },
        changeHumidity() {
            this.form4.propertyId = this.dataList[3].propertyId;
            this.form4.propertyValue = this.form.humidity1 + "-" + this.form.humidity2;
        },
        changeAutoTime() {
            this.form5.propertyId = this.dataList[4].propertyId;
            this.form5.propertyValue = this.form.autoTime.replaceAll(":", "-");
        },
        // 提交按钮
        submitForm(forName) {
            this.$refs[forName].validate((valid) => {
                if (valid) {
                    if (forName === "form1") {
                        const item = JSON.parse(JSON.stringify(this.form1));
                        obj.baseSysUpdate(item)
                            .then((res) => {
                                this.msgSuccess("更新成功");
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    } else if (forName === "form2") {
                        const item = JSON.parse(JSON.stringify(this.form2));
                        obj.baseSysUpdate(item)
                            .then((res) => {
                                this.msgSuccess("更新成功");
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    } else if (forName === "form3") {
                        const item = JSON.parse(JSON.stringify(this.form3));
                        obj.baseSysUpdate(item)
                            .then((res) => {
                                this.msgSuccess("更新成功");
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    } else if (forName === "form4") {
                        const item = JSON.parse(JSON.stringify(this.form4));
                        obj.baseSysUpdate(item)
                            .then((res) => {
                                this.msgSuccess("更新成功");
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    } else if (forName === "form5") {
                        const item = JSON.parse(JSON.stringify(this.form5));
                        obj.baseSysUpdate(item)
                            .then((res) => {
                                this.msgSuccess("更新成功");
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    }
                }
            });
        },
    },
};
</script>

<style>
.container {
    height: 790px;
    box-sizing: border-box;
    min-height: 100%;
    background-color: #fff;
    padding: 15px;
}
.demo-ruleForm {
    margin-bottom: 10px;
}
.demo-ruleForm .el-form-item {
    display: inline-block;
}
.demo-ruleForm .el-button {
    width: 70px;
    font-size: 13px;
}
.demo > .el-form-item__content {
    margin-left: 0 !important;
}
</style>
