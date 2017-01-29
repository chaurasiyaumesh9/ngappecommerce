angular.module('sampleCartApp.controller').controller('signupCtrl', function( $scope, $rootScope, $http, $location, $timeout, $interval, $window ){
	$scope.message = "signup With ";
	$scope.alerts = [];
	$scope.signUp = function( user ){
		
		$http.post('/signup', user ).then( function( response ){
			//console.log('signup response :',response);;
			if ( response.data.user )
			{
				$rootScope.activeUser = response.data.user ;
				$location.url('/profile');
			}else{
				/*$scope.message = response.data.message;
				$scope.showMessage = true;
				$timeout( function(){
					$scope.showMessage = false;
				},3000)*/
				$scope.alerts.push({type:"warning", msg:  response.data.message });
			}
		}, function( errorMessage ){
			console.warn( errorMessage );
		});
	}
	 $scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	  };
});

