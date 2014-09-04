/* GET all methods for seed. */
var asyn=require('async');
var Plan=require('../models/plan');
// create default subscriptions plans----------------------------
exports.plans = function(req, res){
	planFind=Plan.find().exec(function(err,allPlans){
		if(err){
			console.log(err);
		}
		else{
			// if no entries found in plan table
			if(allPlans.length==0){
				var plans = [
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
			  	var allplans=[];
			  	asyn.each(plans,function(eachPlan,callback){
			  		var planSave = new Plan(eachPlan);
					planSave.save(function (err, plansObj) {
						if (err) return console.error(err);
					  	else{
					  		res.json(plansObj);
					  		allplans.push(plansObj);
			  				callback();
					  	};
					});

			  	},function(err){
			  		res.json({message: "plans added successfully"});
			  	});

			}
			// if statement ends here
			else{
				res.json({message: "plans are already present"});
			}
		}
	});

  	
	
};
