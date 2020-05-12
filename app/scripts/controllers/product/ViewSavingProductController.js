(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewSavingProductController: function (scope, routeParams, location, anchorScroll, resourceFactory, filter) {
            resourceFactory.savingProductResource.get({ savingProductId: routeParams.id, template: 'true' }, function (data) {
                scope.savingproduct = data;
                scope.hasAccounting = data.accountingRule.id == 2 ? true : false;
            });

            scope.scrollto = function (link) {
                location.hash(link);
                anchorScroll();
            };

            scope.downloadPDF = function () {
            }
        }
    });
    mifosX.ng.application.controller('ViewSavingProductController', ['$scope', '$routeParams', '$location', '$anchorScroll', 'ResourceFactory', '$filter', mifosX.controllers.ViewSavingProductController]).run(function ($log) {
        $log.info("ViewSavingProductController initialized");
    });
}(mifosX.controllers || {}));
