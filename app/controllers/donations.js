'use strict';

const Donation = require('../models/donation');
const User = require('../models/user');
const Candidate = require('../models/candidate');
const Joi = require('joi');
const os = require('os');


function getLoggedInUser(request) {
  const userId = request.auth.credentials.loggedInUser;
  return User.findOne({ _id: userId });
}

exports.home = {

  handler: function (request, reply) {
    Candidate.find({}).then(candidates => {
      reply.view('home', {
        title: 'Make a Donation',
        candidates: candidates,
        lbserver: os.hostname(),
      });
    }).catch(err => {
      reply.redirect('/');
    });
  },

};

exports.donate = {

  validate: {

    payload: {
      amount: Joi.string().required(),
      method: Joi.string().required(),
      candidate: Joi.string().required(),
    },

    failAction: function (request, reply, source, error) {
      Candidate.find({}).then(candidates => {
        reply.view('home', {
          title: 'Donation error',
          errors: error.data.details,
          candidates: candidates,
        }).code(400);
      });
    },

  },

  handler: function (request, reply) {
    let data;
    getLoggedInUser(request)
        .then(user => {
          data = request.payload;
          data.donor = user;
          const rawCandidate = request.payload.candidate.split(',');
          return Candidate.findOne({ lastName: rawCandidate[0], firstName: rawCandidate[1] });
        })
        .then(candidate => {
          data.candidate = candidate;
          new Donation(data).save();
        })
        .then(newDonation => {
          reply.redirect('/report');
        })
        .catch(err => {
          reply.redirect('/');
        });
  },
};

exports.report = {

  handler: function (request, reply) {
    Donation.find({})
        .populate('donor')
        .populate('candidate')
        .then(allDonations => {
          let totalDonated = 0;
          allDonations.forEach(donation =>
              totalDonated += donation.amount
          );

          reply.view('report', {
            title: 'Donations to Date',
            donations: allDonations,
            totalDonated: totalDonated,
            lbserver: os.hostname(),
          });
        })
        .catch(err => {
          reply.redirect('/');
        });
  },

};
