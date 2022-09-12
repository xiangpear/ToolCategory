//echart
<template>
    <div id="template-chart">
        <div class="doc">
            <a href="http://iotweb.wewin.com.cn/fondation-group/front-base-framework/v-charts/docs/index.html#/" target="_blank">V-Charts(Vue + Echarts) 参考文档</a>
        </div>
        <el-row :gutter="10">
            <el-col :span="12">
                <div class="subtitle">折线图</div>
                <ve-line height="350px" :data="chartData" :extend="chartExtend"></ve-line>
            </el-col>
            <el-col :span="12">
                <div class="subtitle">柱状图</div>
                <ve-histogram height="350px" :data="chartData" :extend="chartExtend"></ve-histogram>
            </el-col>
            <el-col :span="12">
                <div class="subtitle">条形图</div>
                <ve-bar height="350px" :data="chartData" :extend="chartExtend"></ve-bar>
            </el-col>
            <el-col :span="12">
                <div class="subtitle">饼图</div>
                <ve-pie height="350px" :data="chartData"></ve-pie>
            </el-col>
            <el-col :span="12">
                <div class="subtitle">环图</div>
                <ve-ring height="350px" :data="chartData"></ve-ring>
            </el-col>
            <el-col :span="12">
                <div class="subtitle">瀑布图</div>
                <ve-waterfall height="350px" :data="chartData"></ve-waterfall>
            </el-col>
            <el-col :span="12">
                <div class="subtitle">漏斗图</div>
                <ve-funnel height="350px" :data="chartData"></ve-funnel>
            </el-col>
            <el-col :span="12">
                <div class="subtitle">雷达图</div>
                <ve-radar height="350px" :data="chartData"></ve-radar>
            </el-col>
            <el-col :span="12">
                <div class="subtitle">热力图</div>
                <ve-heatmap height="350px" :data="chartData"></ve-heatmap>
            </el-col>
            <el-col :span="12">
                <div class="subtitle">散点图</div>
                <ve-scatter height="350px" :data="chartData"></ve-scatter>
            </el-col>
        </el-row>
    </div>
</template>
<script>
// 参考文档：http://iotweb.wewin.com.cn/fondation-group/front-base-framework/v-charts/docs/index.html#/
export default {
    name: "template-chart",
    components: {},
    data() {
        return {
            chartExtend: {
                "xAxis.0.axisLabel.fontSize": 12,
            },
            chartData: {
                columns: ["日期", "销售额"],
                rows: [
                    { 日期: "1月1日", 销售额: 798 },
                    { 日期: "1月2日", 销售额: 1223 },
                    { 日期: "1月3日", 销售额: 2123 },
                    { 日期: "1月4日", 销售额: 4123 },
                    { 日期: "1月5日", 销售额: 3123 },
                    { 日期: "1月6日", 销售额: 7123 },
                ],
            },
        };
    },
    mounted() {},
    methods: {},
};
</script>

<style lang="scss">
#template-chart {
    .doc {
        margin-bottom: 10px;
        a {
            color: $themeColor;
            text-decoration: underline;
        }
    }
    .el-col {
        margin-bottom: 30px;
    }
    .el-col > div:last-child {
        border: 1px solid #ddd;
    }
    .subtitle {
        text-align: center;
        margin-bottom: 10px;
    }
}
</style>
