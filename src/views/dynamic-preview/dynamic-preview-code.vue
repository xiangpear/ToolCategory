<template>
    <div id="dynamic-preview-code">
        <el-input type="textarea" placeholder="请输入内容" v-model="allCode"> </el-input>
    </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import * as formMakerApi from "@/api/form-maker-api";
export default {
    data() {
        return {
            pageId: "",
            codeObj: {
                controllerCode: "",
                dialogCode: "",
                tableCode: "",
            },
            allCode: "",
            pageType: "",
        };
    },
    created() {},
    mounted() {
        this.pageId = this.$route.query.pageId;
        this.pageType = this.$route.query.pageType;
        axios.defaults.headers.common["businessId"] = this.pageId;
        this.renderDynamicPreviewPage();
    },
    methods: {
        // 渲染动态页面
        renderDynamicPreviewPage() {
            formMakerApi
                .MetaPageInfo({ id: this.pageId })
                .then((res) => {
                    var vueData = JSON.parse(res.vueData);
                    console.log("vueData", vueData);

                    var util = require("@/utils/index");
                    var utilRequest = require("@/utils/request");
                    var request = utilRequest.default;
                    var backendIP = utilRequest.backendIP;

                    var randomComponent = util.randomString(10);

                    // api-------------------------------------------------
                    var controllerArr = vueData.filter((value) => {
                        return value.name.indexOf("Controller") != -1;
                    });
                    var apiEjsData = controllerArr[0].renderData;
                    var ControllerName = controllerArr[0].name.replace(".js", "");
                    var apiStr = apiEjsData.replace(/export /g, "");
                    apiStr = apiStr.replace(`import request, { backendIP } from "@/utils/request";`, ``).replace(`/*return`, `return`).replace(`};return*/`, `};`);
                    apiStr = "function apiStrFunc(request, backendIP){" + apiStr + "}";
                    var apiStrFunc = new Function("return " + apiStr);
                    var Controller = apiStrFunc()(request, backendIP);

                    // 其他表单页-------------------------------------------------
                    var otherFormArr = vueData.filter((value) => {
                        return value.name.indexOf("form-") != -1;
                    });
                    var otherFormStrArr = "";
                    var otherFormObjectArr = [];

                    for (let i = 0; i < otherFormArr.length; i++) {
                        const element = otherFormArr[i];

                        otherFormStrArr += ", Form" + element.name.split("-")[1].replace(".vue", "");

                        var dialogEjsData = element.renderData;
                        var dialogTemplate = dialogEjsData.substring(dialogEjsData.indexOf(`<template>&&&makeid&&&`) + 22, dialogEjsData.indexOf(`</template>&&&makeid&&&`));
                        var backDialogScript =
                            `function backDialogScript(${ControllerName}, axios, backendIP){return ` +
                            dialogEjsData.substring(dialogEjsData.indexOf(`export default`) + 14, dialogEjsData.indexOf(`<\/script>`)) +
                            "}";
                        var backDialogScriptFunc = new Function("return " + backDialogScript);
                        var backDialogScriptFuncJson = backDialogScriptFunc()(Controller, axios, backendIP);
                        var generateTemplateTableFormPage = Vue.extend({
                            template: dialogTemplate,
                            ...backDialogScriptFuncJson,
                        });
                        otherFormObjectArr.push(generateTemplateTableFormPage);
                    }

                    // 表单页-------------------------------------------------
                    var templateTableFormArr = vueData.filter((value) => {
                        return value.name == "template-table-form.vue";
                    });
                    var dialogEjsData = templateTableFormArr[0].renderData;
                    var dialogTemplate = dialogEjsData.substring(dialogEjsData.indexOf(`<template>&&&makeid&&&`) + 22, dialogEjsData.indexOf(`</template>&&&makeid&&&`));
                    var backDialogScript =
                        `function backDialogScript(${ControllerName}, backendIP${otherFormStrArr}){return ` +
                        dialogEjsData.substring(dialogEjsData.indexOf(`export default`) + 14, dialogEjsData.indexOf(`<\/script>`)) +
                        "}";
                    var backDialogScriptFunc = new Function("return " + backDialogScript);
                    var backDialogScriptFuncJson = backDialogScriptFunc()(Controller, backendIP, ...otherFormObjectArr);
                    var generateTemplateTableFormPage = Vue.extend({
                        template: dialogTemplate,
                        ...backDialogScriptFuncJson,
                    });

                    // 表格页-------------------------------------------------
                    var templateTableArr = vueData.filter((value) => {
                        return value.name == "template-table.vue";
                    });
                    console.log("templateTableArr", templateTableArr);
                    var MakeidTableMixin = require("@/components/makeid-table/mixin/makeid-table-mixin");
                    var tableEjsData = templateTableArr[0].renderData;
                    var tableTemplate = tableEjsData.substring(tableEjsData.indexOf(`<template>&&&makeid&&&`) + 22, tableEjsData.indexOf(`</template>&&&makeid&&&`));
                    var backScript =
                        `function backScript(${ControllerName}, TemplateTableForm, MakeidTableMixin, util${otherFormStrArr}){return ` +
                        tableEjsData.substring(tableEjsData.indexOf(`export default`) + 14, tableEjsData.indexOf(`<\/script>`)) +
                        "}";
                    var backScriptFunc = new Function("return " + backScript);
                    var backScriptFuncJson = backScriptFunc()(Controller, generateTemplateTableFormPage, MakeidTableMixin.default, util, ...otherFormObjectArr);

                    this.codeObj = {
                        controllerCode: apiEjsData.replace(/&&&makeid&&&/g, ""),
                        dialogCode: dialogEjsData.replace(/&&&makeid&&&/g, ""),
                        tableCode: tableEjsData.replace(/&&&makeid&&&/g, ""),
                    };

                    if (this.pageType == "table") {
                        this.allCode = this.codeObj.tableCode;
                    }
                    if (this.pageType == "dialog") {
                        this.allCode = this.codeObj.dialogCode;
                    }
                    if (this.pageType == "controller") {
                        this.allCode = this.codeObj.controllerCode;
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        },
    },
};
</script>

<style lang="scss">
#dynamic-preview-code {
    padding: 10px;
    box-sizing: border-box;
    height: 100vh;
    .el-textarea {
        height: 100%;
    }
    textarea {
        width: 100%;
        height: 100% !important;
        border: 1px solid #ddd;
        resize: none;
    }
}
</style>
