// 时间格式化模块
import moment from "moment";
import { backendIP } from "@/utils/request.js";
import CryptoJS from "crypto-js";

/**
 * @desc 函数防抖---“立即执行版本” 和 “非立即执行版本” 的组合版本
 * @param func 需要执行的函数
 * @param wait 延迟执行时间（毫秒）
 * @param immediate---true 表立即执行，false 表非立即执行
 * 按钮点击使用方式：myClick：debounce((a,b,c)=>{},wait,immediate)
 **/
export function debounce(func, wait = 500, immediate) {
    let timer;
    return function () {
        const context = this;
        const args = arguments;
        if (timer) clearTimeout(timer);
        if (immediate) {
            var callNow = !timer;
            timer = setTimeout(() => {
                timer = null;
            }, wait);
            if (callNow) func.apply(context, args);
        } else {
            timer = setTimeout(function () {
                func.apply(context, args);
            }, wait);
        }
    };
}
/**
 * @desc 函数节流---“立即执行版本” 和 “非立即执行版本” 的组合版本
 * @param func 需要执行的函数
 * @param wait 延迟执行时间（毫秒）
 * @param immediate---true 表立即执行，false 表非立即执行
 * 按钮点击使用方式：myClick：throttle((a,b,c)=>{},wait,immediate)
 **/
export function throttle(fn, wait = 500, isImmediate = false) {
    var flag = true;
    // eslint-disable-next-line no-unused-vars
    var timer = null;
    return function () {
        if (flag) {
            // console.log(true)
            isImmediate && fn.apply(this, arguments);
            flag = false;
            timer = setTimeout(() => {
                !isImmediate && fn.apply(this, arguments);
                flag = true;
            }, wait);
        }
    };
}
// 随机生成uuid
export function randomString(len) {
    len = len || 32;
    var $chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678"; /** **默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var pwd = "";
    for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}
// url拼接
export function replacePath(template, context) {
    if (!context) return template;
    return template.replace(/{(.*?)}/g, (match, key) => context[key.trim()] || "");
}

// 时间格式化兼容ie
export function dateFormatIE(value, fmt) {
    return moment(value).format(fmt || "YYYY-MM-DD HH:mm:ss");
}

// get参数解析
export function getUrlSearch() {
    var json = {};
    var url = window.location.search;
    if (url) {
        var arr = url.substring(url.indexOf("?") + 1).split("&");
        for (let i = 0; i < arr.length; i++) {
            const element = arr[i].split("=");
            json[element[0]] = element[1];
        }
    }
    return json;
}

// base64 2次加密
export function encode(str) {
    // 对字符串进行编码
    // var encode = encodeURI(str);
    // 对编码的字符串转化base64
    var base64 = window.btoa(str);
    // base64 = encodeURI(base64);
    base64 = window.btoa(base64);
    return base64;
}
// base64 2次解密
export function decode(str) {
    var base64 = window.atob(str);
    // base64 = decodeURI(base64);
    base64 = window.atob(base64);
    // base64 = decodeURI(base64);
    return base64;
}

//DES加密 Pkcs7填充方式
export function desEncrypt(message) {
    const keyHex = CryptoJS.enc.Utf8.parse("E10ADC3949BA59ABBE56E057F20F883E");
    const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
}

//DES解密
export function desDecrypt(ciphertext) {
    const keyHex = CryptoJS.enc.Utf8.parse("E10ADC3949BA59ABBE56E057F20F883E");
    // direct decrypt ciphertext
    const decrypted = CryptoJS.DES.decrypt(
        {
            ciphertext: CryptoJS.enc.Base64.parse(ciphertext),
        },
        keyHex,
        {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7,
        }
    );
    return decrypted.toString(CryptoJS.enc.Utf8);
}

