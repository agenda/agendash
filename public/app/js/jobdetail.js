const jobDetail = Vue.component('job-detail', {
  props: ['job'],
  template: `
  <div class="modal fade" id="modalData" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <!-- Modal -->
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Job Data</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
        <code> {{job.job.data}}</code>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
  `
})
