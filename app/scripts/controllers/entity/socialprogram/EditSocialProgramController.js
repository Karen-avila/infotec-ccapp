(function (module) {
    mifosX.controllers = _.extend(module, {
        EditSocialProgramController: function (scope, routeParams, resourceFactory, location) {
            scope.formData = {};

            resourceFactory.socialProgramResource.get({socialprogramId: routeParams.id}, function (data) {
                scope.formData = data;
            });

            scope.submit = function () {
                scope.formData.name = scope.formData.name.toUpperCase();

                resourceFactory.socialProgramResource.update({socialprogramId: routeParams.id}, scope.formData, function (data) {
                    location.path("/viewsocialprogram/" + data.id);
                });
            };
        },
    });

    mifosX.ng.application
        .controller("EditSocialProgramController", [
            "$scope",
            '$routeParams', 
            "ResourceFactory",
            "$location",
            mifosX.controllers.EditSocialProgramController,
        ])
        .run(function ($log) {
            $log.info("EditSocialProgramController initialized");
        });
})(mifosX.controllers || {});