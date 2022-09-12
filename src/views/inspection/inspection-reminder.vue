<template>
  <div class="inspectwarn-container">
    <TemplateTable />
  </div>
</template>

<script>
import TemplateTable from "./childrenComp/self-table-warn.vue"
export default {
    name:"inspectwarn",
    components:{
        TemplateTable,
    }
}
</script>

<style>

</style>