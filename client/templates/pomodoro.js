Session.setDefault('counter', 0);
Session.setDefault( 'timerType', POMODORO_TIME.toTimerFormat() );
Session.setDefault( 'totalTime', Session.get( 'timerType' ) );
Session.setDefault( 'currentPomodoroTime', Session.get( 'timerType' ) );
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
	pomodoroTimer: function() {
		return Session.get( 'pomodoroTimer' );
	},
	timerTypeCompare: function( type ) {
		return Session.get( 'timerType' ).fromTimerFormat() == window[ type ];
	},
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
// var stopPomodoro = function( e ) {
//   var timerPomo = POMODORO_TIME.toTimerFormat();
//   Session.set( 'timerType', timerPomo );
//   Session.set( 'totalTime', timerPomo );
//   Session.set( 'currentPomodoroTime', timerPomo );
//   clearInterval( Session.get( 'pomodoroTimer' ) );
//   Session.set( 'pomodoroTimer', false )
//   Todos.update(this._id, {$set: {checked: true}});
//   Lists.update(this.listId, {$inc: {incompleteCount: -1}});
// 	// // Session.set( 'pomodoroTimer', false );
// 	// Session.set( 'timerType', timerTime );
// 	// //Session.set( 'currentPomodoroTime', Session.get( 'timerType' ) );
// 	//document.title = "Todos from " + listTitle;
// 	//Router.go('listsShow', Lists.findOne(this.listId));
// }
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
Template.pomodoro.events({
	'click .pomodoro-start': function( e ) {
		var checked = $(event.target).is(':checked');
		var listTitle = Lists.findOne(this.listId).name;
		if ( ! Session.get( 'pomodoroTimer' ) ) {
			Session.set( 'pomodoroTimer', setInterval( function() {
				currentPomodoroTime = Session.get( 'currentPomodoroTime' ).fromTimerFormat();
				if ( currentPomodoroTime == 0 ) {
					// Session.set( 'pomodoroTimer', setInterval( function() {
					// 	currentPomodoroTime = SHORT_BREAK_TIME.fromTimerFormat();
					// // 	if ( currentPomodoroTime == 0 ) {
					// // // resetPomodoro();
					// // // var timerType = getTimerType();
					// // // Session.set( 'alertMsg', ( timerType.name == 'Pomodoros' ? '<strong>Well done!</strong> ' : '' ) + '1 ' + timerType.name + ' Finished!' );
					// setTimeout( function() {
					//  	alert("Todomoro Finished!, Next is Break Time");
					// });
					var timerTime = SHORT_BREAK_TIME.toTimerFormat();
					Session.set( 'timerType', timerTime );
					Session.set( 'totalTime', timerTime );
					Session.set( 'currentPomodoroTime', timerTime );

					// // // if ( cpo == 0 ) {
					// //  		stopPomodoro();
					// //  	} else {
					// //  		Session.set( 'currentPomodoroTime', ( currentPomodoroTime - 1 ).toTimerFormat() );
					// //  		document.title = getTimerType().name + ' ' + Session.get( 'currentPomodoroTime' );;
					// //  	}

					// }, 1 * MILLISECONDS_IN_SECONDS) );
					// }
					// if ( Session.get( 'pomodoroTimer' ) ) {
					// 	Session.set( 'pomodoroTimer', setInterval( function() {
					// 		currentPomodoroTime = Session.get( 'currentPomodoroTime' ).fromTimerFormat();
					// 		if ( currentPomodoroTime == 0 ) {
					// 			stopPomodoro();
					// 		} else {
					// 			Session.set( 'currentPomodoroTime', ( currentPomodoroTime - 1 ).toTimerFormat() );
					// 			document.title = getTimerType().name + ' ' + Session.get( 'currentPomodoroTime' );;
					// 		}

					// 	}, 1 * MILLISECONDS_IN_SECONDS) );
					// }
					
					//stopPomodoro();
    	// 		Todos.update(this._id, {$set: {checked: true}});
    	// 		Lists.update(this.listId, {$inc: {incompleteCount: -1}});
					// clearInterval( Session.get( 'pomodoroTimer' ) );
					// Session.set( 'pomodoroTimer', false );
					// Session.set( 'currentPomodoroTime', Session.get( 'timerType' ) );
					// resetPomodoro();
					// var listTitle = Lists.findOne(this.listId).name;
					// document.title = "Todos from " + listTitle;
					// Router.go('listsShow', Lists.findOne(this.listId));
					// setTimeout( function() {
					// 	Session.set( 'alertMsg', null );
					// }, 3 * MILLISECONDS_IN_SECONDS);					
				} else {
					Session.set( 'currentPomodoroTime', ( currentPomodoroTime - 1 ).toTimerFormat() );
					document.title = getTimerType().name + ' ' + Session.get( 'currentPomodoroTime' );;
				}

			}, 1 * MILLISECONDS_IN_SECONDS) );
		} else {
			var listTitle = Lists.findOne(this.listId).name;
			document.title = "Todos from " + listTitle;
			Router.go('listsShow', Lists.findOne(this.listId));
		}
		//resetPomodoro();
	},
	'click .pomodoro-stop': function( e ) {
    var checked = $(event.target).is(':checked');
    var timerPomo = POMODORO_TIME.toTimerFormat();
    Session.set( 'timerType', timerPomo );
    Session.set( 'totalTime', timerPomo );
    Session.set( 'currentPomodoroTime', timerPomo );
    clearInterval( Session.get( 'pomodoroTimer' ) );
    Session.set( 'pomodoroTimer', false )
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