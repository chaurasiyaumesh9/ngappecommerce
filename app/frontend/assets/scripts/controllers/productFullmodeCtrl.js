angular.module('sampleCartApp.controller').controller('productFullmodeCtrl', function($scope, $routeParams, $rootScope, productService, categoryService, $window ){
	$rootScope.fullmode = true;
	if ( $rootScope.activeSlide )
	{
		$scope.activeSlide = $rootScope.activeSlide;
	}else{
		$scope.activeSlide = 0;
	}
	if ( !$rootScope.activeProduct )
	{
		$scope.loading = false;
		if ( $routeParams.pid )
		{
			var pId = $routeParams.pid;
			$scope.loading = true;
			productService.getProductById( pId ).then( function( response ){
				$rootScope.activeProduct = response; //setting up the root scope to access full mode
				$scope.loading = false;
			} , function(errorMessage ){ 
				console.warn( errorMessage );
			});
		}
		/*if ( $routeParams.cid )
		{
			var cId = $routeParams.cid;
			$scope.loading = true;
			categoryService.getCategoryById( cId ).then( function( response ){
				$rootScope.activeCategory = response; //setting up the root scope to access full mode
				$scope.loading = false;
			} , function(errorMessage ){ 
				console.warn( errorMessage );
			});
		}*/
	}
	$scope.switchThumbView = function( index ){
		$scope.activeSlide = index;
		$rootScope.activeSlide = index; //setting up the root scope to access full mode
	}
	
});

