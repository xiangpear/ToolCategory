<template>
    <div class="navbar">
        <!-- 折叠侧面导航显示 -->
        <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
        <!-- tab路径显示 -->
        <breadcrumb class="breadcrumb-container" />
        <!-- 用户菜单 -->
        <div class="right-menu">
            <el-dropdown class="avatar-container" trigger="click">
                <div class="avatar-wrapper">
                    <img :src="imgUrl" class="user-avatar" />
                    <span class="user-name">
                        {{ name }}
                        <i class="el-icon-caret-bottom" />
                    </span>
                </div>
                <el-dropdown-menu slot="dropdown" class="user-dropdown">
                    <el-dropdown-item divided @click.native="userDetail">
                        <span style="display: block">用户信息</span>
                    </el-dropdown-item>
                    <el-dropdown-item divided @click.native="changePassword">
                        <span style="display: block">修改密码</span>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="name == 'makeid' && searchObj && searchObj.params" divided @click.native="gotoFormDesignDev">
                        <span style="display: block">开发管理</span>
                    </el-dropdown-item>
                    <el-dropdown-item divided @click.native="logout">
                        <span style="display: block">退出登录</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>

        <!-- 修改密码弹窗 -->
        <div class="f-dialog">
            <el-dialog :close-on-click-modal="false" destroy-on-close title="修改密码" width="500px" :visible.sync="dialog.show" :append-to-body="true" custom-class="f-dialog">
                <el-form ref="dialog.form" :model="dialog.form" label-width="110px" :rules="dialog.rules" size="small">
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="旧密码：" prop="password">
                                <el-input v-model="dialog.form.password" ref="password" placeholder="请输入旧密码" autocomplete="off" :type="passwordType1" />
                                <span class="makeid-show-pwd" @click="showPwd(1)">
                                    <svg-icon :icon-class="passwordType1 === 'password' ? 'eye' : 'eye-open'" />
                                </span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="新密码：" prop="newPassword">
                                <el-input v-model="dialog.form.newPassword" ref="oldPassword" placeholder="请输入新密码" autocomplete="off" :type="passwordType2" />
                                <span class="makeid-show-pwd" @click="showPwd(2)">
                                    <svg-icon :icon-class="passwordType2 === 'password' ? 'eye' : 'eye-open'" />
                                </span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="确认密码：" prop="rePassword">
                                <el-input v-model="dialog.form.rePassword" ref="cfmPassword" placeholder="请输入新密码" autocomplete="off" :type="passwordType3" />
                                <span class="makeid-show-pwd" @click="showPwd(3)">
                                    <svg-icon :icon-class="passwordType3 === 'password' ? 'eye' : 'eye-open'" />
                                </span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button size="small" class="close-btn" @click="dialog.show = false">取 消</el-button>
                    <el-button size="small" class="sure-edit-password" type="primary" @click="sureAddData">确 定</el-button>
                </div>
            </el-dialog>
        </div>

        <!--用户信息-->
        <div class="f-dialog">
            <el-dialog :close-on-click-modal="false" destroy-on-close title="用户信息" width="700px" :visible.sync="dialog.userInfo" :append-to-body="true" custom-class="f-dialog">
                <el-form ref="dialog.userForm" :model="dialog.userForm" label-width="120px" size="small">
                    <el-row :gutter="10">
                        <el-col class="text-normal class_prop0" :span="12">
                            <el-form-item :label="'用户名:'">
                                <div class="user_info">{{ dialog.userForm.userName }}</div>
                            </el-form-item>
                        </el-col>
                        <el-col class="text-normal class_prop0" :span="12">
                            <el-form-item :label="'姓名:'">
                                <div class="user_info">{{ dialog.userForm.realName }}</div>
                            </el-form-item>
                        </el-col>
                        <el-col class="text-normal class_prop0" :span="12">
                            <el-form-item :label="'电话:'">
                                <div class="user_info">{{ dialog.userForm.phone }}</div>
                            </el-form-item>
                        </el-col>
                        <el-col class="text-normal class_prop0" :span="12">
                            <el-form-item :label="'邮箱:'">
                                <div class="user_info">{{ dialog.userForm.email }}</div>
                            </el-form-item>
                        </el-col>
                        <el-col class="text-normal class_prop0" :span="12">
                            <el-form-item :label="'性别:'">
                                <div class="user_info">{{ dialog.userForm.gender == 0 ? "男" : "女" }}</div>
                            </el-form-item>
                        </el-col>
                        <el-col class="text-normal class_prop0" :span="12">
                            <el-form-item :label="'状态:'">
                                <div class="user_info">{{ dialog.userForm.status == 1 ? "正常" : "禁用" }}</div>
                            </el-form-item>
                        </el-col>
                        <el-col class="text-normal class_prop0" :span="12">
                            <el-form-item :label="'部门:'">
                                <div class="user_info">{{ dialog.userForm.deptName }}</div>
                            </el-form-item>
                        </el-col>
                        <el-col class="text-normal class_prop0" :span="12">
                            <el-form-item :label="'角色:'">
                                <div class="user_info">{{ dialog.userForm.roleName }}</div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button size="small" class="close-btn" @click="dialog.userInfo = false">关 闭</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/breadcrumb";
