/* GET all methods for seed. */
var asyn=require('async');
var Subscription=require('../models/subscription');
exports.subscription = function(req, res){
  var subscription = [
	  	{
	  		name: "free",
	  		type: "monthly",
	  		price: 0

	  	},
	  	{
	  		name: "basic",
	  		type: "monthly",
	  		price: 200

	  	},
	  	{
	  		name: "commercial",
	  		type: "monthly",
	  		price: 500

	  	}
  	];

  	asyn.each(subscription,function(eachSubscription,callback){
  		var subscriptionSave = new Subscription(eachSubscription);
		subscriptionSave.save(function (err, subscriptions) {
			if (err) return console.error(err);
		  	else{
		  		res.json(subscriptions);
		  	};
		  	callback();
		});

  	},function(err){

  	});
	
};
