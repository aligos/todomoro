Router.configure({
  // we use the  appBody template to define the layout for the entire app
  layoutTemplate: 'appBody',

  // the appNotFound template is used for unknown routes and missing lists
  notFoundTemplate: 'appNotFound',

  // show the appLoading template whilst the subscriptions below load their data
  loadingTemplate: 'appLoading',

  // wait on the following subscriptions before rendering the page to ensure
  // the data it's expecting is present
  waitOn: function() {
    return [
      Meteor.subscribe('publicLists'),
      Meteor.subscribe('privateLists')
    ];
  }
});

dataReadyHold = null;

if (Meteor.isClient) {
  // Keep showing the launch screen on mobile devices until we have loaded
  // the app's data
  dataReadyHold = LaunchScreen.hold();

  // Show the loading screen on desktop
  Router.onBeforeAction('loading', {except: ['signup', 'signin', 'verifyEmail', 'verifikasi']});
  Router.onBeforeAction('dataNotFound', {except: ['signup', 'signin', 'verifyEmail', 'verifikasi']});
}

Router.route('signup');
Router.route('signin');
Router.route('verifikasi');

Router.route('listsStart',{
    path: '/start/:_id',
    // subscribe to todos before the page is rendered but don't wait on the
    // subscription, we'll just render the items as they arrive
    onBeforeAction: function () {
      this.todosHandle = Meteor.subscribe('pomodoro', this.params._id);

      if (this.ready()) {
        // Handle for launch screen defined in app-body.js
        dataReadyHold.release();
      }
    },
    data: function () {
      return Todos.findOne(this.params._id);
    },
    action: function () {
      this.render();
    }
});

Router.route('listsChart',{
    path: '/chart',
    // subscribe to todos before the page is rendered but don't wait on the
    // subscription, we'll just render the items as they arrive
    onBeforeAction: function () {
      this.todosHandle = Meteor.subscribe('chart');

      if (this.ready()) {
        // Handle for launch screen defined in app-body.js
        dataReadyHold.release();
      }
    },
    data: function () {
      return Todos.findOne();
    },
    action: function () {
      this.render();
    }
});

Router.route('listsShow', {
  path: '/lists/:_id',
  // subscribe to todos before the page is rendered but don't wait on the
  // subscription, we'll just render the items as they arrive
  onBeforeAction: function () {
    this.todosHandle = Meteor.subscribe('todos', this.params._id);

    if (this.ready()) {
      // Handle for launch screen defined in app-body.js
      dataReadyHold.release();
    }
  },
  data: function () {
    return Lists.findOne(this.params._id);
  },
  action: function () {
    this.render();
  }
});

Router.route('home', {
  path: '/',
  action: function() {
    var currentUser = Meteor.userId();
    var list = {name: "Change this default list name", incompleteCount: 0, createdBy: currentUser};

    if (currentUser && Lists.find({createdBy: currentUser}).count() === 0) {
      return Lists.insert(list);
    }

    if(currentUser) {
      Router.go('listsShow', Lists.findOne({ createdBy: currentUser }));
    } else {
      Router.go('signup'); 
    }

  }
});


Router.route('verifyEmail', {
        path: '/verify-email/:token',
        action: function() {
          Accounts.verifyEmail(this.params.token, function () {
            // var currentUser = Meteor.userId();
            // var list = {name: "Change this default list name", incompleteCount: 0, createdBy: currentUser};

            // if (Lists.find({createdBy: currentUser}).count() === 0) {
            //   return Lists.insert(list);
            // } 

            Router.go('home');
          });
        }
});