angular.module('sampleCartAdmin.services').
service("attributeSetsService", function($http, $q){
	return({
        addNew: addNew,
        getAll: getAll, 
		getOneById: getOneById,
		updateOneById: updateOneById ,
		deleteOneById: deleteOneById
    });

	function addNew( set ){
		var request = $http({
            method: "post",
            url: "/admin/attribute-sets",
            params: {
                action: "add"
            },
            data: {
                attributeSet: set
            }
        });
        return( request.then( handleSuccess, handleError ) );
	}

	function getAll() {
        var request = $http({
            method: "get",
            url: "/admin/attribute-sets",
            params: {
                action: "get"
            }
        });
        return( request.then( handleSuccess, handleError ) );
    }
	function getOneById( id ) {
        var request = $http({
            method: "get",
            url: "/admin/attribute-sets/" + id,
            params: {
                action: "get"
            },
            data: {
                id: id
            }
        });
        return( request.then( handleSuccess, handleError ) );
    }
	function updateOneById( set ) {
        var request = $http({
            method: "put",
            url: "/admin/attribute-sets/" + set._id,
            params: {
                action: "update"
            },
            data: {
                attributeSet: set
            }
        });
        return( request.then( handleSuccess, handleError ) );
    }
	 function deleteOneById( id ) {
        var request = $http({
            method: "delete",
            url: "/admin/attribute-sets/" + id,
            params: {
                action: "delete"
            },
            data: {
                id: id
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