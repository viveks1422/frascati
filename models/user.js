// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Role=require('../models/role');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    role : { type: String, ref: 'Role' }

});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};
// callback to save use role into the user
userSchema.pre('save', function(next){
  // to find user role 
  Role.find().where({name: "user"}).limit(1).exec(function(err,roles){
    if(err){
        console.log(err);
    }
    else{
        this.role = roles.id;
    }
    next();
  });
  
});
// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);