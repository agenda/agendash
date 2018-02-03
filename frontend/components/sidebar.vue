<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h1 class="page-title">{{title}}</h1>
      <div class="form-group">
        <label for="overviewFilter">Filter by name</label>
        <input type="text" class="overview-filter form-control" @keyup="setFilterName" v-model="filterName">
      </div>
      <div class="form-group">
        <label for="overviewFilter">Refresh interval (seconds)</label>
        <input type="number" @change="setTimer" v-model="refreshInterval" class="refresh-interval form-control">
      </div>
    </div>
    <job-overview-list
      v-on:changeState="changeState"
      :title="'all jobs'"
      :jobs="jobs"
    >
    </job-overview-list>
    <job-overview-list
      v-for="job in deDupedjobs"
      :key="job.name"
      v-on:changeState="changeState"
      :title="job.name"
      :jobs="jobs"
    >
    </job-overview-list>
  </div>
</template>

<script>
import Vue from 'vue';

export default Vue.component('sidebar', {
  name: 'sidebar',
  props: {
    title: {
      type: String,
      default: 'Agendash'
    },
    jobs: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      refreshInterval: 2,
      filterName: ''
    };
  },
  computed: {
    deDupedjobs() {
      return this.jobs.filter((obj, pos, arr) => {
          return this.jobs.map(mapObj => mapObj.name).indexOf(obj.name) === pos;
      });
    }
  },
  methods: {
    setTimer() {
      this.$emit('setTimer', this.refreshInterval);
    },
    changeState(name, state) {
      this.$emit('changeState', name, state);
    },
    setFilterName() {
      this.$emit('changeState', 'name', this.filterName);
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
