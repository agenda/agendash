const jobList = Vue.component('job-list', {
  props: ['jobs'],
  methods: {
    formatDate(date) {
      return moment(date).fromNow();
      return new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'numeric', year: '2-digit', hour: "numeric", minute: "numeric", second: "numeric" })
    }
  },
  template: `
    <div class="joblist section">
      <table class="table table-striped">
        <thead class="thead-dark">
          <tr>
            <th  scope="col"> Status </th>
            <th  scope="col"> Name </th>
            <th  scope="col"> Last run started </th>
            <th  scope="col"> Next run starts	</th>
            <th  scope="col"> Last finished	</th>
            <th  scope="col"> Locked </th>
            <th  scope="col"> Actions </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="job in jobs"  >

                <td th scope="row" class="job-name">
                  <i class="oi oi-timer pill-own bg-info"><span>{{job.job.repeatInterval}}</span></i>
                  <i v-if="job.scheduled" class="pill-own bg-primary pill-withoutIcon"><span>Scheduled</span></i>
                  <i v-if="job.completed" class="pill-own bg-success pill-withoutIcon"><span>Completed</span></i>
                </td>
                <td class="job-name"> {{job.job.name}} </td>
                <td class="job-lastRunAt"> {{ formatDate(job.job.lastRunAt) }} </td>
                <td class="job-nextRunAt"> {{ formatDate(job.job.nextRunAt) }} </td>
                <td class="job-finishedAt"> {{ formatDate(job.job.lastFinishedAt) }} </td>
                <td class="job-lockedAt"> {{ job.job.lockedAt ? formatDate(job.job.lockedAt) : "" }} </td>
                <td class="job-actions">
                  <i class="btn oi oi-timer action-btn requeue text-primary" data-toggle="modal tooltip" data-placement="left" title="Requeue"></i>
                  <i class="btn oi oi-eye action-btn viewData text-success" data-toggle="modal" data-target="#modalData" @click="$emit('show-job-detail', job)" data-placement="top" title="Job Data"></i>
                  <i class="btn oi oi-trash action-btn viewData text-danger" data-toggle="modal" data-target="#modalDeleteShure" @click="$emit('confirm-delete', job)" data-placement="top" title="Delete permanently"></i>
              </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
