(function (module) {
    mifosX.controllers = _.extend(module, {
        RetainedBalanceController: function (scope, resourceFactory, routeParams, location, dateFilter, MAX_DATEPICKER) {

            scope.loanOfficers = [];
            scope.formData = {};
            scope.MAX_TRANSACTION_DATE = new Date();
            scope.formData.transactionDate = scope.MAX_TRANSACTION_DATE;
            scope.maxDatePicker = new Date(MAX_DATEPICKER);
            scope.staffData = {};
            scope.paramData = {};
            scope.accountNo = routeParams.id;

            resourceFactory.codeOptionsResource.get({ codeName: 'HOLDING_REASON' }, function (data) {
                scope.holdingReasons = data.codeValues;
            });

            scope.cancel = function () {
                location.path('/viewsavingaccount/' + scope.accountNo);
            };

            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                this.formData.transactionDate = dateFilter(this.formData.transactionDate, scope.df);
                resourceFactory.savingsResource.post({ accountId: routeParams.id, resourceType: 'transactions', command: 'holdAmount' }, this.formData, function (data) {
                    location.path('/viewsavingaccount/' + scope.accountNo);
                });
            };

        }
    });
    mifosX.ng.application.controller('RetainedBalanceController', ['$scope', 'ResourceFactory', '$routeParams', '$location', 'dateFilter', 'MAX_DATEPICKER', mifosX.controllers.RetainedBalanceController]).run(function ($log) {
        $log.info("RetainedBalanceController initialized");
    });

}(mifosX.controllers || {}));

