var ERRORS_KEY = 'joinErrors';

Template.signup.onCreated(function() {
  Session.set(ERRORS_KEY, {});
});

Template.signup.helpers({
  errorMessages: function() {
    return _.values(Session.get(ERRORS_KEY));
  },
  errorClass: function(key) {
    return Session.get(ERRORS_KEY)[key] && 'error';
  }
});

function clearFormFields() {
  $('[name=username]').val("");
  $('[name=email]').val("");
  $('[name=password]').val("");
  $('[name=confirm]').val(""); 
}

Template.signup.events({
  'submit': function(event, template) {
    event.preventDefault();
    var username = template.$('[name=username]').val();
    var email = template.$('[name=email]').val();
    var password = template.$('[name=password]').val();
    var confirm = template.$('[name=confirm]').val();

    var errors = {};

    if (! username) {
      errors.username = 'Username required';
    }

    if (! email) {
      errors.email = 'Email required';
    }

    if (! password) {
      errors.password = 'Password required';
    }

    if (confirm !== password) {
      errors.confirm = 'Please confirm your password';
    }

    Session.set(ERRORS_KEY, errors);
    if (_.keys(errors).length) {
      return;
    }

    Accounts.createUser({
      username: username,
      email: email,
      password: password
    }, function(error) {
      if (error) {
        return Session.set(ERRORS_KEY, {'none': error.reason});
      }
      // var currentUser  = Meteor.userId();
      // var list = {name: Lists.defaultName(), incompleteCount: 0, createdBy: currentUser};
      // list._id = Lists.insert(list);
      
    });
    clearFormFields();
  }
});
