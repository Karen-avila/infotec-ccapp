(function (module) {
    mifosX.controllers = _.extend(module, {
        MediaRequestController: function (scope, resourceFactory, API_VERSION, $rootScope, Upload) {
            scope.channels = [{id: 1, name: "ABIERTO"}, {id: 2, name: "CERRADO"}]
            scope.first = {};
            scope.first.templateUrl = API_VERSION + '/offices/downloadtemplate' + '?tenantIdentifier=' + $rootScope.tenantIdentifier
                + '&locale=' + scope.optlang.code + '&dateFormat=' + scope.df;

            scope.formData = {};
            scope.onFileSelect = function (files) {
                scope.formData.file = files[0];
            };

            scope.refreshImportTable = function () {
                resourceFactory.importResource.getImports({ entityType: "offices" }, function (data) {

                    for (var l in data) {
                        var importdocs = {};
                        importdocs = API_VERSION + '/imports/downloadOutputTemplate?importDocumentId=' + data[l].importId + '&tenantIdentifier=' + $rootScope.tenantIdentifier;
                        data[l].docUrl = importdocs;
                    }
                    scope.imports = data;
                });
            };

            scope.upload = function () {
                Upload.upload({
                    url: $rootScope.hostUrl + API_VERSION + '/offices/uploadtemplate',
                    data: { file: scope.formData.file, locale: scope.optlang.code, dateFormat: scope.df },
                }).then(function (data) {
                    // to fix IE not refreshing the model
                    if (!scope.$$phase) {
                        scope.$apply();
                    }
                });
            };
        }
    });
    mifosX.ng.application.controller('MediaRequestController', ['$scope', 'ResourceFactory', 'API_VERSION', '$rootScope', 'Upload', mifosX.controllers.MediaRequestController]).run(function ($log) {
        $log.info("MediaRequestController initialized");
    });
}(mifosX.controllers || {}));