(function (module) {
    mifosX.controllers = _.extend(module, {
        BulkLoanReassignmentController: function (scope, resourceFactory, route, dateFilter) {
            scope.offices = [];
            scope.fromOfficers = [];
            scope.toOfficers = [];
            scope.transfers = {};
            scope.fromOfficeId = '';
            scope.toOfficeId = '';
            scope.first = {};
            scope.toOfficers = [];
            scope.transactionDate = new Date();

            resourceFactory.officeResource.getAllOffices(function (data) {
                scope.offices = data;
            });

            scope.getOfficers = function (officeId, source) {
                resourceFactory.loanReassignmentResource.get({ templateSource: 'template', officeId: officeId }, function (data) {
                    if (source === 0) {
                        scope.fromOfficers = data.loanOfficerOptions;
                    } else {
                        scope.toOfficers = _.filter(data.loanOfficerOptions, function (officer) {
                            return officer.if != scope.formData.fromLoanOfficerId;
                        });
                    }
                });
            };

            scope.getOfficerClients = function () {
                var officerId = scope.formData.fromLoanOfficerId;
                resourceFactory.loanReassignmentResource.get({ templateSource: 'template', officeId: scope.fromOfficeId, fromLoanOfficerId: officerId }, function (data) {
                    scope.clients = data.accountSummaryCollection.clients;
                    scope.groups = data.accountSummaryCollection.groups;
                });
            };

            scope.submit = function () {
                var reqDate = dateFilter(scope.transactionDate, scope.df);
                var loans = [];
                var clients = [];
                var groups = [];
                _.each(scope.transfers, function (value, key) {
                    if (value == true) {
                        var tmp = key.split("_");
                        // Clients
                        if (tmp[0] === "c") {
                            var client = _.filter(scope.clients, function(item) {
                                return item.id == tmp[1];
                            });
                            clients.push(client[0].id);
                            var clientLoans = client[0].loans;
                            for (var i in clientLoans) {
                                loans.push(clientLoans[i].id);
                            }
                        } else {
                            var group = _.filter(scope.groups, function(item) {
                                return item.id == tmp[1];
                            });
                            groups.push(group[0].id);
                        }
                    }
                });
                this.formData.assignmentDate = reqDate;
                this.formData.dateFormat = scope.df;
                this.formData.locale = scope.optlang.code;
                this.formData.loans = loans;

                // Transfer Loans
                resourceFactory.loanReassignmentResource.save(this.formData, function (data) {
                    route.reload();
                });

                // Transfer Clients

                // Transfer Groups
            };
        }
    });
    mifosX.ng.application.controller('BulkLoanReassignmentController', ['$scope', 'ResourceFactory', '$route', 'dateFilter', mifosX.controllers.BulkLoanReassignmentController]).run(function ($log) {
        $log.info("BulkLoanReassignmentController initialized");
    });
}(mifosX.controllers || {}));
