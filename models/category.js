var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var categorySchema = new Schema({
  name: String,
  keywords:String,
  active: Boolean,
  url: String,
	created_at: Date,
	updated_at: Date
});


categorySchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  
  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

var Category = mongoose.model('Category', categorySchema, 'Category');

module.exports = Category;
