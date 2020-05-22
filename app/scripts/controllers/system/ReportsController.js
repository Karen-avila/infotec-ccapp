(function (module) {
  mifosX.controllers = _.extend(module, {
    ReportsController: function (scope, resourceFactory, location) {
      scope.reports = [];

      scope.totalReports = 0;
      scope.query = {
        order: "displayName",
        limit: 25,
        page: 1,
      };

      scope.options = {
        boundaryLinks: true,
        rowSelection: true,
      };

      scope.routeTo = function (id) {
        location.path("/system/viewreport/" + id);
      };

      if (!scope.searchCriteria.manrep) {
        scope.searchCriteria.manrep = null;
        scope.saveSC();
      }
      scope.filterText = scope.searchCriteria.manrep || "";

      scope.onFilter = function () {
        scope.searchCriteria.manrep = scope.filterText;
        scope.saveSC();
      };

      resourceFactory.reportsResource.getReport(function (data) {
        scope.reports = data;
        scope.totalReports = data.length;
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
    },
  });
  mifosX.ng.application
    .controller("ReportsController", [
      "$scope",
      "ResourceFactory",
      "$location",
      mifosX.controllers.ReportsController,
    ])
    .run(function ($log) {
      $log.info("ReportsController initialized");
    });
})(mifosX.controllers || {});
