'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let dbURI = 'mongodb://localhost/donation';

//dbURI = 'mongodb://mytweetwebusername:mytweetwebpassword@ds245805.mlab.com:45805/mytweetweb';
dbURI = 'mongodb://donationuser:password@ds251435.mlab.com:51435/donation';

// heroku config:set NODE_ENV="production"
// heroku config:set MONGOLAB_URI=mongodb://donationuser:password@ds251435.mlab.com:51435/donation
// username: donationuser
// password: password
// address: ds251435.mlab.com
// port: 51435
// database: donation
// 20077700@mail.wit.ie
// YA8W48JrVRq4
process.env.NODE_ENV = 'production';
process.env.MONGOLAB_URI = 'mongodb://donationuser:password@ds251435.mlab.com:51435/donation';
console.log('process.env.NODE_ENV: '  + process.env.NODE_ENV);
console.log('process.env.MONGOLAB_URI: '  + process.env.MONGOLAB_URI);

if (process.env.NODE_ENV === 'production') {
  dbURI = process.env.MONGOLAB_URI;
}

mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error', function (err) {
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});

mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
  if (process.env.NODE_ENV !== 'production') {
    const seeder = require('mongoose-seeder');
    const data = require('./data.json');
    const Donation = require('./donation');
    const User = require('./user');
    const Candidate = require('./candidate.js');
    seeder.seed(data, { dropDatabase: false, dropCollections: true }).then(dbData => {
      console.log('preloading Test Data');
      console.log(dbData);
    }).catch(err => {
      console.log(error);
    });
  }
});
