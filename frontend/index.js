import Vue from 'vue';
import VueRouter from 'vue-router';
import VueMoment from 'vue-moment';
import bTable from 'bootstrap-vue/es/components/table/table';
import IndexComponent from './pages/index.vue';

Vue.use(VueRouter);
Vue.use(VueMoment);
Vue.component('b-table', bTable);

const router = new VueRouter({
  routes: [
    {
      path: '/', component: IndexComponent
    }
  ]
});

const app = new Vue({
  el: '#app',
  router,
  render() {
    return <router-view></router-view>;
  }
});

export default app;
