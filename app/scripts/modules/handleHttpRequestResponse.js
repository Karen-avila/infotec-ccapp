angular.module('handleHttpRequestResponse', [])
    .factory('handleHttpRequestResponse', ['$q', '$location', '$rootScope', 'toaster', '$filter', function ($q, $location, $rootScope, toaster, filter) {
        return {
            'request': function (config) {
                $rootScope.blockUI = true;
                toaster.clear();
                return config || $q.when(config);
            },
            'response': function (response) {
                $rootScope.blockUI = false;
                if (response.config && response.config.method == "GET") {
                    return response || $q.when(response);
                } else {
                    var msg = filter('translate')('label.transaction.with.success');
                    toaster.pop('success', '', msg);
                    return response || $q.when(response);
                }
            },
            'responseError': function(response) {
                $rootScope.blockUI = false;
                if (response.status === 401) {
                    response.headers['www-authenticate'] = '';
                    $location.path('/login');
                    return;
                } else {
                    var msg = "ERROR [" + response.status + "] ";
                    if (response.data && response.data.errors.length > 0) {
                        var valErrors = response.data.errors;
                        for (var j in valErrors) {
                            var temp = valErrors[j];
                            msg = msg + filter('translate')(temp.userMessageGlobalisationCode);
                            if (temp.args.length > 0) {
                                msg = msg + " : " + temp.args[0].value;
                            }
                            toaster.pop('error', '', msg);
                        };
                    }
                }
                return $q.reject(response);
            }
        };
    }]);
