import adaptive from "./adaptive";

const install = function (Vue) {
    // 绑定v-adaptive指令
    Vue.directive("adaptive", adaptive);
};

if (window.Vue) {
    window["adaptive"] = adaptive;
    Vue.use(install);
}

adaptive.install = install;

export default adaptive;
