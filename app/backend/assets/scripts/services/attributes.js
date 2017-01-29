angular.module('sampleCartAdmin.services')
.service("attributeService", function($http, $q){
	return({
        addNewAttribute: addNewAttribute,
        getAllAttributes: getAllAttributes, 
		getAttributeById: getAttributeById,
		updateAttribute: updateAttribute ,
		deleteAttribute: deleteAttribute
    });

	function addNewAttribute( attribute ){
		var request = $http({
            method: "post",
            url: "/admin/attributes",
            params: {
                action: "add"
            },
            data: {
                attribute: attribute
            }
        });
        return( request.then( handleSuccess, handleError ) );
	}

	function getAllAttributes() {
        var request = $http({
            method: "get",
            url: "/admin/attributes",
            params: {
                action: "get"
            }
        });
        return( request.then( handleSuccess, handleError ) );
    }
	function getAttributeById( id ) {
        var request = $http({
            method: "get",
            url: "/admin/attributes/" + id,
            params: {
                action: "get"
            },
            data: {
                id: id
            }
        });
        return( request.then( handleSuccess, handleError ) );
    }
	function updateAttribute( attribute ) {
        var request = $http({
            method: "put",
            url: "/admin/attributes/" + attribute._id,
            params: {
                action: "update"
            },
            data: {
                attribute: attribute
            }
        });
        return( request.then( handleSuccess, handleError ) );
    }
	 function deleteAttribute( id ) {
        var request = $http({
            method: "delete",
            url: "/admin/attributes/" + id,
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