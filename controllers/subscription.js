/* GET home page. */
var Subscription=require('../models/subscription');
exports.index = function(req, res){
  Subscription.find()
	.limit(3)
	.exec(function(err,subscriptions){
		if(err){
			console.log(err);
		}
		else{
			res.render('subscription', {subscriptions: subscriptions});
		}
	});
};
