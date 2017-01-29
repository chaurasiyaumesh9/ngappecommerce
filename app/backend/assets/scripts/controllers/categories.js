angular.module('sampleCartAdmin.controllers')
.controller('categoriesCtrl', function($scope, $http, $routeParams, categoryService, $timeout, $rootScope, $q ){
	$scope.message = "Manage Categories";
	$rootScope.alerts = [];
	$scope.showDelete = false;
	$scope.deleteCount = 0;
	var categoryId = -1;

	if ( $routeParams.id )
	{
		categoryId = $routeParams.id; // check if in edit mode
		//console.log('categoryId:',categoryId);
		$scope.loading = true;
		categoryService.getCategoryById( categoryId ).then( function( response ){
			$scope.category = response;
			$scope.loading = false;
		} , function(errorMessage ){ 
			console.warn( errorMessage );
		});
	}
	$scope.loadDefaults = function(){
		$scope.category = {active:false};
	}
	getAllCategories();

	
	function getAllCategories(){
		$scope.loading = true;
		categoryService.getAllCategories().then( function( response ){
			$scope.categories = response;
			$scope.loading = false;
		}, function( errorMessage ){
			console.warn( errorMessage );
		});
	}

	$scope.updateCategory = function( category ){
		$scope.loading = true;
		category.updated_at = new Date();
		categoryService.updateCategory( category ).then( function( response ){
			$scope.loading = false;
			$rootScope.alerts.push({type:"success", msg:  "Category Updated Successfully!" });
		}, function( errorMessage ){
			console.warn( errorMessage );
		});
	}

	$scope.addNewCategory = function( category ){
		$scope.loading = true;
		categoryService.addNewCategory( category ).then( function( response ){
			$scope.loading = false;
			$rootScope.alerts.push({type:"success", msg:  "Category Added Successfully!" });
			$scope.loadDefaults();
		}, function( errorMessage ){
			console.warn( errorMessage );
		});
	}

	$scope.deleteCategories = function(){
		$scope.loading = true;
		var checked = getCheckedCategories();
		var multipleReq = [];
		for ( var i=0; i<checked.length ;i++ )
		{ 
			multipleReq.push( categoryService.deleteCategory( checked[i]._id ) );
		}
		$scope.deleteCount = multipleReq.length;
		
		$q.all( multipleReq ).then( function( response ){
			getAllCategories();
			$scope.loading = false;
			$rootScope.alerts.push({type:"danger", msg:  "Category(s) Deleted Successfully!" });
		}, function( errorMessage ){
			console.warn( errorMessage );
		});
	}

	 $scope.checkAll = function () {
        angular.forEach($scope.categories, function (category) {
            category.selected = $scope.selectAll;
        });
		 toggleDeleteButton();
    };
	
	 $scope.checkIndividual = function ( ) {
		 if ( getCheckedCategories().length < $scope.categories.length )
		 {
			$scope.selectAll = false;
		 }
		toggleDeleteButton();		
    };
	function toggleDeleteButton(){
		if ( getCheckedCategories().length >0 )
		 {
			$scope.showDelete = true;
		 }else{
			$scope.showDelete = false;
		 }
	}

	function getCheckedCategories(){
		var arr = [];
		for (var i=0; i<$scope.categories.length ;i++ )
		{
			if ( $scope.categories[i].selected )
			{
				arr.push( $scope.categories[i] );
			}	
		}
		return arr;
	}

});