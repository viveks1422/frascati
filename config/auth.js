// config/auth.js
// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: '1504720869766777', // your App ID
		'clientSecret' 	: 'e420703c6df278992927f74e9bb15151', // your App Secret
		'callbackURL' 	: 'http://localhost:3000/auth/facebook/callback'
	},

	'twitterAuth' : {
		'consumerKey' 		: 'TbZq8GL9msY726ljx4T2CaMuf',
		'consumerSecret' 	: 'gfAN9Ny8bICdCAGl5yO3MEGQNKzEg8uYFR3K97iAWmhuOkhaTM',
		'callbackURL' 		: 'http://localhost:3000/auth/twitter/callback'
	},

	'googleAuth' : {
		'clientID' 		: '59257907553-pb74dntsnfrpl1o61lpqvunsni574lqv.apps.googleusercontent.com',
		'clientSecret' 	: 'fiaPHg-HHFzwzUIoWF25eQpj',
		'callbackURL' 	: 'http://localhost:8000/auth/google/callback'
	}

};