const UsersApi = require('./app/api/usersapi');
const CandidatesApi = require('./app/api/candidatesapi');
const DonationsApi = require('./app/api/donationsapi');

module.exports = [

  { method: 'POST', path: '/api/users', config: UsersApi.createNewUser },
  { method: 'POST', path: '/api/users/authenticate', config: UsersApi.authenticateUser },
  { method: 'GET', path: '/api/users/{id}', config: UsersApi.getOneUser },
  { method: 'GET', path: '/api/users', config: UsersApi.getAllUsers },
  { method: 'DELETE', path: '/api/users/{id}', config: UsersApi.deleteOneUser },
  { method: 'DELETE', path: '/api/users', config: UsersApi.deleteAllUsers },

  { method: 'POST', path: '/api/candidates', config: CandidatesApi.createNewCandidate },
  { method: 'GET', path: '/api/candidates/{id}', config: CandidatesApi.getOneCandidate },
  { method: 'GET', path: '/api/candidates', config: CandidatesApi.getAllCandidates },
  { method: 'DELETE', path: '/api/candidates/{id}', config: CandidatesApi.deleteOneCandidate },
  { method: 'DELETE', path: '/api/candidates', config: CandidatesApi.deleteAllCandidates },

  { method: 'POST', path: '/api/candidates/{id}/donations', config: DonationsApi.makeDonation },
  { method: 'GET', path: '/api/donations', config: DonationsApi.findAllDonations },
  { method: 'GET', path: '/api/candidates/{id}/donations', config: DonationsApi.findAllDonationsForCandidate },
  { method: 'DELETE', path: '/api/donations', config: DonationsApi.deleteAllDonations },
  { method: 'DELETE', path: '/api/candidates/{id}/donations', config: DonationsApi.deleteAllDonationsForCandidate },
  { method: 'DELETE', path: '/api/candidates/{candidateId}/donations/{donationId}', config: DonationsApi.deleteOneDonationForCandidate },

];

