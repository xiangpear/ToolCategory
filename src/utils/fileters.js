/*
 全局过滤器管理文件
 在这里定义的过滤器会在main.js中自动注册并可以全局使用
 author：pxt
 */
import { dateFormatIE } from "@/utils/index";
// 时间格式化功能 默认格式化 YYYY-MM-DD HH:mm:ss
const fileters = {
    timeFormate: function (value, fmt) {
        if (value) {
            return dateFormatIE(value, fmt);
        } else {
            return "";
        }
    },
};
export default fileters;
