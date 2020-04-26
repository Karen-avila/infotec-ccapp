(function (module) {
    mifosX.controllers = _.extend(module, {
        ExchangeRatesController: function (scope, resourceFactory, location) {
            scope.exchangerates = [];

            scope.routeTo = function (exchangeRateId) {
                location.path('/viewexchangerate/' + exchangeRateId);
            };

            resourceFactory.exchangerates.getAll(function (data) {
                scope.exchangerates = data;
            });
        }
    });
    mifosX.ng.application.controller('ExchangeRatesController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.ExchangeRatesController]).run(function ($log) {
        $log.info("ExchangeRatesController initialized");
    });
}(mifosX.controllers || {}));
