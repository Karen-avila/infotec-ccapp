(function(module) {
    mifosX.controllers = _.extend(module, {
        OpenBranchOfficeController: function(scope, location, resourceFactory) {

            scope.hola = "hello";


            /* scope.pdfUrl = '/home/gustavo/git/community-app/app/scripts/controllers/branchoffice/pdf.pdf';
            scope.httpHeaders = { Authorization: 'Bearer some-aleatory-token' }; */


        }
    });
    mifosX.ng.application.controller('OpenBranchOfficeController', ['$scope', '$location', 'ResourceFactory', mifosX.controllers.OpenBranchOfficeController]).run(function($log) {
        $log.info("OpenBranchOfficeController initialized");
    });
}(mifosX.controllers || {}));