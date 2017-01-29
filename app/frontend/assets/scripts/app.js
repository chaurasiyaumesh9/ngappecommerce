var cartApp = angular.module('sampleCartApp', ['ngRoute','ngAnimate','ui.bootstrap','ngMaterial','sampleCartApp.service','sampleCartApp.directive','sampleCartApp.filter','sampleCartApp.controller']);
cartApp.config(function( $routeProvider, $locationProvider, $httpProvider ) {
	
	$routeProvider
		.when('/', {
			templateUrl : 'views/homepage.html',
			controller:'hompageCtrl'
		})
		.when('/products', {
			templateUrl : 'views/product-listing.html',
			controller:'productListingCtrl'
		})
		.when('/products/:cid', {
			templateUrl : 'views/product-listing.html',
			controller:'productListingCtrl'
		})
		.when('/product/:pid', {
			templateUrl : 'views/product-details.html',
			controller:'productDetailsCtrl'
		})
		.when('/product/:pid/fullmode', {
			templateUrl : 'views/product-full-mode.html',
			controller:'productFullmodeCtrl'
		})
		.when('/cart', {
			templateUrl : 'views/cart.html',
			controller:'cartCtrl'
		})
		.when('/checkout', {
			templateUrl : 'views/checkout.html',
			controller:'checkoutCtrl'
		})
		.when('/login', {
			templateUrl : 'views/login.html',
			controller:'loginCtrl',
			resolve: { profilecheck1: checkLogin2 }
		})
		.when('/signup', {
			templateUrl : 'views/signup.html',
			controller:'signupCtrl',
			resolve: { profilecheck2: checkLogin2 }
		})
		.when('/profile', {
			templateUrl : 'views/profile.html',
			controller:'profileCtrl',
			resolve: { logincheck: checkLogin }
		});

	 //================================================
    // Add an interceptor for AJAX errors
    //================================================
    $httpProvider.interceptors.push(function($q, $location) {
      return {
        response: function(response) {
          // do something on success
          return response;
        },
        responseError: function(response) {
          if (response.status === 401)
            $location.url('/login');
          return $q.reject(response);
        }
      };
    });

	$locationProvider.html5Mode(false).hashPrefix('!');
});

cartApp.run(getActiveUser);

cartApp.run(function($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function () {
       $rootScope.fullmode = false;
    })
    $rootScope.alerts = [];
    $rootScope.closeAlert = function(index) {
		$rootScope.alerts.splice(index, 1);
  	};
})

function checkLogin( $q, $timeout, $http, $location, $rootScope ){
	var deferred = $q.defer();

	$http.get('/loggedin').success( function( user ){
		$rootScope.errorMessage = null;
		if ( user !== '0' )
		{
			$rootScope.activeUser = user;
			deferred.resolve();
		}else{
			$rootScope.errorMessage = 'You need to login first to access this page';
			deferred.reject();
			$location.url('/login');
		}
	});
	return deferred.promise;
}

function checkLogin2( $q, $timeout, $http, $location, $rootScope ){
	var deferred = $q.defer();

	$http.get('/loggedin').success( function( user ){
		$rootScope.errorMessage = null;
		if ( user !== '0' )
		{
			deferred.reject();
			$location.url('/profile');
		}else{
			deferred.resolve();
		}
	});
	return deferred.promise;
}


function getActiveUser( $http, $rootScope ){
	$http.get('/loggedin').success( function( user ){
		if ( user !== '0' )
		{
			$rootScope.activeUser = user;
		}
	});
}
