angular.module('sampleCartApp.filter', [])
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
.filter('filterProductsByCategory', function( ){
	return function( list, searchCategory ){
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
})
.filter('getCartTotalPrice', function () {
    return function ( p ) {
    	//console.log('product : ',product)
        var total = 0;
        angular.forEach( p, function (product, index) {
            total += product.qty * ( parseInt(product.item.special_price) || parseInt(product.item.price) );
        });
        return total;
    }
});