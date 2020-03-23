const app = Vue.component('app', {
  data: () => ({
    jobs: [],
    overview: [],
    refresh: 60,
    showDetail: false,
    jobData: {},
  }),
  methods: {
    showJobDetail(data){
      this.jobData = data;
      this.showDetail = true;
    },
    fetchData(search = '', property = '', limit = 200, skip = 0, refresh = 60){
      this.refresh = parseFloat(refresh);
      const url = `/api?limit=${limit}&skip=${skip}&property=${property}&q=${search}`;
      return axios.get(url)
        .then(result => result.data)
        .then((data) => {
          this.jobs = data.jobs;
          this.overview = data.overview;
        })
        .catch(console.log)
    }
  },
  created() {
    return this.fetchData();
  },
  template: `
    <div class="container-fluid">
      <topbar v-on:refresh-data="fetchData"></topbar>
      <div class="d-flex">
        <sidebar class="w-25" v-bind:overview="overview"></sidebar>
        <job-list class="w-75" v-on:show-job-detail="showJobDetail" v-bind:jobs="jobs"></job-list>
      </div>
      <job-detail v-if="showDetail" v-bind:job="jobData"></job-detail>
    </div>
  `
})
