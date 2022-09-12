<template>
    <!--系统设置-菜单管理-->
    <div id="system-menu">
        <!-- 表格容器 -->
        <makeid-table-box :isPaginationShow="false">
            <div slot="btn">
                <el-button v-hasPermi="['sys:menu:save']" v-show="loginUserId == 1" type="primary" icon="el-icon-plus" size="medium" @click="handleAdd()">新增</el-button>
            </div>
            <div slot="content">
                <!-- 表格内容 -->
                <el-table
                    ref="table"
                    empty-text="该页面暂无数据"
                    border
                    v-adaptive="{ type: 'table' }"
                    v-loading="loading"
                    :data="menuList"
                    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
                    height="100%"
                    @header-dragend="headerDragend"
                    row-key="menuId"
                >
                    <!-- 动态表格列 -->
                    <el-table-column v-for="item in tableLineSelect" :key="JSON.stringify(item)" :width="item.width" :label="item.label" :prop="item.prop">
                        <template slot-scope="scope">
                            <span v-if="item.prop == 'icon'"> <svg-icon :icon-class="scope.row.icon || ''" /></span>
                            <span v-else> {{ scope.row[item.prop] ? scope.row[item.prop] : "-" }}</span>
                        </template>
                    </el-table-column>
                    <!-- 更多操作 -->
                    <el-table-column label="操作" align="center" width="230" fixed="right" v-if="checkPermissions(['sys:menu:update', 'sys:menu:save', 'sys:menu:delete'])">
                        <template slot-scope="scope">
                            <div class="func-btns">
                                <el-button v-hasPermi="['sys:menu:update']" size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">编辑</el-button>
                                <el-button v-hasPermi="['sys:menu:save']" v-show="loginUserId == 1" size="mini" type="text" icon="el-icon-plus" @click="handleAdd(scope.row)">新增</el-button>
                                <el-button v-hasPermi="['sys:menu:delete']" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </makeid-table-box>

        <!-- 新增/修改 菜单 -->
        <div class="f-dialog add-menu">
            <el-dialog v-adaptive="{ type: 'dialog' }" :title="title" :close-on-click-modal="false" :visible.sync="open" custom-class="makeid-table-dialog" width="900px">
                <el-form ref="drawerForm" :model="form" :rules="rules" label-width="150px">
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="菜单类型" prop>
                                <el-radio-group :disabled="title == '编辑'" v-model="form.type" @change="typeChange">
                                    <el-radio :label="0">目录</el-radio>
                                    <el-radio :label="1">子菜单</el-radio>
                                    <el-radio :label="2">按钮/权限</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <div v-if="form.type !== 2">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="菜单名称" prop="title">
                                    <el-input v-model="form.title" placeholder="请输入菜单名称" maxlength="50" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item v-if="form.type === 1" label="上级菜单" prop="parentId">
                                    <el-popover ref="menuListPopover" width="361" placement="bottom-start" trigger="click">
                                        <el-tree
                                            ref="menuListTree"
                                            class="parent-menu-tree"
                                            :data="menuList"
                                            :props="menuListProps"
                                            node-key="menuId"
                                            :default-expanded-keys="[0]"
                                            :default-expand-all="false"
                                            :highlight-current="true"
                                            :expand-on-click-node="false"
                                            @current-change="menuListTreeCurrentChangeHandle"
                                        />
                                    </el-popover>
                                    <el-input v-model="form.parentTitle" v-popover:menuListPopover :readonly="true" placeholder="请选择父级菜单" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="菜单路径" prop="path">
                                    <el-input v-model="form.path" placeholder="请输入菜单路径" @input="pathChange" maxlength="200" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="组件路径" prop="component">
                                    <el-input v-model="form.component" placeholder="请输入前端组件：Layout" maxlength="200" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="组件名称" prop="name">
                                    <el-input v-model="form.name" placeholder="请输入前端组件名称" maxlength="50" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item v-show="form.type === 0" label="默认跳转地址" prop="redirect">
                                    <el-input v-model="form.redirect" placeholder="请输入路由参数redirect" maxlength="200" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="菜单图标" prop="icon">
                                    <el-popover placement="bottom-start" width="650" trigger="click" @show="$refs['iconSelect'].reset()">
                                        <IconSelect ref="iconSelect" @selected="selected" />
                                        <el-input class="menu-icon" slot="reference" v-model="form.icon" placeholder="点击选择图标（可输入element图标）">
                                            <svg-icon v-if="form.icon" slot="prefix" :icon-class="form.icon" class="el-input__icon" style="height: 32px; width: 16px" />
                                            <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                                        </el-input>
                                    </el-popover>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="权限标识" prop="perms">
                                    <el-input v-model="form.perms" placeholder="多个用逗号隔开，如: sys:menu:save,sys:menu:delete" maxlength="300" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="排序" prop="orderNum">
                                    <el-input-number v-model="form.orderNum" :min="0" :max="100" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row class="add-menu-switch">
                            <el-col :span="12">
                                <el-form-item label="是否切换刷新" prop="noCache">
                                    <el-switch :active-value="true" :inactive-value="false" v-model="form.noCache" active-color="#409EFF" inactive-color="#BFBFBF" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="是否显示根路由" prop="alwaysShow">
                                    <el-switch :active-value="true" :inactive-value="false" v-model="form.alwaysShow" active-color="#409EFF" inactive-color="#BFBFBF" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="是否显示到面包屑" prop="breadcrumb">
                                    <el-switch :active-value="true" :inactive-value="false" v-model="form.breadcrumb" active-color="#409EFF" inactive-color="#BFBFBF" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="是否固定顶部导航栏" prop="affix">
                                    <el-switch :active-value="true" :inactive-value="false" v-model="form.affix" active-color="#409EFF" inactive-color="#BFBFBF" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                    <div v-if="form.type == 2">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="按钮/权限" prop="title">
                                    <el-input v-model="form.title" placeholder="请选择菜单名称" maxlength="50" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="上级菜单" :prop="form.type == 0 ? '' : 'parentId'">
                                    <el-popover ref="menuListPopover2" placement="bottom-start" trigger="click">
                                        <el-tree
                                            ref="menuListTree"
                                            class="parent-menu-tree"
                                            :data="menuList"
                                            :props="menuListProps"
                                            node-key="menuId"
                                            :default-expanded-keys="[0]"
                                            :default-expand-all="false"
                                            :highlight-current="true"
                                            :expand-on-click-node="false"
                                            @current-change="menuListTreeCurrentChangeHandle"
                                        />
                                    </el-popover>
                                    <el-input v-model="form.parentTitle" v-popover:menuListPopover2 :readonly="true" placeholder="请选择父级菜单" />
                                </el-form-item>
                            </el-col>
                            <!-- <el-col :span="12">
                                <el-form-item label="菜单路径" prop>
                                    <el-input v-model="form.path" placeholder="请选择菜单名称" />
                                </el-form-item>
                            </el-col> -->
                            <el-col :span="12">
                                <el-form-item label="权限标识" prop>
                                    <el-input v-model="form.perms" placeholder="多个用逗号隔开，如: sys:menu:save,sys:menu:delete" maxlength="300" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button size="medium" type="default" @click="cancel">取 消</el-button>
                    <el-button size="medium" type="primary" @click="submitForm('drawerForm')" :loading="dialogLoading">确 认</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import { sysMenuList, sysMenuInfoMenuId, sysMenuSave, sysMenuDeleteMenuId, sysMenuUpdate } from "@/api/system/system-menu-api";
