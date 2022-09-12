import hasRole from "./has-role";
import hasPermi from "./has-permi";

const install = function (Vue) {
    Vue.directive("hasRole", hasRole);
    Vue.directive("hasPermi", hasPermi);
};

if (window.Vue) {
    window["hasRole"] = hasRole;
    window["hasPermi"] = hasPermi;
    Vue.use(install); // eslint-disable-line
}

export default install;
