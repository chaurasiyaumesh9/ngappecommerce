angular.module('sampleCartApp.controller').controller('AppCtrl', function( $scope, $rootScope ){
	$scope.determinateValue = 0;
    $scope.$on('$viewContentLoaded', function(){
        $scope.determinateValue = 100;
    });
});