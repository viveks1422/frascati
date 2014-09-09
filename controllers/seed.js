/* GET all methods for seed. */
var asyn=require('async');
var Plan=require('../models/plan');
var Role=require('../models/role');
var User=require('../models/user');
var bcrypt   = require('bcrypt-nodejs');
// create default subscriptions plans----------------------------
exports.plans = function(req, res){
	Plan.find().exec(function(err,allPlans){
		if(err){
			console.log(err);
		}
		else{
			// if no entries present in plan table
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
			  	asyn.each(plans,function(eachPlan,callback){
			  		var planSave = new Plan(eachPlan);
					planSave.save(function (err, plansObj) {
						if (err) return console.error(err);
					  	else{
			  				callback();
					  	};
					});

			  	},function(err){
			  		res.json({message: "Plans added successfully"});
			  	});

			}
			// if statement ends here
			else{
				res.json({message: "Plans are already present"});
			}
		}
	});
};
// create default user roles----------------------------
exports.roles = function(req, res){
	Role.find().exec(function(err,allRoles){
		if(err){
			console.log(err);
		}
		else{
			// if no entries present in role table
			if(allRoles.length==0){
				var roles = [
				  	{
				  		name: "user"
				  	},
				  	{
				  		name: "admin"
				  	}
			  	];
			  	asyn.each(roles,function(eachRole,callback){
			  		var roleSave = new Role(eachRole);
					roleSave.save(function (err, roleObj) {
						if (err) return console.error(err);
					  	else{

			  				callback();
					  	};
					});

			  	},function(err){
			  		res.json({message: "Roles added successfully"});
			  	});

			}
			else{
				res.json({message: "Roles are already present"});
			}
		}
		// conditional statements ends here
	});
};
// create default admin----------------------------
exports.admin = function(req, res){
	User.findOne({role:'admin'}).exec(function(err,adminUser){
		if(err){
			console.log(err);
		}
		else{
			// if no entries present in role table
			if(adminUser==null){
				var adminPass=bcrypt.hashSync('admin123', bcrypt.genSaltSync(8), null);
				var admin = {
		  		local: {
		  			email:'fabio@mailinator.com',
		  			password:adminPass
		  		},
		  		username: "fabio",
		  		role: "admin",
		  		phone: "",
		  		address: ""	
				}
				// saving admin role into the database
				var adminSave = new User(admin);
				adminSave.save(function (err, adminObj) {
					if (err) return console.error(err);
				  	else{

		  				console.log("Admin added successfully");
		  				res.json({message: "Admin added successfully"});
				  	};
				});

			}
			else{
				res.json({message: "Admin is already present"});
			}
		}
		// conditional statements ends here
	});
};
