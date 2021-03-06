(function (module) {
    mifosX.controllers = _.extend(module, {
        BulkLoanReassignmentController: function (scope, resourceFactory, route, dateFilter) {
            scope.offices = [];
            scope.fromOfficers = [];
            scope.toOfficers = [];
            scope.transfers = {};
            scope.first = {};
            scope.toOfficers = [];
            scope.transactionDate = new Date();
            scope.transferTypes = [{id: 1, name: "label.input.clients"}, {id: 2, name: "label.input.groups"}]

            resourceFactory.officeResource.getAllOffices(function (data) {
                scope.offices = data;
            });

            scope.getOfficers = function (source) {
                var _officeId = scope.fromOfficeId;
                if (source === 0)
                    scope.fromOfficers = [];
                else {
                    scope.toOfficers = [];
                    _officeId = scope.toOfficeId;
                }
                resourceFactory.loanReassignmentResource.get({ templateSource: 'template', officeId: _officeId }, function (data) {
                    if (source === 0) {
                        scope.fromOfficers = data.loanOfficerOptions;
                    } else {
                        scope.toOfficers = _.filter(data.loanOfficerOptions, function (officer) {
                            return officer.id != scope.formData.fromLoanOfficerId;
                        });
                    }
                });
            };

            scope.getOfficerClients = function () {
                scope.transferTypeId = null;
                scope.clients = [];
                scope.groups = [];
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
                        if ((tmp[0] === "c") && (scope.transferTypeId == 1)) {
                            var client = _.filter(scope.clients, function(item) {
                                return item.id == tmp[1];
                            });
                            clients.push(client[0].id);
                            var clientLoans = client[0].loans;
                            for (var i in clientLoans) {
                                loans.push(clientLoans[i].id);
                            }
                        } else if ((tmp[0] === "g") && (scope.transferTypeId == 2)) {
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
                if (scope.transferTypeId == 1) {
                    this.formData.loans = loans;
                } else {
                    this.formData.groups = groups;
                }

                // Transfer Clients
                if (scope.transferTypeId == 1) {
                    resourceFactory.loanReassignmentResource.save(this.formData, function (data) {
                        route.reload();
                    });
                } else {
                    resourceFactory.groupReassignmentResource.save(this.formData, function (data) {
                        route.reload();
                    });
                }
                // Transfer Groups
            };
        }
    });
    mifosX.ng.application.controller('BulkLoanReassignmentController', ['$scope', 'ResourceFactory', '$route', 'dateFilter', mifosX.controllers.BulkLoanReassignmentController]).run(function ($log) {
        $log.info("BulkLoanReassignmentController initialized");
    });
}(mifosX.controllers || {}));
