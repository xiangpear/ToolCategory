<template>
    <div id="login1-container">
        <div class="login-item">
            <div class="login1-bg-item">
                <!-- <svg-icon icon-class="login1-bg" /> -->
                <div class="login-icon-svg">
                    <svg viewBox="0 0 293 344" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <title>编组 5</title>
                        <g id="模板" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" fill-opacity="0.5">
                            <g id="登录页1" transform="translate(-393.000000, -165.000000)">
                                <g id="编组-5" transform="translate(393.000000, 165.000000)">
                                    <path
                                        class="path1"
                                        d="M2.55795385e-13,343.737129 C2.55795385e-13,136.720543 2.55795385e-13,29.176946 2.55795385e-13,21.1063385 C2.55795385e-13,9.00042725 9.1631546,1.13686838e-13 21.0923576,1.13686838e-13 C29.0451597,1.13686838e-13 119.622345,1.13686838e-13 292.823914,1.13686838e-13 C293.988098,19.2118378 287.371887,41.9565608 272.975281,68.234169 C251.380371,107.650581 256.334382,128.895968 270.079163,159.31147 C278.011169,176.864021 272.975281,216.846718 262.357727,240.092384 C251.740173,263.338051 216.350464,280.291878 175.473999,277.772896 C134.597534,275.253914 94.0733032,251.215614 48.3562927,274.559761 C33.0152228,282.393261 16.8964585,305.452383 2.55795385e-13,343.737129 Z"
                                        id="路径-2"
                                        fill="#2468DC"
                                    ></path>
                                    <path
                                        class="path2"
                                        d="M-5.68434189e-14,304.546303 C-5.68434189e-14,124.94966 -5.68434189e-14,30.8130512 -5.68434189e-14,22.1364765 C-5.68434189e-14,9.12161446 8.97542572,4.8316906e-13 22.0139275,4.8316906e-13 C30.706262,4.8316906e-13 108.881632,4.8316906e-13 256.540039,4.8316906e-13 C263.592102,15.2820892 258.851562,41.7961197 242.31842,79.5420914 C231.806111,103.542207 223.030902,126.457512 225.457672,142.308571 C228.755924,163.851933 245.75874,176.735622 242.31842,202.324471 C239.192585,225.574211 231.404157,256.191357 208.506012,275.628883 C187.659374,293.324949 153.624385,301.624537 112.147644,289.20475 C54.1241862,271.830218 16.7416382,276.944069 -5.68434189e-14,304.546303 Z"
                                        id="路径-3"
                                        fill="#6D9EF7"
                                    ></path>
                                </g>
                            </g>
                        </g>
                    </svg>
                </div>
            </div>
            <div class="login-content">
                <div class="login-box">
                    <div class="login-title">{{ getUrl() || projectName }}</div>
                    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form theme1" auto-complete="on">
                        <el-form-item prop="username">
                            <span class="svg-container">
                                <svg-icon icon-class="user-fill" />
                            </span>
                            <el-input
                                ref="username"
                                v-model.trim="loginForm.username"
                                placeholder="请输入用户名"
                                name="username"
                                maxlength="30"
                                type="text"
                                tabindex="1"
                                auto-complete="new-password"
                            />
                        </el-form-item>
                        <el-form-item prop="password">
                            <span class="svg-container">
                                <svg-icon icon-class="password" />
                            </span>
                            <el-input
                                :key="passwordType"
                                ref="password"
                                v-model.trim="loginForm.password"
                                :type="passwordType"
                                placeholder="密码"
                                name="password"
                                maxlength="30"
                                tabindex="2"
                                auto-complete="new-password"
                            />
                            <span class="makeid-show-pwd" @click="showPwd">
                                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                            </span>
                        </el-form-item>
                        <el-form-item prop="captcha">
                            <span class="svg-container">
                                <svg-icon style="font-size: 16px" icon-class="validCode" />
                            </span>
                            <el-input
                                ref="loginForm.captcha"
                                v-model.trim="loginForm.captcha"
                                placeholder="验证码"
                                type="text"
                                tabindex="3"
                                auto-complete="off"
                                maxlength="5"
                                @keyup.enter.native="handleLogin"
                            />
                            <div class="login-code noselect">
                                <span @click="getCode" class="code-button">换一张</span>
                                <img :src="codeUrl" />
                            </div>
                        </el-form-item>
                        <el-button :loading="loading" type="primary" class="login-button" @click.native.prevent="handleLogin">登录</el-button>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import loginTemplateMixin from "./mixin/login-template-mixin";
import { mapGetters } from "vuex";
export default {
    mixins: [loginTemplateMixin],
    computed: {
        ...mapGetters(["searchObj"]),
    },
};
</script>

<style lang="scss">
#login1-container {
    background-color: rgba($themeColor, 0.8);
    height: 100vh;
    .login-item {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 59%;
        height: 69%;
        min-height: 530px;
        max-height: 650px;
        min-width: 808px;
        max-width: 930px;
        background: $themeColor;
        border-radius: 20px;
        .login1-bg-item {
            position: absolute;
            top: 0;
            left: 0;
            width: 230px;
            .login-icon-svg {
                width: 100%;
                position: absolute;
                top: 0px;
                left: 0px;
                .path1 {
                    fill: rgba(red($themeColor) - 30, green($themeColor) - 30, blue($themeColor) - 30, alpha($themeColor));
                }
                .path2 {
                    fill: rgba(red($themeColor) + 30, green($themeColor) + 30, blue($themeColor) + 30, alpha($themeColor));
                }
            }
            .login-icon {
                width: 100%;
                position: relative;
                color: #fff;
                margin-top: 80px;
                margin-left: 10px;
                font-size: 42px;
                font-weight: 500;
            }
        }
        .login-content {
            position: absolute;
            right: 0;
            top: 0;
            border-radius: 0 20px 20px 0;
            background: #fff;
            width: 65%;
            // padding-left: 10%;
            box-sizing: border-box;
            min-width: 465px;
            height: 100%;
            .login-box {
                position: absolute;
                width: 80%;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
            .login-title {
                position: relative;
                font-size: 38px;
                font-weight: 600;
                color: $themeColor;
                line-height: 50px;
                margin-bottom: 70px;
            }
            .login-form.theme1 {
                position: relative;
                overflow: hidden;
                .el-form-item {
                    position: relative;
                    background: #ffffff;
                    margin-bottom: 30px;
                    .el-input {
                        width: calc(100% - 18px);
                        input {
                            border: none;
                            border-bottom: 1px solid #e5e5e5;
                            color: $themeColor;
                            border-radius: 0;
                        }
                    }
                    .svg-container {
                        vertical-align: middle;
                        width: 18px;
                        color: $themeColor;
                        display: inline-block;
                        svg-icon {
                            font-size: 14px;
                        }
                    }
                    .login-code {
                        position: absolute;
                        right: 0px;
                        bottom: 0px;
                        display: table-cell;
                        height: 50px;
                        img {
                            width: 140px;
                            margin-top: 5px;
                            float: right;
                            box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1);
                        }
                        .code-button {
                            margin-left: 8px;
                            color: $themeColor;
                            cursor: pointer;
                            font-size: 12px;
                            float: right;
                            line-height: 50px;
                        }
                    }
                }
                .el-form-item.is-error {
                    input {
                        border-bottom: 1px solid #e62412;
                    }
                    .el-form-item__error {
                        top: 110%;
                        left: 17px;
                    }
                }
                .login-button {
                    position: relative;
                    float: right;
                    background: $themeColor;
                    border-radius: 30px;
                    line-height: 24px;
                    width: 160px;
                }
            }
        }
    }
}
</style>
