(function (module) {
  mifosX.controllers = _.extend(module, {
    SearchController: function (scope, routeParams, resourceFactory) {
      scope.query = {
        order: "entityType",
        limit: 25,
        page: 1,
      };

      scope.options = {
        boundaryLinks: true,
        rowSelection: true,
      };

      scope.searchResults = [];
      if (routeParams.query == "undefined") {
        routeParams.query = "";
      }
      resourceFactory.globalSearch.search(
        {
          query: routeParams.query,
          resource: routeParams.resource,
          exactMatch: routeParams.exactMatch,
        },
        function (data) {
          if (data.length > 200) {
            scope.searchResults = data.slice(0, 201);
            scope.showMsg = true;
          } else {
            scope.searchResults = data;
          }
          if (scope.searchResults.length <= 0) {
            scope.flag = true;
          }
        }
      );

      scope.getClientDetails = function (clientId) {
        scope.selected = clientId;
        resourceFactory.clientResource.get({ clientId: clientId }, function (
          data
        ) {
          scope.group = "";
          scope.client = data;
          scope.center = "";
        });
        resourceFactory.clientAccountResource.get(
          { clientId: clientId },
          function (data) {
            scope.clientAccounts = data;
          }
        );
      };

      scope.getGroupDetails = function (groupId) {
        scope.selected = groupId;

        resourceFactory.groupResource.get({ groupId: groupId }, function (
          data
        ) {
          scope.client = "";
          scope.center = "";
          scope.group = data;
        });
        resourceFactory.groupAccountResource.get(
          { groupId: groupId },
          function (data) {
            scope.groupAccounts = data;
          }
        );
      };

      scope.getCenterDetails = function (centerId) {
        scope.selected = centerId;

        resourceFactory.centerResource.get(
          { centerId: centerId, associations: "groupMembers" },
          function (data) {
            scope.client = "";
            scope.group = "";
            scope.center = data;
          }
        );
        resourceFactory.centerAccountResource.get(
          { centerId: centerId },
          function (data) {
            scope.centerAccounts = data;
          }
        );
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
    .controller("SearchController", [
      "$scope",
      "$routeParams",
      "ResourceFactory",
      mifosX.controllers.SearchController,
    ])
    .run(function ($log) {
      $log.info("SearchController initialized");
    });
})(mifosX.controllers || {});
