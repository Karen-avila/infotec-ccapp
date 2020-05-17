(function (module) {
  mifosX.controllers = _.extend(module, {
    ClientController: function (scope, resourceFactory, location) {
      scope.clients = [];
      scope.client = null;
      scope.actualClients = [];
      scope.searchText = "";
      scope.searchResults = [];
      scope.showClosed = false;
      scope.selected;
      scope.routeTo = function (id) {
        location.path("/viewclient/" + id);
      };

      scope.query = {
        order: "displayName",
        limit: 25,
        page: 1,
      };

      scope.options = {
        boundaryLinks: true,
        rowSelection: true,
      };

      scope.getResultsPage = function (pageNumber, limit) {
        if (scope.searchText) {
          var startPosition = (pageNumber - 1) * limit;
          scope.clients = scope.actualClients.slice(
            startPosition,
            startPosition + limit
          );
          return;
        }
        resourceFactory.clientResource.getAllClients(
          {
            offset: (pageNumber - 1) * limit,
            limit: limit,
          },
          function (data) {
            scope.clients = data.pageItems;
          }
        );
      };

      scope.initPage = function () {
        resourceFactory.clientResource.getAllClients(
          {
            offset: 0,
            limit: scope.query.limit,
          },
          function (data) {
            scope.clients = data.pageItems;
            scope.totalClients = scope.clients.length;
          }
        );
      };
      // scope.initPage();

      scope.getDatatableColumn = function (tableName, columnName) {
        var temp = columnName.split("_cd_");
        if (temp[1] && temp[1] != "") {
          columnName = temp[1];
        }
        // return tableName + '.' + columnName;
        return columnName;
      };

      scope.search = function () {
        scope.actualClients = [];
        scope.searchResults = [];
        scope.filterText = "";
        var searchString = scope.searchText;
        searchString = searchString.replace(/(^"|"$)/g, "");
        var exactMatch = false;
        var n = searchString.localeCompare(scope.searchText);
        if (n != 0) {
          exactMatch = true;
        }

        if (!scope.searchText) {
          scope.initPage();
        } else {
          resourceFactory.globalSearch.search(
            {
              query: searchString.toUpperCase(),
              resource: "clients,clientIdentifiers",
              exactMatch: exactMatch,
            },
            function (data) {
              var arrayLength = data.length;
              for (var i = 0; i < arrayLength; i++) {
                var result = data[i];
                var client = {};
                client.status = {};
                client.subStatus = {};
                client.status.value = result.entityStatus.value;
                client.status.code = result.entityStatus.code;
                if (result.entityType == "CLIENT") {
                  client.displayName = result.entityName;
                  client.accountNo = result.entityAccountNo;
                  client.id = result.entityId;
                  client.externalId = result.entityExternalId;
                  client.officeName = result.parentName;
                } else if (result.entityType == "CLIENTIDENTIFIER") {
                  client.displayName = result.parentName;
                  client.id = result.parentId;
                  client.externalId = result.parentExternalId;
                }
                scope.actualClients.push(client);
              }
              scope.clients = scope.actualClients.slice(0, scope.query.limit);
              scope.totalClients = scope.clients.length;
            }
          );
        }
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
    .controller("ClientController", [
      "$scope",
      "ResourceFactory",
      "$location",
      mifosX.controllers.ClientController,
    ])
    .run(function ($log) {
      $log.info("ClientController initialized");
    });
})(mifosX.controllers || {});
