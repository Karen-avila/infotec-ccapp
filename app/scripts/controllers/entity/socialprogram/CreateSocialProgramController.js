(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateSocialProgramController: function (scope, resourceFactory, location) {
            scope.formData = {};
            scope.submit = function () {
                scope.formData.name = scope.formData.name.toUpperCase();

                resourceFactory.roleResource.save(this.formData, function (data) {
                    location.path("/socialprogram/" + data.resourceId);
                });
            };
        },
    });

    mifosX.ng.application
        .controller("CreateSocialProgramController", [
            "$scope",
            "ResourceFactory",
            "$location",
            mifosX.controllers.SocialProgramController,
        ])
        .run(function ($log) {
            $log.info("CreateSocialProgramController initialized");
        });
})(mifosX.controllers || {});