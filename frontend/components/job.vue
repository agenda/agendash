<template>
  <div>
    <td>
      <template v-if="repeating"><span class="label label-info"><i class="glyphicon glyphicon-repeat"></i> {{job.repeatInterval}}</span></template>
      <template v-if="scheduled"><span class="label label-info">Scheduled</span></template>
      <template v-if="queued"><span class="label label-primary">Queued</span></template>
      <template v-if="running"><span class="label label-warning">Running</span></template>
      <template v-if="completed"><span class="label label-success">Completed</span></template>
      <template v-if="failed"><span class="label label-danger">Failed</span></template>
    </td>
    <td>
      {{job.name}}
    </td>
    <td><template v-if="job.lastRunAt"><time :datetime="moment(job.lastRunAt).toISOString()">{{moment(job.lastRunAt).fromNow()}}</time></template></td>
    <td><template v-if="job.nextRunAt"><time :datetime="moment(job.nextRunAt).toISOString()">{{moment(job.nextRunAt).fromNow()}}</time></template></td>
    <td><template v-if="job.lastFinishedAt"><time :datetime="moment(job.lastFinishedAt).toISOString()">{{moment(job.lastFinishedAt).fromNow()}}</time></template></td>
    <td><template v-if="job.lockedAt"><time :datetime="moment(job.lockedAt).toISOString()">{{moment(job.lockedAt).fromNow()}}</time></template></td>
  </div>
</template>

<script>
import Vue from 'vue';

export default Vue.component('job', {
  name: 'job'
});
</script>

<style lang="scss" scoped>
</style>
