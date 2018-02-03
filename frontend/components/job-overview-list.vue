<template>
  <ul class="nav nav-sidebar">
    <li>
      <a class="text-muted" href="#">
        <strong @click="setCurrentState('all')">{{title}}</strong>
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
      <li><a class="text-info" @click="setCurrentState('scheduled')">Scheduled<span class="label label-info pull-right">{{scheduled}}</span></a></li>
      <li><a class="text-primary" @click="setCurrentState('queued')">Queued<span class="label label-primary pull-right">{{queued}}</span></a></li>
      <li><a class="text-warning" @click="setCurrentState('running')">Running<span class="label label-warning pull-right">{{running}}</span></a></li>
      <li><a class="text-success" @click="setCurrentState('completed')">Completed<span class="label label-success pull-right">{{completed}}</span></a></li>
      <li><a class="text-danger" @click="setCurrentState('failed')">Failed<span class="label label-danger pull-right">{{failed}}</span></a></li>
      <li><a class="text-info" @click="setCurrentState('repeating')">Repeating<span class="label label-info pull-right">{{repeating}}</span></a></li>
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
    scheduled: {
      type: Number,
      default: 0
    },
    queued: {
      type: Number,
      default: 0
    },
    running: {
      type: Number,
      default: 0
    },
    completed: {
      type: Number,
      default: 0
    },
    failed: {
      type: Number,
      default: 0
    },
    repeating: {
      type: Number,
      default: 0
    }
  },
  computed: {
    total() {
      return this.scheduled + this.queued + this.running + this.completed + this.failed + this.repeating;
    }
  },
  methods: {
    setCurrentState(state) {
      this.$emit('changeState', state);
    }
  },
  components: {}
});
</script>

<style lang="scss" scoped>
</style>
