/* GET home page. */
var Plan=require('../models/plan');
exports.index = function(req, res){
  Plan.find()
	.limit(3)
	.exec(function(err,plans){
		if(err){
			console.log(err);
		}
		else{
			res.render('plans', {plans: plans});
		}
	});
};