//aes加密
export function aesEncrypt(data) {
    let key = CryptoJS.enc.Utf8.parse("E10ADC3949BA59AB");
    let secretData = CryptoJS.enc.Utf8.parse(data);
    let encrypted = CryptoJS.AES.encrypt(secretData, key, {
        iv: CryptoJS.enc.Utf8.parse("E10ADC3949BA59AB"),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
}

//aes解密
export function aesDecrypt(data) {
    let key = CryptoJS.enc.Utf8.parse("E10ADC3949BA59AB");
    let decrypt = CryptoJS.AES.decrypt(data, key, {
        iv: CryptoJS.enc.Utf8.parse("E10ADC3949BA59AB"),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}

// json转get参数
export function ToPathStr(val) {
    let str = "";
    for (const key in val) {
        str += key + "=" + (val[key] + "") + "&";
    }
    str = str.substr(0, str.length - 1);
    return str;
}
// Blob流文件下载 数据+文件名
// 注：只适合小文件的下载 大文件下载建议直接走url下载
export function downloadFile(data, name, type) {
    if (!data) {
        return;
    }
    let url = "";
    let fileName = "";
    if (window.makeid_disposition) {
        let temp = window.makeid_disposition.split(";")[1].split("=")[1];
        fileName = temp.indexOf("utf-8") === -1 ? temp : temp.split("''")[1];
    }
    fileName = name ? name : decodeURIComponent(fileName);
    if (typeof data != "string") {
        if (type) {
            url = window.URL.createObjectURL(
                new Blob([data], {
                    type: type,
                })
            );
        } else {
            url = window.URL.createObjectURL(new Blob([data]));
        }
    } else {
        url = data;
    }
    const link = document.createElement("a");
    link.style.display = "none";
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.makeid_disposition = null;
}
// 文件下载 url 直接访问方式  缺点：无法自定义文件名
// 使用这种方法时 遇到图片，文本如 ['.png', '.bmp', '.png', '.tif', '.jpg', '.jpeg', '.pdf', '.txt'] 等此类文件会直接打开 此时推荐走上面种下载方式
// 如果是大型文件如果是压缩包等推荐使用此方法
// 实际使用中建议二者结合
export function downLoadByURL(url) {
    if (!url) {
        return "";
    }
    const link = document.createElement("a");
    link.style.display = "none";
    // url需要拼接： baseURL + 目录 + url
    link.href = backendIP + "/file/" + url;
    link.setAttribute("download", url.substring(url.indexOf("-")));
    link.setAttribute("target", "_self");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
// 综合两种方法下载
export function downLoad(url, RequestFun) {
    if (!url) {
        return "";
    }
    // 文件类型判断
    const type = url.substring(url.lastIndexOf("."));
    const urlList = [".png", ".bmp", ".png", ".tif", ".jpg", ".jpeg", ".pdf", ".txt"];
    // 如果属于图片或者文本则走blob流
    if (urlList.includes(type)) {
        // blob流请求后台接口
        RequestFun({
            filePath: url,
        }).then((res) => {
            // blob流文件下载  截取部门做文件名 可自行修改
            downloadFile(res, url.substring(url.indexOf("-")));
        });
    } else {
        // a标签直接下载
        downLoadByURL(url);
    }
}
// 重写console.log 函数，用于生产环境取消console.log
export function rewirteLog() {
    console.log = (function (log) {
        return process.env.NODE_ENV === "development" ? log : function () {};
    })(console.log);
}

// 校验json格式
export function isJSON(str) {
    if (typeof str == "string") {
        try {
            var obj = JSON.parse(str);
            if (typeof obj == "object" && obj) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }
    return false;
}

/**
 * 格式化表格列数据
 * @param {String} value 列数据
 * @returns {String}
 */
export function formatTableColumn(value) {
    var result = "";
    if (value === null || value === undefined || value === "") {
        result = "-";
    } else {
        result = value;
    }
    return result;
}

/**
 * 格式化表格多选列数据
 * @param {String} showStr 多选列数据
 * @param {Array} options 多选列选项
 * @returns {String}
 */
export function formatTableOptionsColumn(showStr, options) {
    var str = "";
    if (typeof showStr == "string" && showStr.indexOf(",") != -1) {
        var arr = showStr.split(",");
        arr.map((item, index) => {
            var optionsArr = options.filter((value) => {
                return value.value == item;
            });
            str += optionsArr.length != 0 ? optionsArr[0].label + (index == arr.length - 1 ? "" : ", ") : "";
        });
    } else {
        var optionsArr = options.filter((value) => {
            return value.value == showStr;
        });
        str += optionsArr.length != 0 ? optionsArr[0].label : "";
    }
    str = formatTableColumn(str);
    return str;
}

/**
 * 数组类型字段转字符串
 * @param {Object} dataFormTemp 提交表单数据
 */
export function dataFormArrayToString(dataFormTemp) {
    try {
        if (dataFormTemp["entity"]) {
            for (var key in dataFormTemp) {
                if (key == "entity") {
                    for (var entityKey in dataFormTemp["entity"]) {
                        if (Array.isArray(dataFormTemp["entity"][entityKey])) {
                            dataFormTemp["entity"][entityKey] = JSON.stringify(dataFormTemp["entity"][entityKey]);
                        }
                    }
                }
                if (Array.isArray(dataFormTemp[key])) {
                    for (let i = 0; i < dataFormTemp[key].length; i++) {
                        for (var childKey in dataFormTemp[key][i]) {
                            if (Array.isArray(dataFormTemp[key][i][childKey])) {
                                dataFormTemp[key][i][childKey] = JSON.stringify(dataFormTemp[key][i][childKey]);
                            }
                        }
                    }
                }
            }
        } else {
            for (var key in dataFormTemp) {
                if (Array.isArray(dataFormTemp[key])) {
                    dataFormTemp[key] = JSON.stringify(dataFormTemp[key]);
                }
            }
        }
    } catch (error) {
        console.log("dataFormArrayToString - error", error);
    }
}

/**
 * 处理表格数据回显
 * @param {Array} dataList 表格数据
 */
export function handlePageListData(dataList) {
    for (let i = 0; i < dataList.length; i++) {
        for (const key in dataList[i]) {
            if (
                (!isNaN(Date.parse(dataList[i][key])) &&
                    Date.parse(dataList[i][key]) > 0 &&
                    typeof dataList[i][key] == "string" &&
                    dataList[i][key].indexOf("T") != -1 &&
                    dataList[i][key].indexOf("+") != -1) ||
                (typeof dataList[i][key] == "number" && (dataList[i][key] + "").length >= 12)
            ) {
                dataList[i][key] = dateFormatIE(dataList[i][key]);
            }
            try {
                if (Array.isArray(JSON.parse(dataList[i][key]))) {
                    var isExist = JSON.parse(dataList[i][key]).filter((value) => {
                        return typeof value == "number" && (value + "").length >= 12;
                    });
                    if (isExist.length != 0) {
                        var arr = JSON.parse(dataList[i][key]).map((value) => {
                            value = dateFormatIE(value);
                            return value;
                        });
                        dataList[i][key] = arr.join(",");
                    } else {
                        dataList[i][key] = JSON.parse(dataList[i][key]).join(",");
                    }
                }
            } catch (error) {
                continue;
            }
        }
    }
}

/**
 * 处理表格滚动
 * @param {Object} _this 页面对象
 */
export function handleTableOverflow(_this) {
    _this.$nextTick(() => {
        let tableWrap = document.getElementsByClassName("el-table__body-wrapper")[0];
        tableWrap.style.overflow = "auto";
    });
}

/**
 * 处理表单数据回显
 * @param {Object} dataForm 表单数据
 */
export function handleDataForm(dataForm) {
    for (const key in dataForm) {
        if (!isNaN(Date.parse(dataForm[key])) && Date.parse(dataForm[key]) > 0 && typeof dataForm[key] == "string" && dataForm[key].indexOf("T") != -1 && dataForm[key].indexOf("+") != -1) {
            dataForm[key] = Date.parse(dataForm[key]);
        }
        try {
            if (Array.isArray(JSON.parse(dataForm[key]))) {
                dataForm[key] = JSON.parse(dataForm[key]);
            }
        } catch (error) {
            continue;
        }
    }
}

/**
 * 删除询问
 * @param {Function} func 删除回调
 * @param {String} msg 删除提示信息
 */
export function deleteHandle(_this, func, msg) {
    _this
        .$confirm(msg ? msg : "是否确定删除?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
        })
        .then(() => {
            func ? func() : "";
        })
        .catch(function () {});
}

//深拷贝函数
export function clone(any) {
    function checkType(any) {
        return Object.prototype.toString.call(any).slice(8, -1);
    }

    if (checkType(any) === "Object") {
        let o = {};
        for (let k in any) {
            o[k] = clone(any[k]);
        }
        return o;
    } else if (checkType(any) === "Array") {
        let arr = [];
        for (let i of any) {
            arr.push(clone(i));
        }
        return arr;
    } else if (checkType(any) === "Function") {
        return new Function("return " + any.toString()).call(this);
    } else if (checkType(any) === "Date") {
        return new Date(any.valueOf());
    } else if (checkType(any) === "RegExp") {
        return new RegExp(any);
    } else if (checkType(any) === "Map") {
        let m = new Map();
        any.forEach((v, k) => {
            m.set(k, clone(v));
        });
        return m;
    } else if (checkType(any) === "Set") {
        let s = new Set();
        for (let val of any) {
            s.add(clone(val));
        }
        return s;
    }
    return any;
}

//多层对象展开
export function unfold(obj) {
    let newObj = {};

    function checkType(any) {
        return Object.prototype.toString.call(any).slice(8, -1);
    }

    (function recursion(obj) {
        for (let key in obj) {
            if (checkType(obj[key]) === "Object") {
                recursion(obj[key]);
            } else if (newObj[key] === undefined) {
                newObj[key] = obj[key];
            }
        }
    })(obj);
    return newObj;
}
