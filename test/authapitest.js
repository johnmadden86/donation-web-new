'use strict';

const assert = require('chai').assert;
const DonationService = require('./donation-service');
const fixtures = require('./fixtures.json');
const utils = require('../app/api/utils');

suite('Auth API tests', function () {

  let users = fixtures.users;
  let newUser = fixtures.newUser;

  const donationService = new DonationService(fixtures.donationService);

  beforeEach(function () {
    donationService.deleteAllUsers();
  });

  afterEach(function () {
    donationService.deleteAllUsers();
  });

  test('authenticate', function () {
    const returnedUser = donationService.createUser(newUser);
    const response = donationService.authenticate(newUser);
    assert(response.success);
    assert.isDefined(response.token);
  });

  test('verify Token', function () {
    const returnedUser = donationService.createUser(newUser);
    const response = donationService.authenticate(newUser);

    const userInfo = utils.decodeToken(response.token);
    assert.equal(userInfo.email, returnedUser.email);
    assert.equal(userInfo.userId, returnedUser._id);
  });

  test('login-logout', function () {
    let returnedCandidates = donationService.getCandidates();
    assert.isNull(returnedCandidates);

    const response = donationService.login(users[0]);
    returnedCandidates = donationService.getCandidates();
    assert.isNotNull(returnedCandidates);

    donationService.logout();
    returnedCandidates = donationService.getCandidates();
    assert.isNull(returnedCandidates);
  });
});
