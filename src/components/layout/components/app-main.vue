<template>
    <section class="app-main">
        <transition name="fade-transform" mode="out-in">
            <keep-alive :include="cachedViews">
                <router-view :key="key" />
            </keep-alive>
        </transition>
    </section>
</template>

<script>
export default {
    name: "AppMain",
    computed: {
        cachedViews() {
            return this.$store.state.tagsView.cachedViews;
        },
        key() {
            return this.$route.path;
        },
    },
};
</script>

<style lang="scss" scoped>
.app-main {
    /*50 = navbar  */
    height: calc(100vh);
    width: 100%;
    position: relative;
    box-sizing: border-box;
    padding: 12px;
    padding-bottom: 10px;
    background: #f3f3f3;
    overflow: hidden;
    overflow-y: auto;
}
.fixed-header + .app-main {
    padding-top: 50px;
}
.hasTagsView {
    .app-main {
        /* 84 = navbar + tags-view = 50 + 34 */
        min-height: calc(100vh - 84px);
    }
    .fixed-header + .app-main {
        padding-top: 107px;
    }
}
</style>

<style lang="scss"></style>
