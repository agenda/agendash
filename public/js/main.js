/* global $, _, Backbone */
$(function () {
  var CurrentRequestModel = Backbone.Model.extend({
    defaults: {
      refreshInterval: 2000,
      overviewFilterRegex: /.*/
    }
  })

  var ActiveTitleModel = Backbone.Model.extend({})

  var OverviewItemModel = Backbone.Model.extend({})
  var OverviewItemCollection = Backbone.Collection.extend({
    model: OverviewItemModel
  })

  var JobItemModel = Backbone.Model.extend({
    idAttribute: '_id',
    defaults: {
      selected: false
    }
  })
  var JobItemCollection = Backbone.Collection.extend({
    model: JobItemModel
  })

  var ActiveTitleView = Backbone.View.extend({
    el: '#active-title',
    initialize: function (options) {
      this.activeTitle = options.activeTitle
      _.bindAll(this, 'render')
      this.listenTo(this.activeTitle, 'change', this.render)
    },
    render: function () {
      this.$('.active-job').text(this.activeTitle.get('job'))
      this.$('.active-state').text(this.activeTitle.get('state'))
      return this
    }
  })

  var OverviewItemView = Backbone.View.extend({
    model: OverviewItemModel,
    template: _.template($('#overview-item-template').html()),
    initialize: function () {
      _.bindAll(this, 'render', 'handleClick')
    },
    events: {
      'click [data-state]': 'handleClick'
    },
    handleClick: function (e) {
      App.trigger('requestChange', {
        job: this.model.get('_id'),
        state: $(e.currentTarget).data('state')
      })
    },
    render: function () {
      var html = this.template(this.model.toJSON())
      this.setElement(html)
      return this
    }
  })

  var OverviewListView = Backbone.View.extend({
    el: '#job-overview-list',
    initialize: function (options) {
      this.overviewItems = options.overviewItems
      this.currentRequest = options.currentRequest
      _.bindAll(this, 'render')
      this.listenTo(this.overviewItems, 'update', this.render)
      this.render()
    },
    render: function () {
      var overviewFilterRegex = this.currentRequest.get('overviewFilterRegex')
      this.$el.empty().append(this.overviewItems.filter(function (overviewItem) {
        return overviewFilterRegex.test(overviewItem.get('_id'))
      }).map(function (overviewItem) {
        var overviewItemView = new OverviewItemView({
          model: overviewItem
        })
        return overviewItemView.render().$el
      }))
      return this
    }
  })

  var JobItemView = Backbone.View.extend({
    model: JobItemModel,
    tagName: 'tr',
    template: _.template($('#job-item-template').html()),
    initialize: function () {
      _.bindAll(this, 'render', 'handleClick')
      this.listenTo(this.model, 'change', this.render)
    },
    events: {
      'click': 'handleClick'
    },
    handleClick: function (e) {
      this.model.set('selected', !this.model.get('selected'))
    },
    render: function () {
      this.$el.html(this.template(this.model.toJSON()))
      this.$el.toggleClass('active', this.model.get('selected'))
      return this
    }
  })

  var JobListView = Backbone.View.extend({
    el: '#job-list',
    initialize: function (options) {
      this.jobItems = options.jobItems
      _.bindAll(this, 'render')
      this.listenTo(this.jobItems, 'update', this.render)
      this.render()
    },
    render: function () {
      this.$el.empty().append(this.jobItems.map(function (jobItem) {
        var jobItemView = new JobItemView({
          model: jobItem
        })
        return jobItemView.render().$el
      }))
      return this
    }
  })

  var SidebarView = Backbone.View.extend({
    el: '#sidebar',
    events: {
      'keyup .overview-filter': 'updateOverviewFilter',
      'change .refresh-interval': 'updateRefreshInterval'
    },
    initialize: function (options) {
      this.currentRequest = options.currentRequest
      _.bindAll(this, 'updateOverviewFilter', 'updateRefreshInterval')
    },
    updateOverviewFilter: function (e) {
      // http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
      var str = $(e.currentTarget).val()
      var newFilterRegex = new RegExp(str.split('').map(function (char) {
        return char.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/, '\\$&')
      }).join('.*'), 'i')
      this.currentRequest.set({
        overviewFilterRegex: newFilterRegex
      })
    },
    updateRefreshInterval: function (e) {
      this.currentRequest.set({
        refreshInterval: +$(e.currentTarget).val() * 1000
      })
    }
  })

  var JobDetailsPaneView = Backbone.View.extend({
    el: '#details-pane',
    initialize: function (options) {
      this.jobItems = options.jobItems
      _.bindAll(this, 'render')
      this.listenTo(this.jobItems, 'update', this.render)
      this.listenTo(this.jobItems, 'change', this.render)
      this.render()
    },
    render: function () {
      var selectedJobs = this.jobItems
      .where({selected: true})
      .map(function (jobItem) {
        var jobDetailsView = new JobDetailsView({
          model: jobItem
        })
        return jobDetailsView.render().$el
      })
      this.$el.empty().toggle(!!selectedJobs.length).append(selectedJobs)
      return this
    }
  })

  var JobDetailsView = Backbone.View.extend({
    model: JobItemModel,
    template: _.template($('#job-item-details-template').html()),
    initialize: function () {
      _.bindAll(this, 'render', 'close', 'requeueJob', 'allowDeleteJob', 'deleteJob')
      this.listenTo(this.model, 'change', this.render)
    },
    events: {
      'click .close': 'close',
      'click [data-action=requeue]': 'requeueJob',
      'click [data-action=delete]': 'allowDeleteJob',
      'click [data-action=delete].deleteable': 'deleteJob'
    },
    showJob: function (jobItem) {
      this.model = jobItem
      this.$el.empty().append(this.jobItemDetailsTemplate(jobItem.toJSON()))
    },
    requeueJob: function (e) {
      $.post('api/job/' + this.model.get('job')._id + '/requeue')
      $(e.currentTarget).remove()
      App.trigger('refreshData')
    },
    allowDeleteJob: function (e) {
      $(e.currentTarget).addClass('deleteable').text('Confirm deletion')
    },
    deleteJob: function (e) {
      $.post('api/job/' + this.model.get('job')._id + '/delete')
      .success(function () {
        App.trigger('refreshData')
      })
    },
    close: function () {
      this.model.set('selected', false)
    },
    render: function () {
      this.$el.html(this.template(this.model.toJSON()))
      return this
    }
  })

  var AppView = Backbone.View.extend({
    el: '#app',
    initialize: function () {
      _.bindAll(this,
        'handleRequestChange',
        'handleShowJobDetails',
        'fetchData',
        'resultsFetched'
      )

      this.activeTitle = new ActiveTitleModel()
      this.currentRequest = new CurrentRequestModel()
      this.overviewItems = new OverviewItemCollection()
      this.jobItems = new JobItemCollection()

      this.activeTitleView = new ActiveTitleView({
        activeTitle: this.activeTitle
      })
      this.sidebarView = new SidebarView({
        currentRequest: this.currentRequest
      })
      this.overviewListView = new OverviewListView({
        currentRequest: this.currentRequest,
        overviewItems: this.overviewItems
      })
      this.jobListView = new JobListView({
        jobItems: this.jobItems
      })
      this.jobDetailsPaneView = new JobDetailsPaneView({
        jobItems: this.jobItems
      })

      this.listenTo(this, 'requestChange', this.handleRequestChange)
      this.listenTo(this, 'showJobDetails', this.handleShowJobDetails)
      this.listenTo(this, 'refreshData', this.fetchData)
      this.listenTo(this.currentRequest, 'change', this.fetchData)

      this.fetchData()
    },
    handleRequestChange: function (newRequest) {
      this.currentRequest.set(newRequest)
    },
    handleShowJobDetails: function (jobItem) {
      this.jobDetailsView.showJob(jobItem)
    },
    fetchData: function () {
      this._fetchRequest && this._fetchRequest.abort()
      this._fetchTimeout && clearTimeout(this._fetchTimeout)
      this._fetchRequest = $.get('api', {
        job: this.currentRequest.get('job'),
        state: this.currentRequest.get('state')
      }).success(this.resultsFetched)
    },
    resultsFetched: function (results) {
      this.overviewItems.set(results.overview)
      this.activeTitle.set({
        job: results.currentRequest.job,
        state: results.currentRequest.state
      })
      this.jobItems.set(results.jobs)
      this._fetchTimeout = setTimeout(this.fetchData, this.currentRequest.get('refreshInterval'))
    }
  })

  var App = new AppView()
})
