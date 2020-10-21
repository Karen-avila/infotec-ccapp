(function (module) {
    mifosX.controllers = _.extend(module, {
        EditThirdPartyServiceController: function (scope, routeParams, resourceFactory, location) {
            resourceFactory.thirdPartyServicesResource.getService({serviceId: routeParams.id}, function (data) {
                scope.formData = data;
                delete scope.formData.id;
                delete scope.formData.clientName;
                resourceFactory.savingsFundResource.get(function (data) {
                    scope.savings = data;
                    for (var i = 0; i < scope.savings.length; i++) {
                        var saving = scope.savings[i];
                        if (saving.accountNo == scope.formData.accountNo) {
                            delete scope.formData.accountNo;
                            scope.formData.savingsAccountId = saving.id;
                            break;
                        }
                    }
                });
            });

            scope.submit = function () {
                resourceFactory.thirdPartyServicesResource.update({'serviceId': routeParams.id}, this.formData, function (data) {
                    location.path('/viewthirdpartyservice/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditThirdPartyServiceController', ['$scope', '$routeParams', 'ResourceFactory', '$location', mifosX.controllers.EditThirdPartyServiceController]).run(function ($log) {
        $log.info("EditThirdPartyServiceController initialized");
    });
}(mifosX.controllers || {}));
