<template>
    <div v-if="!item.hidden">
        <template v-if="hasOneShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren) && !item.alwaysShow">
            <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
                <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{ 'submenu-title-noDropdown': !isNest }">
                    <!-- <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)"
                        :title="onlyOneChild.meta.title" /> -->
                    <template>
                        <template v-if="onlyOneChild.meta.icon || (item.meta && item.meta.icon)">
                            <template v-if="(onlyOneChild.meta.icon || (item.meta && item.meta.icon)).includes('el-icon')">
                                <i :class="[onlyOneChild.meta.icon || (item.meta && item.meta.icon), 'svg-icon']" />
                            </template>
                            <template v-else>
                                <svg-icon :icon-class="onlyOneChild.meta.icon || (item.meta && item.meta.icon)" />
                            </template>
                        </template>
                        <template v-if="onlyOneChild.meta.title">
                            <span slot="title">{{ onlyOneChild.meta.title }}</span>
                        </template>
                        <template v-if="onlyOneChild.meta.title == '抄送我' && hint.copy > 0">
                            <div class="idot-item"><span class="idot"></span>{{ hint.copy }}</div>
                        </template>
                        <template v-if="(onlyOneChild.meta.title == '待处理') & (hint.pending > 0)">
                            <div class="idot-item"><span class="idot"></span>{{ hint.pending }}</div>
                        </template>
                    </template>
                </el-menu-item>
            </app-link>
        </template>

        <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
            <template slot="title">
                <!-- <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" /> -->
                <template v-if="item.meta">
                    <template v-if="item.meta && item.meta.icon">
                        <template v-if="(item.meta && item.meta.icon).includes('el-icon')">
                            <i :class="[item.meta && item.meta.icon, 'svg-icon']" />
                        </template>
                        <template v-else>
                            <svg-icon :icon-class="item.meta && item.meta.icon" />
                        </template>
                    </template>
                    <template v-if="item.meta.title">
                        <span slot="title">{{ item.meta.title }}</span>
                    </template>
                    <template v-if="(item.meta.title == '我的审批') & (hint.pending + hint.copy > 0)">
                        <div class="idot-item"><span class="idot" style="margin-top: 5px; margin-left: -24px"></span></div>
                    </template>
                </template>
            </template>
            <sidebar-item v-for="child in item.children" :key="child.path" :is-nest="true" :item="child" :base-path="resolvePath(child.path)" class="nest-menu" />
        </el-submenu>
    </div>
</template>

<script>
import path from "path";
import { isExternal } from "@/utils/validate";
// import Item from "./item";
import AppLink from "./link";
import FixiOSBug from "./fix-ios-bug";
import * as that from "@/api/approve/approve";

export default {
    name: "SidebarItem",
    components: { AppLink },
    mixins: [FixiOSBug],
    props: {
        // route object
        item: {
            type: Object,
            required: true,
        },
        isNest: {
            type: Boolean,
            default: false,
        },
        basePath: {
            type: String,
            default: "",
        },
    },
    data() {
        // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
        // TODO: refactor with render function
        this.onlyOneChild = null;
        return {
            hint: { copy: 0, pending: 0 },
        };
    },
    mounted() {
        this.hint = this.$store.getters.hint;
    },
    watch: {
        "$store.getters.hint"(n, o) {
            this.hint = n;
        },
    },
    methods: {
        hasOneShowingChild(children = [], parent) {
            const showingChildren = children.filter((item) => {
                if (item.hidden) {
                    return false;
                } else {
                    // Temp set(will be used if only has one showing child)
                    this.onlyOneChild = item;
                    return true;
                }
            });

            // When there is only one child router, the child router is displayed by default
            if (showingChildren.length === 1) {
                return true;
            }

            // Show parent if there are no child router to display
            if (showingChildren.length === 0) {
                this.onlyOneChild = { ...parent, path: "", noShowingChildren: true };
                return true;
            }

            return false;
        },
        resolvePath(routePath) {
            if (isExternal(routePath)) {
                return routePath;
            }
            if (isExternal(this.basePath)) {
                return this.basePath;
            }
            return path.resolve(this.basePath, routePath);
        },
    },
};
</script>
<style scoped>
.idot-item {
    position: absolute;
    right: 30px;
    top: 16px;
    color: #ef2626;
    line-height: 20px;
}
.idot-item .idot {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 5px;
    margin-top: -3px;
    border-radius: 50%;
    background: #ef2626;
}
</style>
