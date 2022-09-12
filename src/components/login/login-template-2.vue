<template>
    <div id="login2-container">
        <div class="login-bg">
            <img src="@/assets/imgs/login/login2-bg.png" />
        </div>
        <div class="login-item">
            <div class="login-content">
                <div class="login-title">{{ projectName }}</div>
                <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form theme2" auto-complete="on">
                    <el-form-item prop="username">
                        <span class="svg-container">
                            <svg-icon icon-class="user-fill" />
                        </span>
                        <el-input ref="username" v-model.trim="loginForm.username" placeholder="请输入用户名" name="username" maxlength="30" type="text" tabindex="1" auto-complete="new-password" />
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
                        <div class="login-code">
                            <img :src="codeUrl" @click="getCode" />
                        </div>
                    </el-form-item>
                    <el-button :loading="loading" type="primary" class="login-button" @click.native.prevent="handleLogin">登录</el-button>
                </el-form>
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
#login2-container {
    height: 100vh;
    overflow-x: hidden;
    .login-icon {
        position: absolute;
        color: #fff;
        font-size: 42px;
        left: 20px;
        top: 20px;
        font-weight: 500;
    }
    .login-bg {
        position: relative;
        background: rgba($themeColor, 0.9);
        max-height: 70%;
        overflow: hidden;
    }
    .login-item {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 42%;
        height: 69%;
        min-height: 530px;
        max-height: 650px;
        min-width: 600px;
        max-width: 700px;
        border-radius: 20px;
        .login-content {
            position: absolute;
            right: 0;
            top: 0;
            border-radius: 20px;
            background: #fff;
            width: 100%;
            height: 100%;
            box-shadow: 0px 2px 13px 2px rgba(0, 0, 0, 0.15);
            .login-title {
                position: relative;
                margin: 70px 0;
                text-align: center;
                font-size: 38px;
                font-weight: 600;
                color: $themeColor;
                line-height: 50px;
            }
            .login-form.theme2 {
                position: relative;
                overflow: hidden;
                width: 70%;
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
                        right: 0;
                        bottom: -14px;
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
