'use strict';

const Hapi = require('hapi');
const corsHeaders = require('hapi-cors-headers');

const fs =  require('fs');
const options = {
  port: process.env.PORT || 4000,
  /*
  tls: {
    key: fs.readFileSync('security/web-server.key'),
    cert: fs.readFileSync('security/web-server.crt'),
  },
  */
};

const server = new Hapi.Server();
server.connection(options);

const utils = require('./app/api/utils');
require('./app/models/db');
/*
const bcrypt = require('bcrypt');
const users = {
  john: {
    username: 'john',
    password: '$2a$10$iqJSHD.BGr0E2IxQwYgJmeP3NvhPrXAeLSaGCj6IR/XU5QtjVu5Tm',// 'secret'
    name: 'John Doe',
    id: '2133d32a',
  },
};
const validate = function (username, password, callback, request) {
  const user = users[username];
  if (!user) {
    return callback(null, false);
  }

  bcrypt.compare(password, user.password, (err, isValid) => {
    callback(err, isValid, { id: user.id, name: user.name });
  });

};
*/

server.register([
  //require('bell'),
  require('inert'),
  require('vision'),
  //require('hapi-auth-basic'),
  require('hapi-auth-cookie'),
  require('hapi-auth-jwt2'),
], err => {

  if (err) {
    throw err;
  }

  server.views({
    engines: {
      hbs: require('handlebars'),
    },
    relativeTo: __dirname,
    path: './app/views',
    layoutPath: './app/views/layout',
    partialsPath: './app/views/partials',
    layout: true,
    isCached: false,
  });

  server.ext('onPreResponse', corsHeaders);

  server.auth.strategy('standard', 'cookie', {
    password: 'secretpasswordnotrevealedtoanyone',
    cookie: 'donation-cookie',
    isSecure: false,
    ttl: 24 * 60 * 60 * 1000,
    redirectTo: '/login',
  });

  server.auth.strategy('jwt', 'jwt', {
    key: 'secretpasswordnotrevealedtoanyone',
    validateFunc: utils.validate,
    verifyOptions: { algorithms: ['HS256'] },
  });

  /*
  server.auth.strategy('simple', 'basic', { validateFunc: validate });

  const authCookieOptions = {
    password: 'cookie-encryption-secret-password', //Password used for encryption
    cookie: 'sitepoint-auth', // Name of cookie to set
    isSecure: false,
  };

  server.auth.strategy('site-point-cookie', 'cookie', authCookieOptions);

  const bellAuthOptions = {
    provider: 'github',
    password: 'github-encryption-secret-password', //Password used for encryption
    clientId: 'bdfc6a86776d710560cc',
    clientSecret: 'b7eef832e7d4e7eb9af4f7173964816ce6e3b77d',
    isSecure: false,
  };

  server.auth.strategy('github-oauth', 'bell', bellAuthOptions);

  server.auth.default('site-point-cookie');
  */

  server.auth.default({
    strategy: 'standard',
  });

  server.route(require('./routes'));
  server.route(require('./routesapi'));

  server.start((err) => {
    if (err) {
      throw err;
    }

    console.log('Server listening at:', server.info.uri);
  });

});
