<template>
  <ul class="nav nav-sidebar">
    <li>
      <a @click="changeState(title, '')" class="text-muted">
        <strong>{{title}}</strong>
        <span class="label label-default pull-right">{{total}}</span>
        <div class="progress">
          <div class="progress-bar progress-bar-info" :style="'flex-grow: ' + Math.log2(1 + scheduled)"></div>
          <div class="progress-bar progress-bar-primary" :style="'flex-grow: ' + Math.log2(1 + queued)"></div>
          <div class="progress-bar progress-bar-warning" :style="'flex-grow: ' + Math.log2(1 + running)"></div>
          <div class="progress-bar progress-bar-success" :style="'flex-grow: ' + Math.log2(1 + completed)"></div>
          <div class="progress-bar progress-bar-danger" :style="'flex-grow: ' + Math.log2(1 + failed)"></div>
        </div>
      </a>
    </li>
    <ul class="nav nav-sidebar">
      <li><a class="text-info" @click="changeState(title, 'scheduled')">Scheduled<span class="label label-info pull-right">{{scheduled}}</span></a></li>
      <li><a class="text-primary" @click="changeState(title, 'queued')">Queued<span class="label label-primary pull-right">{{queued}}</span></a></li>
      <li><a class="text-warning" @click="changeState(title, 'running')">Running<span class="label label-warning pull-right">{{running}}</span></a></li>
      <li><a class="text-success" @click="changeState(title, 'completed')">Completed<span class="label label-success pull-right">{{completed}}</span></a></li>
      <li><a class="text-danger" @click="changeState(title, 'failed')">Failed<span class="label label-danger pull-right">{{failed}}</span></a></li>
      <li><a class="text-info" @click="changeState(title, 'repeating')">Repeating<span class="label label-info pull-right">{{repeating}}</span></a></li>
    </ul>
  </ul>
</template>

<script>
import Vue from 'vue';

export default Vue.component('job-overview-list', {
  name: 'job-overview-list',
  props: {
    title: {
      type: String,
      default: 'All Jobs'
    },
    jobs: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
    };
  },
  computed: {
    isAllJobs() {
      return this.title.toLowerCase() === 'all jobs';
    },
    scheduled() {
      return this.isAllJobs ? this.getTotal('scheduled') : this.getTotalWithName('scheduled');
    },
    queued() {
      return this.isAllJobs ? this.getTotal('queued') : this.getTotalWithName('queued');
    },
    running() {
      return this.isAllJobs ? this.getTotal('running') : this.getTotalWithName('running');
    },
    completed() {
      return this.isAllJobs ? this.getTotal('completed') : this.getTotalWithName('completed');
    },
    failed() {
      return this.isAllJobs ? this.getTotal('failed') : this.getTotalWithName('failed');
    },
    repeating() {
      return this.isAllJobs ? this.getTotal('repeating') : this.getTotalWithName('repeating');
    },
    total() {
      return this.scheduled + this.queued + this.running + this.completed + this.failed;
    },
  },
  methods: {
    changeState(name, state) {
      this.$emit('changeState', name, state);
    },
    getTotal(prop) {
      return this.jobs.filter(x => x[prop] === true).length;
    },
    getTotalWithName(prop) {
      return this.jobs.filter(x => x[prop] === true && x.name.toLowerCase() === this.title.toLowerCase()).length;
    }
  },
  components: {}
});
</script>

<style lang="scss" scoped>
</style>
