(function (module) {
    mifosX.controllers = _.extend(module, {
        BulkLoanReassignmentController: function (scope, resourceFactory, route, dateFilter) {
            scope.offices = [];
            scope.accounts = {};
            scope.fromOfficeId = '';
            scope.toOfficeId = '';
            scope.first = {};
            scope.toOfficers = [];
            scope.first.date = new Date();

            resourceFactory.officeResource.getAllOffices(function (data) {
                scope.offices = data;
            });

            scope.getOfficers = function (officeId, source) {
                resourceFactory.loanReassignmentResource.get({ templateSource: 'template', officeId: officeId }, function (data) {
                    if (source === 0) {
                        scope.fromOfficers = data.loanOfficerOptions;
                        console.log(JSON.stringify(scope.fromOfficers));
                    } else {
                        scope.toOfficers = data.loanOfficerOptions;
                        console.log(JSON.stringify(scope.toOfficers));
                    }
                });
            };

            scope.getOfficerClients = function (officerId, source) {
                var officerTmp = _.filter(scope.officers, function (officer) {
                    return (officer.id == officerId);
                });

                if (source === 0) {
                    scope.fromOfficers = officerTmp;
                } else {
                    scope.toOfficers = officerTmp;
                }
                resourceFactory.loanReassignmentResource.get({ templateSource: 'template', officeId: scope.fromOfficeId, fromLoanOfficerId: scope.formData.fromLoanOfficerId }, function (data) {
                    scope.clients = data.accountSummaryCollection.clients;
                    scope.groups = data.accountSummaryCollection.groups;
                });
            };

            scope.submit = function () {
                var reqDate = dateFilter(scope.first.date, scope.df);
                var loans = [];
                _.each(scope.accounts, function (value, key) {
                    if (value == true) {
                        loans.push(key)
                    }
                });
                this.formData.assignmentDate = reqDate;
                this.formData.dateFormat = scope.df;
                this.formData.locale = scope.optlang.code;
                this.formData.loans = loans;
                resourceFactory.loanReassignmentResource.save(this.formData, function (data) {
                    route.reload();
                });

            };
        }
    });
    mifosX.ng.application.controller('BulkLoanReassignmentController', ['$scope', 'ResourceFactory', '$route', 'dateFilter', mifosX.controllers.BulkLoanReassignmentController]).run(function ($log) {
        $log.info("BulkLoanReassignmentController initialized");
    });
}(mifosX.controllers || {}));