import router from "@/router";
import store from "@/store";
import * as that from "@/api/system/system-user-api";

export default {
    name: "system-menu",
    data() {
        return {
            // 菜单提交
            dialogLoading: false,

            // 当前用户id
            loginUserId: 0,

            // 遮罩层
            loading: true,

            // 菜单表格树数据
            menuList: [],

            // 下拉树配置
            menuListProps: {
                label: "title",
                children: "children",
            },

            // 弹出层标题
            title: "新增",

            // 是否显示弹出层
            open: false,

            // 表单参数
            form: {
                title: "",
                type: 0,
                parentId: 0,
                path: "",
                name: "",
                component: "",
                redirect: "",
                icon: "",
                orderNum: "",
                noCache: true,
                alwaysShow: false,
                breadcrumb: true,
                affix: false,
                parentTitle: "",
            },

            // 表单校验
            rules: {
                title: [
                    {
                        required: true,
                        message: "菜单名称不能为空",
                        trigger: "change",
                    },
                ],
                parentId: [
                    {
                        required: true,
                        message: "父级菜单不能为空",
                        trigger: "current-change",
                    },
                ],
                component: [
                    {
                        required: true,
                        message: "组件名称不能为空",
                        trigger: "change",
                    },
                ],
                orderNum: [
                    {
                        required: true,
                        message: "菜单顺序不能为空",
                        trigger: "change",
                    },
                ],
                path: [
                    {
                        required: true,
                        message: "路由地址不能为空",
                        trigger: "change",
                    },
                ],
            },

            // 全部表格字段
            tableLine: [
                { label: "菜单名称", prop: "title" },
                { label: "图标", prop: "icon" },
                { label: "权限标识", prop: "perms" },
                { label: "组件", prop: "component" },
                { label: "路径", prop: "path" },
                { label: "排序", prop: "orderNum" },
            ],

            // 自定义表格字段
            tableLineSelect: [],
        };
    },
    created() {
        this.userDetail();
        this.getMenuList();
    },
    mounted() {
        this.tableLineSelect = this.tableLine;
    },
    methods: {
        // 头部拖动
        headerDragend() {
            this.$nextTick(() => {
                this.$refs.table.doLayout();
            });
        },

        // 表单重置
        reset() {
            this.form = this.$options.data().form;
            setTimeout(() => {
                this.$refs.drawerForm ? this.$refs.drawerForm.clearValidate() : "";
            }, 0);
        },

        // 用户信息
        userDetail() {
            that.sysUserQueryUserInfo()
                .then((res) => {
                    if (res) {
                        this.loginUserId = res.userId;
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        },

        // 查询菜单列表
        getMenuList() {
            this.loading = true;
            sysMenuList()
                .then((response) => {
                    this.loading = false;
                    this.menuList = response;
                    this.$nextTick(() => {
                        if (!this.$refs.table) return;
                        this.$refs.table.bodyWrapper.scrollTop = 0;
                        this.$refs.table.doLayout();
                    });
                })
                .catch((error) => {
                    this.loading = false;
                    console.log(error);
                });
        },

        // 菜单下拉列表选择
        menuListTreeCurrentChangeHandle(event) {
            this.form.parentId = event.menuId;
            this.form.parentTitle = event.title;
            this.form = this.$lodash.cloneDeep(this.form);
        },

        // 选择图标
        selected(name) {
            this.form.icon = name;
        },

        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },

        // 新增按钮操作
        handleAdd(row) {
            this.open = true;
            this.title = "新增";
            this.reset();
            if (!row) {
                this.form.type = 0;
                this.form.component = "Layout";
                this.form.redirect = "noRedirect";
                this.form.path = "/";
            } else {
                this.form.type = row.menuId && row.parentId === 0 ? 1 : 2;
                this.form.parentTitle = row.title;
                this.form.parentId = row.menuId;
                this.form.component = row.path.substring(1) + "/";
                // this.open = true
                setTimeout(() => {
                    this.menuListTreeSetCurrentNode();
                }, 0);
            }
        },

        // 修改按钮操作
        handleUpdate(row) {
            this.title = "编辑";
            this.reset();
            sysMenuInfoMenuId({ menuId: row.menuId }).then((res) => {
                this.open = true;
                this.form = res;
                setTimeout(() => {
                    if (this.form.parentId !== 0) {
                        this.menuListTreeSetCurrentNode();
                    }
                }, 0);
            });
        },

        // 部门树设置当前选中节点
        menuListTreeSetCurrentNode() {
            this.$refs.menuListTree.setCurrentKey(this.form.parentId);
            this.form.parentTitle = (this.$refs.menuListTree.getCurrentNode() || {})["title"];
            this.form = this.$lodash.cloneDeep(this.form);
        },

        // 提交按钮
        submitForm(forName) {
            this.$refs[forName].validate((valid) => {
                if (valid) {
                    this.dialogLoading = true;
                    if (this.title === "新增") {
                        sysMenuSave(this.form).then((res) => {
                            this.msgSuccess("新增成功");
                            this.open = false;
                            this.dialogLoading = false;
                            this.getMenuList();
                        });
                    } else if (this.title === "编辑") {
                        sysMenuUpdate(this.form).then((res) => {
                            this.msgSuccess("修改成功");
                            this.open = false;
                            this.dialogLoading = false;
                            this.freshRouter();
                        });
                    }
                } else {
                    console.log("error");
                }
            });
        },

        // 删除按钮操作
        handleDelete(row) {
            this.$confirm('是否确认删除名称为"' + row.title + '"的菜单项?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    sysMenuDeleteMenuId({ menuId: row.menuId }).then(() => {
                        this.freshRouter();
                    });
                })
                .catch(function () {});
        },

        // 修改菜单后刷新路由
        freshRouter() {
            this.getMenuList();
            store.dispatch("GenerateRoutes").then((accessRoutes) => {
                router.addRoutes(accessRoutes); // 动态添加可访问路由表
            });
        },

        // 菜单类型切换
        typeChange(e) {
            if (e === 2) {
                this.form.parentId = this.form.menuId;
                this.form.parentTitle = this.form.title;
                this.form.redirect = undefined;
            }
            if (e === 1) {
                this.form.redirect = undefined;
            }
        },

        // 菜单路径输入事件
        pathChange(e) {
            if (this.form.type === 1) {
                const preStr = this.form.component.split("/");
                this.form.component = preStr[0] + "/" + e;
                this.form.name = e;
            }
        },
    },
};
</script>
<style lang="scss">
#system-menu {
    .add-menu-switch {
        .el-form-item__label {
            width: 300px !important;
        }
    }
    .menu-icon {
        svg {
            margin-top: 5px;
        }
        .el-input__prefix {
            margin-left: 5px;
        }
    }
}
.parent-menu-tree {
    max-height: 200px;
    overflow-y: auto;
}
</style>
