angular.module('sampleCartApp.directive', [])
.directive('loader', function(){
	// a directive to show loader while we fetch data from server
	return {
		restrict: "EA",
		replace: true,
		scope: true,
		templateUrl:"./templates/loading.html"
	}
})
.directive('productGridView', function(){
	return {
		restrict:"EA",
		replace:true,
		templateUrl:"./templates/product-grid-view.html"
	}
})
.directive('productListView', function(){
	return {
		restrict:"EA",
		replace:true,
		templateUrl:"./templates/product-list-view.html"
	}
})
.directive('starRating', function() {
  return {
	restrict : "EA",
	templateUrl:"./templates/star-rating.html",
	scope : {
	  ratingValue : "=ngModel",
	  max : "=?", //optional: default is 5
	  onRatingSelected : "&?",
	  readonly: "=?"
	},
	link : function(scope, elem, attrs) {
		 if ( typeof scope.onRatingSelected !== "function" )
		  {
			scope.onRatingSelected = function( rating ){};
		  }
	  if (scope.max == undefined) { scope.max = 5; }
	  function updateStars() {
		scope.stars = [];
		for (var i = 0; i < scope.max; i++) {
		  scope.stars.push({
			filled : (i < scope.ratingValue.rating)
		  });
		}
	  };
	  scope.toggle = function(index) {
		if (scope.readonly == undefined || scope.readonly == false){
		  scope.ratingValue.rating = index + 1;
		  scope.onRatingSelected({
			rating: index + 1
		  });
		}
	  };
	  scope.$watch("ratingValue.rating", function(oldVal, newVal) {
		if (newVal) { updateStars(); }
	  });
	}
  };  
})
.directive('averageStarRating', function(){
  return {
	restrict : "EA",
   templateUrl:"./templates/average-star-rating.html",
	scope : {
	  averageRatingValue : "=ngModel",
	  max : "=?", //optional: default is 5
	},
	link : function(scope, elem, attrs) {
	  if (scope.max == undefined) { scope.max = 5; }
	  function updateStars() {
		scope.stars = [];
		for (var i = 0; i < scope.max; i++) {
		  scope.stars.push({});
		}
		var starContainerMaxWidth = 100; //%
		scope.filledInStarsContainerWidth = scope.averageRatingValue / scope.max * starContainerMaxWidth;
	  };
	  scope.$watch("averageRatingValue", function(oldVal, newVal) {
		if (newVal) { updateStars(); }
	  });
	}
  };
})
.directive('onFinishRenderFilters', function ($timeout) {
	return {
		restrict: 'A',
		link: function (scope, element, attr) {
			if (scope.$last === true) {
				$timeout(function () {
					scope.$emit('ngRepeatFinished');
				});
			}
		}
	}
})
.directive('slickSlider', function ($timeout) {
	return {
		restrict: 'A',
		scope: {'data': '='},
		link: function (scope, element, attrs) {
			scope.$parent.isInitialized = false;
			scope.$watch('data', function(newVal, oldVal) {
				if ( newVal )
				{
					if ( newVal.length > 0 && !scope.$parent.isInitialized) {
						 scope.$parent.$on('ngRepeatFinished', function (ngRepeatFinished) {
							 //console.log('finished tr repeat 1');
							$(element).slick( scope.$eval(attrs.slickSlider));
							 scope.$parent.isInitialized = true;
						});
					}
				}
			});
		}
	}
})
.directive('sliderProductView', function ($timeout) {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			//console.log(scope.$eval(attrs.slickSlider));
			scope.$watch('isInitialized',function(newVal, oldVal){
				//console.log(newVal,',', oldVal );
				if ( newVal )
				{
					//console.log('loading dir 2');
					scope.$watch('activeSlide', function( newValueSlide, oldValueSlide ){
						//console.log(newValueSlide,',', oldValueSlide );
						$(element).slick('slickGoTo', newValueSlide ).on('afterChange', function(event, slick, currentSlide, nextSlide){
							//console.log('got it 1 !', currentSlide);
							scope.$apply(function() {
								scope.switchThumbView( currentSlide );
							});
						});;;;
					});
				}
			});
		}
	}
})
.directive('autoSlideThumb', function ($timeout) {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			scope.$watch('isInitialized',function(newVal, oldVal){
				if ( newVal )
				{
					//console.log('loading dir 2');
					scope.$watch('activeSlide', function( newValueSlide, oldValueSlide ){
						//console.log(newValueSlide,',', oldValueSlide );
						$(element).slick('slickGoTo', newValueSlide );
					});
				}
			});
		}
	}
})
.directive('windowHeightResize', function ($window) {

	 return {
		link: link,
		restrict: 'A'
	 };

	 function link(scope, element, attrs){

	   scope.windowHeight = $window.innerHeight - 45;

	   angular.element($window).bind('resize', function(){

		 scope.windowHeight = $window.innerHeight - 45;

		 scope.$digest();
	   });

	 }

 })
.directive('ngElevateZoom', function($window) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
    	attrs.$observe('zoomImage',function(){
	        linkElevateZoom();
	      });
    	function linkElevateZoom(){
	        //Check if its not empty
	        if (!attrs.zoomImage) return;
	        var screenWidth = $window.innerWidth;
            if (screenWidth >= 768) {
            	element.attr('data-zoom-image',attrs.zoomImage);
        		$(element).elevateZoom({zoomType : "lens", lensShape : "round", lensSize : 200});
            }else{
            	//destroy zoom
            }
	        
	      }
	      $window.onresize = function() {
            linkElevateZoom();
            scope.$apply();
        };

	      linkElevateZoom();
    }
  };
})
.directive('zoomContainer', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
        	scope.$watch('activeSlide', function( newValueSlide, oldValueSlide ){
				//console.log(newValueSlide,',', oldValueSlide );
				if( newValueSlide >=0 ){
					//console.log( element[0].querySelector('div.zoomContainer') );
					var target = element[0].querySelector('div.zoomContainer');
					if( target ){
						target.remove();
					}
				}
				//var target = element.children('div.zoomContainer').remove();
			});
            scope.$on('$routeChangeSuccess', function() {
            	var target = element[0].querySelector('div.zoomContainer');
					if( target ){
						target.remove();
					}
              //  var target = element.children('div.zoomContainer').remove();
            })
        }
    }

})
.directive('imageonload', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('load', function() {
                //alert('image is loaded');
                element.addClass('loaded');
            });
            element.bind('error', function(){
                //alert('image could not be loaded');
            });
        }
    };
})
.directive('goback', ['$window', function($window) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.bind('click', function () {
                $window.history.back();
            });
        }
    };
}]);