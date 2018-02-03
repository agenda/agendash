<template>
  <ul class="nav nav-sidebar">
    <li>
      <a class="text-muted" href="#">
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
      <li><a class="text-info" href="#">Scheduled<span class="label label-info pull-right">{{scheduled}}</span></a></li>
      <li><a class="text-primary" href="#">Queued<span class="label label-primary pull-right">{{queued}}</span></a></li>
      <li><a class="text-warning" href="#">Running<span class="label label-warning pull-right">{{running}}</span></a></li>
      <li><a class="text-success" href="#">Completed<span class="label label-success pull-right">{{completed}}</span></a></li>
      <li><a class="text-danger" href="#">Failed<span class="label label-danger pull-right">{{failed}}</span></a></li>
      <li><a class="text-info" href="#">Repeating<span class="label label-info pull-right">{{repeating}}</span></a></li>
    </ul>
  </ul>
</template>

<script>
import Vue from 'vue';

// var OverviewListView = Backbone.View.extend({
//   el: '#job-overview-list',
//   initialize: function (options) {
//     this.overviewItems = options.overviewItems
//     this.currentRequest = options.currentRequest
//     _.bindAll(this, 'render')
//     this.listenTo(this.overviewItems, 'update', this.render)
//     this.render()
//   },
//   render: function () {
//     var overviewFilterRegex = this.currentRequest.get('overviewFilterRegex')
//     this.$el.empty().append(this.overviewItems.filter(function (overviewItem) {
//       return overviewFilterRegex.test(overviewItem.get('_id'))
//     }).map(function (overviewItem) {
//       var overviewItemView = new OverviewItemView({
//         model: overviewItem
//       })
//       return overviewItemView.render().$el
//     }))
//     return this
//   }
// })

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
    },
    overview: {
      type: Array
    }
  },
  computed: {
    total() {
      return this.scheduled + this.queued + this.running + this.completed + this.failed + this.repeating;
    }
  },
  components: {}
});
</script>

<style lang="scss" scoped>
</style>
