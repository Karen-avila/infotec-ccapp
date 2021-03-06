(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewOfficeController: function (scope, routeParams, route, location, resourceFactory) {
            scope.charges = [];
            scope.datatabledetails = [];
            scope.datatableLoaded = false;
            scope.center = {};

            resourceFactory.officeResource.get({ officeId: routeParams.id }, function (data) {
                scope.office = data;
                scope.office.address = data.address[0];
                var mainMarker = {
                    lat: parseFloat(scope.office.address.latitude),
                    lng: parseFloat(scope.office.address.longitude),
                    focus: true,
                    message: "Ubicación",
                    draggable: true
                };

                angular.extend(scope, {
                    center: {
                        lat: parseFloat(scope.office.address.latitude),
                        lng: parseFloat(scope.office.address.longitude),

                        zoom: 16
                    },
                    markers: {
                        mainMarker: angular.copy(mainMarker)
                    },
                    position: {
                        lat: parseFloat(scope.office.address.latitude),
                        lng: parseFloat(scope.office.address.longitude),
                    },
                    events: { // or just {} //all events
                        markers: {
                            enable: ['dragend']
                            //logic: 'emit'
                        }
                    }
                });
            });
            
            resourceFactory.DataTablesResource.getAllDataTables({ apptable: 'm_office' }, function (data) {
                scope.officedatatables = data;
                if (scope.datatableLoaded == false) {
                    for (var i in data) {
                        if (data[i].registeredTableName) {
                            scope.dataTableChange(data[i].registeredTableName);
                        }
                    }
                    scope.datatableLoaded = true;
                }
            });
            scope.dataTableChange = function (registeredTableName) {
                resourceFactory.DataTablesResource.getTableDetails({
                    datatablename: registeredTableName,
                    entityId: routeParams.id, genericResultSet: 'true'
                }, function (data) {
                    var datatabledetail = data;
                    if (data.data) {
                        datatabledetail.isData = data.data.length > 0 ? true : false;
                    }
                    datatabledetail.registeredTableName = registeredTableName;
                    datatabledetail.isData = data.data.length > 0 ? true : false;
                    datatabledetail.isMultirow = data.datatableData.columnHeaderData[0].columnName == "id" ? true : false;
                    datatabledetail.showDataTableAddButton = !datatabledetail.isData || datatabledetail.isMultirow;
                    datatabledetail.showDataTableEditButton = datatabledetail.isData && !datatabledetail.isMultirow;
                    datatabledetail.singleRow = [];
                    datatabledetail.dataTableScoring = 0;
                    for (var i in data.datatableData.columnHeaderData) {
                        if (datatabledetail.columnHeaders[i].columnCode) {
                            for (var j in datatabledetail.columnHeaders[i].columnValues) {
                                for (var k in data.data) {
                                    if (data.data[k].row[i] == datatabledetail.columnHeaders[i].columnValues[j].id) {
                                        data.data[k].row[i] = {
                                            value: datatabledetail.columnHeaders[i].columnValues[j].value,
                                            score: datatabledetail.columnHeaders[i].columnValues[j].score
                                        }
                                        if (datatabledetail.columnHeaders[i].columnValues[j].score) {
                                            datatabledetail.dataTableScoring += datatabledetail.columnHeaders[i].columnValues[j].score;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (datatabledetail.isData) {
                        for (var i in data.datatableData.columnHeaderData) {
                            if (!datatabledetail.isMultirow) {
                                if (data.datatableData.columnHeaderData[i].columnName != "office_id") {
                                    var row = {};
                                    row.key = data.datatableData.columnHeaderData[i].columnName;
                                    row.value = data.data[0].row[i];
                                    datatabledetail.singleRow.push(row);
                                }
                            }
                        }
                    }
                    scope.datatabledetails.push(datatabledetail);
                });
            };

            scope.deleteAll = function (apptableName, entityId) {
                resourceFactory.DataTablesResource.delete({ datatablename: apptableName, entityId: entityId, genericResultSet: 'true' }, {}, function (data) {
                    route.reload();
                });
            };

            scope.viewDataTable = function (registeredTableName, data) {
                if (scope.datatabledetails.isMultirow) {
                    location.path("/viewdatatableentry/" + registeredTableName + "/" + scope.office.id + "/" + data.row[0]);
                } else {
                    location.path("/viewsingledatatableentry/" + registeredTableName + "/" + scope.office.id);
                }
            };

            scope.getDatatableColumn = function (tableName, columnName) {
                var temp = columnName.split("_cd_");
                if (temp[1] && temp[1] != "") {
                    columnName = temp[1];
                }
                // return tableName + '.' + columnName;
                return columnName;
            }

            scope.getDatatableValue = function (data) {
                if (data === null) {
                    return '';
                }
                if (typeof data != "undefined") {
                    if (typeof data.value != "undefined" && data.value != null && typeof data.value.value != "undefined") {
                        return data.value.value + ' (' + data.value.score + ')';
                    } else {
                        if (typeof data.value != "undefined" && data.value != null) {
                            return data.value;
                        } else {
                            return '';
                        }
                    }
                } else {
                    return '';
                }
            }
        }

    });
    mifosX.ng.application.controller('ViewOfficeController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory', mifosX.controllers.ViewOfficeController]).run(function ($log) {
        $log.info("ViewOfficeController initialized");
    });
}(mifosX.controllers || {}));