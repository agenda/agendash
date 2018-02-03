<template>
  <div id="app">
    <sidebar :overview="overview" :refreshInterval="refreshInterval"></sidebar>
    <div class="main-pane">
      <div class="list-pane">
        <div class="page-header">
          <h2 id="active-title">
            <span class="active-job"></span>
            <small class="active-state"></small>
          </h2>
          <ul id="select-jobs" class="nav nav-pills">
            <li role="presentation"><a role="button" @click="openCreateJob()">Schedule job</a></li>
            <li role="presentation"><a role="button" @click="selectJobs('all')">Select all</a></li>
            <li role="presentation"><a role="button" @click="selectJobs('none')">Select none</a></li>
          </ul>
          <div class="clearfix"></div>
        </div>
        <div class="table-responsive">
          <b-table striped hover :items="jobs" :fields="fields" :filter="filter"></b-table>
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

// var SelectJobsView = Backbone.View.extend({
//   el: '#select-jobs',
//   initialize: function (options) {
//     this.jobItems = options.jobItems
//     _.bindAll(this, 'selectAll', 'selectNone')
//   },
//   events: {
//     'click [data-action=schedule-job]': 'scheduleJob',
//     'click [data-action=select-all]': 'selectAll',
//     'click [data-action=select-none]': 'selectNone'
//   },
//   scheduleJob: function () {
//     $(App.createJobPaneView.el).find('input').val('')
//     $(App.createJobPaneView.el).show()
//   },
//   selectAll: function () {
//     this.jobItems.forEach(function (jobItem) {
//       jobItem.set({selected: true})
//     })
//   },
//   selectNone: function () {
//     this.jobItems.forEach(function (jobItem) {
//       jobItem.set({selected: false})
//     })
//   }
// })

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
      jobs: [],
      createJobActive: false,
      filter: null,
      overview: [],
      // @TODO This should be shown in the UI
      error: null,
      // Used for the auto refreshing of data
      timer: null,
      refreshInterval: 20,
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
        const {jobs, overview} = res.body;

        this.jobs = jobs;
        this.overview = overview;
      } catch (err) {
        this.error = err;
      }
    }
  },
  async mounted() {
    this.timer = setInterval(this.fetchData, this.refreshInterval * 1000);
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
