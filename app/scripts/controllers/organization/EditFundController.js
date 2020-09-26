(function (module) {
    mifosX.controllers = _.extend(module, {
        EditFundController: function (scope, routeParams, resourceFactory, location) {
            resourceFactory.fundsResource.getFund({fundId: routeParams.id}, function (data) {
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
                this.formData.locale = scope.optlang.code;
                resourceFactory.fundsResource.update({'fundId': routeParams.id}, this.formData, function (data) {
                    location.path('/viewfund/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditFundController', ['$scope', '$routeParams', 'ResourceFactory', '$location', mifosX.controllers.EditFundController]).run(function ($log) {
        $log.info("EditFundController initialized");
    });
}(mifosX.controllers || {}));
