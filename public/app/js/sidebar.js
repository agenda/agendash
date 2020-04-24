const sidebar = Vue.component('sidebar', {
  props: ['overview'],
  template: `
    <div class="col">
      <div class="row">
        <div class="col mt-5">
           <button data-toggle="modal" data-target="#modalNewJob" @click="$emit('new-job')" data-placement="top" title="Add a new job" class="btn btn-block btn-outline-success"><i class="oi oi-plus IcoInButton"></i> New Job</button>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div v-for="type in overview"> {{type.displayName}} - {{type.total}} </div>
        </div>
      </div>
    </div>
  `
})
