/* PACKAGES */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const app = module.exports = express();
const MovieCtrl = require('./server/MovieCtrl');
const config = require('./config');
const mongoClient = require('mongodb').MongoClient;
const FacebookCtrl = require('./server/FacebookCtrl');
const mongoURI = config.mongoURI + '/favmovies';
const passport = require('passport');
const FacebookStrategy = require('passport-facebook');

/* APP */
app.set('port', (process.env.PORT || 3000));
app.use(bodyParser.json({limit: '50mb'}));
app.use(cors());
app.use(express.static(__dirname + '/build'));
app.use(session({
  secret: config.secret,
  resave: true,
  saveUninitialized: true,
  cookie: {expires: new Date(2147483647000)}
}));
app.use(passport.initialize());
app.use(passport.session());

/* PASSPORT */// -- facebook
passport.use('facebook', new FacebookStrategy(
  config.facebook, FacebookCtrl.authenticate
));

/* PASSPORT */// -- serialize/deserialize
passport.serializeUser((user, done) => {done(null, user);});
passport.deserializeUser((user, done) => {done(null, user);});

app.get("/auth/facebook", passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect : '/',
  failureRedirect : '/login'
}));

app.get('/auth/me', isLoggedIn, function(req, res) {
  res.send(req.user);
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
});

app.get('/movies', MovieCtrl.getMovies);

app.listen(app.get('port'), () => {
  console.log('localhost:' + app.get('port'));
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}
