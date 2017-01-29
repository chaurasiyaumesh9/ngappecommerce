var express    = require('express')   ;
var router= express.Router();
var appconfig = require('../../config/appconfig');


var productsRoute = require('./products')( router );
var categoriesRoute = require('./categories')( router);
var attributesRoute = require('./attributes')( router);
var attributeSetsRoute = require('./attributeSets')( router);


module.exports = router;
