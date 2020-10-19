(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewSocialProgramController: function (scope, routeParams, resourceFactory, location) {
            scope.socialprogram = {};

            resourceFactory.socialProgramResource.get({socialprogramId: routeParams.id}, function (data) {
                scope.socialprogram = data;
            });
        },
    });

    mifosX.ng.application
        .controller("ViewSocialProgramController", [
            "$scope",
            '$routeParams', 
            "ResourceFactory",
            "$location",
            mifosX.controllers.ViewSocialProgramController,
        ])
        .run(function ($log) {
            $log.info("ViewSocialProgramController initialized");
        });
})(mifosX.controllers || {});