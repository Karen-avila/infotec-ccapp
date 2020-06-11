(function (module) {
    mifosX.controllers = _.extend(module, {
        OfficesController: function (scope, resourceFactory, location) {
            scope.offices = [];
            scope.isTreeView = false;
            var idToNodeMap = {};

            scope.routeTo = function (id) {
                location.path('/viewoffice/' + id);
            };

            if (!scope.searchCriteria.offices) {
                scope.searchCriteria.offices = null;
                scope.saveSC();
            }
       
            scope.deepCopy = function (obj) {
                if (Object.prototype.toString.call(obj) === '[object Array]') {
                    var out = [], i = 0, len = obj.length;
                    for (; i < len; i++) {
                        out[i] = arguments.callee(obj[i]);
                    }
                    return out;
                }
                if (typeof obj === 'object') {
                    var out = {}, i;
                    for (i in obj) {
                        out[i] = arguments.callee(obj[i]);
                    }
                    return out;
                }
                return obj;
            }

            scope.OfficesPerPage =15;
            resourceFactory.officeResource.getAllOffices(function (data) {
                scope.offices = scope.deepCopy(data);
                for (var i in data) {
                    data[i].children = [];
                    idToNodeMap[data[i].id] = data[i];
                }
                function sortByParentId(a, b) {
                    return a.parentId - b.parentId;
                }

                data.sort(sortByParentId);

                var root = [];
                for (var i = 0; i < data.length; i++) {
                    var currentObj = data[i];
                    if (currentObj.children) {
                        currentObj.collapsed = "true";
                    }
                    if (typeof currentObj.parentId === "undefined") {
                        root.push(currentObj);
                    } else {
                        parentNode = idToNodeMap[currentObj.parentId];
                        parentNode.children.push(currentObj);
                    }
                }
                scope.treedata = root;
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
    mifosX.ng.application.controller('OfficesController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.OfficesController]).run(function ($log) {
        $log.info("OfficesController initialized");
    });
}(mifosX.controllers || {}));