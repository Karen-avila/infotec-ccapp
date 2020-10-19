(function (module) {
    mifosX.controllers = _.extend(module, {
        SocialProgramController: function (scope, resourceFactory, location) {
            scope.socialprograms = [];
            scope.client = null;
            scope.actualSocialPrograms = [];
            scope.searchText = "";
            scope.searchResults = [];
            scope.showClosed = false;
            scope.selected;
            scope.myapp;

            scope.routeTo = function (id) {
                location.path("/viewsocialprogram/" + id);
            };
            scope.query = {
                order: "name",
                limit: 25,
                page: 1,
            };

            scope.options = {
                boundaryLinks: true,
                rowSelection: true,
                pageSelector: true,
            };

            scope.getResultsPage = function (page, limit) {
                if (scope.searchText) {
                    var startPosition = (page - 1) * limit;
                    scope.socialPrograms = scope.actualSocialPrograms.slice(
                        startPosition,
                        startPosition + limit
                    );
                    return;
                }
                resourceFactory.socialProgramResource.getAllSocialPrograms(
                    {
                        page: (page - 1) * limit,
                        limit: limit,
                    },
                    function (data) {
                        scope.socialPrograms = data.pageItems;
                    }
                );
            };

            scope.refresh = function () {
                route.reload();
            };

            resourceFactory.socialProgramResource.getAllSocialPrograms(function (data) {
                scope.socialprograms = data;
                scope.totalSocialPrograms = data.length;
            });

            scope.filters = [];
            scope.$watch("filter.search", function (newValue, oldValue) {
                if (newValue != undefined) {
                    scope.filters = newValue.split(" ");
                }
            });

            scope.searachData = {};
            scope.customSearch = function (item) {
                scope.searachData.status = true;

                angular.forEach(scope.filters, function (value1, key) {
                    scope.searachData.tempStatus = false;
                    angular.forEach(item, function (value2, key) {
                        var dataType = typeof value2;

                        if (dataType == "string" && !value2.includes("object")) {
                            if (value2.toLowerCase().includes(value1)) {
                                scope.searachData.tempStatus = true;
                            }
                        }
                    });
                    scope.searachData.status =
                        scope.searachData.status & scope.searachData.tempStatus;
                });

                return scope.searachData.status;
            };
        },
    });

    mifosX.ng.application
        .controller("SocialProgramController", [
            "$scope",
            "ResourceFactory",
            "$location",
            mifosX.controllers.SocialProgramController,
        ])
        .run(function ($log) {
            $log.info("SocialProgramController initialized");
        });
})(mifosX.controllers || {});