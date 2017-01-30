var appconfig = require('../../config/appconfig');
var CategorySchema = require('../../models/category');
var fs = require('fs');  
var path = require('path');
var mongoose = require('mongoose');


var Category = appconfig.db.conn.model('Category', CategorySchema);
//var Category = new CategorySchema;

var categories = {
	getCategories: function (req, res){
		Category.find({}, function(err, results) {
		  if (!err)
			{
			 	res.json( results );
			}else{
				console.log('Error while performing the query..check function categories.getCategories() for more details..', err );
			}
		});
	},
	getCategoryById: function(req, res){
		Category.findById( req.params.id, function(err, results) {
			if (!err)
			{
				res.json( results );
			}else{
				console.log('Error while performing the query..check function categories.getCategoryById() for more details..', err );
			}
		});
	},
	addNewCategory: function(req, res){
		if ( !req.body.category )
		{
			return;
		}
		var category = req.body.category;
		var NewCategory = new Category( category );
		NewCategory.save(function(err) {
			if (!err)
			{
				res.json({});
			}else{
				console.log('Error while performing the query..check function categories.addNewCategory() for more details..', err );
			}
		});
	},
	deleteCategory: function(req, res){
		Category.findByIdAndRemove( req.params.id, function(err) {
			if (!err)
			{
				res.json({});
			}else{
				console.log('Error while performing the query..check function categories.deleteCategory() for more details..', err );
			}
		});
	},
	updateCategory: function(req, res){
		if ( !req.body.category )
		{
			return;
		}
		var updatedCategory = req.body.category;
		Category.findByIdAndUpdate(updatedCategory._id, updatedCategory, function(err, category) {
		  if (!err)
			{
				res.json( category );
			}else{
				console.log('Error while performing the query..check function categories.updateCategory() for more details..', err );
			}
		});
	}
};






module.exports = function(router){
	router.get('/categories', function(req, res){
		categories.getCategories( req, res );
	});

	router.get('/categories/:id', function(req, res){
		categories.getCategoryById( req, res );
	});

	router.put('/categories/:id', function(req, res){
		categories.updateCategory( req, res );
	});

	router.post('/categories', function(req, res){
		categories.addNewCategory( req, res );
	});

	router.delete('/categories/:id', function(req, res){
		categories.deleteCategory( req, res );
	});

};
