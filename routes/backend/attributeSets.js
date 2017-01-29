var appconfig = require('../../config/appconfig');
var AttributeSetSchema = require('../../models/attributeSet');
var fs = require('fs');  
var path = require('path');
var mongoose = require('mongoose');

var as = appconfig.db.conn.model('AttributeSet', AttributeSetSchema);
var AttributeSet = new as;
var attributeSet= {
	getAll: function (req, res){
		AttributeSet.find({}, function(err, results) {
		  if (!err)
			{
			 	res.json( results );
			}else{
				console.log('Error while performing the query..check function attributeSet.getAll() for more details..', err );
			}
		});
	},
	getOneById: function(req, res){
		AttributeSet.findById( req.params.id, function(err, results) {
			if (!err)
			{
				res.json( results );
			}else{
				console.log('Error while performing the query..check function attributeSet.getOneById() for more details..', err );
			}
		});
	},
	addNew: function(req, res){
		if ( !req.body.attributeSet )
		{
			return;
		}
		var attributeSet = req.body.attributeSet;
		var NewAttributeSet = new AttributeSet( attributeSet );
		NewAttributeSet.save(function(err, results ) {
			if (!err)
			{
				res.json( results );
			}else{
				console.log('Error while performing the query..check function attributeSet.addNew() for more details..', err );
			}
		});
	},
	deleteOneById: function(req, res){
		AttributeSet.findByIdAndRemove( req.params.id, function(err) {
			if (!err)
			{
				res.json({});
			}else{
				console.log('Error while performing the query..check function attributeSet.deleteOneById() for more details..', err );
			}
		});
	},
	updateOneById: function(req, res){
		if ( !req.body.attributeSet )
		{
			return;
		}
		var updatedAttributeSet = req.body.attributeSet;
		AttributeSet.findByIdAndUpdate( updatedAttributeSet._id, updatedAttributeSet, function(err, updatedOne ) {
		  if (!err)
			{
				res.json( updatedOne );
			}else{
				console.log('Error while performing the query..check function attributeSet.updateOneById() for more details..', err );
			}
		});
	}
};






module.exports = function(router){
	router.get('/attribute-sets', function(req, res){
		attributeSet.getAll( req, res );
	});

	router.post('/attribute-sets', function(req, res){
		attributeSet.addNew( req, res );
	});

	router.get('/attribute-sets/:id', function(req, res){
		attributeSet.getOneById( req, res );
	});

	router.put('/attribute-sets/:id', function(req, res){
		attributeSet.updateOneById( req, res );
	});

	router.delete('/attribute-sets/:id', function(req, res){
		attributeSet.deleteOneById( req, res );
	});
	
};
