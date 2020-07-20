(function (module) {
    mifosX.controllers = _.extend(module, {
        AccCoaController: function (scope, $rootScope, translate, resourceFactory, location) {
            $rootScope.tempNodeID = -100; // variable used to store nodeID (from directive), so it(nodeID) is available for detail-table

            scope.coadata = [];
            scope.coadata = null;
            scope.isTreeView = false;
            scope.dataProcessed = false;
            scope.idToNodeMap = {};
            scope.rootArray = [];
            scope.selected;
            scope.searchText = "";
            scope.searchResult = [];
            scope.showClosed = false;
            scope.ASSET = translate.instant('ASSET');
            scope.LIABILITY = translate.instant('LIABILITY');
            scope.EQUITY = translate.instant('EQUITY');
            scope.INCOME = translate.instant('INCOME');
            scope.EXPENSE = translate.instant('EXPENSE');
            scope.CREDITORDER = translate.instant('CREDITORDER');
            scope.DEBITORDER = translate.instant('DEBITORDER');
            scope.Accounting = translate.instant('Accounting');
            //  scope.ChartsPerPage = 20;
            scope.routeTo = function (id) {
                location.path('/viewglaccount/' + id);
            };
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
            if (!scope.searchCriteria.acoa) {
                scope.searchCriteria.acoa = null;
                scope.saveSC();
            }

            scope.filterText = scope.searchCriteria.acoa;

            scope.onFilter = function () {
                scope.searchCriteria.acoa = scope.filterText || '';
                scope.saveSC();
            };

            scope.search = function () {
                resourceFactory.accountCoaResource.getAllAccountCoas(function (data) {
                    scope.coadatas = scope.deepCopy(data);
                    scope.dataProcessed = false;
                });
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
            }


            scope.showTreeView = function () {
                scope.isTreeView = !scope.isTreeView;
                if (scope.isTreeView) {
                    const data = scope.coadata;
                    var assetObject = { id: -1, name: scope.ASSET, parentId: -999, children: [] };
                    var liabilitiesObject = { id: -2, name: scope.LIABILITY, parentId: -999, children: [] };
                    var equitiyObject = { id: -3, name: scope.EQUITY, parentId: -999, children: [] };
                    var incomeObject = { id: -4, name: scope.INCOME, parentId: -999, children: [] };
                    var expenseObject = { id: -5, name: scope.EXPENSE, parentId: -999, children: [] };
                    var debitOrderObject = { id: -6, name: scope.DEBITORDER, parentId: -999, children: [] };
                    var creditOrderObject = { id: -7, name: scope.CREDITORDER, parentId: -999, children: [] };
                    var rootObject = { id: -999, name: scope.Accounting, children: [] };
                    var rootArray = [rootObject, assetObject, liabilitiesObject, equitiyObject, incomeObject, expenseObject, debitOrderObject, creditOrderObject];

                    var idToNodeMap = {};
                    for (let i in rootArray) {
                        idToNodeMap[rootArray[i].id] = rootArray[i];
                    }

                    for (i = 0; i < 10; i++) {
                        if (data[i].type.value == "ASSET") {
                            if (data[i].parentId == null) data[i].parentId = -1;
                        } else if (data[i].type.value == "LIABILITY") {
                            if (data[i].parentId == null) data[i].parentId = -2;
                        } else if (data[i].type.value == "EQUITY") {
                            if (data[i].parentId == null) data[i].parentId = -3;
                        } else if (data[i].type.value == "INCOME") {
                            if (data[i].parentId == null) data[i].parentId = -4;
                        } else if (data[i].type.value == "EXPENSE") {
                            if (data[i].parentId == null) data[i].parentId = -5;
                        } else if (data[i].type.value == "DEBITORDER") {
                            if (data[i].parentId == null) data[i].parentId = -6;
                        } else if (data[i].type.value == "CREDITORDER") {
                            if (data[i].parentId == null) data[i].parentId = -7;
                        }
                        data[i].children = [];
                        idToNodeMap[data[i].id] = data[i];
                    }

                    function sortByParentId(a, b) {
                        return a.parentId - b.parentId;
                    }

                    data.sort(sortByParentId);
                    var glAccountsArray = scope.rootArray.concat(data);

                    var root = [];
                    for (let i = 0; i < glAccountsArray.length; i++) {
                        var currentObj = glAccountsArray[i];
                        if (typeof currentObj.parentId === "undefined") {
                            root.push(currentObj);
                        } else {
                            parentNode = idToNodeMap[currentObj.parentId];
                            parentNode.children.push(currentObj);
                            currentObj.collapsed = "true";
                        }
                    }
                    scope.treedata = root;
                }
            }

            const params = {
                detailed: false
            }
            
            scope.refresh = function () {
                route.reload();
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



    mifosX.ng.application.controller('AccCoaController', ['$scope', '$rootScope', '$translate', 'ResourceFactory', '$location', mifosX.controllers.AccCoaController]).run(function ($log) {
        $log.info("AccCoaController initialized");
    });
}(mifosX.controllers || {}));
