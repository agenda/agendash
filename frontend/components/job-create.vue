<template>
  <div v-if="active" id="create-job-pane">
    <h2 class="sub-header">Create Job</h2>
    <hr />
    <div class="form-group">
      <label>Job name</label>
      <input type="text" v-model="jobName" class="form-control">
    </div>
    <div class="form-group">
      <label>Schedule</label>
      <input type="text" v-model="jobSchedule" class="form-control">
    </div>
    <div class="form-group">
      <label>Repeat every</label>
      <input type="text" v-model="jobRepeatEvery" class="form-control">
    </div>
    <div class="form-group">
      <label>Job data (json)</label>
      <textarea v-model="jobData" class="form-control"></textarea>
    </div>
    <div class="form-group">
      <span class="btn btn-default btn-success" @click="saveJob()">Save</span>
      <span class="btn btn-default btn-warning" @click="cancelJob()">Cancel</span>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import cleanJSON from 'loose-json';
import api from '../api.js';

export default Vue.component('job-create', {
  name: 'job-create',
  props: ['active'],
  data() {
    return {
      jobName: '',
      jobSchedule: '',
      jobRepeatEvery: '',
      jobData: '{}'
    };
  },
  methods: {
    saveJob() {
      const {
        jobName,
        jobSchedule,
        jobRepeatEvery,
        jobData
      } = this;
      const job = {
        jobName,
        jobSchedule,
        jobRepeatEvery,
        jobData: cleanJSON(this.jobData)
      };

      api.post('api/jobs/create', {
        body: {
          ...job
        }
      }).then(() => {
        this.$emit('newJob', job);

        this.clearData();
        this.hide();
      });
    },
    cancelJob() {
      this.clearData();
      this.hide();
    },
    clearData() {
      this.jobName = '';
      this.jobSchedule = '';
      this.jobRepeatEvery = '';
      this.jobData = '{}';
    },
    hide() {
      this.$emit('hide');
    }
  },
  components: {}
});
</script>

<style lang="scss" scoped>
.create-job-pane {
  padding: 10px;
  flex: 1 0 370px;
  order: 2;
  box-shadow: 0px -2px 3px 0px #eee;
  margin-top: 10px;
  overflow: scroll;
}
</style>
