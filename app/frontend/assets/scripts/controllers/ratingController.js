angular.module('sampleCartApp.controller').controller('ratingController', function( $scope ){
	/*this.rating1 = 5;
    this.rating2 = 1;
	this.averageRating = 2;
    this.isReadonly = true;
    this.rateFunction = function(rating) {
      //console.log('Rating selected: ' + rating);
    };
	*/
	
	//$scope.averageRating = 3.6; //can be assigned any static value OR fetched from DB
		$scope.user1 = {rating:5};
	  $scope.user2 = {rating:2};
	  $scope.user3 = {rating:1};  
	  $scope.averageRating = 0;
	  
	  $scope.$watch(function(){return $scope.user1.rating + $scope.user2.rating + $scope.user3.rating;}, function(oldVal, newVal) {
			if (newVal) { updateAverageRating(); }
	  });
		
	  function updateAverageRating(){ $scope.averageRating = ($scope.user1.rating + $scope.user2.rating + $scope.user3.rating) / 3; }
	  
	  //$scope.isReadonly = true;
	  $scope.rateFunction = function(rating) {
		console.log("Rating selected: " + rating);
	  };
});