import Hamburger from "@/components/hamburger";
import { sysUserPassword, sysUserQueryUserInfo } from "@/api/system/system-user-api";
import { aesEncrypt } from "@/utils/index";
import { getUpdatePwd, removeUpdatePwd, getToken } from "@/utils/auth";
import * as that from "@/api/system/system-user-api";
import loginTemplateMixin from "@/components/login/mixin/login-template-mixin";

export default {
    components: {
        Breadcrumb,
        Hamburger,
    },
    mixins: [loginTemplateMixin],
    data() {
        return {
            imgUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAoCAYAAABjPNNTAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkM1NzlGQTQ5NkY0NjExRUFCOUI0QzJDNEE4N0I5REZDIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkM1NzlGQTRBNkY0NjExRUFCOUI0QzJDNEE4N0I5REZDIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QzU3OUZBNDc2RjQ2MTFFQUI5QjRDMkM0QTg3QjlERkMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QzU3OUZBNDg2RjQ2MTFFQUI5QjRDMkM0QTg3QjlERkMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4ebtqlAAAFBUlEQVR42rxZzW/jVBB/dtLUdZLGTkLbZNtuPqjEXjgg4AYsSEhIHOC+QtxW/A+AWAT8EXBDCM5wQEJCQgvcFsRhr7vdJi20zXadJt3YcZqvnXHnVW5w7Gen6ZNG+fKb+b35fhNpPB6ziCsOtAyUAlKAFoFiREOiHpAN1AE6ARpEESRFAKkB5QmgFGLfmIA+AWrNCySCu0Zac9bu7t6btm2/MhqNKkAbgEMFdmlJYk+BtSXL8h7QI0VR/t7c3PjNxQu1+58oWBGQaNbrBJLt7++/ZJrWG/3+6fuwNSmsDYmZCwuJH5NJ9fdisfgPfY0g60FuEAQSQVSBFtrtdv7x46MPTk9Pb7EZVyKR+H5l5bnvMpkMmr4PtA1kRgGZAaoAyWDW1zudzsfwbI5d0pIkyUilUl+BG/wBH0cE9CQMyDTQFv5eq9XfNU3zczanlUwmPyuVrv9MgfUA6OnkM7LHPoVMLO3s1N6bJ0BcyB/lUKaougNzGkj8XMZcBxp8x7KsT9kVLJSD8ijHlidxTZq7AFQ8ODh4sdk8/hoDJjD043GmaRmWTqcZpBr0NQbBxVqtFjOMJguR4gbZrH67UCjcxyQCdOClyQTQGr5pt08+EgG4tLTEtraeZ6urq0xVVQY50QG5uLjofHfjxgtsbW1VuIKRXEY4El4g8QcZ1T4cDl8V4YoAEJhPBLNcLsdisZgQSpRLZpe5wtwgkYuTXrrd7oeiR0dNBtZCMDdUI2H/dMnPEa5zkDq+39v79zVguCXKEE4e+Az6Z5j+AOUjDsKmu0FqZ6ew3g4Tlf1+X0Ro6Gh34dA4SImSNxsMBjdFGWEkK8qS0HPxeCwUSBcOxCXJlDxlqMsVsIoqyugskoXKH5AcCiTiQDykRIWDRIcthWFk2108scBzPSG38AggjscBGacgCNU8jEZj9vDhNms2m77+WK/XI1UhwJOntwsyD3OIwGQERgzMMjU4oO8U0vaU1KWee9asdReBNhoNz9+mfR92yXRhQgc3IzawTgn0Whsb607gROw3Le41Mm/doXQZYRlhxVlfv3ahNLrNizW8WCw4Bwm7AM8Tno7jdClCgTXovgVSj8R0PcugY/mfcMMw2OFhA+p1Fur6WenVNM0hiFanK4JriKgCajxByARyBHeOR2AZy3+jwqrVqtNYeGlneXn5wquX1iuVcqBmEQfioWuFA3LMW3boDe/6mbZUKvkK4LXcrxQiHwSKruDTo3IciGssu66WwED9NWpbhqvTManT7gb5GysU1nwOco6j5W4wjlEBEI1/ApAHUdsyuK/wahG5zUP5iINMfewGiXYyaPO33lrqBPaNliUOkh/IAzyXb/D06LbfIaKH6+UvYI57k5uhx8OxinN3QRCYatx9Yq/Xc0rlmU8OoV4PLhwAn8d9uB/5ID8PN7iH8kmLhyIXsW94Xb+iNdB1/Tbk1ft0CdufdqXFOmbhjQ0u7XeuECAOCe4QwK5bi14gUc076AuodrgBfnEVAFEOmRl9kOdH3wmGTXOZcblc+mneGkX+KIfy9TavgFEHVp/As9lLHFg1U6nUl66BFWqwPdPor9VqrxwdHd26rNFfPp//Qde1xqyjP78h6k0aoqrimmMWDVHvuoaoqLnarEPUoHH0W7Ztv0zj6E0aR6cAUIfG0btAO3Bj/Gve4+jJpdN0Iepg3+DlTtgKl/gXiULZgv9FMiKNzfwXyTMBBgAMPWU3YZkdlwAAAABJRU5ErkJggg==",
            dialog: {
                maxIcon: "go",
                iframeRadius: "8px",
                userInfo: false,
                userForm: {
                    userName: "",
                    realName: "",
                    deptName: "",
                    email: "",
                    phone: "",
                    gender: "",
                    roleName: "",
                },
                show: false,
                form: {
                    password: "",
                    newPassword: "",
                    rePassword: "",
                },
                rules: {
                    password: [
                        {
                            required: true,
                            message: "请输入旧密码",
                            trigger: "blur",
                        },
                    ],
                    newPassword: [
                        {
                            required: true,
                            message: "请输入新密码",
                            trigger: "blur",
                        },
                    ],
                    rePassword: [
                        {
                            required: true,
                            message: "请确认新密码",
                            trigger: "blur",
                        },
                    ],
                },
            },
            // 三个眼睛
            passwordType1: "password",
            passwordType2: "password",
            passwordType3: "password",
        };
    },
    computed: {
        ...mapGetters(["sidebar", "name", "searchObj"]),
    },
    mounted() {
        this.init();
        console.log("searchObj-init:", this.searchObj, "name:", this.name);
    },
    methods: {
        // 跳转开发管理
        gotoFormDesignDev() {
            let searchObj = this.searchObj || {};
            searchObj.params["project"] = {
                token: getToken(),
                publicConfig: window.publicConfig,
            };
            console.log("searchObj:", searchObj);
            let params = aesEncrypt(encodeURIComponent(JSON.stringify(searchObj)));
            var url = window.publicConfig.devManagerUrl + "?makeid_params=" + params;
            window.open(url);
        },

        // 初始加载
        init() {
            if (getUpdatePwd() == "true") {
                this.changePassword();
            }
        },

        // 侧边栏展开
        toggleSideBar() {
            this.$store.dispatch("app/toggleSideBar");
        },

        // 退出登录
        async logout() {
            // 清除tagsView，如果需要下次登录回到对应页，需要删除此代码
            // await this.$store.dispatch('tagsView/delAllVisitedViews', this.$route)
            await this.$store.dispatch("tagsView/delAllViews");
            await this.$store.dispatch("user/logout");
            // 退出登录，下次登录回到首页
            this.$router.push("/login");
            // this.$router.go(0)
            // 退出登录，下次登录回到对应页
            // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        },

        // 获取用户详情
        userDetail() {
            this.dialog.userInfo = true;
            that.sysUserQueryUserInfo()
                .then((res) => {
                    Object.assign(this.dialog.userForm, res);
                    let roles = res.roles.map((item) => {
                        return item.roleName;
                    });
                    this.dialog.userForm.roleName = roles.join(", ");
                })
                .catch((error) => {
                    console.log(error);
                });
        },

        // 打开修改密码弹窗
        changePassword() {
            this.dialog.show = true;
            this.dialog.form = {
                password: "",
                newPassword: "",
                rePassword: "",
            };
        },

        // 修改密码确认
        sureAddData() {
            this.$refs["dialog.form"].validate((valid) => {
                if (valid) {
                    if (this.dialog.form.newPassword === this.dialog.form.rePassword) {
                        const item = {
                            password: aesEncrypt(this.dialog.form.password),
                            newPassword: aesEncrypt(this.dialog.form.newPassword),
                        };
                        sysUserPassword(item).then((res) => {
                            removeUpdatePwd();
                            this.msgSuccess("修改成功,即将重新登录");
                            this.dialog.show = false;
                            setTimeout(() => {
                                this.logout();
                            }, 2000);
                        });
                    } else {
                        this.$message({
                            message: "两次输入的密码不一样！",
                            type: "warning",
                        });
                        this.dialog.form.rePassword = "";
                    }
                }
            });
        },

        //修改密码的小眼睛
        showPwd(x) {
            if (x === 1) {
                if (this.passwordType1 === "password") {
                    this.passwordType1 = "";
                } else {
                    this.passwordType1 = "password";
                }
                this.$nextTick(() => {
                    this.$refs.password.focus();
                });
            } else if (x === 2) {
                if (this.passwordType2 === "password") {
                    this.passwordType2 = "";
                } else {
                    this.passwordType2 = "password";
                }
                this.$nextTick(() => {
                    this.$refs.oldPassword.focus();
                });
            } else {
                if (this.passwordType3 === "password") {
                    this.passwordType3 = "";
                } else {
                    this.passwordType3 = "password";
                }
                this.$nextTick(() => {
                    this.$refs.cfmPassword.focus();
                });
            }
        },
    },
};
</script>
<style lang="scss">
@import "@/assets/styles/variables.scss";
.dev-manager-dialog {
    margin: 0px !important;
    height: 95%;
    position: absolute !important;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 8px;
    .el-dialog__header {
        display: none;
    }
    .el-dialog__body {
        height: 100%;
        padding: 5px;
        padding-top: 0px;
        box-sizing: border-box;
        .content {
            height: 100%;
            .close {
                position: absolute;
                top: -0;
                right: -0;
                z-index: 10;
                font-size: 0px;
                height: 38px;
                width: 38px;
                cursor: pointer;
                transition: all 0.1s;
                text-align: center;
                border-radius: 0 8px 0 0;
                &:hover {
                    background: rgba(232, 17, 35, 1);
                    svg path {
                        fill: #fff;
                    }
                }
                svg {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
            }
            iframe {
                width: 100%;
                height: 100%;
            }
        }
    }
}
.navbar {
    height: $navHeight;
    overflow: hidden;
    position: relative;
    background: $navBackgroudColor;
    .user_info {
        line-height: 36px;
        font-size: 14px;
        text-align: left;
        color: #000000;
        font-weight: normal;
        font-style: normal;
        text-decoration: none;
    }

    .user-dropdown {
        top: 43px !important;
        padding: 0px 0 !important;
        margin: 0px 0 !important;
    }
    .dev-manager {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 9999;
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s;
        &.active {
            pointer-events: visible;
            opacity: 1;
        }
        &.active .dev-manager-center {
            pointer-events: visible;
            opacity: 1;
            transform: translate(-50%, -50%);
        }
        .dev-manager-center {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, calc(-50% - 20px));
            transition: all 0.3s;
            box-sizing: border-box;
            border-radius: 8px;
            background: #fff;
            opacity: 0;
            width: 90%;
            height: 90%;
            min-width: 1200px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
            pointer-events: none;
            &.active {
                opacity: 1;
                transform: translate(-50%, -50%);
            }
            iframe {
                width: 100%;
                height: 100%;
                border-radius: 8px;
            }
            .min {
                position: absolute;
                top: -0;
                right: 76px;
                z-index: 10;
                font-size: 0px;
                height: 38px;
                width: 38px;
                cursor: pointer;
                transition: all 0.1s;
                text-align: center;
                &:hover {
                    background: #eee;
                }
                svg {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
            }
            .max {
                position: absolute;
                top: -0;
                right: 38px;
                z-index: 10;
                font-size: 0px;
                height: 38px;
                width: 38px;
                cursor: pointer;
                transition: all 0.1s;
                text-align: center;
                &:hover {
                    background: #eee;
                }
                svg {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
            }
            .close {
                position: absolute;
                top: -0;
                right: -1px;
                z-index: 10;
                font-size: 0px;
                height: 38px;
                width: 38px;
                cursor: pointer;
                transition: all 0.1s;
                text-align: center;
                border-radius: 0 8px 0 0;
                &:hover {
                    background: rgba(232, 17, 35, 1);
                    svg path {
                        fill: #fff;
                    }
                }
                svg {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
            }
        }
    }
    .hamburger-container {
        line-height: $navHeight;
        height: 100%;
        float: left;
        cursor: pointer;
        transition: background 0.3s;
        -webkit-tap-highlight-color: transparent;

        &:hover {
            background: rgba(0, 0, 0, 0.025);
        }
    }

    .breadcrumb-container {
        float: left;
    }

    .right-menu {
        float: right;
        height: 100%;
        line-height: $navHeight;

        &:focus {
            outline: none;
        }

        .right-menu-item {
            display: inline-block;
            padding: 0 8px;
            height: 100%;
            font-size: 18px;
            color: #5a5e66;
            vertical-align: text-bottom;

            &.hover-effect {
                cursor: pointer;
                transition: background 0.3s;

                &:hover {
                    background: rgba(0, 0, 0, 0.025);
                }
            }
        }

        .avatar-container {
            margin-right: 30px;

            .avatar-wrapper {
                // margin-top: 5px;
                position: relative;
                .user-avatar {
                    cursor: pointer;
                    vertical-align: middle;
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }
                .user-name {
                    vertical-align: top;
                    height: 40px;
                    font-size: 16px;
                    color: $navTextColor;
                    padding: 0 5px;
                    display: inline-block;
                    line-height: $navHeight;
                    cursor: pointer;
                }
            }
        }
    }
}
.user-dropdown {
    padding: 0px 0 !important;
    margin: 0px 0 !important;
    .el-dropdown-menu__item {
        padding: 3px 20px !important;
    }
    .el-dropdown-menu__item--divided {
        margin-top: 0px !important;
        &:before {
            display: none !important;
        }
    }
}
</style>
