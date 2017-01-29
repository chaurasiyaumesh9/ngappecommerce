angular.module('sampleCartAdmin.services')
.service('productService', function($http, $q){
	
	return({
		getProductList: getProductList,
		getProductById: getProductById,
		addNewProduct: addNewProduct,
		updateProduct: updateProduct,
		deleteProduct: deleteProduct
	});
	function deleteProduct( id ) {
        var request = $http({
            method: "delete",
            url: "/admin/products/" + id,
            params: {
                action: "delete"
            },
            data: {
                id: id
            }
        });
        return( request.then( handleSuccess, handleError ) );
    }
	function updateProduct( product ) {
        var request = $http({
            method: "put",
            url: "/admin/products/" + product._id,
            params: {
                action: "update"
            },
            data: {
                product: product
            }
        });
        return( request.then( handleSuccess, handleError ) );
    }

	function getProductList(){
		var request = $http({
            method: "get",
            url: "/admin/products",
            params: {
                action: "get"
            }
        });
        return( request.then( handleSuccess, handleError ) );
	}

	function getProductById( id ){
		//console.log('getProductById', id);
		var request = $http({
            method: "get",
            url: "/admin/products/" + id,
            params: {
                action: "get"
            }
        });
        return( request.then( handleSuccess, handleError ) );
	}

	function addNewProduct( product ){
		var request = $http({
            method: "post",
            url: "/admin/products",
            params: {
                action: "add"
            },
            data: {
                product: product
            }
        });
        return( request.then( handleSuccess, handleError ) );
	}

	function handleError( response ) {
        if ( ! angular.isObject( response.data ) || ! response.data.message ) {
            return( $q.reject( "An unknown error occurred." ) );
        }
        // Otherwise, use expected error message.
        return( $q.reject( response.data.message ) );
    }
    function handleSuccess( response ) {
	    return( response.data );
	}
});