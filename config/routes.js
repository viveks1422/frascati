// including seed methods
// to send email notification
var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');
var User=require('../models/user');
var bcrypt   = require('bcrypt-nodejs');
// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'vivekshine22@gmail.com',
        pass: 'vteam123'
    }
});
module.exports = function(app, passport) {

// normal routes ===============================================================

	// LOGOUT ==============================
	app.get('/logout', function (req, res){
	  	req.logout();
	  	req.flash('success', 'Logout successfully');
		res.redirect('/');
	});
	// profile page route
	app.get('/profile', function(req, res) {
		if(!req.user){
			res.redirect('/');
		}else{
			res.render('profile', { user: req.user});
		}
	});

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================
	// locally --------------------------------
		// LOGIN ===============================
		app.get('/login', function(req, res){
			if(req.user){
				res.redirect('/profile');
			}
			else{
				res.render('login');
			}
		});
		// signup ===============================
		app.get('/signup', function(req, res){
			if(req.user){
				res.redirect('/profile');
			}
			else{
				res.render('signup');
			}
		});
		// process the login form
		app.post('/login', function(req, res, next) {
		    if (!req.body.email || !req.body.password) {
		    	req.flash('error', 'Email and Password required');
		    	res.redirect('/login');

		    }
		    passport.authenticate('local-login',{ failureRedirect: '/login' }, function(err, user, info) {
		        if (err) { 
		            return res.json(err);
		        }
		        if (user.error) {
		            req.flash('error', 'Wrong email and passowrd');
		            res.redirect('/login');
		        }
		        else{
		        	req.logIn(user, function(err) {
			            if (err) {
			                return res.json(err);
			            }
			            req.flash('success', 'Login successfully');
			            res.redirect('/profile');
			        });
		        }
		        
		    })(req, res);
		});

		// SIGNUP =================================
		// process the signup form
		app.post('/signup', function(req, res, next) {
		    if (!req.body.email || !req.body.password) {
		        return res.json({ error: 'Email and Password required' });
		    }
		    // password doen't match
		    if (req.body.password !==req.body.confirmpassword) {
		        req.flash('error', 'Password does not matching');
		        res.redirect('/signup');
		    }else{
		    	passport.authenticate('local-signup', function(err, user, info) {
			        
			        if (err) { 
			            return res.json(err);
			        }
			        if (user.error) {
			            req.flash('error',user.error);
				        res.redirect('/signup');
			        }
			        else{
			        	req.logIn(user, function(err) {
				            if (err) {
				                return res.json(err);
				            }
				            // setup e-mail data with unicode symbols
				            // registration email -------------------------------------
						    var mailOptions = {
						        from: 'Fabio ✔ <admin@eaemaquinas.com>', // sender address
						        to: user.local.email, // list of receivers
						        subject: 'Eaemaquinas :: Registation sucessfull ✔', // Subject line
						        text: 'Hello Customer', // plaintext body
						        html: '<b>Registration successful ✔</b>' // html body
						    };
						    // send mail with defined transport object
						    transporter.sendMail(mailOptions, function(error, info){
						        if(error){
						            console.log(error);
						        }else{
						            console.log('Message sent: ' + info.response);
						        }
						    });
				            req.flash('success', 'Signup successfully');
				            res.redirect('/profile');
				        });

			        }
			        
			    })(req, res);
		    }
		    
		});
	// reset password ---------------------------------------
	app.get('/forgot', function(req, res) {
	  res.render('forgot', {
	    user: req.user
	  });
	});
	// forgot password post--------------------------------------
	app.post('/forgot', function(req, res,next) {
	  async.waterfall([
	    function(done) {
	      crypto.randomBytes(20, function(err, buf) {
	        var token = buf.toString('hex');
	        done(err, token);
	      });
	    },
	    function(token, done) {
	      User.findOne({ 'local.email': req.body.email }, function(err, user) {
	        if (!user) {	
	          req.flash('error', 'No account with that email address exists.');
	          return res.redirect('/forgot');
	        }

	        user.resetPasswordToken = token;
	        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

	        user.save(function(err) {
	          done(err, token, user);
	        });
	      });
	    },
	    function(token, user, done) {
	      var mailOptions = {
	        to: user.local.email,
	        from: 'Fabio ✔ <admin@eaemaquinas.com>',
	        subject: 'Node.js Password Reset',
	        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
	          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
	          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
	          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
	      };
	      transporter.sendMail(mailOptions, function(err) {
	        req.flash('info', 'An e-mail has been sent to ' + user.local.email + ' with further instructions.');
	        done(err, 'done');
	      });
	    }
	  ], function(err) {
	    if (err) return next(err);
	    res.redirect('/forgot');
	  });
	});
	// reset route ---------------------------------------
	app.get('/reset/:token', function(req, res) {
	  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }).exec(function(err, user) {
	    if (!user) {
	      req.flash('error', 'Password reset token is invalid or has expired.');
	      return res.redirect('/forgot');
	    }
	    else{
	    	res.render('reset', {
		      user: req.user,
		      token: req.params.token
		    });
	    }
	    
	  });
	});
	// reset password post path ---------------------------------------
	app.post('/reset/:token', function(req, res) {
	  async.waterfall([
	    function(done) {
	      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
	        if (!user) {
	          req.flash('error', 'Password reset token is invalid or has expired.');
	          return res.redirect('back');
	        }

	        user.local.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null);
	        user.local.resetPasswordToken = undefined;
	        user.local.resetPasswordExpires = undefined;

	        user.save(function(err) {
	          req.logIn(user, function(err) {
	            done(err, user);
	          });
	        });
	      });
	    },
	    function(user, done) {
	      var mailOptions = {
	        to: user.local.email,
	        from: 'Fabio ✔ <admin@eaemaquinas.com>',
	        subject: 'Your password has been changed',
	        text: 'Hello,\n\n' +
	          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
	      };
	      transporter.sendMail(mailOptions, function(err) {
	        req.flash('success', 'Success! Your password has been changed.');
	        done(err);
	      });
	    }
	  ], function(err) {
	    res.redirect('/profile');
	  });
	});
	// facebook -------------------------------
		// send to facebook to do the authentication
		app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

		// handle the callback after facebook has authenticated the user
		app.get('/auth/facebook/callback',
			passport.authenticate('facebook', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

	// twitter --------------------------------
		// send to twitter to do the authentication
		app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

		// handle the callback after twitter has authenticated the user
		app.get('/auth/twitter/callback',
			passport.authenticate('twitter', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

	// google ---------------------------------
		// send to google to do the authentication
		app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

		// the callback after google has authenticated the user
		app.get('/auth/google/callback',
			passport.authenticate('google', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

	// locally --------------------------------
		app.post('/connect/local', function(req, res, next) {
		    if (!req.body.email || !req.body.password) {
		        return res.json({ error: 'Email and Password required' });
		    }
		    passport.authenticate('local-signup', function(err, user, info) {
		        if (err) { 
		            return res.json(err);
		        }
		        if (user.error) {
		            return res.json({ error: user.error });
		        }
		        req.logIn(user, function(err) {
		            if (err) {
		                return res.json(err);
		            }
		            return res.json({ redirect: '/profile' });
		        });
		    })(req, res);
		});

	// facebook -------------------------------

		// send to facebook to do the authentication
		app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

		// handle the callback after facebook has authorized the user
		app.get('/connect/facebook/callback',
			passport.authorize('facebook', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

	// twitter --------------------------------

		// send to twitter to do the authentication
		app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

		// handle the callback after twitter has authorized the user
		app.get('/connect/twitter/callback',
			passport.authorize('twitter', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));


	// google ---------------------------------
		// send to google to do the authentication
		app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

		// the callback after google has authorized the user
		app.get('/connect/google/callback',
			passport.authorize('google', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

	// local -----------------------------------
	app.get('/unlink/local', function(req, res) {
		var user            = req.user;
		user.local.email    = undefined;
		user.local.password = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	// facebook -------------------------------
	app.get('/unlink/facebook', function(req, res) {
		var user            = req.user;
		user.facebook.token = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	// twitter --------------------------------
	app.get('/unlink/twitter', function(req, res) {
		var user           = req.user;
		user.twitter.token = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	// google ---------------------------------
	app.get('/unlink/google', function(req, res) {
		var user          = req.user;
		user.google.token = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

    app.get('/api/userData', isLoggedInAjax, function(req, res) {
        return res.json(req.user);
    });

	// show the home page (will also have our login links)
	// app.get('*', function(req, res) {
	// 	res.render('profile', { user: req.user});
	// });

};
// route middleware to ensure user is logged in - ajax get
function isLoggedInAjax(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.json( { redirect: '/login' } );
    } else {
        next();
    }
}
// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}