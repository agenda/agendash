const topbar = Vue.component('topbar', {
  data: () => ({
    search: '',
    property: 'data.id',
    limit: 200,
    skip: 0,
    refresh: 60,
  }),
  methods: {
    submit() {
      console.log(this.search)
    }
  },
  template: `
    <div class="topbar section">
      <div class="container">
        <div class="input-group mt-2 mb-2">
          <div class="input-group-prepend">
            <span class="input-group-text"> Search </span>
          </div>
          <input class="form-control" v-model="search" />
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
            <span class="input-group-text"> Limit </span>
          </div>
          <input class="form-control" v-model="limit" />
          <div class="input-group-prepend">
            <span class="input-group-text"> Skip </span>
          </div>
          <input class="form-control" v-model="skip" />
        </div>
        <button @click="$emit('refresh-data', search, property, limit, skip, refresh)" class="btn btn-success"> Apply </button>
      </div>
    </div>
  `
})
