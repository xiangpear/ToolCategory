<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
import { handleParams, handleURL } from "@/utils/auth.js";
import { getTenantInfo } from "@/api/login/login.js";
export default {
    name: "App",
    created() {
        let uuid = handleParams().params;
        console.log("uuid", uuid);
        if (uuid) {
            getTenantInfo(uuid).then((res) => {
                let searchObj = handleURL(res);
                this.$store.dispatch("user/saveSearchObj", searchObj);
            });
        }
    },
    methods: {},
};
</script>
