(function (module) {
    mifosX.controllers = _.extend(module, {
        DataTableController: function (scope, resourceFactory, location) {
            scope.routeTo = function (id) {
                location.path('/viewdatatable/' + id);
            };

            if (!scope.searchCriteria.datatables) {
                scope.searchCriteria.datatables = null;
                scope.saveSC();
            }
            scope.filterText = scope.searchCriteria.datatables || '';

            scope.onFilter = function () {
                scope.searchCriteria.datatables = scope.filterText;
                scope.saveSC();
            };

            scope.DataTablesPerPage = 15;
            resourceFactory.DataTablesResource.getAllDataTables(function (data) {
                scope.datatables = data;
            });
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
    mifosX.ng.application.controller('DataTableController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.DataTableController]).run(function ($log) {
        $log.info("DataTableController initialized");
    });
}(mifosX.controllers || {}));