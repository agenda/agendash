const sidebar = Vue.component('sidebar', {
  props: ['overview'],
  template: `
    <div class="sidebar section">
      <div class="d-flex flex-column">
        <div v-for="type in overview"> {{type.displayName}} - {{type.total}} </div>
      </div>
    </div>
  `
})
