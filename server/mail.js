Meteor.startup(function () {
  smtp = {
    username: 'advertisa.id@gmail.com',
    password: 'ic0O_kSfZGQLoEhy8-hK_Q',
    server:   'smtp.mandrillapp.com',
    port: 587
 };
    
  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
});

Accounts.emailTemplates.siteName = "Tomatisa";
Accounts.emailTemplates.from = "Tomatisa Account <no-reply@tomatisa.com>";
Accounts.emailTemplates.enrollAccount.subject = function (user) {
    return "Welcome to Tomatisa, " + user.profile.name;
};
//-- Subject line of the email.
Accounts.emailTemplates.verifyEmail.subject = function(user) {
  return 'Confirm Your Email Address for Tomatisa';
};

//-- Email text
Accounts.emailTemplates.verifyEmail.text = function(user, url) {
  return 'Thank you for registering.  Please click on the following link to verify your email address: \r\n' + url;
};