import { constantRoutes } from "@/router";
import Layout from "@/components/layout/index";
import { sysMenuNav } from "@/api/system/system-menu-api";
const permission = {
    state: {
        routes: [],
        addRoutes: [],
        permissions: [],
    },
    mutations: {
        SET_ROUTES: (state, routes) => {
            state.addRoutes = routes;
            state.routes = constantRoutes.concat(routes);
            // console.log(state.routes)
        },
        SET_PERMISSIONS: (state, permissions) => {
            state.permissions = permissions;
        },
    },
    actions: {
        // 生成路由
        GenerateRoutes({ commit }) {
            return new Promise((resolve) => {
                // 向后端请求路由数据
                sysMenuNav()
                    .then((res) => {
                        // console.log(res)
                        commit("SET_PERMISSIONS", res.permissions);
                        const menuList = formatMenu(res.menuList);
                        const accessedRoutes = filterAsyncRouter(menuList);
                        // console.log(accessedRoutes)
                        accessedRoutes.push({ path: "*", redirect: "/404", hidden: true });
                        commit("SET_ROUTES", accessedRoutes);
                        resolve(accessedRoutes);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            });
        },
    },
};

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap) {
    return asyncRouterMap.filter((route) => {
        if (route.component) {
            // Layout组件特殊处理
            if (route.component === "Layout") {
                route.component = Layout;
            } else {
                route.component = loadView(route.component);
            }
        }
        if (route.children != null && route.children && route.children.length) {
            route.children = filterAsyncRouter(route.children);
        }
        return true;
    });
}
function formatMenu(data) {
    // console.log(data)
    const res = [];
    for (const item of data) {
        const temp = {
            name: item.name,
            path: item.path,
            component: item.component,
            redirect: item.redirect,
            alwaysShow: !!item.alwaysShow,
            meta: {
                title: item.title,
                icon: item.icon,
                noCache: !!item.noCache,
                breadcrumb: !!item.breadcrumb,
                affix: !!item.affix,
            },
        };
        if (item.children && item.children.length > 0) {
            temp.children = formatMenu(item.children);
        }
        res.push(temp);
    }
    // console.log(res)
    return res;
}

// export const loadView = (view) => { // 路由懒加载
//   return () => import(`@/views/${view}`)
// }
export const loadView = (view) => {
    return (resolve) => require([`@/views/${view}`], resolve);
};

export default permission;
