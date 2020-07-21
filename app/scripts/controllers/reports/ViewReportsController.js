(function (module) {
  mifosX.controllers = _.extend(module, {
    ViewReportsController: function (
      scope,
      routeParams,
      resourceFactory,
      location
    ) {
      scope.reports = [];
      scope.type = routeParams.type;

      scope.totalReports = 0;
      scope.query = {
        order: "displayName",
        limit: 25,
        page: 1,
      };

      scope.options = {
        boundaryLinks: true,
        rowSelection: true,
        pageSelector: true,
        
      };

      scope.routeTo = function (report) {
        location
          .path("/run_report/" + report.report_name)
          .search({ reportId: report.id, type: report.report_type });
      };

      if (!scope.searchCriteria.reports) {
        scope.searchCriteria.reports = null;
        scope.saveSC();
      }
      scope.filterText = scope.searchCriteria.reports || "";

      scope.filterByReportSubType = function (report) {
        return !(report.report_subtype === "Triggered");
      };

      scope.onFilter = function () {
        scope.searchCriteria.reports = scope.filterText;
        scope.saveSC();
      };

      if (routeParams.type == "all") {
        resourceFactory.runReportsResource.get({
            reportSource: "FullReportList",
            parameterType: true,
            genericResultSet: false,
          },
          function (data) {
            scope.reports = scope.getReports(data);
          }
        );
      } else if (routeParams.type == "clients") {
        resourceFactory.runReportsResource.get(
          {
            reportSource: "reportCategoryList",
            R_reportCategory: "Client",
            parameterType: true,
            genericResultSet: false,
          },
          function (data) {
            scope.reports = scope.getReports(data);
          }
        );
      } else if (routeParams.type == "loans") {
        resourceFactory.runReportsResource.get(
          {
            reportSource: "reportCategoryList",
            R_reportCategory: "Loan",
            parameterType: true,
            genericResultSet: false,
          },
          function (data) {
            scope.reports = scope.getReports(data);
          }
        );
      } else if (routeParams.type == "savings") {
        resourceFactory.runReportsResource.get(
          {
            reportSource: "reportCategoryList",
            R_reportCategory: "Savings",
            parameterType: true,
            genericResultSet: false,
          },
          function (data) {
            scope.reports = scope.getReports(data);
          }
        );
      } else if (routeParams.type == "funds") {
        resourceFactory.runReportsResource.get(
          {
            reportSource: "reportCategoryList",
            R_reportCategory: "Fund",
            parameterType: true,
            genericResultSet: false,
          },
          function (data) {
            scope.reports = scope.getReports(data);
          }
        );
      } else if (routeParams.type == "accounting") {
        resourceFactory.runReportsResource.get(
          {
            reportSource: "reportCategoryList",
            R_reportCategory: "Accounting",
            parameterType: true,
            genericResultSet: false,
          },
          function (data) {
            scope.reports = scope.getReports(data);
          }
        );
      }

      scope.ReportsPerPage = 15;

      // Remove the duplicate entries from the array. The reports api returns same report multiple times if it have more than one parameter.
      scope.getReports = function (data) {
        var obj = {};
        for ( var i=0, len=data.length; i < len; i++ ) {
            const item = data[i];
            if (item.id) {
                obj[item.id] = item;
            } else if (item.report_id) {
                obj[item.report_id] = item;
            }
        }
        var reports = [];
        for ( var key in obj )
            reports.push(obj[key]);

        return reports;
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
    },
  });
  mifosX.ng.application
    .controller("ViewReportsController", [
      "$scope",
      "$routeParams",
      "ResourceFactory",
      "$location",
      mifosX.controllers.ViewReportsController,
    ])
    .run(function ($log) {
      $log.info("ViewReportsController initialized");
    });
})(mifosX.controllers || {});
