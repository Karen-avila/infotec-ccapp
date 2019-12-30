(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewGroupController: function (scope, routeParams, route, location, resourceFactory, dateFilter, $uibModal) {
            scope.group = [];
            scope.template = [];
            scope.formData = {};
            scope.groupReports = [];
            scope.choice = 0;
            scope.datatabledetails = [];
            scope.staffData = {};
            scope.openLoan = true;
            scope.openSaving = true;
            scope.editMeeting = false;
            scope.isGroupMembersAvailable = false;
            scope.datatableLoaded = false;
            scope.repSelect={};
            scope.routeToLoan = function (id) {
                location.path('/viewloanaccount/' + id);
            };
            scope.routeToSaving = function (id) {
                location.path('/viewsavingaccount/' + id);
            };
            scope.routeToMem = function (id) {
                location.path('/viewclient/' + id);
            };
            resourceFactory.groupResource.get({groupId: routeParams.id, associations: 'all'}, function (data) {
                scope.group = data;
                if(scope.group.clientMembers){
                    scope.isGroupMembersAvailable = (scope.group.clientMembers.length>0);
                }
                scope.isClosedGroup = scope.group.status.value == 'Closed';
                scope.staffData.staffId = data.staffId;
                if(data.collectionMeetingCalendar) {
                    scope.entityId = data.id;
                    scope.entityType = data.collectionMeetingCalendar.entityType.value;

                    if(scope.entityType == "GROUPS" && data.hierarchy == "."+ data.id + "." ){
                        scope.editMeeting = true;
                    }
                }
                
            });
            resourceFactory.runReportsResource.get({reportSource: 'GroupSummaryCounts', genericResultSet: 'false', R_groupId: routeParams.id}, function (data) {
                scope.summary = data[0];
            });
            resourceFactory.runReportsResource.get({ reportSource: 'GroupReports', genericResultSet: 'false', R_groupId: routeParams.id }, function (data) {
                scope.groupReports = data;
            });
            resourceFactory.groupAccountResource.get({groupId: routeParams.id}, function (data) {
                scope.groupAccounts = data;
            });
            resourceFactory.groupNotesResource.getAllNotes({groupId: routeParams.id}, function (data) {
                scope.groupNotes = data;
            });
            scope.delrole = function (id) {
                resourceFactory.groupResource.save({groupId: routeParams.id, command: 'unassignRole', roleId: id}, {}, function (data) {
                    resourceFactory.groupResource.get({groupId: routeParams.id}, function (data) {
                        route.reload();
                    });
                });
            };
            scope.deleteGroup = function () {
                $uibModal.open({
                    templateUrl: 'deletegroup.html',
                    controller: GroupDeleteCtrl
                });
            };
            scope.unassignStaffGroup = function () {
                $uibModal.open({
                    templateUrl: 'groupunassignstaff.html',
                    controller: GroupUnassignCtrl
                });
            };
            var GroupUnassignCtrl = function ($scope, $uibModalInstance) {
                $scope.unassign = function () {
                    resourceFactory.groupResource.save({groupId: routeParams.id, command: 'unassignstaff'}, scope.staffData, function (data) {
                        $uibModalInstance.close('unassign');
                        route.reload();
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };
            var GroupDeleteCtrl = function ($scope, $uibModalInstance) {
                $scope.delete = function () {
                    resourceFactory.groupResource.delete({groupId: routeParams.id}, {}, function (data) {
                        $uibModalInstance.close('delete');
                        location.path('/groups');
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };
            scope.cancel = function (id) {
                resourceFactory.groupResource.get({groupId: id}, function (data) {
                    route.reload();
                });
            };
            scope.viewDataTable = function (registeredTableName,data){
                if (scope.datatabledetails.isMultirow) {
                    location.path("/viewdatatableentry/"+registeredTableName+"/"+scope.group.id+"/"+data.row[0]);
                }else{
                    location.path("/viewsingledatatableentry/"+registeredTableName+"/"+scope.group.id);
                }
            };
            scope.saveNote = function () {
                resourceFactory.groupResource.save({groupId: routeParams.id, anotherresource: 'notes'}, this.formData, function (data) {
                    var today = new Date();
                    temp = { id: data.resourceId, note: scope.formData.note, createdByUsername: "test", createdOn: today };
                    scope.groupNotes.push(temp);
                    scope.formData.note = "";
                    scope.predicate = '-id';
                });
            };
            scope.isLoanClosed = function (loanaccount) {
                if (loanaccount.status.code === "loanStatusType.closed.written.off" ||
                    loanaccount.status.code === "loanStatusType.closed.obligations.met" ||
                    loanaccount.status.code === "loanStatusType.closed.reschedule.outstanding.amount" ||
                    loanaccount.status.code === "loanStatusType.withdrawn.by.client" ||
                    loanaccount.status.code === "loanStatusType.rejected") {
                    return true;
                } else {
                    return false;
                }
            };
            scope.setLoan = function () {
                if (scope.openLoan) {
                    scope.openLoan = false
                } else {
                    scope.openLoan = true;
                }
            };
            scope.setSaving = function () {
                if (scope.openSaving) {
                    scope.openSaving = false;
                } else {
                    scope.openSaving = true;
                }
            };
            scope.isSavingClosed = function (savingaccount) {
                if (savingaccount.status.code === "savingsAccountStatusType.withdrawn.by.applicant" ||
                    savingaccount.status.code === "savingsAccountStatusType.closed" ||
                    savingaccount.status.code === "savingsAccountStatusType.rejected") {
                    return true;
                } else {
                    return false;
                }
            };
            scope.isLoanNotClosed = function (loanaccount) {
                if (loanaccount.status.code === "loanStatusType.closed.written.off" ||
                    loanaccount.status.code === "loanStatusType.closed.obligations.met" ||
                    loanaccount.status.code === "loanStatusType.closed.reschedule.outstanding.amount" ||
                    loanaccount.status.code === "loanStatusType.withdrawn.by.client" ||
                    loanaccount.status.code === "loanStatusType.rejected") {
                    return false;
                } else {
                    return true;
                }
            };

            scope.isSavingNotClosed = function (savingaccount) {
                if (savingaccount.status.code === "savingsAccountStatusType.withdrawn.by.applicant" ||
                    savingaccount.status.code === "savingsAccountStatusType.closed" ||
                    savingaccount.status.code === "savingsAccountStatusType.rejected") {
                    return false;
                } else {
                    return true;
                }
            };

            scope.isActiveMember = function (status) {
                if (status == 'clientStatusType.active') {
                    return true;
                } else {
                    return false;
                }
            };

            resourceFactory.DataTablesResource.getAllDataTables({apptable: 'm_group'}, function (data) {
                scope.groupdatatables = data;
                if(scope.datatableLoaded == false) {
                	for(var i in data){
                		if(data[i].registeredTableName){
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
                	datatabledetail.registeredTableName = registeredTableName;
                	datatabledetail.isData = false;
                	if (data.data) {
                        datatabledetail.isData = data.data.length > 0 ? true : false;
                    }
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
                            	if (data.columnHeaders[i].columnName != "group_id") {
                            		var row = {};
                            		row.key = data.columnHeaders[i].columnName;
                            		row.value = data.data[0].row[i];
                            		datatabledetail.singleRow.push(row);                            		
                            	}
                            }
                        }
                    }
                    scope.datatabledetails.push(datatabledetail);
                });
            };
            
            scope.getDatatableColumn = function (tableName, columnName) {
                var temp = columnName.split("_cd_");
                if (temp[1] && temp[1] != "") {
                    columnName = temp[1];
                }               
                return tableName + '.' + columnName;
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
                    return data;
                } else {
                    return '';
                }
            }
            
            scope.reportsGroup = function (rep) {
                $uibModal.open({
                    templateUrl: 'reporte.html',
                    controller: function ($scope, $uibModalInstance){
                        var aux=angular.copy(routeParams);
                        routeParams.name= rep.report_name;
                        routeParams.type='Jasper';
                        routeParams.reportId= rep.id;
                        routeParams.groupAccountNo=scope.group.accountNo;
                        $scope.cancel = function () {
                        	$uibModalInstance.dismiss('cancel');
                        	routeParams=aux;
                        	 route.reload();
                        }
                        },
                        backdrop: 'static',
                        keyboard: false
                });
            };
                        
            scope.deleteAll = function (apptableName, entityId) {
                resourceFactory.DataTablesResource.delete({datatablename: apptableName, entityId: entityId, genericResultSet: 'true'}, {}, function (data) {
                    route.reload();
                });
            };

        }
    });
    mifosX.ng.application.controller('ViewGroupController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory', 'dateFilter', '$uibModal', mifosX.controllers.ViewGroupController]).run(function ($log) {
        $log.info("ViewGroupController initialized");
    });
}(mifosX.controllers || {}));
