var appconfig = require('../../config/appconfig');
var AttributeSchema = require('../../models/attribute');
var fs = require('fs');  
var path = require('path');
var mongoose = require('mongoose');

var a = appconfig.db.conn.model('Attribute', AttributeSchema);
var Attribute = new a;
var attributes = {
	getAttributes: function (req, res){
		Attribute.find({}, function(err, results) {
		  if (!err)
			{
			 	res.json( results );
			}else{
				console.log('Error while performing the query..check function attributes.getAttributes() for more details..', err );
			}
		});
	},
	getAttributeById: function(req, res){
		Attribute.findById( req.params.id, function(err, results) {
			if (!err)
			{
				res.json( results );
			}else{
				console.log('Error while performing the query..check function attributes.getAttributeById() for more details..', err );
			}
		});
	},
	addNewAttribute: function(req, res){
		if ( !req.body.attribute )
		{
			return;
		}
		var attribute = req.body.attribute;
		var NewAttribute = new Attribute( attribute );
		NewAttribute.save(function(err, results ) {
			if (!err)
			{
				res.json( results );
			}else{
				console.log('Error while performing the query..check function attributes.addNewAttribute() for more details..', err );
			}
		});
	},
	deleteAttribute: function(req, res){
		Attribute.findByIdAndRemove( req.params.id, function(err) {
			if (!err)
			{
				res.json({});
			}else{
				console.log('Error while performing the query..check function attributes.deleteAttribute() for more details..', err );
			}
		});
	},
	updateAttribute: function(req, res){
		if ( !req.body.attribute )
		{
			return;
		}
		var updatedAttribute = req.body.attribute;
		Attribute.findByIdAndUpdate( updatedAttribute._id, updatedAttribute, function(err, attribute) {
		  if (!err)
			{
				res.json( attribute );
			}else{
				console.log('Error while performing the query..check function attributes.updateAttribute() for more details..', err );
			}
		});
	}
};






module.exports = function(router){
	router.get('/attributes', function(req, res){
		attributes.getAttributes( req, res );
	});

	router.get('/attributes/:id', function(req, res){
		attributes.getAttributeById( req, res );
	});

	router.post('/attributes', function(req, res){
		attributes.addNewAttribute( req, res );
	});

	router.put('/attributes/:id', function(req, res){
		attributes.updateAttribute( req, res );
	});

	router.delete('/attributes/:id', function(req, res){
		attributes.deleteAttribute( req, res );
	});
	
};
