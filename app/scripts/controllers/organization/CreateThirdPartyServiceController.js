(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateThirdPartyServiceController: function (scope, resourceFactory, location) {
            scope.savings = [];
            console.log("al vienen las cuentas",scope.savings);
            resourceFactory.savingsFundResource.get(function (data) {
                scope.savings = data;
                console.log("al vienen las cuentas",scope.savings);
            });

            scope.submit = function () {
                resourceFactory.thirdPartyServicesResource.save(this.formData, function (data) {
                    location.path('/viewthirdpartyservice/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateThirdPartyServiceController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.CreateThirdPartyServiceController]).run(function ($log) {
        $log.info("CreateThirdPartyServiceController initialized");
    });
}(mifosX.controllers || {}));
