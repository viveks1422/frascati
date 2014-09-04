// load the things we need
var mongoose = require('mongoose');
// define the schema for our subscription model
var planSchema = mongoose.Schema({
    name    : { 
        type: String, 
        required: true, 
        trim: true 
    },
    type    : { 
        type: String, 
        required: true, 
        trim: true 
    },
    price   : { 
        type: String, 
        required: true, 
        trim: true 
    },
    created_at  : { 
        type: Date 
    }, 
    updated_at  : { 
        type: Date 
    }
});

planSchema.pre('save', function(next){
  now = new Date();
  this.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }
  next();
});
// create the model for subscription and expose it to our app
module.exports = mongoose.model('Plan', planSchema);

  