var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var setSchema = new Schema({
	name: String,
	attributes:{ type : Array , "default" : [] },
	created_at: Date,
	updated_at: Date
});


setSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
   // change the updated_at field to current date
  this.updated_at = currentDate;


  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

var AttributeSet = mongoose.model('AttributeSet', setSchema);

module.exports = setSchema;
