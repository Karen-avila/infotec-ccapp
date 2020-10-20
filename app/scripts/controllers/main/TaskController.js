(function (module) {
    mifosX.controllers = _.extend(module, {
        TaskController: function (scope,$rootScope, resourceFactory, route, dateFilter, $uibModal, location, translate, MIN_DATEPICKER, MAX_DATEPICKER) {
            scope.clients = [];
            scope.loans = [];
            scope.offices = [];
            scope.pendingApproval = [];
            scope.pendingToAuthorize = [];
            scope.pendingDisburse = [];
            scope.errorSignature = [];
            var idToNodeMap = {};
            scope.formData = {
                limit: 100
            };
            scope.loanTemplate = {};
            scope.loanGroupTemplate = {};
            scope.loanDisbursalTemplate = {};
            scope.date = {};
            scope.checkData = [];
            scope.isCollapsed = true;
            scope.approveData = {};
            scope.restrictDate = new Date();
            scope.minDatePicker = new Date(MIN_DATEPICKER);
            scope.maxDatePicker = new Date(MAX_DATEPICKER);
            scope.date.from = new Date('2020-01-02');
            scope.date.to = new Date();
            scope.showLoanApprovalDetail = [];
            //this value will be changed within each specific tab
            scope.requestIdentifier = "loanId";
            scope.isAllPendingToAuthorizeSelected = false;
            scope.itemsPerPage = 15;
            scope.loanRescheduleData = [];

            scope.query = {
                order: "loanId",
                limit: 25,
                page: 1,
            };
        
            scope.options = {
                boundaryLinks: true,
                rowSelection: true,
                pageSelector: true,
            };

            scope.checkForBulkLoanRescheduleApprovalData = [];
            scope.rescheduleData = function () {
                if($rootScope.hasPermission('RESCHEDULE_LOAN')){
                    resourceFactory.loanRescheduleResource.getAll({ command: 'pending' }, function (data) {
                        scope.loanRescheduleData = data;
                    });
                }

            };
            scope.rescheduleData();

            resourceFactory.checkerInboxResource.get({ templateResource: 'searchtemplate' }, function (data) {
                scope.checkerTemplate = data;
                scope.actionNames = [];
                for (i = 0; i < data.actionNames.length; i++) {
                    scope.actionNames[i] = {};
                    scope.actionNames[i].value = data.actionNames[i];
                    scope.actionNames[i].text = translate.instant('task.action.' + data.actionNames[i]);
                }

                scope.actionNames.sort((a, b) => (a.text > b.text) ? 1 : ((b.text > a.text) ? -1 : 0));

                scope.entityNames = [];
                for (i = 0; i < data.entityNames.length; i++) {
                    scope.entityNames[i] = {};
                    scope.entityNames[i].value = data.entityNames[i];
                    scope.entityNames[i].text = translate.instant('task.entity.' + data.entityNames[i]);
                }

                scope.entityNames.sort((a, b) => (a.text > b.text) ? 1 : ((b.text > a.text) ? -1 : 0));
            });

            resourceFactory.fundsResource.getFunds({ activeOnly: 'true' }, function (data) {
                scope.funds = data;
            });

            resourceFactory.codeOptionsResource.get({ codeName: 'PAYMENT_CHANNEL' }, function (data) {
                scope.channelOptions = data.codeValues;
            });

            resourceFactory.checkerInboxResource.search(function (data) {
                scope.searchData = data;
            });
            scope.viewUser = function (item) {
                scope.userTypeahead = true;
                scope.formData.user = item.id;
            };
            scope.checkerInboxAllCheckBoxesClicked = function () {
                var newValue = !scope.checkerInboxAllCheckBoxesMet();
                if (!angular.isUndefined(scope.searchData)) {
                    for (var i = scope.searchData.length - 1; i >= 0; i--) {
                        scope.checkData[scope.searchData[i].id] = newValue;
                    };
                }
            }
            scope.checkerInboxAllCheckBoxesMet = function () {
                var checkBoxesMet = 0;
                if (!angular.isUndefined(scope.searchData)) {
                    _.each(scope.searchData, function (data) {
                        if (_.has(scope.checkData, data.id)) {
                            if (scope.checkData[data.id] == true) {
                                checkBoxesMet++;
                            }
                        }
                    });
                    return (checkBoxesMet === scope.searchData.length);
                }
            }
            scope.clientApprovalAllCheckBoxesClicked = function (officeName) {
                var newValue = !scope.clientApprovalAllCheckBoxesMet(officeName);
                if (!angular.isUndefined(scope.groupedClients) && !angular.isUndefined(scope.groupedClients[officeName])) {
                    for (var i = scope.groupedClients[officeName].length - 1; i >= 0; i--) {
                        scope.approveData[scope.groupedClients[officeName][i].id] = newValue;
                    };
                }
            }
            scope.clientApprovalAllCheckBoxesMet = function (officeName) {
                var checkBoxesMet = 0;
                if (!angular.isUndefined(scope.groupedClients) && !angular.isUndefined(scope.groupedClients[officeName])) {
                    _.each(scope.groupedClients[officeName], function (data) {
                        if (_.has(scope.approveData, data.id)) {
                            if (scope.approveData[data.id] == true) {
                                checkBoxesMet++;
                            }
                        }
                    });
                    return (checkBoxesMet === scope.groupedClients[officeName].length);
                }
            }
            scope.loanApprovalAllCheckBoxesClicked = function (office) {
                var newValue = !scope.loanApprovalAllCheckBoxesMet(office);
                if (!angular.isUndefined(scope.offices)) {
                    for (var i = office.loans.length - 1; i >= 0; i--) {
                        scope.loanTemplate[office.loans[i].id] = newValue;
                    };
                }
            }
            scope.loanApprovalAllLoansClicked = function () {
                var newValue = !scope.loanApprovalAllLoans;
                if (!angular.isUndefined(scope.pendingApproval)) {
                    for (var i = scope.pendingApproval.length - 1; i >= 0; i--) {
                        scope.loanTemplate[scope.pendingApproval[i].loan.id] = newValue;
                    };
                }
            }
            scope.loanApprovalAllLoansCheckMet = function () {
                var checkBoxesMet = 0;
                if (!angular.isUndefined(scope.pendingApproval)) {
                    _.each(scope.pendingApproval, function (data) {
                        if (_.has(scope.loanTemplate, data.loan.id)) {
                            if (scope.loanTemplate[data.loan.id] == true) {
                                checkBoxesMet++;
                            }
                        }
                    });
                    return (checkBoxesMet === scope.pendingApproval.length);
                }
            }
            scope.loanApprovalAllCheckBoxesMet = function (office) {
                var checkBoxesMet = 0;
                if (!angular.isUndefined(scope.offices)) {
                    _.each(office.loans, function (data) {
                        if (_.has(scope.loanTemplate, data.id)) {
                            if (scope.loanTemplate[data.id] == true) {
                                checkBoxesMet++;
                            }
                        }
                    });
                    return (checkBoxesMet === office.loans.length);
                }
            }
            scope.loanDisbursalAllCheckBoxesClicked = function () {
                var newValue = !scope.loanDisbursalAllCheckBoxesMet();
                if (!angular.isUndefined(scope.pendingDisburse)) {
                    for (var i = scope.pendingDisburse.length - 1; i >= 0; i--) {
                        scope.loanDisbursalTemplate[scope.pendingDisburse[i].id] = newValue;
                    };
                }
            }
            scope.loanDisbursalAllCheckBoxesMet = function () {
                var checkBoxesMet = 0;
                if (!angular.isUndefined(scope.pendingDisburse)) {
                    _.each(scope.pendingDisburse, function (data) {
                        if (_.has(scope.loanDisbursalTemplate, data.id)) {
                            if (scope.loanDisbursalTemplate[data.id] == true) {
                                checkBoxesMet++;
                            }
                        }
                    });
                    return (checkBoxesMet === scope.pendingDisburse.length);
                }
            }
            scope.approveOrRejectChecker = function (action) {
                if (scope.checkData) {
                    $uibModal.open({
                        templateUrl: 'approvechecker.html',
                        controller: CheckerApproveCtrl,
                        resolve: {
                            action: function () {
                                return action;
                            }
                        }
                    });
                }
            };
            var CheckerApproveCtrl = function ($scope, $uibModalInstance, action) {
                $scope.approve = function () {
                    var totalApprove = 0;
                    var approveCount = 0;
                    _.each(scope.checkData, function (value, key) {
                        if (value == true) {
                            totalApprove++;
                        }
                    });
                    _.each(scope.checkData, function (value, key) {
                        if (value == true) {

                            resourceFactory.checkerInboxResource.save({ templateResource: key, command: action }, {}, function (data) {
                                approveCount++;
                                if (approveCount == totalApprove) {
                                    scope.search();
                                }
                            }, function (data) {
                                approveCount++;
                                if (approveCount == totalApprove) {
                                    scope.search();
                                }
                            });
                        }
                    });
                    scope.checkData = {};
                    $uibModalInstance.close('approve');
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

            scope.deleteChecker = function () {
                if (scope.checkData) {
                    $uibModal.open({
                        templateUrl: 'deletechecker.html',
                        controller: CheckerDeleteCtrl
                    });
                }
            };
            var CheckerDeleteCtrl = function ($scope, $uibModalInstance) {
                $scope.delete = function () {
                    var totalDelete = 0;
                    var deleteCount = 0
                    _.each(scope.checkData, function (value, key) {
                        if (value == true) {
                            totalDelete++;
                        }
                    });
                    _.each(scope.checkData, function (value, key) {
                        if (value == true) {

                            resourceFactory.checkerInboxResource.delete({ templateResource: key }, {}, function (data) {
                                deleteCount++;
                                if (deleteCount == totalDelete) {
                                    scope.search();
                                }
                            }, function (data) {
                                deleteCount++;
                                if (deleteCount == totalDelete) {
                                    scope.search();
                                }
                            });
                        }
                    });
                    scope.checkData = {};
                    $uibModalInstance.close('delete');
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

            scope.approveClient = function () {
                if (scope.approveData) {
                    $uibModal.open({
                        templateUrl: 'approveclient.html',
                        controller: ApproveClientCtrl,
                        resolve: {
                            items: function () {
                                return scope.approveData;
                            }
                        }
                    });
                }
            };

            $('#mifos-reskin-ui-container').on('scroll', function () {
                if ($(this).scrollTop() > 100) {
                    $('.head-affix').css({
                        position: "fixed",
                        top: "50px",
                        width: "80%"
                    });

                } else {
                    $('.head-affix').css({
                        position: 'static',
                        width: "100%"
                    });
                }
            });

            var ApproveClientCtrl = function ($scope, $uibModalInstance, items) {
                $scope.restrictDate = new Date();
                $scope.date = {};
                $scope.date.actDate = new Date();
                $scope.approve = function (act) {
                    var activate = {}
                    activate.activationDate = dateFilter(act, scope.df);
                    activate.dateFormat = scope.df;
                    activate.locale = scope.optlang.code;
                    var totalClient = 0;
                    var clientCount = 0
                    _.each(items, function (value, key) {
                        if (value == true) {
                            totalClient++;
                        }
                    });

                    scope.batchRequests = [];
                    scope.requestIdentifier = "clientId";

                    var reqId = 1;
                    _.each(items, function (value, key) {
                        if (value == true) {
                            scope.batchRequests.push({
                                requestId: reqId++, relativeUrl: "clients/" + key + "?command=activate",
                                method: "POST", body: JSON.stringify(activate)
                            });
                        }
                    });

                    resourceFactory.batchResource.post(scope.batchRequests, function (data) {
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].statusCode == '200') {
                                clientCount++;
                                if (clientCount == totalClient) {
                                    route.reload();
                                }
                            }
                        }
                    });

                    scope.approveData = {};
                    $uibModalInstance.close('delete');
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

            scope.routeTo = function (id) {
                location.path('viewcheckerinbox/' + id);
            };

            scope.routeToClient = function (id) {
                location.path('viewclient/' + id);
            };

            resourceFactory.officeResource.getAllOffices(function (data) {
                scope.offices = data;
                for (var i in data) {
                    data[i].loans = [];
                    idToNodeMap[data[i].id] = data[i];
                }

                scope.loanResource = function () {
                    scope.pendingApproval = [];
                    scope.pendingToAuthorize = [];
                    scope.pendingDisburse = [];

                    if($rootScope.hasPermission('APPROVE_LOAN_CHECKER')){
                        resourceFactory.loanResource.getAllLoans({ tiny: true, limit: 100, sqlSearch: 'l.loan_status_id = 100' }, function (loanData) {
                            scope.adminloans(loanData.pageItems);
                        });
                    }

                    if($rootScope.hasPermission('AUTHORIZE_LOAN')){
                        resourceFactory.loanResource.getAllLoans({ tiny: true, limit: 100, sqlSearch: 'l.loan_status_id = 200 and l.loan_sub_status_id = 210' }, function (loanData) {
                            scope.adminloans(loanData.pageItems);
                        });
                    }    

                    if($rootScope.hasPermission('DISBURSALUNDO_LOAN_CHECKER')){
                        resourceFactory.loanResource.getAllLoans({ tiny: true, limit: 100, sqlSearch: 'l.loan_status_id = 200 and l.loan_sub_status_id = 220' }, function (loanData) {
                            scope.adminloans(loanData.pageItems);
                        });
                    }

                    var finalArray = [];
                    for (var i in scope.offices) {
                        if (scope.offices[i].loans && scope.offices[i].loans.length > 0) {
                            finalArray.push(scope.offices[i]);
                        }
                    }
                    scope.offices = finalArray;
                }

                scope.adminloans = function(loanResult){
                    for (var i in loanResult) {
                        if (loanResult[i].status.pendingApproval) {
                            var tempOffice = undefined;
                            if (loanResult[i].group) {
                                tempOffice = idToNodeMap[loanResult[i].group.officeId];
                                tempOffice.loans.push(loanResult[i]);

                                var wasFound = false;
                                for (var j = 0; j < scope.pendingApproval.length; j++) {
                                    if (scope.pendingApproval[j].client.name === loanResult[i].group.name) {
                                        scope.pendingApproval[j].loans.push({
                                            id: loanResult[i].id,
                                            accountNo: loanResult[i].accountNo,
                                            client: {
                                                id: loanResult[i].clientId,
                                                name: loanResult[i].clientName,
                                                loanCounter: loanResult[i].groupLoanCounter,
                                                staffName: loanResult[i].loanOfficerName,
                                            },
                                            productName: loanResult[i].loanProductName,
                                            amount: loanResult[i].principal,
                                            loanPurposeName: loanResult[i].loanPurposeName
                                        });
                                        scope.pendingApproval[j].loan.amount += loanResult[i].principal;
                                        wasFound = true;
                                        break;
                                    }
                                }
                                if (!wasFound) {
                                    scope.pendingApproval.push({
                                        office: tempOffice,
                                        individual: false,
                                        client: {
                                            id: loanResult[i].group.officeId,
                                            name: loanResult[i].group.name,
                                            loanCounter: loanResult[i].group.loanCounter,
                                            staffName: loanResult[i].loanOfficerName,
                                        },
                                        loan: {
                                            id: loanResult[i].id,
                                            accountNo: loanResult[i].accountNo,
                                            productName: loanResult[i].loanProductName,
                                            amount: loanResult[i].principal,
                                            loanPurposeName: loanResult[i].loanPurposeName
                                        },
                                        loans: [{
                                            id: loanResult[i].id,
                                            accountNo: loanResult[i].accountNo,
                                            client: {
                                                id: loanResult[i].clientId,
                                                name: loanResult[i].clientName,
                                                loanCounter: loanResult[i].groupLoanCounter,
                                                staffName: loanResult[i].loanOfficerName,
                                            },
                                            productName: loanResult[i].loanProductName,
                                            amount: loanResult[i].principal,
                                            loanPurposeName: loanResult[i].loanPurposeName
                                        }]
                                    });
                                }

                            } else if (loanResult[i].clientOfficeId) {
                                tempOffice = idToNodeMap[loanResult[i].clientOfficeId];
                                tempOffice.loans.push(loanResult[i]);
                                scope.pendingApproval.push({
                                    office: tempOffice,
                                    individual: true,
                                    client: {
                                        id: loanResult[i].clientId,
                                        name: loanResult[i].clientName,
                                        loanCounter: loanResult[i].groupLoanCounter,
                                        staffName: loanResult[i].loanOfficerName,
                                    },
                                    loan: {
                                        id: loanResult[i].id,
                                        accountNo: loanResult[i].accountNo,
                                        productName: loanResult[i].loanProductName,
                                        amount: loanResult[i].principal,
                                        loanPurposeName: loanResult[i].loanPurposeName
                                    }
                                });
                            }
                        }
                        else if (loanResult[i].status.waitingForDisbursal) {
                            var tempOffice = undefined;
                            if (loanResult[i].group) {
                                tempOffice = idToNodeMap[loanResult[i].group.officeId];
                                tempOffice.loans.push(loanResult[i]);

                                var wasFound = false;
                                for (var j = 0; j < scope.pendingDisburse.length; j++) {
                                    if (scope.pendingDisburse[j].client.name === loanResult[i].group.name) {
                                        scope.pendingDisburse[j].loans.push({
                                            id: loanResult[i].id,
                                            accountNo: loanResult[i].accountNo,
                                            client: {
                                                id: loanResult[i].clientId,
                                                name: loanResult[i].clientName,
                                                loanCounter: loanResult[i].group.loanCounter,
                                                staffName: loanResult[i].loanOfficerName,
                                            },
                                            productName: loanResult[i].loanProductName,
                                            amount: loanResult[i].principal,
                                            loanPurposeName: loanResult[i].loanPurposeName
                                        });
                                        scope.pendingDisburse[j].loan.amount += loanResult[i].principal;
                                        wasFound = true;
                                        break;
                                    }
                                }
                                if (!wasFound) {
                                    scope.pendingDisburse.push({
                                        office: tempOffice,
                                        individual: false,
                                        client: {
                                            id: loanResult[i].group.officeId,
                                            name: loanResult[i].group.name,
                                            loanCounter: loanResult[i].group.loanCounter,
                                            staffName: loanResult[i].loanOfficerName,
                                        },
                                        loan: {
                                            id: loanResult[i].id,
                                            accountNo: loanResult[i].accountNo,
                                            productName: loanResult[i].loanProductName,
                                            amount: loanResult[i].principal,
                                            loanPurposeName: loanResult[i].loanPurposeName
                                        },
                                        loans: [{
                                            id: loanResult[i].id,
                                            accountNo: loanResult[i].accountNo,
                                            client: {
                                                id: loanResult[i].clientId,
                                                name: loanResult[i].clientName,
                                                loanCounter: loanResult[i].groupLoanCounter,
                                                staffName: loanResult[i].loanOfficerName,
                                            },
                                            productName: loanResult[i].loanProductName,
                                            amount: loanResult[i].principal,
                                            loanPurposeName: loanResult[i].loanPurposeName
                                        }]
                                    });
                                }

                            } else if (loanResult[i].clientOfficeId) {
                                tempOffice = idToNodeMap[loanResult[i].clientOfficeId];
                                tempOffice.loans.push(loanResult[i]);
                                if(loanResult[i].subStatus != undefined && loanResult[i].subStatus.value == "Authorized"){
                                    scope.pendingDisburse.push({
                                        office: tempOffice,
                                        individual: true,
                                        client: {
                                            id: loanResult[i].clientId,
                                            name: loanResult[i].clientName,
                                            loanCounter: loanResult[i].groupLoanCounter,
                                            staffName: loanResult[i].loanOfficerName,
                                        },
                                        loan: {
                                            id: loanResult[i].id,
                                            accountNo: loanResult[i].accountNo,
                                            productName: loanResult[i].loanProductName,
                                            amount: loanResult[i].principal,
                                            loanPurposeName: loanResult[i].loanPurposeName
                                        }
                                    });
                                }else if(loanResult[i].subStatus != undefined && loanResult[i].subStatus.value == "Waiting for authorization"){
                                    scope.pendingToAuthorize.push({
                                        office: tempOffice,
                                        individual: true,
                                        client: {
                                            id: loanResult[i].clientId,
                                            name: loanResult[i].clientName,
                                            loanCounter: loanResult[i].groupLoanCounter,
                                            staffName: loanResult[i].loanOfficerName,
                                        },
                                        loan: {
                                            id: loanResult[i].id,
                                            accountNo: loanResult[i].accountNo,
                                            productName: loanResult[i].loanProductName,
                                            amount: loanResult[i].principal,
                                            loanPurposeName: loanResult[i].loanPurposeName
                                        }
                                    });
                                }
                            }
                        }
                    }
                }

                scope.loanResource();
            });

            scope.getDataResources =  function(){
                if($rootScope.hasPermission('ACTIVATE_CLIENT_CHECKER')){
                    resourceFactory.clientResource.getAllClients({ tiny:true, limit:100, sqlSearch: 'c.status_enum=100' }, function (data) {
                        scope.pendingClientApproval = data.pageItems;
                        scope.groupedClients = _.groupBy(data.pageItems, "officeName");
                    });
                }
    
                if($rootScope.hasPermission('ACTIVATE_CLIENT_CHECKER')){
                    resourceFactory.groupResource.getAllGroups({ limit:100, sqlSearch: 'g.status_enum=100' }, function (data) {
                        scope.groupedGroups = data;
                    });
                }
            }
            
            scope.getDataResources();

            scope.showGroupDetail = function (groupId, prefix) {
                angular.element(document.querySelector("#grp_" + prefix + groupId)).toggleClass("collapse");
            }

            scope.search = function () {
                scope.isCollapsed = true;
                var reqFromDate = dateFilter(scope.date.from, 'yyyy-MM-dd');
                var reqToDate = dateFilter(scope.date.to, 'yyyy-MM-dd');
                var params = {};
                if (scope.formData.action) {
                    params.actionName = scope.formData.action;
                }

                if (scope.formData.entity) {
                    params.entityName = scope.formData.entity;
                }

                if (scope.formData.resourceId) {
                    params.resourceId = scope.formData.resourceId;
                }

                if (scope.formData.user) {
                    params.makerId = scope.formData.user;
                }

                if (scope.date.from) {
                    params.makerDateTimeFrom = reqFromDate;
                }

                if (scope.date.to) {
                    params.makerDateTimeto = reqToDate;
                }

                resourceFactory.checkerInboxResource.search(params, function (data) {
                    scope.searchData = data;
                    if (scope.userTypeahead) {
                        scope.formData.user = '';
                        scope.userTypeahead = false;
                        scope.user = '';
                    }
                });
            };

            scope.searchCredit = function () {
                scope.isCollapsed = true;
                var reqFromDate = dateFilter(scope.date.from, 'yyyy-MM-dd');
                var reqToDate = dateFilter(scope.date.to, 'yyyy-MM-dd');
                var params = {limit: 200};

                if (scope.formData.status > 0) {
                    params.status = scope.formData.status;
                }

                if (scope.date.from) {
                    params.fromDate = reqFromDate;
                }

                if (scope.date.to) {
                    params.toDate = reqToDate;
                }

                resourceFactory.loansDashboard.search(params, function (data) {
                    scope.searchedLoansFiltered = data.pageItems;
                    console.log(scope.searchedLoansFiltered);
                    for (var i = 0; i < scope.searchedLoansFiltered.length; i++) {
                        if(scope.searchedLoansFiltered[i].validationdate) {
                            scope.searchedLoansFiltered[i].orderDate = new Date(scope.searchedLoansFiltered[i].validationdate);
                        } else {
                            scope.searchedLoansFiltered[i].orderDate = "";
                        }
                    }
                });
            };

            scope.searchSocialBank = function () {
                scope.isCollapsed = true;
                var reqFromDate = dateFilter(scope.date.from, 'yyyy-MM-dd');
                var reqToDate = dateFilter(scope.date.to, 'yyyy-MM-dd');
                var params = {limit: scope.formData.limit};

                if (scope.formData.clientStatus > 0) {
                    params.clientStatus = scope.formData.clientStatus;
                }

                if (scope.date.from) {
                    params.fromDate = reqFromDate;
                }

                if (scope.date.to) {
                    params.toDate = reqToDate;
                }

                resourceFactory.loansDashboard.search(params, function (data) {
                    scope.searchedSocialBanks = data.pageItems;

                    for (var i = 0; i < scope.searchedSocialBanks.length; i++) {
                        scope.searchedSocialBanks[i].orderDate = new Date(scope.searchedSocialBanks[i].submittedDate);
                    }

                    if (scope.formData.clientStatus > 0) {
                        scope.searchedSocialBanks = scope.searchedSocialBanks.filter(function (item) {
                            return item.clientStatus.id == scope.formData.clientStatus;
                        });
                    }
                    
                    if (scope.formData.entity > 0) {
                        scope.searchedSocialBanks = scope.searchedSocialBanks.filter(function (item) {
                            return item.city == scope.formData.entity.toUpperCase();
                        });
                    }
                });
            };

            scope.approveLoan = function () {
                var selectedAccounts = 0;
                _.each(scope.loanTemplate, function (value, id) {
                    if (value == true) {
                        _.each(scope.pendingApproval, function (item) {
                            if (id == item.client.id) {
                                if (item.individual == true) {
                                    selectedAccounts++;
                                } else {
                                    selectedAccounts += item.loans.length;
                                }
                            }
                        });
                    }
                });
                // console.log("Loans for approval selected: " + selectedAccounts);
                if (selectedAccounts > 0) {
                    $uibModal.open({
                        templateUrl: 'approveloan.html',
                        controller: ApproveLoanCtrl
                    });
                }
            };

            var ApproveLoanCtrl = function ($scope, $uibModalInstance) {
                $scope.approve = function () {
                    scope.bulkApproval();
                    route.reload();
                    $uibModalInstance.close('approve');
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            }

            scope.bulkApproval = function () {
                scope.formData.approvedOnDate = dateFilter(new Date(), scope.df);
                scope.formData.dateFormat = scope.df;
                scope.formData.locale = scope.optlang.code;
                var selectedAccounts = 0;
                var approvedAccounts = 0;
                _.each(scope.loanTemplate, function (value, id) {
                    if (value == true) {
                        _.each(scope.pendingApproval, function (item) {
                            if (id == item.client.id) {
                                if (item.individual == true) {
                                    selectedAccounts++;
                                } else {
                                    selectedAccounts += item.loans.length;
                                }
                            }
                        });
                    }
                });

                // console.log("Loans to be approved " + selectedAccounts);
                scope.batchRequests = [];
                scope.requestIdentifier = "loanId";

                var reqId = 1;
                _.each(scope.loanTemplate, function (value, id) {
                    if (value == true) {
                        _.each(scope.pendingApproval, function (item) {
                            if (id == item.client.id) {
                                if (item.individual == true) {
                                    scope.batchRequests.push({
                                        requestId: reqId++, relativeUrl: "loans/" + item.loan.id + "?command=approve",
                                        method: "POST", body: JSON.stringify(scope.formData)
                                    });
                                } else {
                                    _.each(item.loans, function (loan) {
                                        scope.batchRequests.push({
                                            requestId: reqId++, relativeUrl: "loans/" + loan.id + "?command=approve",
                                            method: "POST", body: JSON.stringify(scope.formData)
                                        });
                                    });
                                }
                            }
                        });
                    }
                });

                // console.log("Loans to be approved batch: " + scope.batchRequests.length);
                resourceFactory.batchResource.post(scope.batchRequests, function (data) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].statusCode == '200') {
                            approvedAccounts++;
                            data[i].body = JSON.parse(data[i].body);
                            scope.loanTemplate[data[i].body.loanId] = false;
                            if (selectedAccounts == approvedAccounts) {
                                scope.loanResource();
                            }
                        }
                    }
                });
            };

            scope.authorizeLoan = function () {
                var selectedAccounts = 0;
                _.each(scope.loanTemplate, function (value, id) {
                    if (value == true) {
                        _.each(scope.pendingToAuthorize, function (item) {
                            if (id == item.client.id) {
                                if (item.individual == true) {
                                    selectedAccounts++;
                                } else {
                                    selectedAccounts += item.loans.length;
                                }
                            }
                        });
                    }
                });
                // console.log("Loans for approval selected: " + selectedAccounts);
                if (selectedAccounts > 0) {
                    $uibModal.open({
                        templateUrl: 'authorizeloan.html',
                        controller: authorizeLoanCtrl
                    });
                }
            };

            scope.toggleAllPendingToAuthorize = function() {
                scope.isAllPendingToAuthorizeSelected=!scope.isAllPendingToAuthorizeSelected;
                scope.loanTemplate = [];
                if(scope.isAllPendingToAuthorizeSelected){
                    _.each(scope.pendingToAuthorize, function(item){ 
                        scope.loanTemplate[item.client.id] = true;
                    });
                }
             }
            
            var authorizeLoanCtrl = function ($scope, $uibModalInstance) {
                $scope.authorize = function () {
                    scope.bulkAuthorize($scope.authorizeKey);                        
                    $uibModalInstance.close('authorize');
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            }

            scope.bulkAuthorize = function (authorizeKey) {
                var selectedAccounts = 0;
                _.each(scope.loanTemplate, function (value, id) {
                    if (value == true) {
                        _.each(scope.pendingToAuthorize, function (item) {
                            if (id == item.client.id) {
                                if (item.individual == true) {
                                    selectedAccounts++;
                                } else {
                                    selectedAccounts += item.loans.length;
                                }
                            }
                        });
                    }
                });

                scope.batchRequests = [];
                scope.requestIdentifier = "loanId";
                var reqId = 1;
                _.each(scope.loanTemplate, function (value, id) {
                    if (value == true) {
                        _.each(scope.pendingToAuthorize, function (item) {
                            if (id == item.client.id) {
                                    scope.formData.signedKey = authorizeKey;
                                    if (item.individual == true) {
                                        scope.batchRequests.push({
                                            requestId: reqId++, relativeUrl: "loans/" + item.loan.id + "?command=authorize",
                                            method: "POST", body: JSON.stringify(scope.formData)
                                        });
                                    } else {
                                        _.each(item.loans, function (loan) {
                                            scope.batchRequests.push({
                                                requestId: reqId++, relativeUrl: "loans/" + loan.id + "?command=authorize",
                                                method: "POST", body: JSON.stringify(scope.formData)
                                            });
                                        });
                                    }
                            }
                        });
                    }
                });  

                // console.log("Loans to be approved batch: " + scope.batchRequests.length);
                resourceFactory.batchResource.post(scope.batchRequests, function (data) {
                    console.log("reload page");
                    route.reload();
                },function(data){
                    console.log("error in the process");
                });
            };

            scope.disburseLoan = function () {
                var selectedAccounts = 0;
                _.each(scope.loanDisbursalTemplate, function (value, id) {
                    if (value == true) {
                        _.each(scope.pendingDisburse, function (item) {
                            if (id == item.client.id) {
                                if (item.individual == true) {
                                    selectedAccounts++;
                                } else {
                                    selectedAccounts += item.loans.length;
                                }
                            }
                        });
                    }
                });
                // console.log("Loans for disburse selected: " + selectedAccounts);
                if (selectedAccounts > 0) {
                    $uibModal.open({
                        templateUrl: 'disburseloan.html',
                        controller: DisburseLoanCtrl
                    });
                }
            };

            var DisburseLoanCtrl = function ($scope, $uibModalInstance) {
                $scope.funds = scope.funds;
                $scope.channelOptions = scope.channelOptions;

                $scope.disburse = function () {
                    scope.bulkDisbursal($scope.fundId, $scope.channelId, $scope.disbursedondate);
                    route.reload();
                    $uibModalInstance.close('disburse');
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            }

            scope.bulkDisbursal = function (fundId, channelId, disbursedondate) {
                scope.formData.actualDisbursementDate = dateFilter(disbursedondate, scope.df); // dateFilter(new Date(), scope.df);
                scope.formData.dateFormat = scope.df;
                scope.formData.locale = scope.optlang.code;
                scope.formData.fundId = fundId;
                scope.formData.channelId = channelId;

                var selectedAccounts = 0;
                var approvedAccounts = 0;
                _.each(scope.loanDisbursalTemplate, function (value, id) {
                    if (value == true) {
                        _.each(scope.pendingDisburse, function (item) {
                            if (id == item.client.id) {
                                if (item.individual == true) {
                                    selectedAccounts++;
                                } else {
                                    selectedAccounts += item.loans.length;
                                }
                            }
                        });
                    }
                });

                scope.batchRequests = [];
                scope.requestIdentifier = "loanId";

                var reqId = 1;
                _.each(scope.loanDisbursalTemplate, function (value, id) {
                    if (value == true) {
                        _.each(scope.pendingDisburse, function (item) {
                            if (id == item.client.id) {
                                if (item.individual == true) {
                                    scope.batchRequests.push({
                                        requestId: reqId++, relativeUrl: "loans/" + item.loan.id + "?command=disburse",
                                        method: "POST", body: JSON.stringify(scope.formData)
                                    });
                                } else {
                                    _.each(item.loans, function (loan) {
                                        scope.batchRequests.push({
                                            requestId: reqId++, relativeUrl: "loans/" + loan.id + "?command=disburse",
                                            method: "POST", body: JSON.stringify(scope.formData)
                                        });
                                    });
                                }
                            }
                        });
                    }
                });

                resourceFactory.batchResource.post(scope.batchRequests, function (data) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].statusCode == '200') {
                            approvedAccounts++;
                            data[i].body = JSON.parse(data[i].body);
                            scope.loanDisbursalTemplate[data[i].body.loanId] = false;
                            if (selectedAccounts == approvedAccounts) {
                                scope.loanResource();
                            }
                        }

                    }
                });
            };

            scope.approveBulkLoanReschedule = function () {
                if (scope.checkForBulkLoanRescheduleApprovalData) {
                    $uibModal.open({
                        templateUrl: 'loanreschedule.html',
                        controller: ApproveBulkLoanRescheduleCtrl
                    });
                }
            };

            var ApproveBulkLoanRescheduleCtrl = function ($scope, $uibModalInstance) {
                $scope.approveLoanReschedule = function () {
                    scope.bulkLoanRescheduleApproval();
                    route.reload();
                    $uibModalInstance.close('approveLoanReschedule');
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            }
            scope.checkerInboxAllCheckBoxesClickedForBulkLoanRescheduleApproval = function () {
                var newValue = !scope.checkerInboxAllCheckBoxesMetForBulkLoanRescheduleApproval();
                scope.checkForBulkLoanRescheduleApprovalData = [];
                if (!angular.isUndefined(scope.loanRescheduleData)) {
                    for (var i = scope.loanRescheduleData.length - 1; i >= 0; i--) {
                        scope.checkForBulkLoanRescheduleApprovalData[scope.loanRescheduleData[i].id] = newValue;
                    };
                }
            }

            scope.checkerInboxAllCheckBoxesMetForBulkLoanRescheduleApproval = function () {
                var checkBoxesMet = 0;
                if (!angular.isUndefined(scope.loanRescheduleData)) {
                    _.each(scope.loanRescheduleData, function (data) {
                        if (_.has(scope.checkForBulkLoanRescheduleApprovalData, data.id)) {
                            if (scope.checkForBulkLoanRescheduleApprovalData[data.id] == true) {
                                checkBoxesMet++;
                            }
                        }
                    });
                    return (checkBoxesMet === scope.loanRescheduleData.length);
                }
            }

            scope.bulkLoanRescheduleApproval = function () {
                scope.formData.approvedOnDate = dateFilter(new Date(), scope.df);
                scope.formData.dateFormat = scope.df;
                scope.formData.locale = scope.optlang.code;
                var selectedAccounts = 0;
                var approvedAccounts = 0;
                _.each(scope.checkForBulkLoanRescheduleApprovalData, function (value, key) {
                    if (value == true) {
                        selectedAccounts++;
                    }
                });
                scope.batchRequests = [];
                scope.requestIdentifier = "RESCHEDULELOAN";
                var reqId = 1;
                _.each(scope.checkForBulkLoanRescheduleApprovalData, function (value, key) {
                    if (value == true) {
                        var url = "rescheduleloans/" + key + "?command=approve";
                        var bodyData = JSON.stringify(scope.formData);
                        var batchData = { requestId: reqId++, relativeUrl: url, method: "POST", body: bodyData };
                        scope.batchRequests.push(batchData);
                    }
                });
                resourceFactory.batchResource.post(scope.batchRequests, function (data) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].statusCode == '200') {
                            approvedAccounts++;
                            data[i].body = JSON.parse(data[i].body); scope.checkForBulkLoanRescheduleApprovalData[data[i].body.resourceId] = false;
                        }
                    }
                });
            };
        }
    });
    mifosX.ng.application.controller('TaskController', ['$scope','$rootScope', 'ResourceFactory', '$route', 'dateFilter', '$uibModal', '$location', '$translate', 'MIN_DATEPICKER', 'MAX_DATEPICKER', mifosX.controllers.TaskController]).run(function ($log) {
        $log.info("TaskController initialized");
    });
}(mifosX.controllers || {}));
