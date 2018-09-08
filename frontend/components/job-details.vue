<template>
  <div v-if="jobs.length" id="details-pane">
    <h2 class="sub-header"><span class="number-selected">{{jobs.length}}</span> <small>selected</small></h2>
    <button type="button" class="btn btn-danger btn-xs" @click="requeueJobs">Requeue selected</button>
    <button type="button" class="btn btn-danger btn-xs pull-right" @click="deleteJobs">Delete selected</button>
    <hr />
    <div v-for="job in jobs" class="panel panel-default">
      <div class="panel-heading">
        <button @click="removeJob(job)" type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h3 class="panel-title">{{job.name}}</h3>
        <template v-if="job.repeating"><span class="label label-info"><i class="glyphicon glyphicon-repeat"></i> {{ job.repeatInterval }}</span></template>
        <template v-if="job.scheduled"><span class="label label-info">Scheduled</span></template>
        <template v-if="job.queued"><span class="label label-primary">Queued</span></template>
        <template v-if="job.running"><span class="label label-warning">Running</span></template>
        <template v-if="job.completed"><span class="label label-success">Completed</span></template>
        <template v-if="job.failed"><span class="label label-danger">Failed</span></template>
      </div>
      <div class="panel-body">
        <template v-if="job.lastRunAt"><p>Last run <time>{{job.lastRunAt | moment('from', now)}}</time></p></template>
        <template v-if="job.nextRunAt"><p>Next run <time>{{job.nextRunAt | moment('from', now)}}</time></p></template>
        <template v-if="job.lastFinishedAt"><p>Last finished <time>{{job.lastFinishedAt | moment('from', now)}}</time></p></template>
        <template v-if="job.lockedAt"><p>Locked <time>{{job.lockedAt | moment('from', now)}}</time></p></template>
        <template v-if="job.repeatInterval"><p>Repeat each {{job.repeatInterval}}</p></template>

        <strong>Job data</strong>
        <pre>{{JSON.stringify(job.data, null, 2)}}</pre>
        <template v-if="job.failed">
          <strong>Failure reason</strong>
          <pre>{{JSON.stringify(job.failReason || '', null, 2)}}</pre>
        </template>
      </div>
      <div class="panel-footer clearfix">
        <button type="button" class="btn btn-danger btn-sm" @click="requeueJob(job)">Requeue</button>
        <button type="button" class="btn btn-danger btn-sm pull-right" @click="deleteJob(job)">Delete permanently</button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import api from '../api.js';

export default Vue.component('job-details', {
  name: 'job-details',
  props: {
    jobs: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      // @TODO: We need to display this in the UI
      error: null,
      now: new Date()
    };
  },
  methods: {
    removeJob(job) {
      this.$emit('removeJob', job);
    },
    removeJobs() {
      this.jobs.forEach(job => this.$emit('removeJob', job));
    },
    requeueJob(job) {
      api.post('api/jobs/requeue', {
        body: {
          jobIds: [job._id]
        }
      }).catch(error => {
        this.error = error;
      });
    },
    requeueJobs() {
      const jobIds = this.jobs.map(job => job._id);
      api.post('api/jobs/requeue', {
        body: {
          jobIds
        }
      }).catch(errorrr => {
        this.error = error;
      });
    },
    deleteJob(job) {
      api.post('api/jobs/delete', {
        body: {
          jobIds: [job._id]
        }
      }).then(() => {
        this.removeJob(job);
      }).catch(error => {
        this.error = error;
      });
    },
    deleteJobs() {
      const jobIds = this.jobs.map(job => job._id);
      api.post('api/jobs/delete', {
        body: {
          jobIds
        }
      }).then(() => {
        this.removeJobs();
      }).catch(error => {
        this.error = error;
      });
    }
  },
  mounted() {
    setInterval(() => {
      this.$data.now = Date.now();
    }, 1000);
  },
  components: {}
});
</script>

<style lang="scss" scoped>
</style>
