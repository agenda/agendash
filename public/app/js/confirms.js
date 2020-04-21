const popupmessage = Vue.component('popup-message', {
  props: ['job','deletec'],
  template: `
   <div v-if="deletec" class="alert alert-success popupmessage">Job deleted successfull</div>
  `
})
