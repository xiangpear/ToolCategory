import { baseStorehouseList } from "@/api/base/base-huowei-api";

const state = {
    storehouseList: [],
};

const mutations = {
    STOREHOUSELIST(state, storehouseList) {
        state.storehouseList = storehouseList;
    },
};

const actions = {
    async storehouseList({ commit }) {
        let result = await baseStorehouseList();
        commit("STOREHOUSELIST", result);
    },
};
export default {
    state,
    mutations,
    actions,
};
