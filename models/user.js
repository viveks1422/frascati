// load the things we need
var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');
var Role=require('../models/role');
// to send email notification
var nodemailer = require('nodemailer');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local: {
        email: { 
            type: String 
        },
        password: { 
            type: String 
        }
    },
    facebook: {
        id: { 
            type: String 
        },
        token        : { 
            type: String 
        },
        email: { 
            type: String 
        },
        name: { 
            type: String 
        }
    },
    twitter: {
        id:{ 
            type: String 
        },
        token: { 
            type: String 
        },
        displayName: { 
            type: String 
        },
        username: { 
            type: String 
        }
    },
    google: {
        id: { 
            type: String 
        },
        token: { 
            type: String 
        },
        email: { 
            type: String 
        },
        name: { 
            type: String 
        }
    },
    name:{
        type:String
    },
    phone:{
        type:Number 
    },
    address:{
        type:String 
    },
    resetPasswordToken:{
        type: String
    },
    resetPasswordExpires:{
        type: String
    },
    role:{
        type: String
    }      

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
    if(typeof(this.role)=="undefined" || typeof(this.role)==""){
        this.role="user";
    }
    next();
});
// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);