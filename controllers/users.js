/* GET home page. */
var User=require('../models/user');
exports.edit = function(req, res){
	if(req.user){
		User.findOne({_id:req.params.id})
		.exec(function(err,userObj){
			if(err){
				console.log(err);
			}
			else{
				res.render('users/edit', {user: userObj});
			}
		});
	}
	else{
		res.redirect('/login');
	}
  
};