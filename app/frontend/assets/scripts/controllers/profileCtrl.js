angular.module('sampleCartApp.controller').controller('profileCtrl', function( $scope, $http, $rootScope ){
	$scope.message = "User Profile will be shown here ";
	$scope.loading = true;
	
	$http.get('/loggedin').then( function( user ){
		if ( user !== '0' )
		{
			$rootScope.activeUser = user;
			$scope.user = user;
			$scope.loading = false;
		}
	},function(err){
		console.log("exception while fetching profile");
	});
});
