var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var attributeSchema = new Schema({
	code: String,
	label:String,
	type: String, // to detect wheather text field or selection field to be provided 
	created_at: Date
});


attributeSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

var Attribute = mongoose.model('Attribute', attributeSchema, 'Attribute');
module.exports = Attribute;
