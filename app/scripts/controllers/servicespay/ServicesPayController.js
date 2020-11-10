(function(module) {
    mifosX.controllers = _.extend(module, {
        ServicesPayController: function(scope, location, resourceFactory) {

            scope.hola = "hello";

            resourceFactory.paymentTypeResource.getAll(function (data) {
                scope.paymentTypes = data;
            });

            resourceFactory.thirdPartyServicesResource.getAllServices(function (data) {
                scope.paymentthirdServices = data;
            });

        }
    });
    mifosX.ng.application.controller('ServicesPayController', ['$scope', '$location', 'ResourceFactory', mifosX.controllers.ServicesPayController]).run(function($log) {
        $log.info("ServicesPayController initialized");
    });
}(mifosX.controllers || {}));