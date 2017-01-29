angular.module('sampleCartApp.service', [])

  .service('categoryService', function($http, $q){
	return({
		getActiveCategories: getActiveCategories,
		getCategoryById: getCategoryById
	});

	function getActiveCategories(){
		var request = $http({
            method: "get",
            url: "/categories",
            params: {
                action: "get"
            }
        });
        return( request.then( handleSuccess, handleError ) );
	}
	function getCategoryById( id ) {
        var request = $http({
            method: "get",
            url: "/categories/" + id,
            params: {
                action: "get"
            },
            data: {
                id: id
            }
        });
        return( request.then( handleSuccess, handleError ) );
    }
})
.service('productService', function($http, $q){
	return({
		getProductsByCategory: getProductsByCategory,
		getProductById: getProductById,
		getAllProducts: getAllProducts
	});

	function getAllProducts(){
		var request = $http({
			method: "get",
			url: "/products",
			params: {
				action: "get"
			}
		});
		return( request.then( handleSuccess, handleError ) );
	}
	function getProductById( pid ){
		//console.log('getProductById:',pid);
		var request = $http({
			method: "get",
			url: "/product/" + pid,
			params: {
				action: "get"
			}
		});
		return( request.then( handleSuccess, handleError ) );
	}
	
	function getProductsByCategory( cid ){
		//console.log('getProductsByCategory:',cid);
		var request = $http({
			method: "get",
			url: "/products/" + cid,
			params: {
				action: "get"
			}
		});
		return( request.then( handleSuccess, handleError ) );
	}
})
.service('cartService', function($http, $q){
	return({
		addToCart: addToCart,
		getCart: getCart,
		getTotal: getTotal,
		updateCart: updateCart
	});
	function updateCart( cart ) {
        var request = $http({
            method: "put",
            url: "/cart",
            params: {
                action: "update"
            },
            data: {
                cart: cart
            }
        });
        return( request.then( handleSuccess, handleError ) );
    }

	function addToCart( product ){
		var request = $http({
            method: "post",
            url: "/cart",
            params: {
                action: "add"
            },
            data: {
                product: product
            }
        });
        return( request.then( handleSuccess, handleError ) );
	}
	function getCart(){
		var request = $http({
			method: "get",
			url: "/cart",
			params: {
				action: "get"
			}
		});
		return( request.then( handleSuccess, handleError ) );
	}

	function getTotal( cart ){
		var total = 0;
		for (var i = 0;i <cart.length; i++ ) {
			var product = cart[i];
			total += product.qty * ( product.item.special_price || product.item.price );
		};
		return total;
	}
	
})
function handleError( response ) {
	if ( ! angular.isObject( response.data ) || ! response.data.message ) {
		return( $q.reject( "An unknown error occurred." ) );
	}
	// Otherwise, use expected error message.
	return( $q.reject( response.data.message ) );
}
function handleSuccess( response ) {
	//console.log( typeof response.data );
	if( typeof response.data =='object' ){
		return( response.data );
	}	
	else{
		return;		
	}
	
}	
