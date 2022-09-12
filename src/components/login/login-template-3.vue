<template>
    <div id="login3-container">
        <img src="@/assets/imgs/login/login3-bg.png" class="login3-bg" />
        <div class="login-bg">
            <div class="login-item">
                <div class="login-content">
                    <div class="login-box">
                        <div class="login3-bg-item">
                            {{ projectName }}
                        </div>
                        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form theme3" auto-complete="on">
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
                            <el-form-item prop="captcha" style="width: calc(100% - 200px)">
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
                                <div class="login-code">
                                    <img :src="codeUrl" @click="getCode" />
                                </div>
                            </el-form-item>
                            <el-button :loading="loading" type="primary" class="login-button" @click.native.prevent="handleLogin">登录</el-button>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import loginTemplateMixin from "./mixin/login-template-mixin";
export default {
    mixins: [loginTemplateMixin],
};
</script>

<style lang="scss">
#login3-container {
    height: 100vh;
    overflow: hidden;
    .login3-bg {
        position: relative;
        z-index: 1;
    }
    .login-bg {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        background: rgba($themeColor, 0.8);
        height: 100vh;
        overflow: hidden;
        z-index: 2;
    }
    .login-item {
        position: absolute;
        left: 50%;
        top: 50%;
        z-index: 2;
        transform: translate(-50%, -50%);
        width: 59%;
        height: 69%;
        min-height: 530px;
        max-height: 650px;
        min-width: 808px;
        max-width: 930px;
        background: $themeColor;
        border-radius: 20px;
        .login3-bg-item {
            text-align: center;
            position: relative;
            line-height: 56px;
            color: $themeColor;
            margin-bottom: 8%;
            font-size: 38px;
            font-weight: bold;
        }
        .login-content {
            position: absolute;
            right: 0;
            top: 0;
            border-radius: 0 20px 20px 0;
            background: #fff;
            width: 62%;
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
                font-size: 36px;
                text-align: center;
                font-weight: 600;
                color: $themeColor;
                line-height: 50px;
                margin-bottom: 70px;
            }
            .login-form.theme3 {
                position: relative;
                overflow: hidden;
                width: 100%;
                margin: auto;
                .el-form-item {
                    position: relative;
                    background: #ffffff;
                    padding: 5px 10px;
                    margin-bottom: 30px;
                    border: 1px solid #8b8b8b;
                    border-radius: 28px;
                    .el-input {
                        width: 82%;
                        input {
                            border: none;
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
                        right: -200px;
                        bottom: -15px;
                        img {
                            width: 160px;
                            cursor: pointer;
                        }
                    }
                }
                .el-form-item.is-error {
                    border: 1px solid #e62412;
                    .el-form-item__error {
                        top: 120%;
                        left: 17px;
                    }
                }
                .login-button {
                    position: relative;
                    float: right;
                    background: $themeColor;
                    margin-top: 6%;
                    border-radius: 30px;
                    line-height: 24px;
                    width: 100%;
                }
            }
        }
    }
}
</style>
