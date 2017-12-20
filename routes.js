const Accounts = require('./app/controllers/accounts');
const Donations = require('./app/controllers/donations');
const Assets = require('./app/controllers/assets');
const os = require('os');

module.exports = [

  {
    method: 'GET',
    path: '/testlb/{param}',
    config: { auth: false },
    handler: function (request, reply) {
      reply('Server: ' + os.hostname());
      console.log('testing: ' + request.params.param);
    },
  },

  {
    method: 'GET',
    path: '/account',
    config: {
      handler: function (request, reply) {
        reply(request.auth.credentials.profile);
      },
    },
  },

  { method: 'GET', path: '/', config: Accounts.main },
  { method: 'GET', path: '/signup', config: Accounts.signup },
  { method: 'GET', path: '/login', config: Accounts.login },

  // { method: 'GET', path: '/register', config: Accounts.register },
  { method: 'POST', path: '/login', config: Accounts.authenticate },
  { method: 'POST', path: '/register', config: Accounts.register },
  { method: 'GET', path: '/logout', config: Accounts.logout },
  { method: 'GET', path: '/settings', config: Accounts.viewSettings },
  { method: 'POST', path: '/settings', config: Accounts.updateSettings },

  { method: 'GET', path: '/home', config: Donations.home },
  { method: 'GET', path: '/report', config: Donations.report },
  { method: 'POST', path: '/donate', config: Donations.donate },

  {
    method: 'GET',
    path: '/{param*}',
    config: { auth: false },
    handler: Assets.servePublicDirectory,
  },

  {
    method: 'GET', path: '/welcome/{lname}',
    handler: function (request, reply) {
      reply('Welcome ' + request.params.lname + '!  Go <a href="/login">here</a> to log in.');
    },
  },

];
