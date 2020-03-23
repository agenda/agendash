const jobList = Vue.component('job-list', {
  props: ['jobs'],
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'numeric', year: '2-digit', hour: "numeric", minute: "numeric", second: "numeric" })
    }
  },
  template: `
    <div class="joblist section">
      <div class="d-flex flex-column table">
        <div class="d-flex flex-row table-headers">
          <div class="table-header"> Status </div>
          <div class="table-header"> Name </div>
          <div class="table-header"> Last run started </div>
          <div class="table-header"> Next run starts	</div>
          <div class="table-header"> Last finished	</div>
          <div class="table-header"> Locked </div>
        </div>
          <div v-for="job in jobs" class="d-flex flex-row table-row" @click="$emit('show-job-detail', job)">
              <div class="job-attribute job-name"> {{job.scheduled}} </div>
              <div class="job-attribute job-name"> {{job.job.name}} </div>
              <div class="job-attribute job-lastRunAt"> {{ formatDate(job.job.lastRunAt) }} </div>
              <div class="job-attribute job-nextRunAt"> {{ formatDate(job.job.nextRunAt) }} </div>
              <div class="job-attribute job-finishedAt"> {{ formatDate(job.job.lastFinishedAt) }} </div>
              <div class="job-attribute job-lockedAt"> {{ formatDate(job.job.lockedAt) }} </div>
          </div>
        </div>
      </div>
    </div>
  `
})
