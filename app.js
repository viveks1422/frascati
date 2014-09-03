var express = require('express');
var engine = require('ejs-locals');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;

var routes = require('./routes');
var users = require('./routes/user');
var auth = require('./routes/auth');

var app = express();
// -------------------------- database connection -----------------
var database = require('./config/database.js')
// configuration ===============================================================
mongoose.connect(database.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration
// -------------------------- database connection -----------------
// view engine setup
// use ejs-locals for all ejs templates:
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

app.get('/', routes.index);
app.get('/users', users.list);
// routes for sigin signup for authentication
// Passport session setup.
passport.serializeUser(function(user, done) {
  console.log("serializing " + user.username);
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  console.log("deserializing " + obj);
  done(null, obj);
});
// passport authentication code
passport.use(new FacebookStrategy({
    clientID: "1504720869766777",
    clientSecret: "e420703c6df278992927f74e9bb15151",
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // User.findOrCreate(..., function(err, user) {
    if (!profile) { return done(err); }
    done(null, profile);

  }
));
// passport authentication code
// app.get('/login',auth.login);
// app.get('/signup',auth.signup);
// app.get('/auth/facebook', passport.authenticate('facebook'));

// app.get('/auth/facebook/callback', 
//   passport.authenticate('facebook', { successRedirect: '/',
//                                       failureRedirect: '/login',title: 'Login' }));
// routes ======================================================================
require('./config/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport



/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
