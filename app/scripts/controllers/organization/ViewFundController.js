(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewFundController: function (scope, routeParams, route, location, resourceFactory) {            
            resourceFactory.fundsResource.getFund({fundId: routeParams.id}, function (data) {
                scope.fund = data;
            });
        }

    });
    mifosX.ng.application.controller('ViewFundController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory', mifosX.controllers.ViewFundController]).run(function ($log) {
        $log.info("ViewFundController initialized");
    });
}(mifosX.controllers || {}));