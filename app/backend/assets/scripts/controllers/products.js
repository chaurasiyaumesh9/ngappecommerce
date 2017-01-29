angular.module('sampleCartAdmin.controllers')
.controller('productsCtrl', function($scope,$rootScope, $routeParams, productService, categoryService, attributeSetsService, $timeout, common,Upload, $http, $q){
	$scope.message = "Manage Your Products";
	$rootScope.alerts = [];
	$scope.currentPage = 1;
	$scope.pageSize = 5;

	$scope.showDelete = false;
	$scope.deleteCount = 0;

	$scope.sortType     = 'date_added'; // set the default sort type
	$scope.sortReverse  = true;  // set the default sort order
	$scope.bool = [];
	$scope.loadDefaults = function(){
		//console.log('loadDefaults');
		$scope.product = { in_stock: false, categories:[], attribute_sets:[] };
		$scope.bool = [];
	}
	$scope.getProductCategories = getProductCategories; //providing access to scope view
	$scope.pageChangeHandler = function(num) {};
	getAllCategories();
	$scope.loadDefaults();

	if ( $routeParams.id )
	{
		productID = $routeParams.id; // check if in edit/view mode
		$scope.loading = true;
		productService.getProductById( productID ).then( function( response ){
			//console.log('getProductById :',response);
			$scope.product = response;
			$scope.loading = false;
			$scope.product.valid_from = common.stringToDate( $scope.product.valid_from );
			$scope.product.valid_till  = common.stringToDate( $scope.product.valid_till );
		} , function(errorMessage ){ 
			console.warn( errorMessage );
		});
	}
	
	$scope.addNewProduct = function( product ){	
		$scope.loading = true;
		$scope.uploadFiles( product ).then( function( response ){
			//console.log('uploaded all!',product);
			productService.addNewProduct( product ).then( function( response ){
				//console.log('added to DB!');
				$scope.loading = false;
				$rootScope.alerts.push({type:"success", msg:  "New Product Added Successfully!" });
				//$timeout(function() { $scope.addSuccess = false;}, 3000); //need to make it generic for all the messages
				$scope.loadDefaults(); //re-initalize my page by loading defaults
				$scope.getProductCategories(); //re-initalize all the empty categories
			}, function( errorMessage ){
				console.warn( errorMessage );
			});
		});		
	}

	$scope.updateProduct = function( product ){
		//console.log('updateProduct :',product);
		$scope.loading = true;
		product.updated_at = new Date();
		$scope.uploadFiles( product ).then( function( response ){
			//console.log('uploaded all!',product);
			productService.updateProduct( product ).then( function( response ){
				//console.log('updated to DB!');
				//console.log('updateProduct response :',response);
				$scope.loading = false;
				$scope.product = response;
				$scope.product.valid_from = common.stringToDate( $scope.product.valid_from );
				$scope.product.valid_till  = common.stringToDate( $scope.product.valid_till );
				//$scope.updateSuccess = true;
				$rootScope.alerts.push({type:"success", msg:  "Product Updated Successfully!" });
				//$timeout(function() { $scope.updateSuccess = false;}, 3000); //need to make it generic for all the messages
			}, function( errorMessage ){
				console.warn( errorMessage );
			});
		});
		//$scope.uploadFiles( product );
	}

	$scope.deleteProduct = function( product ){
		$scope.loading = true;
		productService.deleteProduct( product._id ).then( function( response ){
			$scope.loading = true;
			$rootScope.alerts.push({type:"danger", msg:  "Product Deleted Successfully!" });
			//$timeout(function() { $scope.deletionSuccess = false;}, 3000); //need to make it generic for all the messages
		}, function( errorMessage ){
			console.warn( errorMessage );
		});
	}

	$scope.revertAddingProduct = function( product ){
		//console.log('revertAddingProduct :', product);
	}
	getProductList();

	function getProductList(){
		$scope.loading = true;
		productService.getProductList().then( function( response ){
			$scope.productList = response;
			$scope.loading = false;
		}, function( errorMessage ){
			console.warn( errorMessage );
		});
	}

	function getProductCategories(){
		categoryService.getAllCategories().then( function( response ){
			$scope.product.categories = response;
		}, function( errorMessage ){
			console.warn( errorMessage );
		});
	}

	function getAllCategories(){
		categoryService.getAllCategories().then( function( response ){
			$scope.categories = response;
		}, function( errorMessage ){
			console.warn( errorMessage );
		});
	}

	$scope.removeProductImage = function( arr, image ){
		// logic needs to be redefined as - remove images from uploads directory if images exist in DB.
		var pos = arr.indexOf( image );
		//console.log('pos :',pos);
		if ( pos != -1 )
		{
			//arr.splice( pos, 1);
			//console.log(arr[pos]);
			arr[pos]['deleted'] = true;
		}
	}

	$scope.uploadFiles = function( product ){
		var requests = [];
		if ( !$scope.product['toBeUploaded'] )
		{
			$scope.product['toBeUploaded'] = [];
		}
		if ( !product['images'])
		{
			product['images'] = [];
		}
		for ( var i=0; i<$scope.product['toBeUploaded'].length ;i++ )
		{
			if ( !$scope.product['toBeUploaded'][i]['deleted'])
			{
				var file = $scope.product['toBeUploaded'][i];
				//console.log('file :',file);
				//console.log('string :',JSON.parse( JSON.stringify( file ) ));
				requests[i] = Upload.upload({ 
					method: "post",
					url: "/admin/uploads",
					data: { productPic: file }
				}).then(function (response) {
					//console.log('response :',response);
					var objectRole = response.config.data['productPic']['role'];
					//var objectUrl = response.data['image']['url'];
					//var objectUrl = response.data['image'];
					var imgData = response.data['image'];
					//console.log('objectUrl :',objectUrl);
					//var o = { role : objectRole, url: objectUrl};
					var o = { role : objectRole, imgdata: imgData};
					//console.log('o :',o);
					product['images'].push( o );
					$timeout(function () {
						file.result = response.data;
					});
				}, function (response) {
					if (response.status > 0)
						$scope.errorMsg = response.status + ': ' + response.data;
				}, function (evt) {
					file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
				});;
			}
		}
		return ( $q.all( requests ).then( handleSuccess ) );

		function handleSuccess(){
			$scope.product['toBeUploaded'] = [];
		}
	}

	$scope.showFiles = function(files, errFiles) {
		if ( !$scope.product['toBeUploaded'] )
		{
			$scope.product['toBeUploaded'] = [];
		}
		for ( var i=0;i<files.length ;i++ )
		{
			$scope.product['toBeUploaded'].push( files[i] );
		}
        $scope.product.invalidImages =  errFiles;
    }
	$scope.deleteProducts = function(){
		var checked = getCheckedProducts();
		var multipleReq = [];
		for ( var i=0; i<checked.length ;i++ )
		{ 
			multipleReq.push( productService.deleteProduct( checked[i]._id ) );
		}
		$scope.deleteCount = multipleReq.length;
		$q.all( multipleReq ).then( function( response ){
			getProductList();
			$rootScope.alerts.push({type:"danger", msg:  "Product(s) Deleted Successfully!" });
		}, function( errorMessage ){
			console.warn( errorMessage );
		});
	}

	 $scope.checkAll = function () {
		angular.forEach($scope.productList, function ( product ) {
			product.selected = $scope.selectAll;
		});
		 toggleDeleteButton();
	};

	 $scope.checkIndividual = function ( ) {
		 if ( getCheckedProducts().length < $scope.productList.length )
		 {
			$scope.selectAll = false;
		 }
		toggleDeleteButton();		
	};
	function toggleDeleteButton(){
		if ( getCheckedProducts().length >0 )
		 {
			$scope.showDelete = true;
		 }else{
			$scope.showDelete = false;
		 }
	}

	function getCheckedProducts(){
		var arr = [];
		for (var i=0; i<$scope.productList.length ;i++ )
		{
			if ( $scope.productList[i].selected )
			{
				arr.push( $scope.productList[i] );
			}	
		}
		return arr;
	}

	$scope.loadCategoryProducts = function( category ){
		$scope.currentCategory = category;
		//console.log('$scope.productsCategory :',$scope.currentCategory);
	}

	$scope.getAllSets = function( ){
		//$scope.loading = true;
		var request = attributeSetsService.getAll( );
		function errorCallback( errorMessage ) {
			console.warn( errorMessage );
		}
		function successCallback( response ) {
			//$scope.loading = false;
			$scope.availableAttributeSets = response;
			return( response.data );
		}
		return( request.then( successCallback, errorCallback ) );
	}

	getAllSets();

	function getAllSets(){
		$scope.getAllSets();
	}

	$scope.changeMethod = function( index, set ){
		//console.log('changeMethod',$scope.bool[index]);
		if ( $scope.bool[index] )
		{
			$scope.product.attribute_sets.push( set ) 
		}else{
			var i = $scope.product.attribute_sets.indexOf( set );
			$scope.product.attribute_sets.splice(i,1 ) ;
		}
	}

	$scope.addToList = function( attribute ){
		if ( !attribute.values )
		{
			attribute.values = [];
		}
		if ( attribute.newText )
		{
			attribute.values.push( { text: attribute.newText, disabled:false } );
			attribute.newText = "";
		}
	}
	
	function matchId( id ){
		if ( !$scope.availableAttributeSets )
		{
			return ;
		}
		for (var i=0; i< $scope.availableAttributeSets.length ;i++ )
		{
			if ( $scope.availableAttributeSets[i]._id == id )
			{
				return i;
			}
		}
		return -1;
	}

	function setSelectedSet(){
		for (var i=0;i< $scope.product.attributes.length;i++ )
		{
			if ( matchId( $scope.product.attributes[i]._id ) != -1)
			{
				var index = matchId( $scope.product.attributes[i]._id );
				$scope.bool[index] = true;
			}
		}
	}


	$scope.$watch('availableAttributeSets', function(newValue, oldValue ) {
		//console.log('newValue :',newValue,',oldValue : ',oldValue);
		if ( newValue && newValue.length > 0)
		{
			$scope.doneFetchingAvailableAttributeSets = true;
			if(!$scope.$$phase) {
			  $scope.$apply();
			}
		}
	});
	
	$scope.$watch('doneFetchingAvailableAttributeSets', function(newValue, oldValue ) {
		//console.log('newValue :',newValue,',oldValue : ',oldValue);
		if ( newValue )
		{
				$scope.$watch('product.attribute_sets', function(newValue, oldValue ) {
				//console.log('newValue :',newValue,',oldValue : ',oldValue);
				
				if ( newValue && newValue.length >0 )
				{
					for (var i=0;i< newValue.length;i++ )
					{
						if ( matchId( newValue[i]._id ) != -1)
						{
							var index = matchId( newValue[i]._id );
							$scope.bool[index] = true;
						}
					}
				}
			});
		}
	});

});