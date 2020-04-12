(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewExchangeRateController: function (scope, routeParams, resourceFactory) {
            resourceFactory.exchangerates.get({exchangeRateId: routeParams.exchangeRateId}, function (data) {
                scope.id = data.id ;
                scope.name = data.name ;
                scope.isActive = data.isActive ;
                scope.createdBy = data.createdBy ;
                scope.rateValues = data.rateValues ;
            });
        }
    });
    mifosX.ng.application.controller('ViewExchangeRateController', ['$scope', '$routeParams', 'ResourceFactory', mifosX.controllers.ViewExchangeRateController]).run(function ($log) {
        $log.info("ViewExchangeRateController initialized");
    });
}(mifosX.controllers || {}));
