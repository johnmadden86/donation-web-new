'use strict';

const User = require('../models/user');
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
    reply.view('main', {
      title: 'Welcome to Donations',
      lbserver: os.hostname(),
    });
  },

};

exports.signup = {
  auth: false,
  handler: function (request, reply) {
    reply.view('signup', { title: 'Sign up for Donations' });
  },

};

exports.login = {
  auth: false,
  handler: function (request, reply) {
    reply.view('login', { title: 'Login to Donations' });
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

      email: Joi.string().email().required(),

      password: Joi.string().min(8), // min 8 characters
    },

    failAction: function (request, reply, source, error) {
      reply.view('signup', {
        title: 'Sign up error',
        errors: error.data.details,
      }).code(400);
    },

  },

  handler: function (request, reply) {
    const user = new User(request.payload);
    user.save()
        .then(newUser => {
          setCookie(request, newUser._id);
          reply.redirect('/home');
        })
        .catch(err => {
          reply.redirect('/');
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
          if (foundUser && foundUser.password === user.password) {
            setCookie(request, foundUser._id);
            reply.redirect('/home');
          } else {
            reply.redirect('/login');
          }
        })
        .catch(err => {
          reply.redirect('/');
        });
  },

};

exports.logout = {
  auth: false,
  handler: function (request, reply) {
    request.cookieAuth.clear();
    reply.redirect('/');
  },

};

exports.viewSettings = {

  handler: function (request, reply) {
    getLoggedInUser(request)
        .then(foundUser => {
          reply.view('settings', { title: 'Edit Account Settings', user: foundUser });
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
          user.password = updatedUser.password;
          return user.save();
        })
        .then(user => {
          reply.view('settings', { title: 'Edit Account Settings', user: user });
        })
        .catch(err => {
          reply.redirect('/');
        });
  },
};
