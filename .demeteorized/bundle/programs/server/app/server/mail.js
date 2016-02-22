(function(){Meteor.startup(function () {
  smtp = {
    username: 'postmaster@advertisa.id',
    password: '65168234fc4f5683d8ec772ce9c3ec8e',
    server:   'smtp.mailgun.org',
    port: 587
 };

 process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
});

Accounts.emailTemplates.siteName = "Todomoro";
Accounts.emailTemplates.from = "Todomoro Account <no-reply@todomoro.id>";
Accounts.emailTemplates.enrollAccount.subject = function (user) {
    return "Welcome to Todomoro, " + user.profile.username;
};
//-- Subject line of the email.
Accounts.emailTemplates.verifyEmail.subject = function(user) {
  return user.profile.username + ' please confirm your email address for Todomoro Account';
};

//-- Email text
Accounts.emailTemplates.verifyEmail.text = function(user, url) {
  return 'Hi, '+ user.profile.username +' thanks for signing up for Todomoro. \r\nPlease click this link bellow to activate your account at Todomoro: \r\n' + url + '\r\nThanks,\r\nTodomoro \r\nAn Advertisa Team';
};
}).call(this);

//# sourceMappingURL=mail.js.map
