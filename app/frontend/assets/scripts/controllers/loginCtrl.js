angular.module('sampleCartApp.controller').controller('loginCtrl', function( $scope, $rootScope, $http, $location, $timeout, $interval, $window ){
	$scope.message = "Login With ";
	$scope.showMessage = false;
	$scope.alerts = [];
	var catchInterval;
	$scope.login = function( user ){
		$http.post('/login', user).then( function( response ){
			//console.log('login response :',response);;
			if ( response.data.user )
			{
				$rootScope.activeUser = response.data.user ;
				$location.url('/profile');
			}else{
				
				$scope.alerts.push({type:"warning", msg:  response.data.message });
				/*$scope.message = response.data.message;
				$scope.showMessage = true;
				$timeout( function(){
					$scope.showMessage = false;
				},3000);*/
			}
		}, function( errorMessage ){
			console.warn( errorMessage );
		});
	}
	 $scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	  };
});

