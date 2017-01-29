angular.module('sampleCartAdmin.controllers')
.controller('attributeSetsCtrl', function($scope, $http, $routeParams, attributeService, attributeSetsService, $timeout, $rootScope, $q ){
	$scope.message = "Make New Attribute Set";
	$rootScope.alerts = [];
	$scope.loadDefaults = function(){
		$scope.set = { name:null, attributes:[] };// we'll be posting updated set of this data via submit form //attributeSet = {}
		$scope.attributesAvailable = [];
		$scope.bool = [];
		getAllAttributes();
	}

	
	function getAllAttributes(){
		var request = attributeService.getAllAttributes();
		function errorCallback( errorMessage ) {
			console.warn( errorMessage );
		}
		function successCallback( response ) {
			$scope.attributesAvailable = response;
			return( response.data );
		}
		return( request.then( successCallback, errorCallback ) );
	}

	$scope.addNew = function( set ){
		$scope.loading = true;
		attributeSetsService.addNew( set ).then( function( response ){
			$rootScope.alerts.push({type:"success", msg:  "Attribute Set Added Successfully" });
			$scope.loading = false;
			$scope.loadDefaults();
		}, function( errorMessage ){
			console.warn( errorMessage );
		});
	}
	$scope.getAllSets = function( ){
		$scope.loading = true;
		var request = attributeSetsService.getAll( );
		function errorCallback( errorMessage ) {
			console.warn( errorMessage );
		}
		function successCallback( response ) {
			$scope.loading = false;
			$scope.attributeSets = response;
			return( response.data );
		}
		return( request.then( successCallback, errorCallback ) );
	}

	function getAllSets(){
		$scope.getAllSets();
	}

	$scope.getOneById = function( id ){
		$scope.loading = true;
		attributeSetsService.getOneById( id ).then( function( response ){
			$scope.set = response;
			$scope.loading = false;
			getAllAttributes().then( function( response ){
				removeDeletedAttributesFromSet( $scope.attributesAvailable, $scope.set.attributes, $scope.set );
			}, function( errorMessage ){
				console.warn( errorMessage );
			});
		} , function(errorMessage ){ 
			console.warn( errorMessage );
		});
	}
	$scope.updateOneById = function( set ){
		set.updated_at = new Date();
		$scope.loading = true;
		
		var request = attributeSetsService.updateOneById( set );
		function errorCallback( errorMessage ) {
			console.warn( errorMessage );
		}
		function successCallback( response ) {
			$rootScope.alerts.push({type:"success", msg:  "Attribute Set Updated Successfully" });
			$scope.loading = false;
			return( response.data );
		}
		return( request.then( successCallback, errorCallback ) );
	}
	$scope.deleteOneById = function( ){
		
	}
	getAllSets();
	if ( $routeParams.id )
	{
		var setId = $routeParams.id; // check if in edit mode
		$scope.getOneById( setId );
	}

	function removeDeletedAttributesFromSet( setAvailable, setSelected, setToBeUpdatedInDB ){
		for(var i=0 ; i < setSelected.length; i++) {
			var cnt = 0;
			for ( var j=0; j< setAvailable.length; j++ )
			{
				//console.log('setSelected[',i,']._id : ',setSelected[i]._id,', setAvailable[',j,']._id : ',setAvailable[j]._id);
				if ( setSelected[i]._id != setAvailable[j]._id )
				{
					cnt++
				}
				if ( cnt == setAvailable.length )
				{
					setSelected.splice(i,1);
					$scope.updateOneById( setToBeUpdatedInDB ).then( function( response){ 
						$rootScope.alerts = [];
						removeDeletedAttributesFromSet( setAvailable, setSelected );	
					}, function( errorMessage){ });
					
				}
			}
		 }  
	}

	$scope.isChecked = function( id ){
      var match = false;
      for(var i=0 ; i < $scope.set.attributes.length; i++) {
        if( $scope.set.attributes[i]._id == id ){
          match = true;
        }
      }
      return match;
  };
  $scope.sync = function(bool, item){
    if(bool){
      $scope.set.attributes.push(item);
    } else {
      for(var i=0 ; i < $scope.set.attributes.length; i++) {
        if( $scope.set.attributes[i]._id == item._id){
          $scope.set.attributes.splice(i,1);
        }
      }      
    }
  };
  $scope.selectAll = function(){
		$scope.set.attributes = angular.copy( $scope.attributesAvailable );
		for ( var i=0;i<$scope.attributesAvailable.length ; i++ )
		{
			$scope.bool[i] = true;
		}
	}

	$scope.deSelectAll = function(){
		$scope.set.attributes = [];
		$scope.bool = []
	}

});
