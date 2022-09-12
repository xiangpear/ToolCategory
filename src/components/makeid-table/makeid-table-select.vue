<template>
    <!-- 动态列展示 -->
    <div class="makeid-table-select">
        <template v-if="isSelectShow">
            <i class="el-icon-info" />
            <span>已选择</span>
            <span class="code">{{ selectedNum }}</span>
            <el-button type="text" @click="clear">清空</el-button>
        </template>
        <slot />
        <div class="select-btn">
            <el-popover placement="bottom" title="选择展示列" trigger="click" @show="porverShow">
                <div class="makeid-table-select-popover">
                    <el-checkbox-group v-model="defineLine" @change="lineSelect">
                        <el-checkbox v-for="item in subTableLine" :key="JSON.stringify(item)" :checked="true" :label="item.label" />
                    </el-checkbox-group>
                </div>
                <el-button slot="reference" icon="el-icon-setting" type="text">自定义列</el-button>
            </el-popover>
        </div>
    </div>
</template>
<script>
export default {
    name: "MakeidTableSelect",
    props: {
        // 已选择数量
        selectedNum: {
            type: Number,
            default: 0,
        },

        // 表格字段
        tableLine: {
            type: Array,
            default: () => {
                return [];
            },
        },

        // 清空已选择函数
        clear: {
            type: Function,
            default: function () {},
        },

        // 是否显示已选择
        isSelectShow: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            defineLine: [],
            preDefinLine: [],
            subTableLine: this.tableLine,
        };
    },
    computed: {
        tableData() {
            return this.tableList;
        },
    },
    methods: {
        // 选择展示列
        porverShow() {
            this.preDefinLine = this.defineLine;
        },

        // 动态列改变
        lineSelect() {
            if (this.defineLine.length === 0) {
                this.msgWarning("可展示列不能为空");
                this.defineLine = this.preDefinLine;
                return;
            }
            this.preDefinLine = this.defineLine;
            this.$emit("refresh", this.defineLine);
        },
    },
};
</script>
