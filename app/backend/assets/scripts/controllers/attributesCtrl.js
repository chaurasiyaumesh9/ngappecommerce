angular.module('sampleCartAdmin.controllers')
.controller('attributesCtrl', function($scope, $http, $routeParams, attributeService, $timeout, $rootScope, $q ){
	$scope.message = "Manage Attributes";
	$scope.showDelete = false;
	$scope.deleteCount = 0;
	$scope.currentPage = 1;
	$scope.pageSize = 5;
	var attributeId = -1;

	$scope.sortReverse  = true;
	$rootScope.alerts = [];
	$scope.loadDefaults = function(){
		$scope.attribute = { };
	}
	getAllAttributes();
	$scope.addNewAttribute = function( attribute ){
		$scope.loading = true;
		attributeService.addNewAttribute( attribute ).then( function( response ){
			$rootScope.alerts.push({type:"success", msg:  "Attribute Added Successfully!" });
			$scope.loading = false;
			$scope.loadDefaults();
		}, function( errorMessage ){
			console.warn( errorMessage );
		});
	}

	$scope.updateAttribute = function( attribute ){
		$scope.loading = true;
		attributeService.updateAttribute( attribute ).then( function( response ){
			$scope.loading = false;
			$rootScope.alerts.push({type:"success", msg:  "Attribute Updated Successfully!" });
		}, function( errorMessage ){
			console.warn( errorMessage );
		});
	}

	function getAllAttributes(){
		$scope.loading = true;
		attributeService.getAllAttributes().then( function( response ){
			$scope.attributes = response;
			$scope.loading = false;
		}, function( errorMessage ){
			console.warn( errorMessage );
		});
	}

	if ( $routeParams.id )
	{
		attributeId = $routeParams.id; // check if in edit mode
		$scope.loading = true;
		attributeService.getAttributeById( attributeId ).then( function( response ){
			$scope.attribute = response;
			$scope.loading = false;
		} , function(errorMessage ){ 
			console.warn( errorMessage );
		});
	}

	$scope.deleteAttributes = function(){
		$scope.loading = true;
		var checked = getCheckedAttributes();
		var multipleReq = [];
		for ( var i=0; i<checked.length ;i++ )
		{ 
			multipleReq.push( attributeService.deleteAttribute( checked[i]._id ) );
		}
		$scope.deleteCount = multipleReq.length;
		$q.all( multipleReq ).then( function( response ){
			$scope.loading = true;
			getAllAttributes();
			$rootScope.alerts.push({type:"danger", msg:  "Attribute(s) deleted successfully!" });
		}, function( errorMessage ){
			console.warn( errorMessage );
		});
	}
	
	$scope.checkAll = function () {
        angular.forEach($scope.attributes, function (category) {
            category.selected = $scope.selectAll;
        });
		 toggleDeleteButton();
    };
	
	 $scope.checkIndividual = function ( ) {
		 if ( getCheckedAttributes().length < $scope.attributes.length )
		 {
			$scope.selectAll = false;
		 }
		toggleDeleteButton();		
    };
	function toggleDeleteButton(){
		if ( getCheckedAttributes().length >0 )
		 {
			$scope.showDelete = true;
		 }else{
			$scope.showDelete = false;
		 }
	}

	function getCheckedAttributes(){
		var arr = [];
		for (var i=0; i<$scope.attributes.length ;i++ )
		{
			if ( $scope.attributes[i].selected )
			{
				arr.push( $scope.attributes[i] );
			}	
		}
		return arr;
	}
});