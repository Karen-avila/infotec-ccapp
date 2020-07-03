(function (module) {
    mifosX.controllers = _.extend(module, {
        LoanProductController: function (scope, resourceFactory, location) {
            scope.products = [];
            scope.totalLoanProducts = 0;

            scope.routeTo = function (id) {
                location.path('/viewloanproduct/' + id);
            };

            scope.query = {
                order: 'name',
                limit: 25,
                page: 1
            }

            if (!scope.searchCriteria.loanP) {
                scope.searchCriteria.loanP = null;
                scope.saveSC();
            }
            scope.filterText = scope.searchCriteria.loanP || '';

            scope.onFilter = function () {
                scope.searchCriteria.loanP = scope.filterText;
                scope.saveSC();
            };

            scope.LoanProductsPerPage = 15;
            scope.$broadcast('LoanProductDataLoadingStartEvent');
            resourceFactory.loanProductResource.getAllLoanProducts(function (data) {
                scope.loanproducts = data;
                scope.totalLoanProducts = data.length;
                scope.$broadcast('LoanProductDataLoadingCompleteEvent');
            });
        }
    });
    mifosX.ng.application.controller('LoanProductController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.LoanProductController]).run(function ($log) {
        $log.info("LoanProductController initialized");
    });
}(mifosX.controllers || {}));