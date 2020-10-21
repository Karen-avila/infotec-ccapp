(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateThirdPartyServiceController: function (scope, routeParams, resourceFactory, location) {
            scope.formData = {};

            resourceFactory.savingsFundResource.get(function (data) {
                scope.savings = data;
            });

            scope.submit = function () {
                resourceFactory.thirdPartyServicesResource.save(this.formData, function (data) {
                    location.path('/viewthirdpartyservice/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateThirdPartyServiceController', ['$scope', '$routeParams', 'ResourceFactory', '$location', mifosX.controllers.CreateThirdPartyServiceController]).run(function ($log) {
        $log.info("CreateThirdPartyServiceController initialized");
    });
}(mifosX.controllers || {}));
