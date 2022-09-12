// ==================================================================
// import相关模块
// ==================================================================
import config from "../package.json";
import Vue from "vue";
import App from "./App";
import store from "./store";
import router from "./router";
import lodash from "lodash";
import "@/assets/icons"; // icon
import "@/permission"; // permission control

import "normalize.css/normalize.css"; // 默认重置css样式，统一各个浏览器样式
import "@/assets/styles/index.scss"; // 全局 css
import "@/assets/iconfonts/iconfont.js"; //引入iconfont(svg方式)

import axios from "axios";
Vue.prototype.$axios = axios;

console.log("基础框架版本号:", `v${config.version}`);
console.log("项目版本号：", `v${window.publicConfig.projectVersion}`);
// lodash配置
Vue.prototype.$lodash = lodash;

// 权限校验
import permission from "./directive/permission";
Vue.use(permission);

// 表格高度及弹窗自适应
import adaptive from "./directive/table";
Vue.use(adaptive);

// 表格复制
import copy from "./directive/copy";
Vue.use(copy);

// 更改标题
// import title from "./directive/title";
// Vue.use(title)
Vue.directive("title", {
    inserted(el, binding) {
        document.title = el.dataset.title;
    },
});

// 图标选择
import IconSelect from "@/components/icon-select";
Vue.component(IconSelect.name, IconSelect);

// 图表组件
import VCharts from "v-charts";
Vue.use(VCharts);

// elementui message对象
import { message } from "@/utils/reset-message";
Vue.prototype.$message = message;

// 引入自定义工具库
import * as util from "@/utils/index";
Vue.prototype.$util = util;
// 生产环境取消console.log
util.rewirteLog();

import fileters from "@/utils/fileters";
Vue.config.productionTip = false;
// 注册过滤器
for (const key in fileters) {
    if (fileters.hasOwnProperty(key)) {
        Vue.filter(key, fileters[key]);
    }
}

// 初始化Element-ui
import ElementUI from "element-ui";
// element ui 全局设置 表格内容不换行实现提示
ElementUI.TableColumn.props.showOverflowTooltip = {
    default: true,
    type: Boolean,
};
Vue.use(ElementUI);
// 注册流程图相关插件
import "@/components/process/package/highlight";
import "highlight.js/styles/atom-one-dark-reasonable.css";
import hljsVuePlugin from "@highlightjs/vue-plugin";
Vue.use(hljsVuePlugin);

import makeidPD from "@/components/process/package/index.js";
Vue.use(makeidPD);
import "@/components/process/package/theme/index.scss";

import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";

// ==================================================================
// 全局挂载
// ==================================================================
// build后全局配置
Vue.prototype.$publicConfig = window.publicConfig;

Vue.prototype.msgSuccess = function (msg, duration = 2000) {
    this.$message({ showClose: true, message: msg, type: "success", duration: duration });
};

Vue.prototype.msgWarning = function (msg, duration = 2000) {
    this.$message({ showClose: true, message: msg, type: "warning", duration: duration });
};

Vue.prototype.msgError = function (msg, duration = 2000) {
    this.$message({ showClose: true, message: msg, type: "error", duration: duration });
};

//校验权限标识
Vue.prototype.checkPermissions = function (permissionsArr) {
    var allPermissions = store.getters && store.getters.permissions;
    const all_permission = "*:*:*";
    const hasPermissions = allPermissions.some((permission) => {
        return all_permission === allPermissions || permissionsArr.includes(permission);
    });
    return hasPermissions;
};

// 内容复制
Vue.prototype.copyContent = function (txt) {
    var obj = document.createElement("input");
    obj.value = txt;
    document.body.appendChild(obj);
    obj.select();
    document.execCommand("Copy");
    console.log(txt);
    message.success("复制成功");
    document.body.removeChild(obj);
};

// 数值格式校验弹窗
window.inputCheck = function (max) {
    message.error("该数值不能超过 " + max);
};

// 表格页模板组件
var widgetPathArr = require.context(`@/components/makeid-table/`, false, /\.vue$/);
widgetPathArr.keys().forEach((key) => {
    const fileName = key.split(".")[1].split("/")[1];
    const fileModule = widgetPathArr(key).default;
    Vue.component(fileName, fileModule);
});

// ==================================================================
// 初始化Vue
// ==================================================================
new Vue({
    el: "#app",
    router,
    store,
    render: (h) => h(App),
});
