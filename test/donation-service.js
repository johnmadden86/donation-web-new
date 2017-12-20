'use strict';

// https://dry-cliffs-14757.herokuapp.com
const SyncHttpService = require('./sync-http-service');
const fixtures = require('./fixtures.json');

const baseUrl = fixtures.donationService;

class DonationService {

  constructor(baseUrl) {
    this.httpService = new SyncHttpService(baseUrl);
  }

  logout() {
    this.httpService.clearAuth();
  }

  createUser(newUser) {
    return this.httpService.post('/api/users', newUser);
  }

  login(user) {
    return this.httpService.setAuth('/api/users/authenticate', user);
    // return this.httpService.post('/api/users/authenticate', user);
  }

  getUser(id) {
    return this.httpService.get('/api/users/' + id);
  }

  getUsers() {
    return this.httpService.get('/api/users');
  }

  deleteOneUser(id) {
    return this.httpService.delete('/api/users/' + id);
  }

  deleteAllUsers() {
    return this.httpService.delete('/api/users');
  }

  getCandidate(id) {
    return this.httpService.get('/api/candidates/' + id);
  }

  getCandidates() {
    return this.httpService.get('/api/candidates');
  }

  createCandidate(newCandidate) {
    return this.httpService.post('/api/candidates', newCandidate);
  }

  deleteOneCandidate(id) {
    return this.httpService.delete('/api/candidates/' + id);
  }

  deleteAllCandidates() {
    return this.httpService.delete('/api/candidates');
  }

  makeDonation(id, donation) {
    return this.httpService.post('/api/candidates/' + id + '/donations', donation);
  }

  getDonation(id) {
    return this.httpService.get('/api/candidates/' + id + '/donations');
  }

  getAllDonations() {
    return this.httpService.get('/api/donations');
  }

  deleteAllDonations() {
    return this.httpService.delete('/api/donations');
  }

  deleteAllDonationsForCandidate(id) {
    return this.httpService.delete('/api/candidates/' + id + '/donations');
  }

  deleteOneDonationForCandidate(candidateId, donationId) {
    return this.httpService.delete('/api/candidates/' + candidateId + '/donations/' + donationId);
  }
}

module.exports = DonationService;
