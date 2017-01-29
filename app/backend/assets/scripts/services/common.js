angular.module('sampleCartAdmin.services')
.service('common', function(){
	return({
		stringToDate: stringToDate
	});

	function stringToDate( str ){
		return new Date( str );
	}
});