'use strict';

const User = require('../models/user');
const utils = require('../api/utils');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const Boom = require('boom');
const Joi = require('joi');
const os = require('os');

function setCookie(request, userId) {
  request.cookieAuth.set({
    loggedIn: true,
    loggedInUser: userId,
  });
  console.log('Cookie set: ' + userId);
}

function clearCookie(request) {
  request.cookieAuth.set({
    loggedIn: false,
    loggedInUser: null,
  });
}

function getLoggedInUser(request) {
  const userId = request.auth.credentials.loggedInUser;
  return User.findOne({ _id: userId });
}

exports.main = {
  auth: false,

  handler: function (request, reply) {
    /*if (request.auth.isAuthenticated) {
      request.auth.session.set(request.auth.credentials);
      return */
    reply.view('main', {
      title: 'Welcome to Donations',
      lbserver: os.hostname(),
    });
    /*}

    //reply('Not logged in...').code(401);*/
  },
};

exports.signup = {
  auth: false,
  handler: function (request, reply) {
    reply.view('signup', {
      title: 'Sign up for Donations',
      lbserver: os.hostname(),
    });
  },

};

exports.login = {
  auth: false,
  handler: function (request, reply) {
    reply.view('login', {
      title: 'Login to Donations',
      lbserver: os.hostname(),
    });
  },

};

exports.register = {
  auth: false,

  validate: {

    payload: {
      // begin with upper case letter and then 2+ lower case letters
      firstName: Joi.string().regex(/^[A-Z][a-z]{2,}$/),

      // begin with upper case letter, then any 2+ characters
      lastName: Joi.string().regex(/^[A-Z]/).min(3),

      email: Joi.string().regex(/^[a-z0-9._]*@[a-z0-9]*[.][a-z]*[.]?[a-z]*/).required(),

      password: Joi.string().min(8), // min 8 characters

      phone: Joi.string().regex(/^[(]?[0]?[0-9]{1,3}[)\-]?[\s]?[0-9]{3}[\s]?[0-9]{2,4}/),
    },

    options: {
      abortEarly: false,
    },

    failAction: function (request, reply, source, error) {
      reply.view('signup', {
        title: 'Sign up error',
        errors: error.data.details,
      }).code(400);
    },
  },

  handler: function (request, reply) {
    let user;
    if (request.payload) { //POST
      user = new User(request.payload);
    } else { // GET
      user = new User(request.url.query);
    }

    const plaintextPassword = user.password;
    bcrypt.hash(plaintextPassword, saltRounds, (err, hash) => {
      user.password = hash;
      console.log(plaintextPassword, user.password);
      return user.save()
          .then(newUser => {
            setCookie(request, newUser._id);
            reply.redirect('/home');
          })
          .catch(err => {
            reply.redirect('/');
          });
    });
  },
};

exports.authenticate = {
  auth: false,

  validate: {

    payload: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },

    options: {
      abortEarly: false,
    },

    failAction: function (request, reply, source, error) {
      reply.view('login', {
        title: 'Sign in error',
        errors: error.data.details,
      }).code(400);
    },

  },

  handler: function (request, reply) {
    const user = request.payload;
    User.findOne({ email: user.email })
        .then(foundUser => {
          bcrypt.compare(user.password, foundUser.password, (err, isValid) => {
            if (isValid) {
              setCookie(request, foundUser._id);
              reply.redirect('/home');
            } else {
              reply.redirect('/login');
            }
          }).catch(err => {
            reply.redirect('/');
          });
        });
  },
};

exports.logout = {
  auth: false,
  handler: function (request, reply) {
    clearCookie(request);
    reply.redirect('/');
  },

};

exports.viewSettings = {

  handler: function (request, reply) {
    getLoggedInUser(request)
        .then(foundUser => {
          reply.view('settings', {
            title: 'Edit Account Settings', user: foundUser,
            lbserver: os.hostname(),
          });
        })
        .catch(err => {
          reply.redirect('/');
        });
  },

};

exports.updateSettings = {

  validate: {

    payload: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },

    options: {
      abortEarly: false,
    },

    failAction: function (request, reply, source, error) {
      reply.view('signup', {
        title: 'Sign up error',
        errors: error.data.details,
      }).code(400);
    },

  },

  handler: function (request, reply) {
    const updatedUser = request.payload;
    getLoggedInUser(request)
        .then(user => {
          user.firstName = updatedUser.firstName;
          user.lastName = updatedUser.lastName;
          user.email = updatedUser.email;
          bcrypt.hash(updatedUser.password, saltRounds, (err, hash) => {
            user.password = hash;
            return user.save();
          });
        })
        .then(user => {
          reply.view('settings', { title: 'Edit Account Settings', user: user });
        })
        .catch(err => {
          reply.redirect('/');
        });
  },
};
