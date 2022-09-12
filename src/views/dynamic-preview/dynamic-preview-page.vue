<template>
    <div id="dynamic-preview-page">
        <component :is="componentName"></component>
    </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import * as formMakerApi from "@/api/form-maker-api";
var pageId = window.location.href.substring(window.location.href.lastIndexOf("/") + 1);
export default {
    name: "dynamic-preview-page-" + pageId,
    data() {
        return {
            componentName: "",
            pageId: "",
        };
    },
    created() {},
    mounted() {
        this.pageId = this.$route.path.substring(this.$route.path.lastIndexOf("/") + 1);
        axios.defaults.headers.common["businessId"] = this.pageId;
        this.beforeRenderDynamicPreviewPage();
    },
    methods: {
        // 渲染缓存校验
        beforeRenderDynamicPreviewPage() {
            var pageInfo = localStorage.getItem("makeid-dynamic-page-" + this.pageId);
            if (pageInfo) {
                pageInfo = JSON.parse(pageInfo);

                formMakerApi
                    .MetaPageInfoPageId({ pageId: this.pageId, type: -1 })
                    .then((res) => {
                        if (Date.parse(pageInfo.updatedTime) == Date.parse(res.updatedTime)) {
                            this.renderDynamicPreviewPage(pageInfo);
                        } else {
                            formMakerApi
                                .MetaPageInfoPageId({ pageId: this.pageId, type: 0 })
                                .then((res2) => {
                                    this.renderDynamicPreviewPage(res2);
                                })
                                .catch((error) => {
                                    console.log(error);
                                });
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            } else {
                formMakerApi
                    .MetaPageInfoPageId({ pageId: this.pageId, type: 0 })
                    .then((res) => {
                        this.renderDynamicPreviewPage(res);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        },

        // 渲染动态页面
        renderDynamicPreviewPage(res) {
            // console.log(res);
            localStorage.setItem("makeid-dynamic-page-" + res.pageId, JSON.stringify(res));

            var vueData = JSON.parse(res.vueData);
            // console.log(vueData);

            var util = require("@/utils/index");
            var utilRequest = require("@/utils/request");
            var request = utilRequest.default;
            var backendIP = utilRequest.backendIP;
            var axios = require("axios");
            var getToken = require("@/utils/auth").getToken;
            var md5 = require("js-md5");

            var randomComponent = util.randomString(10);

            var publicStrArr = "axios, backendIP, util, getToken, md5";
            var publicObjectArr = [axios, backendIP, util, getToken, md5];

            // api-------------------------------------------------
            var controllerArr = vueData.filter((value) => {
                return value.name.indexOf("Controller") != -1;
            });
            var otherControllerStrArr = "";
            var otherControllerObjectArr = [];

            for (let i = 0; i < controllerArr.length; i++) {
                const element = controllerArr[i];
                var ControllerName = element.name.replace(".js", "");

                otherControllerStrArr += ", " + ControllerName;

                var apiEjsData = element.renderData;
                var apiStr = apiEjsData.replace(/export /g, "");
                apiStr = apiStr.replace(`import request, { backendIP } from "@/utils/request";`, ``).replace(`/*return`, `return`).replace(`};return*/`, `};`);
                apiStr = "function apiStrFunc(request, backendIP){" + apiStr + "}";
                var apiStrFunc = new Function("return " + apiStr);
                var Controller = apiStrFunc()(request, backendIP);

                otherControllerObjectArr.push(Controller);
            }

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
                    `function backDialogScript(${publicStrArr}${otherControllerStrArr}){return ` +
                    dialogEjsData.substring(dialogEjsData.indexOf(`export default`) + 14, dialogEjsData.indexOf(`<\/script>`)) +
                    "}";
                var backDialogScriptFunc = new Function("return " + backDialogScript);
                var backDialogScriptFuncJson = backDialogScriptFunc()(...publicObjectArr, ...otherControllerObjectArr);
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
                `function backDialogScript(${publicStrArr}${otherFormStrArr}${otherControllerStrArr}){return ` +
                dialogEjsData.substring(dialogEjsData.indexOf(`export default`) + 14, dialogEjsData.indexOf(`<\/script>`)) +
                "}";
            var backDialogScriptFunc = new Function("return " + backDialogScript);
            var backDialogScriptFuncJson = backDialogScriptFunc()(...publicObjectArr, ...otherFormObjectArr, ...otherControllerObjectArr);
            var mainTemplateTableFormPage = Vue.extend({
                template: dialogTemplate,
                ...backDialogScriptFuncJson,
            });

            // 表格页-------------------------------------------------
            var templateTableArr = vueData.filter((value) => {
                return value.name == "template-table.vue";
            });
            var MakeidTableMixin = require("@/components/makeid-table/mixin/makeid-table-mixin");
            var tableEjsData = templateTableArr[0].renderData;
            var tableTemplate = tableEjsData.substring(tableEjsData.indexOf(`<template>&&&makeid&&&`) + 22, tableEjsData.indexOf(`</template>&&&makeid&&&`));
            var backScript =
                `function backScript(TemplateTableForm, MakeidTableMixin, ${publicStrArr}${otherFormStrArr}${otherControllerStrArr}){return ` +
                tableEjsData.substring(tableEjsData.indexOf(`export default`) + 14, tableEjsData.indexOf(`<\/script>`)) +
                "}";
            var backScriptFunc = new Function("return " + backScript);
            var backScriptFuncJson = backScriptFunc()(mainTemplateTableFormPage, MakeidTableMixin.default, ...publicObjectArr, ...otherFormObjectArr, ...otherControllerObjectArr);

            Vue.component("generate-template-table-page-" + randomComponent, {
                template: tableTemplate,
                ...backScriptFuncJson,
            });

            this.componentName = "generate-template-table-page-" + randomComponent;
        },
    },
};
</script>

<style lang="scss"></style>
