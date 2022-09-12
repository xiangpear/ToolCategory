import { login, logout, getInfo } from "@/api/login/login";
import { getToken, setToken, removeToken, setUpdatePwd, getUpdatePwd } from "@/utils/auth";
import { resetRouter } from "@/router";
const getDefaultState = () => {
    return {
        updatePwd: getUpdatePwd(),
        token: getToken(),
        name: "",
        deptName: "",
        deptId: "",
        phone: "",
        realName: "",
        roles: [],
        roleIds: [],
        searchObj: null,
        permissions: [],
    };
};

const state = getDefaultState();

const mutations = {
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState());
    },
    SET_TOKEN: (state, token) => {
        state.token = token;
    },
    SET_NAME: (state, name) => {
        state.name = name;
    },
    SET_REALNAME: (state, realName) => {
        state.realName = realName;
    },
    SET_DEPTNAME: (state, deptName) => {
        state.deptName = deptName;
    },
    SET_PHONE: (state, phone) => {
        state.phone = phone;
    },
    SET_DEPTID: (state, deptId) => {
        state.deptId = deptId;
    },
    SET_ROLES: (state, roles) => {
        state.roles = roles;
    },
    SET_ROLEIDS: (state, roleIds) => {
        state.roleIds = roleIds;
    },
    SET_PERMISSIONS: (state, permissions) => {
        state.permissions = permissions;
    },
    SAVE_SEARCHOBJ: (state, searchObj) => {
        state.searchObj = searchObj;
    },
};

const actions = {
    // user login
    login({ commit }, userInfo) {
        const { username, password, captcha, uuid, tenantId } = userInfo;
        return new Promise((resolve, reject) => {
            login({ username: username.trim(), password: password, captcha, uuid, tenantId })
                .then((response) => {
                    commit("SET_TOKEN", response.token);
                    setToken(response.token);
                    setUpdatePwd(response.updatePwd);
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },

    // get user info
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            getInfo()
                .then((response) => {
                    if (!response.userName) {
                        return reject("Verification failed, please Login again.");
                    }
                    if (response.roles && response.roles.length > 0) {
                        const roleList = [];
                        const roleIdList = [];
                        for (const item of response.roles) {
                            roleList.push(item.roleName);
                            roleIdList.push(item.roleId);
                        }
                        commit("SET_ROLES", roleList);
                        commit("SET_ROLEIDS", roleIdList);
                        commit("SET_PERMISSIONS", response.permissions);
                    } else {
                        commit("SET_ROLES", ["ROLE_DEFAULT"]);
                        commit("SET_PERMISSIONS", response.permissions);
                    }
                    const { userName, deptName, phone, deptId, realName } = response;
                    commit("SET_REALNAME", realName);
                    commit("SET_NAME", userName);
                    commit("SET_DEPTNAME", deptName);
                    commit("SET_PHONE", phone);
                    commit("SET_DEPTID", deptId);
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },

    // user logout
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            logout(state.token)
                .then(() => {
                    removeToken(); // must remove  token  first
                    resetRouter();
                    commit("RESET_STATE");
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },

    // remove token
    resetToken({ commit }) {
        return new Promise((resolve) => {
            removeToken(); // must remove  token  first
            commit("RESET_STATE");
            resolve();
        });
    },
    // save searchObj
    saveSearchObj({ commit, state }, searchObj) {
        return new Promise((resolve, reject) => {
            if (searchObj && Object.keys(searchObj.params).length > 0) {
                commit("SAVE_SEARCHOBJ", searchObj);
                window.localStorage.setItem("searchObj", JSON.stringify(searchObj));
            } else {
                let obj = JSON.parse(window.localStorage.getItem("searchObj"));
                commit("SAVE_SEARCHOBJ", obj);
            }

            resolve();
        });
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
