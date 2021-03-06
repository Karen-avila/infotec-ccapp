(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewThirdPartyServiceController: function (scope, routeParams, route, location, resourceFactory) {            
            resourceFactory.thirdPartyServicesResource.getService({serviceId: routeParams.id}, function (data) {
                scope.service = data;
        
                console.log(scope.service)
            });
            scope.delete = function () {
                resourceFactory.thirdPartyServicesResource.delete({'serviceId': routeParams.id}, this.formData, function (data) {
                    location.path('/thirdpartyservices/');
                });
            };
        }

        

        

    });
    mifosX.ng.application.controller('ViewThirdPartyServiceController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory', mifosX.controllers.ViewThirdPartyServiceController]).run(function ($log) {
        $log.info("ViewThirdPartyServiceController initialized");
    });
}(mifosX.controllers || {}));