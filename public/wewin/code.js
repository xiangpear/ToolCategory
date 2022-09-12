/**
 * 导出版本：1.0
 * 导出时间：8/22/2022, 6:27:48 AM
 */

//初始化WewinPrintService API
var wps = typeof require !== 'undefined' ? require("./labelimage/static/WewinPrintService")() : WewinPrintService();
window.wewin = wps;

//修改-标签预览
wps.PageViewPrint = function () {
    
    wps.StartPreviewTag({
        //预览页面标题
        title: "重庆品胜 - 资管打印 - 打印预览",
        //修改版本号
        version: "TY_1.0"
    }, function(i){
        //预览标签构建方法

        //解析数据
        //EntityTypeId节点
        var labelType = wps.ParseElement(i, "EntityTypeId");
        //Code节点
        var Codes = wps.ParseElement(i, "Code");
        //Text节点
        var Texts = wps.ParseElement(i, "Text");

        // 标签1(安全工器具)
        if (labelType[0] == "安全工器具") {
                                    
            //检验打印数据是否符合规范
            wps.SetRightData({
                on: false,//是否开启详细说明弹窗(true: 弹窗显示详情; false: 控制台输出，无详情)
                name: ["labelType", "Code", "Text"],
                data: [
                    { elem: labelType, num: 1 },
                    { elem: Codes, num: 1 },
                    { elem: Texts, num: 3 }
                ]
            });

            //添加下拉框标签型号
            wps.SetLabelName({
                "70-30": "0"
            });
                                    
            //获取标签下拉列表
            var selValue = wps.GetLabelName();
                                    
            if(selValue == "0"){
                //支持的打印机型号
                wps.SetPrintInfo("I70");

                //-----------------------预览背景图片----------------------------
                wps.AddPreviewBackground({
                    index: i,//标签索引
                    imgName: "(30-70)(0).png",//图片名称
                    width: 70,//图片宽度
                    height: 30,//图片高度
                    scale: {
                        on: false,//是否开启缩放
                        tagScale: 1,//标签缩放比例(非IE浏览器)
                        checkScale: 1,//复选框缩放比例(非IE浏览器)
                        tagOffset: 0,//标签左侧偏移值
                        firstTagTop: 0,//第一张标签向上偏移值
                        otherTagTop: 2,//其他标签向上偏移值
                        ratio: 1//缩小比例(全浏览器)
                    }
                });
                //---------------------------------------------------------
                            
                //-----------------------文本预览----------------------------
                //注释
                wps.AddPreviewText({
                    str: [Texts[0]],//文本内容
                    fontHeight: 2.63,//字体大小
                    printWidth: 24.00,//换行宽度
                    x: 3.31,//x坐标
                    y: 3.43,//y坐标
                    maxH: 30.00,//最大高度 
                    xoffset: 0.25,
                    loffset: 0.13,
                    ptype: wps.ptype.left,//对齐方式
                    width: 24.13,//文本块宽度
                    rotate: false,//文本180度翻转
                    rotateLowIE: {//当旋转开启(rotate:true)时低版本IE浏览器的坐标(覆盖上方xy)
                        x: 0,
                        y: 0
                    },
                    debug: false//调试模式：打开文本边框
                });
                //---------------------------------------------------------
                                                            
                //-----------------------文本预览----------------------------
                //注释
                wps.AddPreviewText({
                    str: [Texts[1]],//文本内容
                    fontHeight: 2.63,//字体大小
                    printWidth: 30.00,//换行宽度
                    x: 3.41,//x坐标
                    y: 13.28,//y坐标
                    maxH: 30.00,//最大高度 
                    xoffset: 0.25,
                    loffset: 0.13,
                    ptype: wps.ptype.left,//对齐方式
                    width: 30.13,//文本块宽度
                    rotate: false,//文本180度翻转
                    rotateLowIE: {//当旋转开启(rotate:true)时低版本IE浏览器的坐标(覆盖上方xy)
                        x: 0,
                        y: 0
                    },
                    debug: false//调试模式：打开文本边框
                });
                //---------------------------------------------------------
                                                            
                //-----------------------文本预览----------------------------
                //注释
                wps.AddPreviewText({
                    str: [Texts[2]],//文本内容
                    fontHeight: 2.63,//字体大小
                    printWidth: 60.00,//换行宽度
                    x: 3.30,//x坐标
                    y: 22.81,//y坐标
                    maxH: 33.00,//最大高度 
                    xoffset: 0.25,
                    loffset: 0.13,
                    ptype: wps.ptype.left,//对齐方式
                    width: 60.13,//文本块宽度
                    rotate: false,//文本180度翻转
                    rotateLowIE: {//当旋转开启(rotate:true)时低版本IE浏览器的坐标(覆盖上方xy)
                        x: 0,
                        y: 0
                    },
                    debug: false//调试模式：打开文本边框
                });
                //---------------------------------------------------------
                                                            
            }
                                            
        }

    });                           
                                
    
}

