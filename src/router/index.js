import Vue from "vue";
import Router from "vue-router";
import { handleURL, handleParams } from "../utils/auth";
Vue.use(Router);

/* Layout */
import Layout from "@/components/layout";
/*  name: 'router-name' //设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 *                                // 你可以设置 alwaysShow：false，只有一个子路由时，会将其合并，显示一级菜单栏如首页
  meta: {
    roles: ['admin', 'editor'] //设置该路由进入的权限，支持多个权限叠加
    title: 'title' //设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name' //设置该路由的图标
    noCache: true //如果设置为true，则不会被 <keep-alive> 缓存(默认 false)，每次切换便会刷新页面 路由名称必须和页面名称一样
    breadcrumb: false // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
*/
export const constantRoutes = [
    {
        path: "/redirect",
        component: Layout,
        hidden: true,
        children: [
            {
                path: "/redirect/:path(.*)",
                component: () => import("@/views/redirect/index"),
            },
            // {
            //     path: "/base/type-test",
            //     component: () =>
            //         import ("@/views/base/type-test"),
            //     hidden: true,
            // },
            // {
            //     path: "/base/base-type",
            //     component: () =>
            //         import ("@/views/base/base-type"),
            //     hidden: true,
            // },
        ],
    },
    {
        path: "/template",
        component: () => import("@/views/template/template-table-form"),
        hidden: true,
    },
    {
        path: "/login",
        component: () => import("@/views/login/index"),
        hidden: true,
    },
    {
        path: "/404",
        component: () => import("@/views/404"),
        hidden: true,
    },
    {
        path: "/",
        component: Layout,
        redirect: "/dashboard",
        children: [
            {
                path: "dashboard",
                name: "Dashboard",
                component: () => import("@/views/dashboard/index"),
                meta: { title: "首页", icon: "index", affix: true, noCache: true },
            },
        ],
    },

    // 404 page must be placed at the end !!!
    // { path: '*', redirect: '/404', hidden: true }
];

const createRouter = () =>
    new Router({
        // mode: 'history', // require service support
        scrollBehavior: () => ({ y: 0 }),
        routes: constantRoutes,
    });

const router = createRouter();
router.beforeEach((to, from, next) => {
    let val = handleParams().title;
    if (val) {
        Vue.nextTick(() => {
            document.getElementById("title").innerHTML = val;
        });
    }
    next();
});
// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter();
    router.matcher = newRouter.matcher; // reset router
}

export default router;
