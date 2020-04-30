const jobList = Vue.component('job-list', {
  data: () => ({
    multijobs: [],
  }),
  props: ['jobs','pagesize','pagenumber','sendClean'],

  methods: {
    sendQueued(){
      this.$emit('confirm-multi-requeue', this.multijobs)
      this.multijobs = []
    },
    sendDelete(){
      this.$emit('confirm-multi-delete', this.multijobs)
      this.multijobs = []
    },
    cleanMulti() {
      return console.log("receibed Clean Multi")
    },
    formatDate(date) {
      return moment(date).fromNow();
      // return new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'numeric', year: '2-digit', hour: "numeric", minute: "numeric", second: "numeric" })
    },
  },
  template: `
<div v-on:sendClean="cleanMulti">
        <div v-if="multijobs.length > 0" class="row" >
          <div class="col-3 ml-auto">
            <button data-toggle="modal" data-target="#modalRequeueShureMulti" @click="sendQueued" class="btn btn-primary" data-placement="top" title="Requeue list of selecteds Jobs"> Multiple Requeue </button>
            <button data-toggle="modal" data-target="#modalDeleteShureMulti" @click="sendDelete" class="btn btn-danger" data-placement="top" title="Delete list of selecteds Jobs"> Multiple Delete </button>
          </div>
        </div>
        <table class="table table-striped">
          <thead class="thead-dark">
            <tr>
              <th  scope="col"> Multi </th>
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
            <tr v-for="job in jobs">
                  <td width="10" class="mult-select"><input v-model="multijobs" :id='job.job._id' type="checkbox" :value="job.job._id"></input></td>
                  <td th scope="row" class="job-name">
                    <i v-if="job.repeating" class="oi oi-timer pill-own bg-info"><span>{{job.job.repeatInterval}}</span></i>
                    <i v-if="job.scheduled" class="pill-own bg-info pill-withoutIcon"><span>Scheduled</span></i>
                    <i v-if="job.completed" class="pill-own bg-success pill-withoutIcon"><span>Completed</span></i>
                    <i v-if="job.queued" class="pill-own bg-primary pill-withoutIcon"><span>Queued</span></i>
                    <i v-if="job.failed" class="pill-own bg-danger pill-withoutIcon"><span>Failed</span></i>
                    <i v-if="job.running" class="pill-own bg-warning pill-withoutIcon"><span>Running</span></i>
                  </td>
                  <td class="job-name"> {{job.job.name}} </td>
                  <td class="job-lastRunAt"> {{ formatDate(job.job.lastRunAt) }} </td>
                  <td class="job-nextRunAt"> {{ formatDate(job.job.nextRunAt) }} </td>
                  <td class="job-finishedAt"> {{ formatDate(job.job.lastFinishedAt) }} </td>
                  <td class="job-lockedAt"> {{ job.job.lockedAt ? formatDate(job.job.lockedAt) : "" }} </td>
                  <td class="job-actions">
                    <i class="material-icons md-dark md-custom action-btn viewData text-primary" data-toggle="modal" data-target="#modalRequeueShure" @click="$emit('confirm-requeue', job)" data-placement="left" title="Requeue">update</i>
                    <i class="material-icons md-dark md-custom action-btn viewData text-success" data-toggle="modal" data-target="#modalData" @click="$emit('show-job-detail', job)" data-placement="top" title="Job Data">visibility</i>
                    <i class="material-icons md-dark md-custom action-btn viewData text-danger" data-toggle="modal" data-target="#modalDeleteShure" @click="$emit('confirm-delete', job)" data-placement="top" title="Delete permanently">delete_forever</i>
                </td>
            </tr>
          </tbody>
        </table>
        <div class="row ">
            <div class="col d-flex justify-content-center">
            <nav aria-label="Page navigation example">
                <ul class="pagination">
                  <li class="page-item" :class="pagenumber === 1 ? 'disabled': ''"><a class="page-link" @click="$emit('pagechange', 'prev')">Previous</a></li>
                  <!-- <li class="page-item" :class="pagenumber === 1 ? 'disabled': ''"><a class="page-link" @click="$emit('pagechange', 'prev')">{{pagenumber -1}}</a></li>
                  <li class="page-item active"><a class="page-link">{{pagenumber}}</a></li>
                  <li class="page-item"><a class="page-link" @click="$emit('pagechange', 'next')">{{pagenumber +1}}</a></li> -->
                  <li class="page-item"><a class="page-link" @click="$emit('pagechange', 'next')">Next</a></li>
                </ul>
              </nav>
            </div>
        </div>
</div>
  `
})
