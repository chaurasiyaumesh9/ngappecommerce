angular.module('sampleCartAdmin.filters',[])
.filter('yesNo', function() {
    return function(input) {
        return input ? 'Yes' : 'No';
    }
})

.filter('smallImg', function( ){
	return function( arr ){
		for (var i=0;i<arr.length ;i++ )
		{
			//console.log('arr :',arr[i]);
			if ( arr[i].role['small'])
			{
				//return arr[i]['url'];
				
				if ( arr[i]['imgdata'] )
				{
					return arr[i]['imgdata']['secure_url'];
				}else if( arr[i]['url'] ){
					return arr[i]['url'];
				}
			}
		}
	}
})

.filter('removeDeleted', function( ){
	return function( arr ){
		if ( !arr)
		{
			arr = [];
		}
		//console.log('arr :',arr);
		for (var i=0;i<arr.length ;i++ )
		{
			if ( arr[i]['deleted'] )
			{
				arr.splice( i, 1);
			}
		}
		return arr;
	}
})

.filter('filterProductsByCategory', function( ){
	return function( list, searchCategory ){
		if ( !searchCategory )
		{
			searchCategory = {};
		}
		if ( !list )
		{
			return [];
		}
		if ( !searchCategory.name ) //checking if no category then load all
		{
			return list;
		}
		var out = [];
		angular.forEach(list, function( product ){
			angular.forEach( product.categories, function( category ){
				if ( category._id === searchCategory._id && category.selected )
				{
					out.push( product );
				}
			});
		});
		return out;
	  }
});