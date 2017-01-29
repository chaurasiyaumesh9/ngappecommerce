angular.module('sampleCartAdmin.services')
.service("categoryService", function($http, $q){
	return({
        addNewCategory: addNewCategory, //done
        getAllCategories: getAllCategories, //done
		getCategoryById: getCategoryById, //done
        deleteCategory: deleteCategory, //done
		updateCategory: updateCategory //done
    });

	function addNewCategory( category ){
		var request = $http({
            method: "post",
            url: "/admin/categories",
            params: {
                action: "add"
            },
            data: {
                category: category
            }
        });
        return( request.then( handleSuccess, handleError ) );
	}

	function getAllCategories() {
        var request = $http({
            method: "get",
            url: "/admin/categories",
            params: {
                action: "get"
            }
        });
        return( request.then( handleSuccess, handleError ) );
    }
	function getCategoryById( id ) {
        var request = $http({
            method: "get",
            url: "/admin/categories/" + id,
            params: {
                action: "get"
            },
            data: {
                id: id
            }
        });
        return( request.then( handleSuccess, handleError ) );
    }
    function deleteCategory( id ) {
        var request = $http({
            method: "delete",
            url: "/admin/categories/" + id,
            params: {
                action: "delete"
            },
            data: {
                id: id
            }
        });
        return( request.then( handleSuccess, handleError ) );
    }
	 function updateCategory( category ) {
        var request = $http({
            method: "put",
            url: "/admin/categories/" + category._id,
            params: {
                action: "update"
            },
            data: {
                category: category
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