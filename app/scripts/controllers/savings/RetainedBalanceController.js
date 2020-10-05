(function (module) {
    mifosX.controllers = _.extend(module, {
        RetainedBalanceController: function (scope, resourceFactory, routeParams, location, dateFilter) {

            scope.loanOfficers = [];
            scope.formData = {};
           scope.formData.transactionDate= new Date();
            scope.staffData = {};
            scope.paramData = {};
            scope.accountNo = routeParams.id;
            
            scope.cancel = function () { 
                location.path('/viewsavingaccount/' + scope.accountNo);
            };

            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                this.formData.transactionDate = dateFilter(this.formData.transactionDate, scope.df);
                console.log(this.formData);
                 resourceFactory.savingsResource.post({accountId: routeParams.id, resourceType: 'transactions', command:'holdAmount'}, this.formData, function (data) {
                    location.path('/viewsavingaccount/' + scope.accountNo);
               });
            };

        }
    });
    mifosX.ng.application.controller('RetainedBalanceController', ['$scope', 'ResourceFactory', '$routeParams', '$location', 'dateFilter', mifosX.controllers.RetainedBalanceController]).run(function ($log) {
        $log.info("RetainedBalanceController initialized");
    });
    
}(mifosX.controllers || {}));

