<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h1 class="page-title">{{title}}</h1>
      <div class="form-group">
        <label for="overviewFilter">Filter by name</label>
        <input type="text" class="overview-filter form-control">
      </div>
      <div class="form-group">
        <label for="overviewFilter">Refresh interval (seconds)</label>
        <input type="number" @change="setTimer" v-model="refreshInterval" class="refresh-interval form-control">
      </div>
    </div>
    <job-overview-list :overview="overview"></job-overview-list>
  </div>
</template>

<script>
import Vue from 'vue';

export default Vue.component('sidebar', {
  name: 'sidebar',
  props: {
    overview: {
      type: Array
    },
    title: {
      type: String,
      default: 'Agendash'
    }
  },
  data() {
    return {
      refreshInterval: 2
    };
  },
  methods: {
    setTimer(interval) {
      this.$emit('setTimer', this.refreshInterval);
    }
  },
  components: {}
});
</script>

<style lang="scss" scoped>
.sidebar {
  padding-top: 20px;
  flex: 0 0 250px;
  order: 1;
  box-shadow: 4px 0px 3px -2px #eee;
  overflow: scroll;
}
/* Details, styling */
.page-title {
  margin: 0 auto 10px; /* override h1 defaults */
}
</style>
