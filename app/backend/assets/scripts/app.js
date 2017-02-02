var adminApp = angular.module('sampleCartAdmin', ['ngRoute','ngAnimate','ui.bootstrap','angularUtils.directives.dirPagination','ngMaterial','ngFileUpload','ngProgress','sampleCartAdmin.directives','sampleCartAdmin.services','sampleCartAdmin.filters','sampleCartAdmin.controllers']);

adminApp.config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			templateUrl : 'views/dashboard.html'
		})
		.when('/products', {
			templateUrl : 'views/products.html',
			controller: "productsCtrl"
		})
		.when('/products/add-new', {
			templateUrl : 'views/add-new-product.html',
			controller: "productsCtrl"
		})
		.when('/products/:id', {
			templateUrl : 'views/edit-view-product.html',
			controller: "productsCtrl"
		})
		.when('/attributes', {
			templateUrl : 'views/attributes.html',
			controller: "attributesCtrl"
		})
		.when('/attributes/add-new', {
			templateUrl : 'views/add-new-attribute.html',
			controller: "attributesCtrl"
		})
		.when('/attributes/:id', {
			templateUrl : 'views/edit-view-attribute.html',
			controller: "attributesCtrl"
		})
		.when('/attribute-sets', {
			templateUrl : 'views/attribute-sets.html',
			controller: "attributeSetsCtrl"
		})
		.when('/attribute-sets/add-new', {
			templateUrl : 'views/add-new-set.html',
			controller: "attributeSetsCtrl"
		})
		.when('/attribute-sets/:id', {
			templateUrl : 'views/edit-view-set.html',
			controller: "attributeSetsCtrl"
		})
		.when('/categories', {
			templateUrl : 'views/categories.html',
			controller: "categoriesCtrl"
		})

		.when('/categories/add-new', {
			templateUrl : 'views/add-new-category.html',
			controller: "categoriesCtrl"
		})
		.when('/categories/:id', {
			templateUrl : 'views/edit-view-category.html',
			controller: "categoriesCtrl"
		});

		//function($locationProvider) {
			//$locationProvider.hashPrefix('!');
		//}

		$locationProvider.html5Mode(false).hashPrefix('!');
});

adminApp.controller('adminCtrl', function($scope, $rootScope, ngProgressFactory ){
	$scope.message = "Welcome to Dashboard!"; //just to check if controller is working fine..print the message!
	$rootScope.alerts = [];
	$rootScope.closeAlert = function( index ) {
		$rootScope.alerts.splice(index, 1);
	};

	$rootScope.progressbar = ngProgressFactory.createInstance();
});

var lib = {
	getCurrentDate: function(){
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();

		if(dd<10) {
			dd='0'+dd
		} 

		if(mm<10) {
			mm='0'+mm
		} 

		//today = mm+'-'+dd+'-'+yyyy;
		today = yyyy +'-'+ mm +'-'+ dd ;
		return today;
	}
}