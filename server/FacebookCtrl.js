const config = require('../config');
const mongoClient = require('mongodb').MongoClient;
const mongoURI = config.mongoURI + '/favmovies';

module.exports = {
  authenticate: (token, refreshToken, profile, done) => {
    mongoClient.connect(mongoURI, (err, db) => {
      var collection = db.collection('users');
      collection.findOne({'id': profile.id}, (err, result) => {
        if (!result) {
          collection.insert(profile, (err, result) => {
            if (err) {
              return done(err, null);
            } else {
              return done(err, result);
            }
          });
        } else {
          return done(err, result);
        }
      });
    });
  }
};
