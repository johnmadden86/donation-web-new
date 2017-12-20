'use strict';

const User = require('../models/user');
const Boom = require('boom');
const utils = require('./utils.js');

exports.getAllUsers = {

  auth: false,

  handler: function (request, reply) {
    User.find({}).exec()
        .then(users => {
          reply(users);
        }).catch(err => {
      reply(Boom.badImplementation('error accessing db'));
    });
  },
};

exports.getOneUser = {

  auth: false,

  handler: function (request, reply) {
    User.findOne({ _id: request.params.id })
        .then(user => {
          if (user !== null) {
            reply(user);
          } else {
            reply(Boom.notFound('id not found'));
          }
        }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
};

exports.createNewUser = {

  auth: false,
  handler: function (request, reply) {
    const user = new User(request.payload);
    user.save()
        .then(newUser => {
          reply(newUser).code(201);
        }).catch(err => {
      reply(Boom.badImplementation('error creating user'));
    });
  },
};

exports.deleteAllUsers = {

  auth: false,
  handler: function (request, reply) {
    User.remove({})
        .then(err => {
          reply().code(204);
        }).catch(err => {
      reply(Boom.badImplementation('error removing users'));
    });
  },
};

exports.deleteOneUser = {

  auth: false,
  handler: function (request, reply) {
    User.remove({ _id: request.params.id }).then(user => {
      reply(user).code(204);
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
};

exports.authenticateUser = {
  auth: false,
  handler: function (request, reply) {
    const user = request.payload;
    User.findOne({ email: user.email })
        .then(foundUser => {
          if (foundUser && foundUser.password === user.password) {
            const token = utils.createToken(foundUser);
            reply({
              success: true,
              token: token,
            }).code(201);
          } else {
            reply({
              success: false,
              message: 'Authentication failed. User not found.',
            }).code(201);
          }
        }).catch(err => {
      reply(Boom.notFound('internal db failure'));
    });
  },

};

