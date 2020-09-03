(function (module) {
    mifosX.controllers = _.extend(module, {
        RecurringDepositProductController: function (scope, resourceFactory, location) {
            scope.routeTo = function (id) {
                location.path('/viewrecurringdepositproduct/' + id);
            };

            if (!scope.searchCriteria.rdp) {
                scope.searchCriteria.rdp = null;
                scope.saveSC();
            }
            scope.filterText = scope.searchCriteria.rdp || '';

            scope.totalReports = 0;
            scope.query = {
                order: 'name',
                limit: 15,
                page: 1
            };

            scope.options = {
                boundaryLinks: true,
                rowSelection: true,
            };

            scope.onFilter = function () {
                scope.searchCriteria.rdp = scope.filterText;
                scope.saveSC();
            };

            resourceFactory.recurringDepositProductResource.getAllRecurringDepositProducts(function (data) {
                scope.depositproducts = data;
            });
        }
    });
    mifosX.ng.application.controller('RecurringDepositProductController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.RecurringDepositProductController]).run(function ($log) {
        $log.info("RecurringDepositProductController initialized");
    });
}(mifosX.controllers || {}));