import Vue from "vue";

const initEvent = (el, binding) => {
    el.removeEventListener("mouseup", copyText);
    el.addEventListener("mouseup", copyText);
    function copyText() {
        if (el.offsetWidth + 22 > el.parentNode.offsetWidth) {
            var txt = binding.value.text;
            Vue.prototype.copyContent(txt);
        }
    }
};

const Copy = {
    //第一次绑定到元素时调用
    bind(el, binding) {
        initEvent(el, binding);
    },
    inserted(el, binding) {
        // initEvent(el, binding);
    },
    //组件变动时触发
    update(el, binding) {
        // initEvent(el, binding);
    },
    //指令与元素解绑时调用
    unbind(el) {
        el.instance && el.instance.$destroy();
    },
};

const install = function (Vue) {
    // 绑定v-adaptive指令
    Vue.directive("copy", Copy);
};

if (window.Vue) {
    window["copy"] = Copy;
    Vue.use(install);
}

Copy.install = install;

export default Copy;
