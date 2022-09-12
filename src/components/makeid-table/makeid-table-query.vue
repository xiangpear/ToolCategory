<template>
    <!-- 条件筛选 -->
    <div class="makeid-table-query" :style="{ height: queryHeight }">
        <!-- 条件筛选标题 -->
        <div class="query-title">
            <!-- <div class="txt">条件筛选</div> -->
            <div v-if="moreShow" class="more" @click="moreQuery">{{ queryMoreTxt }} <i :class="queryMoreIcon"></i></div>
        </div>

        <!-- 条件筛选表单内容 -->
        <div class="query-content" :style="{ width: queryContentWidth }">
            <el-form :inline="true">
                <slot />
            </el-form>
        </div>

        <!-- 条件筛选操作按钮 -->
        <div class="query-btn" :class="isExpand" style="margin: 15px">
            <el-button type="primary" icon="el-icon-search" @click="handleQuery" size="mini" round>查询</el-button>
            <el-button icon="el-icon-refresh-left" @click="resetQuery" size="mini" round>重置</el-button>
            <!-- <div v-if="moreShow" class="more" @click="moreQuery">{{ queryMoreTxt }} <i :class="queryMoreIcon"></i></div> -->
        </div>
    </div>
</template>
<script>
export default {
    name: "MakeidTableQuery",
    props: {
        // 查询函数
        handleQuery: {
            type: Function,
            default: function () {},
        },

        // 重置函数
        resetQuery: {
            type: Function,
            default: function () {},
        },
    },
    data() {
        return {
            queryHeight: "85px",
            queryMoreTxt: "展开",
            queryMoreIcon: "el-icon-arrow-down",
            moreShow: false,
            queryContentWidth: "calc(100% - 210px)",
            isExpand: "",
        };
    },
    mounted() {
        this.$nextTick(() => {
            var elForm = this.$children[0].$el;
            if (elForm.offsetHeight < 60) {
                this.moreShow = false;
            } else {
                this.moreShow = true;
            }
        });
    },
    methods: {
        // 条件筛选展开
        moreQuery() {
            if (this.queryHeight == "85px") {
                this.queryHeight = "100%";
                this.queryMoreTxt = "收起";
                this.queryMoreIcon = "el-icon-arrow-up";
                this.queryContentWidth = "100%";
                this.$nextTick(() => {
                    setTimeout(() => {
                        var items = [];
                        this.$children[0].$children.map((value) => {
                            items.push(value.$el);
                            return value;
                        });
                        var elForm = this.$children[0].$el;
                        var width = 0;
                        var arr = [];
                        for (let i = 0; i < items.length; i++) {
                            const element = items[i];
                            width += element.offsetWidth + 10;
                            if (width > elForm.offsetWidth) {
                                arr.push(i);
                                width = 0;
                                i--;
                            }
                        }
                        width = 0;
                        if (arr.length == 0) {
                            arr.push(0);
                        }
                        for (let i = arr[arr.length - 1]; i < items.length; i++) {
                            const element = items[i];
                            width += element.offsetWidth + 10;
                        }
                        if (width < elForm.offsetWidth - 195) {
                            this.isExpand = "";
                        } else {
                            this.isExpand = "active";
                        }
                    }, 100);
                });
            } else {
                this.queryHeight = "85px";
                this.queryMoreTxt = "展开";
                this.queryMoreIcon = "el-icon-arrow-down";
                setTimeout(() => {
                    this.queryContentWidth = "calc(100% - 210px)";
                    this.isExpand = "";
                }, 230);
            }
        },
    },
};
</script>
