angular.module('sampleCartAdmin.directives')
.directive('product', function(){
	// a directive to add new product OR edit/show existing product
	// show or collect product data 
	return {
		restrict: "EA",
		replace: true,
		templateUrl:"./templates/product.html"
	}
});