(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateExchangeRateController: function (scope, resourceFactory, location, dateFilter) {
            scope.formData = {};
            scope.formData.rateValues = [] ;
            scope.formData.isActive = false;
            scope.addRateValue = function () {
                scope.formData.rateValues.push({
                    locale: scope.optlang.code,
                    dateFormat: scope.df,
                    fromDate: new Date()
                });
            };

            scope.deleteRateValue = function (index) {
                scope.formData.rateValues.splice(index, 1);
            } ;

            scope.submit = function () {
                var i = 0 ;
                var length = this.formData.rateValues.length;
                for(i = 0 ; i < length; i++) {
                    this.formData.rateValues[i].locale = scope.optlang.code;
                    this.formData.rateValues[i].dateFormat = scope.df;
                    this.formData.rateValues[i].fromDate = dateFilter(this.formData.rateValues[i].fromDate, scope.df);
                }

                resourceFactory.exchangerates.save(this.formData, function (data) {
                    location.path('/viewexchangerate/' + data.resourceId);
                });
            } ;
        }
    });
    mifosX.ng.application.controller('CreateExchangeRateController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.CreateExchangeRateController]).run(function ($log) {
        $log.info("CreateExchangeRateController initialized");
    });
}(mifosX.controllers || {}));
