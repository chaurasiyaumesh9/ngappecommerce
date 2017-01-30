var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var ProductSchema = new Schema({
	name: String,
	title: String,
	SKU: String,
	price: Number,
	special_price: Number,
	quantity: Number,
	in_stock: Boolean,
	description: String,
	short_description: String,
	date_added: Date,
	valid_from: Date,
	valid_till: Date,
	is_deleted: Boolean,
	discontinued: Boolean,
	updated_at: Date,
	categories:{ type : Array , "default" : [] },
	images:{ type : Array , "default" : [] },
	attribute_sets:{ type : Array , "default" : [] }
});


ProductSchema.pre('save', function(next) {
  // get the current date
  this.is_deleted = false; //deleted false by default as of now
  var currentDate = new Date();
  
  // change the updated_at field to current date
  this.updated_at = currentDate;
 	
  // if date_added doesn't exist, add to that field
  if (!this.date_added)
    this.date_added = currentDate;

  next();
});


//console.log('ProductSchema : ',ProductSchema);
var Product = mongoose.model('Product', ProductSchema, 'Product');
//console.log('Product Model : ',Product);
module.exports = Product;
