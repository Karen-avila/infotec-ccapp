(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateFundController: function (scope, resourceFactory, location) {
            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                resourceFactory.fundsResource.save(this.formData, function (data) {
                    location.path('/viewfund/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateFundController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.CreateFundController]).run(function ($log) {
        $log.info("CreateFundController initialized");
    });
}(mifosX.controllers || {}));
