import Vue from "vue";
import Vuex from "vuex";
import getters from "./getters";

Vue.use(Vuex);

const modules = {};

const modulesFiles = require.context("./modules", true, /\.js$/);
modulesFiles.keys().forEach((key) => {
    //截取名字
    const moduleName = key.replace(/(.*\/)*([^.]+).*/gi, "$2");
    //通过 context(key)导出文件内容。在文件中时通过 export.default 导出的，所以后边加.default
    const fileModule = modulesFiles(key).default;
    //TODO namespaced-命名空间属性此处不能为true，还未闹明白待优化
    //
    modules[moduleName] = {
        ...fileModule,
        //namespaced: true,
    };
});

const store = new Vuex.Store({
    modules: modules,
    getters,
});
export default store;
