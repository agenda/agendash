const popupmessage = Vue.component("popup-message", {
  props: ["job", "deletec", "requeuec", "createc"],
  template: `
   <div v-if="deletec" class="alert alert-success popupmessage">Job Deleted successful</div>
   <div v-else-if="requeuec" class="alert alert-success popupmessage">Job Requeue successful</div>
   <div v-else-if="createc" class="alert alert-success popupmessage">Job Created successful</div>
  `,
});
