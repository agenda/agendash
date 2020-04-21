const app = Vue.component('app', {
  data: () => ({
    jobs: [],
    overview: [],
    refresh: 60,
    showDetail: false,
    showConfirm: false,
    jobData: {},
    deletec: false,
  }),
  methods: {
    showJobDetail(data){
      this.jobData = data;
      this.showDetail = true;
    },
    confirmDelete(data){
      this.jobData = data;
      this.showConfirm = true;
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
    },
    popupmessage(data){
      if(data === 'delete'){
        this.deletec = true
          setTimeout(() => {
            return this.deletec = false
            console.log("SE TERMINO EL TIEMPO", this.deletec)
          }, 2000);
      }
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
        <job-list class="col-md-12"
            v-on:confirm-delete="confirmDelete"
            v-on:show-job-detail="showJobDetail"
            v-on:popup-delete="popupmessage"
            v-bind:jobs="jobs"></job-list>
      </div>
      <job-detail v-if="showDetail" v-bind:job="jobData"></job-detail>
      <confirm-delete v-if="showConfirm" v-on:popup-delete="popupmessage('delete')" v-on:refresh-data="fetchData" v-bind:job="jobData"></confirm-delete>
      <popup-message v-bind:deletec="deletec"></popup-message>
    </div>
  `
})
