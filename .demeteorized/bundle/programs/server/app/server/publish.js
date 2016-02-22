(function(){Meteor.publish('publicLists', function() {
  return Lists.find({userId: {$exists: false}});
});

Meteor.publish('privateLists', function() {
  if (this.userId) {
    return Lists.find({userId: this.userId});
  } else {
    this.ready();
  }
});

Meteor.publish('todos', function(listId) {
  check(listId, String);

  return Todos.find({listId: listId});
});

Meteor.publish('pomodoro', function() {
	return Todos.find();
});

Meteor.publish('chart', function() {
	return Todos.find();
});


// Publishing third party oauth service specifically to client
Meteor.publish('userData', function() {
    var currentUser;
    currentUser = this.userId;
    if (currentUser) {
        return Meteor.users.find({
            _id: currentUser
        }, {
            fields: {
                // Default
                "emails": 1,
                // Created profile property
                "profile": 1
            }
        });
    } else {
        return this.ready();
    }
});

}).call(this);

//# sourceMappingURL=publish.js.map
