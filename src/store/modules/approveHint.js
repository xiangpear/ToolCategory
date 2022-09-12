import { hint } from "@/api/system/message";
const approveHint = {
    state: {
        hint: {},
    },
    mutations: {
        SET_Hint: (state, hint) => {
            state.hint = hint;
        },
    },
    actions: {
        gethint({ commit }) {
            return new Promise((resolve) => {
                // hint()
                //     .then((res) => {
                //         const hint = { copy: res.copy, pending: res.pending };
                //         commit("SET_Hint", hint);
                //         resolve(hint);
                //     })
                //     .catch((error) => {});
            });
        },
    },
};

export default approveHint;
