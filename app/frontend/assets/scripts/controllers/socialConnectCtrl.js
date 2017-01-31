angular.module('sampleCartApp.controller').controller('socialConnectCtrl', function( $scope, $rootScope, $http, $location, $timeout, $interval, $window ){
	
	var catchInterval;
	
	 $rootScope.$watch('activeUser', function(newVal, oldVal) {
		//console.log('newVal : ',newVal, ',oldVal : ',oldVal)
		if ( newVal && $rootScope.popup )
		{
			$rootScope.popup.close();
		}
	});

	function onSuceessCallback( response ){
		var user = response.data;
		//console.log('socialConnectCtrl onSuceessCallback response :',user);;
		if ( user !== '0' )
		{
			$rootScope.activeUser = user;
			$scope.disablePopup = false;
			$interval.cancel( catchInterval );
			$location.url('/profile');
		}
	}

	function manageSocialLogin(){
		$scope.disablePopup = true;
		catchInterval = $interval( function(){
			if ( $rootScope.popup.closed && !$rootScope.activeUser )
			{
				$scope.disablePopup = false;
				$interval.cancel( catchInterval );
			}
			$http.get('/loggedin').then( onSuceessCallback,function(){
				console.log("error while managing social login");
			} );
		}, 200);
	}
	
	$scope.facebookConnect = function( ){
		$rootScope.popup = $window.open('/auth/facebook', 'Sign in with facebook', 'width=500,height=400');
		manageSocialLogin();
	}
	$scope.googleConnect = function( ){
		$rootScope.popup = $window.open('/auth/google', 'Sign in with your google account', 'width=500,height=400');
		manageSocialLogin();
	}
	$scope.twitterConnect = function( ){
		$rootScope.popup = $window.open('/auth/twitter', 'Sign in with your Twitter account', 'width=500,height=400');
		manageSocialLogin();
	}

	
});