//修改-标签打印
wps.PageDoLabelPrint = function () {

    //开始调用标签打印函数
    wps.StartPrintTag(function (i) {
        
        //解析数据
        //EntityTypeId节点
        var labelType = wps.ParseElement(i, "EntityTypeId");
        //Code节点
        var Codes = wps.ParseElement(i, "Code");
        //Text节点
        var Texts = wps.ParseElement(i, "Text");
                                
        // 标签1(安全工器具)
        if (labelType[0] == '安全工器具') {
            wps.SetPrintFunc(i, print_tag安全工器具, [Codes, Texts]);
        }
    });

}


// 标签1(安全工器具)
function print_tag安全工器具(Codes, Texts) {
    var printTexts = [];

    //获取标签下拉列表
    var selValue = wps.GetLabelName();
                            
    if(selValue == "0") {

        wps.StartTag(70, 30);
                                                
        //---------------------------------------
        //二维码打印-注释
        printTexts = Codes.slice(0, 1);
        wps.PrintQrcode({
            str: printTexts[0],
            x: 44.83,
            y: 2.34,
            width: 18.75,
            rotate: wps.rotate.rotate0
        });
        //---------------------------------------
                                        
        //---------------------------------------------------------
        //文字打印-注释
        printTexts = Texts.slice(0, 1);
        wps.PrintText({
            str: printTexts,
            fontHeight: 2.63,
            fontWeight: 500,
            printWidth: 24.00,
            x: 1.99,
            y: 3.43,
            rotate: wps.rotate.rotate0,
            xoffset: 0.25,
            loffset: 0.13,
            maxH: 30,
            ptype: wps.ptype.left
            //,startPos: 0 //垂直居中起始坐标
            //,height: 0 //垂直居中结束坐标与起始坐标相距的长度
        });
        //---------------------------------------------------------
                                                    
        //---------------------------------------------------------
        //文字打印-注释
        printTexts = Texts.slice(1, 2);
        wps.PrintText({
            str: printTexts,
            fontHeight: 2.63,
            fontWeight: 500,
            printWidth: 30.00,
            x: 2.10,
            y: 13.28,
            rotate: wps.rotate.rotate0,
            xoffset: 0.25,
            loffset: 0.13,
            maxH: 30,
            ptype: wps.ptype.left
            //,startPos: 0 //垂直居中起始坐标
            //,height: 0 //垂直居中结束坐标与起始坐标相距的长度
        });
        //---------------------------------------------------------
                                                    
        //---------------------------------------------------------
        //文字打印-注释
        printTexts = Texts.slice(2, 3);
        wps.PrintText({
            str: printTexts,
            fontHeight: 2.63,
            fontWeight: 500,
            printWidth: 60.00,
            x: 1.98,
            y: 22.81,
            rotate: wps.rotate.rotate0,
            xoffset: 0.25,
            loffset: 0.13,
            maxH: 33,
            ptype: wps.ptype.left
            //,startPos: 0 //垂直居中起始坐标
            //,height: 0 //垂直居中结束坐标与起始坐标相距的长度
        });
        //---------------------------------------------------------
                                                    
    }
                                        
    wps.EndTag();
}
                            