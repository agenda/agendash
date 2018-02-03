<template>
  <div v-if="false" class="panel panel-default">
    <div class="panel-heading">
      <button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
      <h3 class="panel-title">{{job.name}}</h3>
      <template v-if="repeating"><span class="label label-info"><i class="glyphicon glyphicon-repeat"></i> {{ job.repeatInterval }}</span></template>
      <template v-if="scheduled"><span class="label label-info">Scheduled</span></template>
      <template v-if="queued"><span class="label label-primary">Queued</span></template>
      <template v-if="running"><span class="label label-warning">Running</span></template>
      <template v-if="completed"><span class="label label-success">Completed</span></template>
      <template v-if="failed"><span class="label label-danger">Failed</span></template>
    </div>
    <div class="panel-body">
      <template v-if="job.lastRunAt"><p>Last run <time :datetime="moment(job.lastRunAt).toISOString()">{{moment(job.lastRunAt).fromNow()}}</time></p></template>
      <template v-if="job.nextRunAt"><p>Next run <time :datetime="moment(job.nextRunAt).toISOString()">{{moment(job.nextRunAt).fromNow()}}</time></p></template>
      <template v-if="job.lastFinishedAt"><p>Last finished <time :datetime="moment(job.lastFinishedAt).toISOString()">{{moment(job.lastFinishedAt).fromNow()}}</time></p></template>
      <template v-if="job.lockedAt"><p>Locked <time :datetime="moment(job.lockedAt).toISOString()">{{moment(job.lockedAt).fromNow()}}</time></p></template>
      <template v-if="job.repeatInterval"><p>Repeat each {{job.repeatInterval}}</p></template>

      <strong>Job data</strong>
      <pre>{{JSON.stringify(job.data, null, 2)}}</pre>
      <template v-if="failed">
        <strong>Failure reason</strong>
        <pre>{{JSON.stringify(job.failReason || '', null, 2)}}</pre>
      </template>
    </div>
    <div class="panel-footer clearfix">
      <button type="button" class="btn btn-danger btn-sm" data-action="requeue">Requeue</button>
      <button type="button" class="btn btn-danger btn-sm pull-right" data-action="delete">Delete permanently</button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

export default Vue.component('job-details', {
  name: 'job-details',
  props: {
    job: {
      type: Object,
      default: () => {
        return {
          lastRunAt: null,
          nextRunAt: null,
          lastFinishedAt: null,
          lockedAt: null,
          repeatInterval: null
        };
      }
    }
  },
  components: {}
});
</script>

<style lang="scss" scoped>
</style>
