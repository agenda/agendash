<template>
  <div id="app">
    <sidebar :jobs="jobs" v-on:setTimer="setTimer" v-on:changeState="changeState" v-on:setFilterName="setFilterName"></sidebar>
    <div class="main-pane">
      <div class="list-pane">
        <div class="page-header">
          <h2 id="active-title">
            <span class="active-job">{{currentJob}}</span>
            <small class="active-state">{{currentJobState}}</small>
          </h2>
          <ul id="select-jobs" class="nav nav-pills">
            <li role="presentation"><a role="button" @click="openCreateJob()">Schedule job</a></li>
            <li role="presentation"><a role="button" @click="selectJobs('all')">Select all</a></li>
            <li role="presentation"><a role="button" @click="selectJobs('none')">Select none</a></li>
          </ul>
          <div class="clearfix"></div>
        </div>
        <div class="table-responsive">
          <b-table striped hover :items="jobs" :fields="fields" :filter="filter" :no-provider-paging="true" :no-provider-sorting="true" :no-provider-filtering="true">
            <template slot="status" slot-scope="row">
              <td>
                <template v-if="row.item.repeating"><span class="label label-info"><i class="glyphicon glyphicon-repeat"></i> {{row.item.repeatInterval}}</span></template>
                <template v-if="row.item.scheduled"><span class="label label-info">Scheduled</span></template>
                <template v-if="row.item.queued"><span class="label label-primary">Queued</span></template>
                <template v-if="row.item.running"><span class="label label-warning">Running</span></template>
                <template v-if="row.item.completed"><span class="label label-success">Completed</span></template>
                <template v-if="row.item.failed"><span class="label label-danger">Failed</span></template>
              </td>
            </template>
            <template slot="lastRunAt" slot-scope="row">
              <td><template v-if="row.item.lastRunAt"><time>{{row.item.lastRunAt | moment('from', now)}}</time></template></td>
            </template>
            <template slot="nextRunAt" slot-scope="row">
              <td><template v-if="row.item.nextRunAt"><time>{{row.item.nextRunAt | moment('from', now)}}</time></template></td>
            </template>
            <template slot="lastFinishedAt" slot-scope="row">
              <td><template v-if="row.item.lastFinishedAt"><time>{{row.item.lastFinishedAt | moment('from', now)}}</time></template></td>
            </template>
            <template slot="lockedAt" slot-scope="row">
              <td><template v-if="row.item.lockedAt"><time>{{row.item.lockedAt | moment('from', now)}}</time></template></td>
            </template>
          </b-table>
        </div>
      </div>
      <job-details :job="selectedJob"></job-details>
      <job-create :active="createJobActive" v-on:hide="createJobActive = false"></job-create>
    </div>
  </div>
</template>

<script>
import api from '../api.js';
import Sidebar from '../components/sidebar.vue';
import JobCreate from '../components/job-create.vue';
import JobDetails from '../components/job-details.vue';
import JobOverviewList from '../components/job-overview-list.vue';

export default {
  data() {
    return {
      fields: [{
        key: 'status',
        label: 'Status',
        sortable: true
      }, {
        key: 'name',
        label: 'Name',
        sortable: true
      }, {
        key: 'lastRunAt',
        label: 'Last run started',
        sortable: true
      }, {
        key: 'nextRunAt',
        label: 'Next run starts',
        sortable: true
      }, {
        key: 'lastFinishedAt',
        label: 'Last finished',
        sortable: true
      }, {
        key: 'lockedAt',
        label: 'Locked',
        sortable: true
      }],
      currentJob: '',
      currentJobState: '',
      jobs: [],
      createJobActive: false,
      // @TODO This should be shown in the UI
      error: null,
      // Auto refreshing of data
      timer: null,
      refreshInterval: 2,
      now: new Date(),
      // Filtering table of jobs
      filterBy: '*',
      filterName: ''
    };
  },
  computed: {
    selectedJob() {}
  },
  methods: {
    scheduleJob() {},
    selectJobs() {},
    openCreateJob() {
      this.createJobActive = true;
    },
    async fetchData() {
      try {
        const res = await api.get('/api/');
        const {jobs} = res.body;

        this.jobs = jobs.map(job => {
          const data = Object.assign({}, job.job);
          delete job.job;

          return {
            ...data,
            ...job
          }
        });
      } catch (err) {
        this.error = err;
      }
    },
    setTimer(refreshInterval) {
      clearInterval(this.timer);
      if (Number(refreshInterval) >= 1) {
        this.timer = setInterval(this.fetchData, refreshInterval * 1000);
      }
    },
    filter(job) {
      if (this.filterBy === '*') {
        return true;
      };

      if (this.filterBy === 'name') {
        return job.name.toLowerCase().trim().includes(this.filterName.toLowerCase().trim());
      }

      if (this.filterBy in ['scheduled', 'queued', 'running', 'completed', 'failed', 'repeating'] && job[this.filterBy] === true) {
        return true;
      }
      return false;
    },
    changeState(state) {
      if (state === 'all') {
        this.filterBy = '*';
      } else {
        this.filterBy = state;
      }
    },
    setFilterName(name) {
      if (name.trim() === '') {
        this.filterBy = '*';
        this.filterName = '';
      } else {
        this.filterBy = 'name';
        this.filterName = name;
      }
    }
  },
  async mounted() {
    this.setTimer(this.refreshInterval);
    setInterval(() => {
       this.$data.now = Date.now();
    }, 1000);
  },
  components: {
    Sidebar,
    JobCreate,
    JobDetails,
    JobOverviewList
  }
};
</script>

<style lang="scss">
// @TODO: Move over to bootstrap 4
@import '~bootstrap-vue/dist/bootstrap-vue.min.css';
@import '~/css/bootstrap.min.css';
@import '~/css/dashboard.css';

/* Page layout */
.main-pane {
  padding: 0;
  order: 2;
  flex: 1 1;
  display: flex;
  flex-direction: column;
  overflow: scroll;
}

.list-pane {
  flex: 1 1 750px;
  order: 1;
  padding: 10px;
  overflow: scroll;
}

.details-pane {
  padding: 10px;
  flex: 1 0 370px;
  order: 2;
  box-shadow: 0px -2px 3px 0px #eee;
  margin-top: 10px;
  overflow: scroll;
}


@media (min-width: 1200px) {
  .main-pane {
    flex-direction: row;
  }
  .details-pane {
    margin-top: 0;
    box-shadow: -2px 0px 3px 0px #eee;
  }
  .create-job-pane {
    margin-top: 0;
    box-shadow: -2px 0px 3px 0px #eee;
  }
}


.nav-sidebar {
  margin-bottom: 10px;
}
.progress {
  display: flex;
  height: 5px;
  margin-top: 5px;
  margin-bottom: 0;
}
.sidebar-header {
  padding: 0 10px 20px;
}

#job-list tr {
  cursor: pointer;
}

.sub-header {
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}
</style>
