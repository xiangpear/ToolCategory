<template>
    <!-- 表格区域 -->
    <div class="makeid-table-box">
        <!-- 功能按钮区 -->
        <div class="box-btn">
            <slot name="btn" />
        </div>

        <!-- 表格内容区 -->
        <div class="box-content">
            <slot name="content" />
        </div>

        <!-- 表格分页 -->
        <div class="box-pagination" v-if="isPaginationShow">
            <el-pagination
                background
                :current-page="pagination.pageNo"
                :page-sizes="pagination.pageRange"
                :page-size="pagination.pageSize"
                layout="total, prev, pager, next, sizes"
                :total="pagination.total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </div>
    </div>
</template>
<script>
export default {
    name: "MakeidTableBox",
    props: {
        // 分页
        pagination: {
            type: Object,
            default: () => {
                return {
                    pageNo: 1,
                    pageSize: 10,
                    total: 0,
                    pageRange: [10, 20, 30, 50, 100],
                };
            },
        },

        // 调整一页条数
        handleSizeChange: {
            type: Function,
            default: function () {},
        },

        // 调整当前页数
        handleCurrentChange: {
            type: Function,
            default: function () {},
        },

        // 是否显示分页
        isPaginationShow: {
            type: Boolean,
            default: true,
        },
    },
};
</script>
