Accounts.config({
    sendVerificationEmail: true
});

Accounts.urls.verifyEmail = function (token) {
    return Meteor.absoluteUrl('verify-email/' + token);
};

if (Meteor.isServer) {
  Accounts.validateLoginAttempt(function(attempt) {
    var user = attempt.user;
    if (!user.emails[0].verified) throw new Meteor.Error(403, 'open your mail for verification.');
    return true;
  });
}