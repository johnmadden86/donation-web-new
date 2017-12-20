'use strict';

const Donation = require('../models/donation');
const User = require('../models/user');
const Candidate = require('../models/candidate');
const Boom = require('boom');
const utils = require('./utils.js');

exports.findAllDonations = {
  auth: false,
  handler: function (request, reply) {
    Donation.find({})
        .populate('donor')
        .populate('candidate')
        .then(donations => {
          reply(donations);
        })
        .catch(err => {
          reply(Boom.badImplementation('error accessing db'));
        });
  },
};

exports.findAllDonationsForCandidate = {

  auth: false,

  handler: function (request, reply) {
    Donation.find({ candidate: request.params.id })
        .then(donations => {
          reply(donations);
        })
        .catch(err => {
          reply(Boom.badImplementation('error accessing db'));
        });
  },
};

exports.makeDonation = {

  auth: false,

  handler: function (request, reply) {
    const donation = new Donation(request.payload);
    donation.candidate = request.params.id;
    // const authorization = request.headers.authorization;
    // const token = authorization.split(' ')[1];
    // const userInfo = utils.decodeToken(token);
    // donation.donor = User.findOne({ _id: userInfo.id });
    donation.save()
        .then(newDonation => {
          Donation.findOne(newDonation).populate('candidate').populate('donor');
        })
        .then(newDonation => {
          reply(newDonation).code(201);
        })
        .catch(err => {
          reply(Boom.badImplementation('error making donation'));
        });
  },

};

exports.deleteAllDonations = {

  auth: false,

  handler: function (request, reply) {
    Donation.remove({})
        .then(err => {
          reply().code(204);
        })
        .catch(err => {
          reply(Boom.badImplementation('error removing Donations'));
        });
  },
};

exports.deleteAllDonationsForCandidate = {

  auth: false,

  handler: function (request, reply) {
    const candidate = request.params.id;
    Donation.remove({ candidate: candidate })
        .then(err => {
          reply().code(204);
        })
        .catch(err => {
          reply(Boom.badImplementation('error removing Donations'));
        });
  },
};

exports.deleteOneDonationForCandidate = {

  auth: false,

  handler: function (request, reply) {
    const candidate = request.params.candidateId;
    const donationId = request.params.donationId;
    Donation.remove({
      _id: donationId,
      candidate: candidate,
    })
        .then(err => {
          reply().code(204);
        })
        .catch(err => {
          reply(Boom.badImplementation('error removing Donations'));
        });
  },
};

