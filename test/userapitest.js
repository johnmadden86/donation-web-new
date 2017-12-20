'use strict';

const assert = require('chai').assert;
// const request = require('sync-request');
const DonationService = require('./donation-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');
const uuid = require('uuid');

suite('User API tests', function () {

  let users = fixtures.users;
  let newUser = fixtures.newUser;

  const donationService = new DonationService(fixtures.donationService);

  beforeEach(function () {
    donationService.login(users[0]);
  });

  afterEach(function () {
    donationService.deleteAllUsers();
    donationService.logout();
  });

  test('get all users', function () {
    users.forEach(user => {
      donationService.createUser(user);
    });
    const returnedUsers = donationService.getUsers();
    returnedUsers.forEach(user => {
      delete user._id;
      delete user.__v;
    });
    assert.deepEqual(users, returnedUsers);
  });

  test('create a user', function () {
    const returnedUser = donationService.createUser(newUser);
    assert(_.some([returnedUser], newUser), 'returnedUser must be a superset of newUser');
    assert.isDefined(returnedUser._id);
    assert.isDefined(returnedUser.__v);
  });

  test('get user', function () {
    const u1 = donationService.createUser(newUser);
    const u2 = donationService.getUser(u1._id);
    assert.deepEqual(u1, u2);
  });

  test('get invalid user', function () {
    const id = uuid();
    const u = donationService.getUser(id);
    assert.isNull(u);
  });

  test('delete a user', function () {
    const c = donationService.createUser(newUser);
    assert(donationService.getUser(c._id) !== null);
    donationService.deleteOneUser(c._id);
    assert(donationService.getUser(c._id) === null);
  });


  test('get users detail', function () {
    for (let u of users) {
      donationService.createUser(u);
    }

    const allUsers = donationService.getUsers();
    for (let i = 0; i < users.length; i++) {
      assert(_.some([allUsers[i]], users[i]), 'returnedUser must be a superset of newUser');
    }
  });


  /*
  test('get all users empty', function () {
    for (let u of users) {
      donationService.createUser(u);
    }

    assert.isAbove(users.length, 0, 'test fixtures created');
    donationService.deleteAllUsers();
    const allUsers = donationService.getUsers();
    assert.equal(allUsers.length, 0);
  });
  */

});
