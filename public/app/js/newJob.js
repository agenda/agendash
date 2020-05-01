const newJob = Vue.component('new-job', {
  data: () =>({
    jobName: '',
    jobSchedule: '',
    jobRepeatEvery: '',
    jobData: '',
  }),
  props: ['job'],
  methods: {
    clear(){
      this.jobName = '',
      this.jobSchedule = '',
      this.jobRepeatEvery = '',
      this.jobData = ''
    },
    CreateOne(){
      const url = `api/jobs/create`;
      let body = {
        jobName: this.jobName,
        jobSchedule: this.jobSchedule,
        jobRepeatEvery: this.jobRepeatEvery,
        jobData: this.jobData,
      };
      return axios.post(url, body)
        .then(result => result.data)
        .then(data => {
          this.$emit('popup-message');
          this.$emit('refresh-data');
          this.clear();
        })
        .catch(console.log)
    }
  },
  template: `
  <div class="modal fade" id="modalNewJob" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <!-- Modal -->
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Create Job</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
            <form>
              <div class="form-group">
                <label for="jobname">Job Name</label>
                <input v-model="jobName"  type="text" class="form-control" id="jobname" aria-describedby="jobname">
                <small id="jobname" class="form-text text-muted">Description of the schedule job.</small>
              </div>
              <div class="form-group">
                <label for="jobSchedule">Job Schedule</label>
                <input v-model="jobSchedule" type="text" class="form-control" id="jobSchedule" aria-describedby="jobSchedule">
                <small id="jobSchedule" class="form-text text-muted">Receibe Number/Every Unit  E.g. 1 seconds or 3 days</small>
              </div>
              <div class="form-group">
                <label for="jobRepeatEvery">Job Repeat Every</label>
                <input v-model="jobRepeatEvery"  type="text" class="form-control" id="jobRepeatEvery" aria-describedby="jobRepeatEvery">
                <small id="jobRepeatEvery" class="form-text text-muted">Receibe Number/Every Unit  E.g. 1 months or 3 hours</small>
              </div>
              <div class="form-group">
                <label for="jobData">Job Data</label>
                <textarea v-model="jobData" type="text" placeholder="{...data}" class="form-control" id="jobData" aria-describedby="jobData"></textarea>
                <small id="jobData" class="form-text text-muted">Json data for the job.</small>
              </div>
            </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-info" data-dismiss="modal" @click="CreateOne()">Create Job</button>
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
        </div>
      </div>
    </div>
  </div>
  `
})
