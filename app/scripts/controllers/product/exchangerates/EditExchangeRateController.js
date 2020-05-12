(function (module) {
    mifosX.controllers = _.extend(module, {
        EditExchangeRateController: function (scope, routeParams, resourceFactory, location, dateFilter) {

            scope.formData = {};
            scope.formData.rateValues = [] ;

            resourceFactory.exchangerates.get({exchangeRateId: routeParams.exchangeRateId}, function (data) {
                scope.formData.name = data.name;
                scope.formData.isActive = data.isActive;
                scope.formData.rateValues = data.rateValues;

                var i = 0 ;
                var length = scope.formData.rateValues.length;
                var futurerateValues = [] ;

                for(i = 0 ; i < length; i++) {
                    scope.formData.rateValues[i].fromDate = new Date(scope.formData.rateValues[i].fromDate);
                    if(scope.formData.rateValues[i].fromDate > Date.now()) {
                        futurerateValues.push(scope.formData.rateValues[i]) ;
                    }
                }
                scope.formData.rateValues = futurerateValues;
            });

            scope.addRatePeriod = function () {
                scope.formData.rateValues.push({
                });
            };

            scope.deleteRatePeriod = function (index) {
                scope.formData.rateValues.splice(index, 1);
            } ;

            scope.checkDate = function (index) {
                return scope.formData.rateValues[index].fromDate > Date.now() ;
            } ;

            scope.submit = function () {
                var i = 0 ;
                var length = this.formData.rateValues.length;
                for(i = 0 ; i < length; i++) {
                    delete this.formData.rateValues[i].id ;
                    delete this.formData.rateValues[i].isActive ;
                    delete this.formData.rateValues[i].createdBy ;
                    delete this.formData.rateValues[i].createdOn ;
                    delete this.formData.rateValues[i].modifiedBy ;
                    delete this.formData.rateValues[i].modifiedOn ;
                    this.formData.rateValues[i].locale = scope.optlang.code;
                    this.formData.rateValues[i].dateFormat =  scope.df;
                    this.formData.rateValues[i].fromDate = dateFilter(this.formData.rateValues[i].fromDate, scope.df);
                }

                resourceFactory.exchangerates.put({exchangeRateId: routeParams.exchangeRateId}, this.formData, function (data) {
                    location.path('/viewexchangerate/' + data.resourceId);
                });
            } ;
        }
    });
    mifosX.ng.application.controller('EditExchangeRateController', ['$scope', '$routeParams', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.EditExchangeRateController]).run(function ($log) {
        $log.info("EditExchangeRateController initialized");
    });
}(mifosX.controllers || {}));
