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
    <job-overview-list
      v-on:changeState="changeState"
      :scheduled="scheduled"
      :running="running"
      :completed="completed"
      :repeating="repeating"
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
  mounted() {
    this.overview = this.jobs.filter(x => x.overview === true).length;
    this.scheduled = this.jobs.filter(x => x.scheduled === true).length;
    this.running = this.jobs.filter(x => x.running === true).length;
    this.completed = this.jobs.filter(x => x.completed === true).length;
    this.repeating = this.jobs.filter(x => x.repeating === true).length;
  },
  data() {
    return {
      refreshInterval: 2,
      overview: 0,
      scheduled: 0,
      running: 0,
      completed: 0,
      repeating: 0
    };
  },
  methods: {
    setTimer(interval) {
      this.$emit('setTimer', this.refreshInterval);
    },
    changeState(state) {
      this.$emit('changeState', state);
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
