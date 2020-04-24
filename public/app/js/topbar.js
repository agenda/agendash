const topbar = Vue.component('topbar', {
  data: () => ({
    search: '',
    property: 'data.id',
    limit: 5,
    skip: 0,
    refresh: 60,
    object: false,
  }),
  methods: {
    submit() {
      console.log(search)
    }
  },
  template: `
  <div class="topbar section row">
      <div class=" col-md-8">
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
            <input class="form-control" v-model="property" />
          </div>
          <div class="input-group mt-2 mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text"> Refresh Interval </span>
            </div>
            <input class="form-control" v-model="refresh" />
          </div>
          <div class="input-group mt-2 mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text"> Page Size </span>
            </div>
            <input type="number" class="form-control" v-model="limit" />
          </div>
          <button @click="$emit('search-form', search, property, limit, skip, refresh, object)" class="btn btn-success"> Apply </button>
      </div>
      <div class="col-md-4"></div>
  </div>
  `
})
