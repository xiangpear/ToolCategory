<template>
    <div id="template-form">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px" style="width: 400px">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="正整数" prop="num1">
                        <el-input
                            oninput="if(value>999){inputCheck(999);value=value.substring(0,value.length-1);};if(value<=0)value='';"
                            onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"
                            type="number"
                            min="1"
                            max="999"
                            clearable
                            v-model="dataForm.num1"
                            placeholder="请输入正整数(最大值999)"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="正浮点数" prop="num2">
                        <el-input
                            oninput="if(value>999){inputCheck(999);if(value.indexOf('.')==-1){value=value.substring(0,value.length-1);}else{value=value.substring(0,value.length-2);}};value=value.match(/^\d*(\.?\d{0,2})/g)[0];if(value[0]==0&&value.length>1&&value.indexOf('.')==-1)value=value.substring(1);"
                            onKeypress="return(String.fromCharCode(event.keyCode) != '-')"
                            type="number"
                            min="0"
                            max="999"
                            step="0.01"
                            clearable
                            v-model="dataForm.num2"
                            placeholder="请输入正浮点数(最大值999)"
                        ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-button type="primary" size="medium" @click="dataFormSubmit()" style="width: 400px">确定</el-button>
        </el-form>
    </div>
</template>
<script>
export default {
    name: "template-form",
    components: {},
    data() {
        return {
            dataForm: {
                num1: "",
                num2: "",
            },
            dataRule: {
                num1: [{ required: true, message: "正整数不能为空", trigger: "blur" }],
                num2: [
                    { required: true, message: "正浮点数不能为空", trigger: "blur" },
                    {
                        pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/,
                        message: "正浮点数必须大于0",
                    },
                ],
            },
        };
    },
    mounted() {},
    methods: {
        dataFormSubmit() {
            console.log(this.dataForm);
            this.$refs["dataForm"].validate((valid) => {
                if (valid) {
                }
            });
        },
    },
};
</script>
