(function (module) {
    mifosX.controllers = _.extend(module, {
        ManageFundsController: function (scope, location, resourceFactory) {
            scope.funderror = [];
            scope.formData = [];
            scope.addfunderror = false;

            scope.query = {
                order: "name",
                limit: 25,
                page: 1,
            };

            scope.options = {
                boundaryLinks: true,
                rowSelection: true,
            };

            resourceFactory.fundsResource.getAllFunds(function (data) {
                scope.funds = data;
                scope.totalFunds = data.length;
                console.log(scope.funds);
            });

            scope.editFund = function (fund, name, id) {
                fund.edit = !fund.edit;
                scope.formData[id] = name;
            };

            scope.routeTo = function (id) {
                location.path('/viewfund/' + id);
            };

            if (!scope.searchCriteria.fund) {
                scope.searchCriteria.fund = null;
                scope.saveSC();
            }
            scope.filterText = scope.searchCriteria.fund;

            scope.onFilter = function () {
                scope.searchCriteria.fund = scope.filterText || '';
                scope.saveSC();
            };

            scope.saveFund = function (id) {
                if (this.formData[id]) {
                    scope.funderror[id] = false;
                    resourceFactory.fundsResource.update({ fundId: id }, { 'name': this.formData[id] }, function (data) {
                        location.path('/funds');
                    });
                } else {
                    scope.funderror[id] = true;
                }
            };

            scope.addFund = function () {
                if (scope.newfund != undefined) {
                    scope.addfunderror = false;
                    resourceFactory.fundsResource.save({ 'name': scope.newfund }, function (data) {
                        location.path('/funds');
                    });
                } else {
                    scope.addfunderror = true;
                }

                scope.newfund = undefined;
            };

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

        }
    });
    mifosX.ng.application.controller('ManageFundsController', ['$scope', '$location', 'ResourceFactory', mifosX.controllers.ManageFundsController]).run(function ($log) {
        $log.info("ManageFundsController initialized");
    });
}(mifosX.controllers || {}));
