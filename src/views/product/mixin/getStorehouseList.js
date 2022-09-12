import { mapState } from "vuex";
export default {
    created() {
        this.$store.dispatch("storehouseList");
    },

    computed: {
        ...mapState({
            storehouseList: (state) => state.storehouse.storehouseList,
        }),
    },
};
