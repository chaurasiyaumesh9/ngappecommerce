angular.module('sampleCartAdmin.directives')
.directive('loader', function(){
	// a directive to show loader while we fetch data from server
	return {
		restrict: "EA",
		replace: true,
		scope: true,
		templateUrl:"./templates/loading.html"
	}
});