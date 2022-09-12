import { randomString, aesEncrypt, aesDecrypt } from "@/utils/index.js";
import { backendIP } from "@/utils/request.js";
import md5 from "js-md5";
import { handleURL, handleParams } from "@/utils/auth.js";
import { mapGetters } from "vuex";
import { getTenantInfo } from "@/api/login/login.js";
export default {
    name: "Login",
    data() {
        const validateUsername = (rule, value, callback) => {
            if (!value) {
                callback(new Error("请输入用户名"));
            } else {
                callback();
            }
        };
        const validatePassword = (rule, value, callback) => {
            if (value.length === 0) {
                callback(new Error("请输入密码"));
            } else {
                callback();
            }
        };
        return {
            loginForm: {
                username: "",
                password: "",
                captcha: "",
                uuid: "",
            },
            loginRules: {
                username: [{ required: true, trigger: "blur", validator: validateUsername }],
                password: [{ required: true, trigger: "blur", validator: validatePassword }],
                captcha: [{ required: true, trigger: "blur", message: "请输入验证码" }],
            },
            loading: false,
            passwordType: "password",
            redirect: undefined,
            codeUrl: "",
            projectName: window.publicConfig.projectName,
        };
    },
    watch: {
        $route: {
            handler: function (route) {
                this.redirect = route.query && route.query.redirect;
            },
            immediate: true,
        },
    },
    mounted() {
        this.getCode();
        this.initUserPwd();
    },
    methods: {
        // 只有开发、测试环境默认写入管理员账号密码
        initUserPwd() {
            if (process.env.NODE_ENV === "development") {
                this.loginForm.username = "makeid";
                this.loginForm.password = "Makeid@123456";
            }
            let uuid = handleParams().params;
            if (uuid) {
                this.loginForm.username = "makeid";
                this.loginForm.password = "Makeid@123456";
            }
        },
        getUrl() {
            let projectName = handleParams().title;
            return projectName;
        },
        showPwd() {
            if (this.passwordType === "password") {
                this.passwordType = "";
            } else {
                this.passwordType = "password";
            }
            this.$nextTick(() => {
                this.$refs.password.focus();
            });
        },
        // async getParams() {
        //     let uuid = handleParams().params;
        //     if (uuid) {
        //         await getTenantInfo(uuid).then((res) => {
        //             return handleURL(res);
        //         });
        //     }
        // },
        handleLogin() {
            this.$refs.loginForm.validate(async (valid) => {
                if (valid) {
                    await this.getSearchObj();
                    console.log("searchObj-state:", this.searchObj);
                    this.loading = true;
                    const ps = aesEncrypt(md5(this.loginForm.password));
                    const item = {
                        username: this.loginForm.username,
                        password: ps,
                        captcha: this.loginForm.captcha,
                        uuid: this.loginForm.uuid,
                    };
                    // item["tenantId"] = searchObj.params.tenant.tenantId;
                    if (this.searchObj && this.searchObj.params) {
                        item["tenantId"] = this.searchObj.params.tenant.tenantId;
                        this.$store.dispatch("user/saveSearchObj", this.searchObj);
                    }
                    this.$store
                        .dispatch("user/login", item)
                        .then(() => {
                            this.$router.push({ path: "/" });
                            this.loading = false;
                        })
                        .catch(() => {
                            this.loading = false;
                            this.loginForm.captcha = "";
                            this.getCode();
                        });
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        async getSearchObj() {
            let searchObj = null;
            let uuid = handleParams().params;
            if (uuid) {
                const res = await getTenantInfo(uuid);
                if (res) {
                    searchObj = handleURL(res);
                    this.$store.dispatch("user/saveSearchObj", searchObj);
                    // window.localStorage.setItem('searchObj',JSON.stringify(searchObj))
                }
            }
        },
        getCode() {
            this.loginForm.uuid = randomString(16);
            this.codeUrl = backendIP + "/captcha.jpg?uuid=" + this.loginForm.uuid;
        },
    },
    computed: {
        ...mapGetters(["searchObj"]),
    },
};
