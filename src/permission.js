import router from "./router";
import store from "./store";
// import { Message } from 'element-ui'
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken } from "@/utils/auth"; // get token from cookie
import getPageTitle from "@/utils/get-page-title";

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ["/login"]; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
    // start progress bar
    NProgress.start();

    // set page title
    document.title = getPageTitle(to.meta.title);

    // determine whether the user has logged in
    const hasToken = getToken();

    if (hasToken) {
        if (to.path === "/login") {
            // if is logged in, redirect to the home page
            next({ path: "/" });
            NProgress.done();
        } else {
            const hasGetUserInfo = store.getters.name;
            if (!hasGetUserInfo) {
                // 判断当前用户是否已拉取完user_info信息
                store
                    .dispatch("user/getInfo")
                    .then((res) => {
                        // 拉取user_info
                        // const roles = res.roles
                        store.dispatch("GenerateRoutes").then((accessRoutes) => {
                            // 测试 默认静态页面
                            // store.dispatch('permission/generateRoutes', { roles }).then(accessRoutes => {
                            // 根据roles权限生成可访问的路由表
                            router.addRoutes(accessRoutes); // 动态添加可访问路由表
                            next({ ...to, replace: true }); // hack方法 确保addRoutes已完成
                        });
                        store.dispatch("gethint").then((res) => {});
                    })
                    .catch((err) => {
                        console.log(err);
                        store
                            .dispatch("user/logout")
                            .then(() => {
                                // Message.error(err)
                                next({ path: "/" });
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    });
            } else {
                next();
            }
        }
    } else {
        /* has no token*/

        if (whiteList.indexOf(to.path) !== -1) {
            // in the free login whitelist, go directly
            next();
        } else {
            // other pages that do not have permission to access are redirected to the login page.
            next(`/login?redirect=${to.path}`);
            NProgress.done();
        }
    }
});

router.afterEach(() => {
    // finish progress bar
    NProgress.done();
});
