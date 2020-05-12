const topbar = Vue.component('topbar', {
  props: ['name','state','search','property'],
  data: () => ({
    // search: '',
    // property: 'data.id',
    // name: '',
    limit: 15,
    skip: 0,
    refresh: 60,
    // state: '',
    object: false,
    stateobject: [
                  {text: 'All', value: '', class: ''},
                  {text: 'Scheduled', value: 'scheduled', class: ""},
                  {text: 'Queued', value: 'queued', class: "text-primary"},
                  {text: 'Running', value: 'running', class: 'text-warning'},
                  {text: 'Completed', value: 'completed', class: 'text-success'},
                  {text: 'Failed', value: 'failed', class: 'text-danger'},
                  {text: 'Repeating', value: 'repeating', class: 'text-info'},
                ]
  }),
  methods: {
    submit() {
      console.log(search)
    }
  },
  template: `
  <div>
    <div class="row">
      <div class="col-xs-12 col-md-6">
          <div class="input-group mt-2 mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text"> Name </span>
            </div>
            <input type="text" class="form-control" v-model='name'/>
          </div>
          <div class="input-group mt-2 mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text"> Search </span>
            </div>
            <input class="form-control" v-model="search" />
            <div class="form-check mx-2 pt-2">
                <input type="checkbox" v-model="object" class="form-check-input" id="exampleCheck1">
                <label class="form-check-label" for="exampleCheck1"> Is ObjectId?</label>
            </div>
          </div>
          <div class="input-group mt-2 mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text"> Property </span>
            </div>
            <input type="text" class="form-control" v-model="property" />
          </div>
      </div>
      <div class="col-xs-12 col-md-6">
        <div class="input-group mt-2 mb-2">
              <div class="input-group-prepend">
                <span class="input-group-text"> Refresh Interval </span>
              </div>
              <input type="text" class="form-control" v-model="refresh" />
            </div>
            <div class="input-group mt-2 mb-2">
              <div class="input-group-prepend">
                <span class="input-group-text"> Page Size </span>
              </div>
              <input type="number" class="form-control" v-model="limit" />
            </div>
            <div class="input-group mt-2 mb-2">
            <div class="input-group-prepend">
                <span class="input-group-text"> State </span>
              </div>
                <select v-model="state" class="form-control" id="selectStateInput">
                  <option v-bind:class="option.class" v-for="option in stateobject" v-bind:value="option.value">{{option.text}}</option>
                </select>
          </div>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-xs-12 col-md-3 ml-auto text-right">
        <button @click="$emit('search-form', search, property, limit, skip, refresh, state, object)" class="btn btn-success"> Apply </button>
      </div>
    </div>
  </div>
  `
})
