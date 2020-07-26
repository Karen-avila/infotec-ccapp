(function (module) {
    mifosX.controllers = _.extend(module, {
        CodeController: function (scope, resourceFactory, location) {
            scope.codes = [];

            scope.query = {
                order: "name",
                limit: 25,
                page: 1
            };
        
            scope.options = {
                boundaryLinks: true,
                rowSelection: true,
                pageSelector: true
            };
                
            scope.routeTo = function (id) {
                location.path('/viewcode/' + id);
            }

            if (!scope.searchCriteria.codes) {
                scope.searchCriteria.codes = null;
                scope.saveSC();
            }
            scope.filterText = scope.searchCriteria.codes || '';

            scope.onFilter = function () {
                scope.searchCriteria.codes = scope.filterText;
                scope.saveSC();
            };

            scope.CodesPerPage = 15;
            resourceFactory.codeResources.getAllCodes(function (data) {
                scope.codes = data;
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
        }
    });
    mifosX.ng.application.controller('CodeController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.CodeController]).run(function ($log) {
        $log.info("CodeController initialized");
    });
}(mifosX.controllers || {}));