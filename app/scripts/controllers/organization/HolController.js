(function (module) {
    mifosX.controllers = _.extend(module, {
        HolController: function (scope, resourceFactory, location) {
            scope.holidays = [];
            scope.offices = [];
            scope.formData = {
              officeId: 1
            };

            scope.query = {
                order: "name",
                limit: 25,
                page: 1,
            };
    
            scope.options = {
                boundaryLinks: true,
                rowSelection: true,
            };

            scope.routeTo = function (id) {
                location.path('/viewholiday/' + id);
            };

            if (!scope.searchCriteria.holidays) {
                scope.searchCriteria.holidays = [null, null];
                scope.saveSC();
            }
            scope.filterText = scope.searchCriteria.holidays[0] || '';
            scope.formData.officeId = scope.searchCriteria.holidays[1];

            scope.onFilter = function () {
                scope.searchCriteria.holidays[0] = scope.filterText;
                scope.saveSC();
            };

            scope.HolidaysPerPage = 15;

            resourceFactory.holResource.getAllHols({ officeId: scope.formData.officeId }, function (data) {
                scope.holidays = data;
            });

            resourceFactory.officeResource.getAllOffices(function (data) {
                scope.offices = data;
            });

            scope.getHolidays = function () {
                scope.searchCriteria.holidays[1] = scope.formData.officeId;
                scope.saveSC();
                resourceFactory.holResource.getAllHols({ officeId: scope.formData.officeId }, function (data) {
                    scope.holidays = data;
                });
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
    mifosX.ng.application.controller('HolController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.HolController]).run(function ($log) {
        $log.info("HolController initialized");
    });
}(mifosX.controllers || {}));