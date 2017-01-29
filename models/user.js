var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;


var UserSchema = mongoose.Schema({

    local            : {
        email        : { type : String  },
        password     : String,
		    displayName: String
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : { type : String  },
        name         : String,
		    gender: String,
		    profilePic: String
    },
    twitter          : {
        id           : String,
        token        : String,
        name         : String,
		    gender: String,
		    profilePic: String,
        username     : { type : String  }
    },
    google           : {
        id           : String,
        token        : String,
        email        : { type : String  },
        name         : String,
		    gender: String,
		    profilePic: String
    }

});

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

/*
UserSchema.pre('save', function(next) {
  // get the current date
  this.is_deleted = false; //deleted false by default as of now
  var currentDate = new Date();
  
  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if date_added doesn't exist, add to that field
  if (!this.date_added)
    this.date_added = currentDate;

  next();
}); */

var User = mongoose.model('User', UserSchema);

module.exports = User;