angular.module('sampleCartApp.controller').controller('productListingCtrl', function( $scope, $rootScope, ngProgressFactory, $routeParams, productService, categoryService, cartService, $location ){
	$scope.message = "Product Listing Page!"; //just for testing purpose
	$scope.layout = 'grid';
	$scope.filters = [
		{
			caption: "New",
			field: "date_added",
			reverse: true
		},
		{
			caption: "Price: Heigh To Low",
			field: "special_price || price",
			reverse: true
		},
		{
			caption: "Price: Low To Heigh",
			field: "special_price || price",
			reverse: false
		}	
	];


	$rootScope.progressbar = ngProgressFactory.createInstance();
	$rootScope.progressbar.start();
	$scope.loading = true;
	$scope.defaultFilter = {
		caption: "Look Up By",
		field: "SKU",
		reverse: false
	};


	if ( $routeParams.cid )
	{
		//var cUrl = $routeParams.curl; // check if in edit/view mode
		var cId = $routeParams.cid;
		$scope.activeCategory = $scope.$parent.activeCategory;;
		$scope.loading = true;
		categoryService.getCategoryById( cId ).then( function( response ){
			//console.log('getCategoryById response :', response);
			$scope.activeCategory = response;
		} , function(errorMessage ){ 
			console.warn( errorMessage );
		});
		
		productService.getProductsByCategory( cId ).then( function( response ){
			//console.log('response :',response);
			
			$scope.loading = false;
			$rootScope.progressbar.set(100);
			$rootScope.progressbar.complete();
			$scope.productList = response;
			//$rootScope.progressbar.reset();
		} , function(errorMessage ){ 
			console.warn( errorMessage );
		});
	}else{
		getTop100Products();
	}
	$scope.setActiveFilter = function( f ){
		$scope.activeFilter = f;
		$scope.sortType = f.field;
		$scope.sortReverse = f.reverse;
	}
	$scope.resetFilter = function(){
		$scope.activeFilter = {};
		$scope.sortType = "";
		$scope.sortReverse = "";
		$scope.setActiveFilter( $scope.defaultFilter );
	}
	$scope.setActiveFilter( $scope.defaultFilter ); //setting up default filter

	function getTop100Products(){

		productService.getAllProducts( ).then( function( response ){
			//console.log('response :',response);
			$scope.listingTitle = "TOP 50 PRODUCT(S) FOR YOU";
			$scope.productList = response;
			$scope.loading = false;
		} , function(errorMessage ){ 
			console.warn( errorMessage );
		});
	}

	function getCategories(){
		categoryService.getActiveCategories().then( function( response ){
			$scope.categories = response;
		} , function(errorMessage ){ 
			console.warn( errorMessage );
		});
	}
	$scope.addToCart = function( product ){
		//console.log('addToCart product :',product);
		cartService.addToCart( product ).then( function(response){
			//console.log('addToCart response :',response);
			$rootScope.cart = response.cart;
			$rootScope.alerts.push({type:"success", msg:  response.message });
			$location.url('/cart');

		}, function(errorMessage){
			console.log('addToCart errorMessage : ',errorMessage);
		});
	}
	getCategories();
	$scope.setActiveCategory = function( category ){
		$scope.activeCategory = category;
		//$scope.loading = true;
	}
		
});
