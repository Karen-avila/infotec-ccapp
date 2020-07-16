(function (module) {
    mifosX.controllers = _.extend(module, {
        UserListController: function (scope, resourceFactory, location) {
            scope.users = [];

            scope.routeTo = function (id) {
                location.path('/viewuser/' + id);
            };

            scope.query = {
                order: "username",
                limit: 25,
                page: 1,
            };
    
            scope.options = {
                boundaryLinks: true,
                rowSelection: true,
            };
              
            resourceFactory.userListResource.getAllUsers(function (data) {
                scope.users = data;
                scope.totalUsers = data.length;
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

            scope.getUserStatus = function(isEnabled) {
                if (isEnabled) {
                    return "Enabled";
                } else {
                    return "Disabled";
                }

            }
        }
    });
    mifosX.ng.application.controller('UserListController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.UserListController]).run(function ($log) {
        $log.info("UserListController initialized");
    });
}(mifosX.controllers || {}));