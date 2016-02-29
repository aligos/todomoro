Session.setDefault('counter', 0);
Session.setDefault( 'timerType', POMODORO_TIME.toTimerFormat() );
Session.setDefault( 'timerTime', SHORT_BREAK_TIME.toTimerFormat() );
Session.setDefault( 'totalTime', Session.get( 'timerType' ) );
Session.setDefault( 'currentPomodoroTime', Session.get( 'timerType' ) );
Session.setDefault( 'currentBreakTime', Session.get( 'timerTime' ) );
Session.setDefault( 'timerStatus', 0 );
Session.setDefault( 'alertMsg', null );
Session.setDefault( 'profile', {} );

Template.body.onRendered(function() {
	document.oldTitle = document.title;
});
Template.body.helpers({
	projectName: function() {
		return projectName;
	},
	alertMsg: function() {
		return Session.get( 'alertMsg' );
	}
});

Template.pomodoro.helpers({
	pomodoroHeight: function( totalHeight ) {
		return ( Session.get( 'currentPomodoroTime' ).fromTimerFormat() / Session.get( 'totalTime' ).fromTimerFormat() ) * totalHeight;
	},
	currentPomodoroTime: function() {
		return Session.get( 'currentPomodoroTime' );
	},
	currentBreakTime: function() {
		return Session.get( 'currentBreakTime' );
	},
	pomodoroTimer: function() {
		return Session.get( 'pomodoroTimer' );
	},
	timerTypeCompare: function( type ) {
		return Session.get( 'timerType' ).fromTimerFormat() == window[ type ];
	}
})
var resetPomodoro = function() {
	if ( Session.get( 'pomodoroTimer' ) ) {
		clearInterval( Session.get( 'pomodoroTimer' ) );
		Session.set( 'pomodoroTimer', false )
	}
	Session.set( 'currentPomodoroTime', Session.get( 'timerType' ) );

	if ( document.oldTitle ) {
		document.title = document.oldTitle;
	}
}
var getTimerType = function() {
	var timerType = {};
	switch ( Session.get( 'timerType' ).fromTimerFormat() ) {
		case POMODORO_TIME:
			timerType.key = 'pomodoros';
			timerType.name = 'Pomodoro';
			break;
		case SHORT_BREAK_TIME:
			timerType.key = 'shortbreaks';
			timerType.name = 'Short Break';
			break;
		case LONG_BREAK_TIME:
			timerType.key = 'longbreaks';
			timerType.name = 'Long Break';
			break;
	}
	return timerType;
}
var breakTime = function (e) {
	var timerTime = SHORT_BREAK_TIME.toTimerFormat();
	Session.set( 'timerType', timerTime );
	Session.set( 'totalTime', timerTime );
	Session.set( 'currentPomodoroTime', timerTime);
}
var stopTime = function( e ) {
	// var listId = Todos.findOne().this.listId;
	// var _id = Todos.findOne().this._id;
  var timerPomo = POMODORO_TIME.toTimerFormat();
  Session.set( 'timerType', timerPomo );
  Session.set( 'totalTime', timerPomo );
  Session.set( 'currentPomodoroTime', timerPomo );
  clearInterval( Session.get( 'pomodoroTimer' ) );
  Session.set( 'pomodoroTimer', false );
  Todos.update(this._id, {$set: {checked: true}});
  Lists.update(this.listId, {$inc: {incompleteCount: -1}});
  var listTitle = Lists.findOne(this.listId).name;
  document.title = "Todos from " + listTitle;
  Router.go('listsShow', Lists.findOne(this.listId));
}
Template.pomodoro.events({
	'click .pomodoro-start': function( e ) {
		var _id = Todos.findOne(this._id)._id;
		//console.log(_id);
		var listId = Todos.findOne(this._id).listId;
		//console.log(listId);
		var checked = $(event.target).is(':checked');
		if ( ! Session.get( 'pomodoroTimer' ) ) {
			Session.set( 'pomodoroTimer', setInterval( function() {
				var CBT = Session.get( 'totalTime' ).fromTimerFormat();
				//console.log(CBT);
				currentPomodoroTime = Session.get( 'currentPomodoroTime' ).fromTimerFormat();
				if ( currentPomodoroTime == 0 ) {
					breakTime();
					if ( CBT == 300 && currentPomodoroTime == 0 ) {
						var timerPomo = POMODORO_TIME.toTimerFormat();
						Session.set( 'timerType', timerPomo );
						Session.set( 'totalTime', timerPomo );
						Session.set( 'currentPomodoroTime', timerPomo );
						clearInterval( Session.get( 'pomodoroTimer' ) );
						Session.set( 'pomodoroTimer', false );
						Todos.update(_id, {$set: {checked: true}});
						Lists.update(listId, {$inc: {incompleteCount: -1}});
						var listTitle = Lists.findOne(listId).name;
						document.title = "Todos from " + listTitle;
						Router.go('listsShow', Lists.findOne(listId));	
					}
				} else {
					Session.set( 'currentPomodoroTime', ( currentPomodoroTime - 1 ).toTimerFormat() );
					document.title = getTimerType().name + ' ' + Session.get( 'currentPomodoroTime' );;
				}
			}, 1 * MILLISECONDS_IN_SECONDS) );
		}
	},
	'click .pomodoro-stop': function( e ) {
    var checked = $(event.target).is(':checked');
    var timerPomo = POMODORO_TIME.toTimerFormat();
    Session.set( 'timerType', timerPomo );
    Session.set( 'totalTime', timerPomo );
    Session.set( 'currentPomodoroTime', timerPomo );
    clearInterval( Session.get( 'pomodoroTimer' ) );
    Session.set( 'pomodoroTimer', false );
    Todos.update(this._id, {$set: {checked: true}});
    Lists.update(this.listId, {$inc: {incompleteCount: -1}});
		// // Session.set( 'pomodoroTimer', false );
		// Session.set( 'timerType', timerTime );
		// //Session.set( 'currentPomodoroTime', Session.get( 'timerType' ) );
		var listTitle = Lists.findOne(this.listId).name;
		document.title = "Todos from " + listTitle;
		Router.go('listsShow', Lists.findOne(this.listId));
	},
	'click .pomodoro-reset': function( e ) {
		resetPomodoro();
	},
	'click .pomodoro-change-type': function( e ) {
		if ( window[ e.target.getAttribute( 'data-type' ) ] ) {
			var timerTime = window[ e.target.getAttribute( 'data-type' ) ].toTimerFormat();
			Session.set( 'timerType', timerTime );
			Session.set( 'totalTime', timerTime );
			Session.set( 'currentPomodoroTime', timerTime );
			$( e.target ).closest( '.pomodoro-container' ).find( '.pomodoro-reset' )[0].click();
		}
	}
});


var addSessiontoUser = function() {
	if ( Meteor.userId() ) {
		Meteor.call( 'getUserProfile', function( error, userProfile ) {
			var sessionProfile = Session.get( 'profile' );
			userProfile = typeof userProfile == 'undefined' ? {} : userProfile;
			for ( i in sessionProfile )
				userProfile[ i ] = userProfile[ i ] ? userProfile[ i ] + sessionProfile[ i ] : sessionProfile[ i ];
			Meteor.call( 'updateUserProfile', userProfile );
		} );
	}
}