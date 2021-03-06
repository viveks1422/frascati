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
var passport = require('passport');
var flash = require('express-flash');

var routes = require('./controllers');
var plans = require('./controllers/plans.js');
var users = require('./controllers/users.js');
var seed = require('./controllers/seed.js');
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
app.set('views',__dirname + '/views');
app.set('view engine', 'ejs'); // so you can render('index')

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());

app.use(express.static(path.join(__dirname, 'public')));
// app.use(app.router);
// site routes ---------------------------------------------------------------------
app.get('/', routes.index);
app.get('/plans', plans.index);
// routes to insert seed entries into the database ----------------------------------------------
app.get('/seed_plans', seed.plans);
app.get('/seed_roles', seed.roles);
app.get('/seed_admin', seed.admin);
// user routes -----------------------------
app.get('/admin/users',users.index);
app.get('/admin/users/new',users.new);
app.post('/admin/users/create',users.create);
app.get('/admin/manage_roles',users.create);
app.get('/user/:id/edit',users.edit);
app.post('/user/:id/update',users.update);
app.get('/user/:id/delete',users.delete);

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
// // passport authentication code
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
// launch ======================================================================
module.exports = app;
