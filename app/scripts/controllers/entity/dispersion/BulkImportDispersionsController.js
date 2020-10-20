(function (module) {
    mifosX.controllers = _.extend(module, {
        BulkImportDispersionsController: function (scope, resourceFactory, API_VERSION, $rootScope, Upload) {
            scope.first = {};
            scope.entityType = "dispersion";
            scope.first.templateUrl = API_VERSION + '/dispersion/downloadtemplate' + '?tenantIdentifier=' + $rootScope.tenantIdentifier
                + '&locale=' + scope.optlang.code + '&dateFormat=' + scope.df;
            scope.formData = {};

            scope.first.queryParams = '&';

            scope.onFileSelect = function (files) {
                scope.formData.file = files[0];
            };

            scope.downloadTemplate = function () {
                resourceFactory.bulkImportTemplateResource.get({resource: scope.entityType, action: "downloadtemplate"});
            }

            scope.refreshImportTable = function () {
                resourceFactory.importResource.getImports({ entityType: scope.entityType }, function (data) {

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
                    url: $rootScope.hostUrl + API_VERSION + '/dispersion/uploadtemplate',
                    data: { file: scope.formData.file, locale: scope.optlang.code, dateFormat: scope.df },
                }).then(function (data) {
                    if (!scope.$$phase) {
                        scope.$apply();
                    }
                });
            };
        }
    });
    mifosX.ng.application.controller('BulkImportDispersionsController', ['$scope', 'ResourceFactory', 'API_VERSION', '$rootScope', 'Upload', mifosX.controllers.BulkImportDispersionsController]).run(function ($log) {
        $log.info("BulkImportDispersionsController initialized");
    });
}(mifosX.controllers || {}));