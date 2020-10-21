(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateSocialProgramController: function (scope, resourceFactory, location) {
            scope.formData = {};

            resourceFactory.savingsFundResource.get(function (data) {
                scope.savings = data;
            });
            
            scope.submit = function () {
                scope.formData.name = scope.formData.name.toUpperCase();

                resourceFactory.socialProgramResource.save(scope.formData, function (data) {
                    location.path("/viewsocialprogram/" + data.resourceId);
                });
            };
        },
    });

    mifosX.ng.application
        .controller("CreateSocialProgramController", [
            "$scope",
            "ResourceFactory",
            "$location",
            mifosX.controllers.CreateSocialProgramController,
        ])
        .run(function ($log) {
            $log.info("CreateSocialProgramController initialized");
        });
})(mifosX.controllers || {});