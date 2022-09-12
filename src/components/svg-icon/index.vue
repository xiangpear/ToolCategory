<template>
    <!-- <div v-if="isExternal" :style="styleExternalIcon" class="svg-external-icon svg-icon" v-on="$listeners" />
    <svg v-else :class="svgClass" aria-hidden="true" v-on="$listeners">
        <use :xlink:href="iconName" />
    </svg> -->
    <div style="display: inline">
        <template v-if="isExternal">
            <div :style="styleExternalIcon" class="svg-external-icon svg-icon" v-on="$listeners" />
        </template>
        <template v-else>
            <template v-if="iconName.includes('el-icon')"> <i :class="[iconName, 'svg-icon']" /> </template>
            <template v-else>
                <svg :class="svgClass" aria-hidden="true" v-on="$listeners">
                    <use :xlink:href="iconName" />
                </svg>
            </template>
        </template>
    </div>
</template>

<script>
// doc: https://panjiachen.github.io/vue-element-admin-site/feature/component/svg-icon.html#usage
import { isExternal } from "@/utils/validate";

export default {
    name: "SvgIcon",
    props: {
        iconClass: {
            type: String,
            required: true,
        },
        className: {
            type: String,
            default: "",
        },
    },
    computed: {
        isExternal() {
            return isExternal(this.iconClass);
        },
        iconName() {
            if (this.iconClass.includes("el-icon")) {
                return this.iconClass;
            } else {
                return `#icon-${this.iconClass}`;
            }
        },
        svgClass() {
            if (this.className) {
                return "svg-icon " + this.className;
            } else {
                return "svg-icon";
            }
        },
        styleExternalIcon() {
            return {
                mask: `url(${this.iconClass}) no-repeat 50% 50%`,
                "-webkit-mask": `url(${this.iconClass}) no-repeat 50% 50%`,
            };
        },
    },
};
</script>

<style scoped>
.svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}

.svg-external-icon {
    background-color: currentColor;
    mask-size: cover !important;
    display: inline-block;
}
</style>
