(function (module) {
    mifosX.controllers = _.extend(module, {
        UserListController: function (scope, resourceFactory, location) {
            scope.users = [];
            scope.searchResults = [];
            scope.actualUsers = [];
            scope.filterText = "";            

            scope.routeTo = function (id) {
                location.path('/viewuser/' + id);
            };

            scope.refresh = function () {
              route.reload();
            };

            scope.query = {
                order: "displayName",
                limit: 10,
                page: 1,
            };
    
            scope.options = {
                boundaryLinks: true,
                rowSelection: true,
            };

            scope.getResultsPage = function (page, limit) {
              if (scope.searchText) {
                var startPosition = (page - 1) * limit;
                scope.clients = scope.actualUsers.slice(
                  startPosition,
                  startPosition + limit
                );
                return;
              }
              resourceFactory.clientResource.getAllClients(
                {
                  page: (page - 1) * limit,
                  limit: limit,
                },
                function (data) {
                  scope.clients = data.pageItems;
                }
              );
            };
            

          scope.refresh = function () {
            route.reload();
          };

          scope.search = function () {
            scope.actualUsers = [];
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
                  resource: "users",
                  exactMatch: exactMatch,
                },
                function (data) {
                  var arrayLength = data.length;
                  for (var i = 0; i < arrayLength; i++) {
                    var result = data[i];
                    var user = {};
                    user.status = {};
                    user.subStatus = {};
                    user.status.value = result.entityStatus.value;
                    user.status.code = result.entityStatus.code;
                    if (result.entityType == "USER") {
                      user.displayName = result.entityName;
                      user.accountNo = result.entityAccountNo;
                      user.id = result.entityId;
                      user.externalId = result.entityExternalId;
                      user.officeName = result.parentName;
                      user.phoneNumber = result.entityMobileNo;
                    }
                    scope.actualUsers.push(user);
                  }
                  scope.users = scope.actualUsers;
                  scope.totalUsers = scope.users.length;
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

        }
    });
    mifosX.ng.application.controller('UserListController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.UserListController]).run(function ($log) {
        $log.info("UserListController initialized");
    });
}(mifosX.controllers || {}));