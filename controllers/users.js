/* GET home page. */
var User=require('../models/user');
// user edit method
exports.edit = function(req, res){
	if((req.user) && (req.user.role=="admin"|| req.user._id == req.params.id)){
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
// user update method
exports.update = function(req, res){
	if((req.user) && (req.user.role=="admin"|| req.user._id == req.params.id)){
		User.update({_id:req.params.id},req.body)
		.exec(function(err,userObj){
			if(err){
				console.log(err);
				req.flash('erro',err);
				res.redirect('/profile');
			}
			else{
				req.flash('success','Profile successfully updated');
				res.redirect('/profile');
			}
		});
	}
	else{
		res.redirect('/login');
	}
  
};
// user list method
exports.index = function(req, res){
	if((req.user) && (req.user.role=="admin")){
		User.find()
		.exec(function(err,userObj){
			if(err){
				console.log(err);
				req.flash('erro',err);
				res.redirect('/profile');
			}
			else{
				res.render('users/index',{user:req.user,users:userObj});
			}
		});
	}
	else{
		res.redirect('/login');
	}
  
};
// user destroy method
exports.delete = function(req, res){
	if((req.user) && (req.user.role=="admin"|| req.user._id == req.params.id)){
		User.remove({_id:req.params.id})
		.exec(function(err,userObj){
			if(err){
				console.log(err);
				req.flash('erro',err);
				res.redirect('/profile');
			}
			else{
				req.flash('success','User deleted successfully');
				res.redirect('/profile');
			}
		});
	}
	else{
		res.redirect('/login');
	}
  
};
