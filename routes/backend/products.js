var appconfig = require('../../config/appconfig');
var ProductSchema = require('../../models/product');
var multer  =   require('multer');
var fs = require('fs');  
var path = require('path');
var mongoose = require('mongoose');
var cloudinary = require('cloudinary');

/*
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, '././uploads');
  },
  filename: function (req, file, callback) {
	 // console.log(req.params.id );
	  var pid = req.params.id;
    //callback(null, file.fieldname + '-' + Date.now());
	var datetimestamp = Date.now();
	var newFileName = file.fieldname + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
	var url = "../../uploads/" + newFileName;
	callback(null, newFileName );
  }
});
*/

var storage =   multer.diskStorage({
  filename: function (req, file, callback) {
	 // console.log(req.params.id );
	  var pid = req.params.id;
    //callback(null, file.fieldname + '-' + Date.now());
	var datetimestamp = Date.now();
	var newFileName = file.fieldname + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
	var url = "../../uploads/" + newFileName;
	callback(null, newFileName );
  }
});

console.log('appconfig.db.conn : ',appconfig.db.conn.model('Product'));
var Product = appconfig.db.conn.model('Product', ProductSchema);
//var Product = new ProductSchema;
var products = {
	getProductList: function (req, res){
		/*Product.find({ is_deleted: false }, function(err, results) {
		  if (!err)
			{
				res.json( results );
			}else{
				console.log('Error while performing the query..check function products.getProductList() for more details..', err );
			}
		});*/
		Product.find({ }, function(err, results) {
			//db.products.find({ categories: { $elemMatch: { selected: true, name: "Men" } } } ).pretty();
			//Product.find( { categories: { $elemMatch: { selected: true, name: "Women" } } } , function(err, results) {
		  if (!err)
			{
			  //console.log('results :',results.length);
				res.json( results );
			}else{
				console.log('Error while performing the query..check function products.getProductList() for more details..', err );
			}
		});

	},
	getProductById: function (req, res){
		var pid = req.params.id;

		Product.findById( pid, function(err, product ) {
			if (!err)
			{
				res.json( product );
			}else{
				console.log('Error while performing the query..check function products.getProductById() for more details..', err );
			}
		});
	},
	addNewProduct: function(req, res){
		//console.log('invoking addNewProduct....');
		if ( !req.body.product )
		{
			return;
		}
		var product = req.body.product ;		
		var NewProduct = new Product( product );
		//console.log('NewProduct :',NewProduct );
		
		NewProduct.save(function(err, product ) {
			if (!err)
			{
				res.json( product );
			}else{
				console.log('Error while performing the query..check function products.addNewProduct() for more details..', err );
			}
		});
		
	},
	uploadImages: function( req, res ){
		//if ( req.file )
		//{
			//console.log('req.files  :',req.file);
		//}
		
		var upload = multer({ storage : storage, inMemory: true }).single('productPic');
		upload( req, res, function(err) {
			if(err) {
				//console.log( err );
				return res.end("Error uploading file.",err);
			}else{
				var file = req.file;
				
				//console.log('file :',file);
				//console.log('data :',req.data);
				//var path = "../uploads/" + file.filename;
				//var img = {
				//	url:  path
				//}
				//res.json( {image: path } );
				//res.json( img );
				cloudinary.uploader.upload( file.path , function(result) { 
				  console.log(result) ;
				  //res.json( {image: result.secure_url } );
				  res.json( {image: result } );
				});
			}
			//res.redirect("/");
		});
		
	},
	updateProduct: function(req, res){
		//console.log('updateProduct');
		if ( !req.body.product )
		{
			return;
		}
		var updatedProduct = req.body.product ;
		var toBeDeleted = [];
		//console.log('updatedProduct :',updatedProduct );

		// Three step process to update the product -
		// 1. Find the images to be deleted
		// 2. Delete it from Upload directory
		// 3. Update DB and send back latest data as response

		function Step1(){
			for ( var i=0;i< updatedProduct['images'].length; i++ ){
				if ( updatedProduct['images'][i]['deleted'] ){	
					if ( updatedProduct['images'][i]['imgdata'] )
					{
						toBeDeleted.push( updatedProduct['images'][i]['imgdata']['public_id'] );
					}
					updatedProduct['images'].splice(i,1);
					Step1();
				}
			 }
		}
		Step1();
		Step2();
		
		function Step2(){
			//delete from either filesystem or cloud 
			/*deleteFiles( toBeDeleted, function( err ){
				if (err) {
					console.log(err);
				  } else {
					console.log('all files removed');
				  }
			});	*/

			toBeDeleted.forEach( function( publicid ){
				//console.log( 'publicid:', publicid);
				cloudinary.uploader.destroy( publicid, function(result) { console.log('removing... ',result) });
			})

		}
		// Step - 3
		Product.findByIdAndUpdate( updatedProduct._id, updatedProduct,{new: true}, function(err, product) {
		  if (!err)
			{
				res.json( product );
			}else{
				console.log('Error while performing the query..check function products.updateProduct() for more details..', err );
			}
		});

		function deleteFiles(files, callback){
		  var i = files.length;
		  files.forEach(function(filepath){
			fs.unlink(filepath, function(err) {
			  i--;
			  if (err) {
				callback(err);
				return;
			  } else if (i <= 0) {
				callback(null);
			  }
			});
		  });
		}
		
	},
	deleteProduct: function(req, res){
		Product.findByIdAndRemove( req.params.id, function(err) {
			if (!err)
			{
				res.json({});
			}else{
				console.log('Error while performing the query..check function products.deleteProduct() for more details..', err );
			}
		});
	}
};

module.exports =  function( router ){
	router.get('/products', function(req, res){
		products.getProductList(req, res);
	});
	router.get('/products/:id', function(req, res){
		products.getProductById(req, res);
	});

	router.put('/products/:id', function(req, res){
		products.updateProduct( req, res );
	});
	router.post('/products', function(req, res){
		products.addNewProduct( req, res );
	});
	router.post('/uploads', function(req, res, next ){
		products.uploadImages( req, res, next );
	});
	router.delete('/products/:id', function(req, res){
		products.deleteProduct( req, res );
	});
};
