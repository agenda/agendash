<template>
  <div id="app">
    <sidebar :jobs="jobs" v-on:setTimer="setTimer" v-on:changeState="changeState"></sidebar>
    <div class="main-pane">
      <div class="list-pane">
        <div class="page-header">
          <h2 id="active-title">
            <!-- @TODO: This needs to update when we choose to filter by job name in sidebar using links -->
            <!--        Check the :3000 version for an example -->
            <span class="active-job">{{filterBy.toLowerCase() === 'name' ? 'Searching...' : filterBy | capitalizeFirstLetter()}}</span>
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
          <b-table
            striped
            hover
            :items="jobs"
            :fields="fields"
            :filter="filter"
            :no-provider-paging="true"
            :no-provider-sorting="true"
            :no-provider-filtering="true"
            v-on:row-clicked="rowClicked"
          >
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
      <job-details :active="currentJobActive" v-on:hide="currentJobActive = false" :jobs="currentJobs" v-on:removeJob="removeJob"></job-details>
      <job-create :active="createJobActive" v-on:hide="createJobActive = false" v-on:newJob="newJob"></job-create>
    </div>
  </div>
</template>

<script>
import Debug from 'debug';
import api from '../api.js';
import Sidebar from '../components/sidebar.vue';
import JobCreate from '../components/job-create.vue';
import JobDetails from '../components/job-details.vue';
import JobOverviewList from '../components/job-overview-list.vue';

const debug = new Debug('agendash');

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
      // Current job pane
      currentJobActive: false,
      currentJobs: [],
      currentJobState: '',
      jobs: [],
      // Schedule job pane
      createJobActive: false,
      // @TODO This should be shown in the UI
      error: null,
      // Auto refreshing of data
      timer: null,
      refreshInterval: 2,
      now: new Date(),
      // Filtering table of jobs
      filterBy: 'all jobs',
      filterName: ''
    };
  },
  computed: {
    selectedJob() {}
  },
  methods: {
    scheduleJob() {},
    selectJobs(filter) {
      if (filter === 'all') {
        this.currentJobs = this.jobs;
      }
      if (filter === 'none') {
        this.currentJobs = [];
      }
    },
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
      // If all jobs and NO sub-filter
      if (
        this.filterBy.toLowerCase() === 'all jobs' &&
        this.filterName.trim() === ''
      ) {
        debug('all jobs and NO sub-filter');
        return true;
      }

      // If all jobs and sub-filter
      if (
        this.filterBy.toLowerCase() === 'all jobs' &&
        this.filterName.trim() !== ''
      ) {
        debug('all jobs and sub-filter');
        return ['scheduled', 'queued', 'running', 'completed', 'failed', 'repeating'].includes(this.filterName) && job[this.filterName] === true;
      }

      // If filtering by name
      if (
        this.filterBy.toLowerCase() === 'name' &&
        job.name.toLowerCase().includes(this.filterName.toLowerCase().trim())
      ) {
        debug('filtering by name');
        return true;
      }

      // If name and a NO sub-filter
      if (
        this.filterBy.toLowerCase() !== 'all jobs' &&
        this.filterBy.toLowerCase().trim() === job.name.toLowerCase() &&
        this.filterName.trim() === ''
      ) {
        debug('name and a NO sub-filter');
        return true;
      }

      // If name and a sub-filter
      if (
        this.filterBy.toLowerCase() !== 'all jobs' &&
        this.filterBy.toLowerCase().trim() === job.name.toLowerCase() &&
        this.filterName.trim() !== '' &&
        ['scheduled', 'queued', 'running', 'completed', 'failed', 'repeating'].includes(this.filterName) &&
        job[this.filterName] === true
      ) {
        debug('name and a sub-filter');
        return true;
      }

      // Otherwise just remove it
      return false;
    },
    changeState(filterBy, name) {
      if (filterBy.toLowerCase() === 'name' && name.trim() === '') {
        this.filterBy = 'all jobs';
        this.filterName = '';
      } else {
        this.filterBy = filterBy || 'all jobs';
        this.filterName = name || '';
      }
    },
    rowClicked(job) {
      if (this.currentJobs.filter(currentJob => currentJob._id === job._id).length >= 1) {
        this.currentJobs.splice(this.currentJobs.indexOf(job), 1);
      } else {
        this.currentJobs.push(job);
      }
      this.openJobDetails();
    },
    openJobDetails() {
      this.jobDetailsActive = true;
    },
    async newJob(job) {
      this.jobs.push(job);
      await this.fetchData();
    },
    removeJob(job) {
      this.currentJobs.splice(this.currentJobs.indexOf(job), 1)
    }
  },
  async mounted() {
    this.setTimer(this.refreshInterval);
    setInterval(() => {
       this.$data.now = Date.now();
    }, 1000);
  },
  filters: {
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }
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
