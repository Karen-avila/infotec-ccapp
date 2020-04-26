angular.module('httpErrorHandler', [])
    .factory('handleResponseError401', ['$q', '$location', function ($q, $location) {
        return {
            'responseError': function(response) {
                if (response.status === 401) {
                    console.log("HEEEY " + response.status);
                    console.log("returning... " + JSON.stringify(response.headers));
                    response.headers['www-authenticate'] = '';
                    $location.path('/login');
                    return;
                }
                return $q.reject(response);
            }
        };
    }]);
