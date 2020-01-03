(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewOfficeController: function (scope, routeParams, route, location, resourceFactory) {
            scope.charges = [];
            scope.datatabledetails = [];
            scope.datatableLoaded = false;

            resourceFactory.officeResource.get({ officeId: routeParams.id }, function (data) {
                scope.office = data;
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
                console.log("=============================");
                console.log(JSON.stringify(scope.datatabledetails));

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
                    datatabledetail.isData = data.data.length > 0 ? true : false;
                    datatabledetail.isMultirow = data.columnHeaders[0].columnName == "id" ? true : false;
                    datatabledetail.showDataTableAddButton = !datatabledetail.isData || datatabledetail.isMultirow;
                    datatabledetail.showDataTableEditButton = datatabledetail.isData && !datatabledetail.isMultirow;
                    datatabledetail.singleRow = [];
                    datatabledetail.dataTableScoring = 0;
                    for (var i in data.columnHeaders) {
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
                        for (var i in data.columnHeaders) {
                            if (!datatabledetail.isMultirow) {
                                if (data.columnHeaders[i].columnName != "office_id") {
                                    var row = {};
                                    row.key = data.columnHeaders[i].columnName;
                                    row.value = data.data[0].row[i];
                                    datatabledetail.singleRow.push(row);
                                }
                            }
                        }
                    }
                    console.log(JSON.stringify(datatabledetail));
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
        }

    });
    mifosX.ng.application.controller('ViewOfficeController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory', mifosX.controllers.ViewOfficeController]).run(function ($log) {
        $log.info("ViewOfficeController initialized");
    });
}(mifosX.controllers || {}));