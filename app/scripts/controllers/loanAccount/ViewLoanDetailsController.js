(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewLoanDetailsController: function (scope, routeParams, resourceFactory,paginatorService, location, route, $uibModal, dateFilter, API_VERSION, $sce, $rootScope, $mdDialog) {
            scope.loandocuments = [];
            scope.report = false;
            scope.hidePentahoReport = true;
            scope.formData = {};
            scope.datatabledetails = [];
            scope.datatableLoaded = false;
            scope.date = {
                payDate: new Date()
            }
            scope.hideAccrualTransactions = false;
            scope.isHideAccrualsCheckboxChecked = true;
            scope.loandetails = [];
            scope.accountNo;
            scope.payments = {
                total: 0,
                paid: 0,
                pending: 0,
                expired: 0
            };

            scope.routeTo = function (loanId, transactionId, transactionTypeId) {
                if (transactionTypeId == 2 || transactionTypeId == 4 || transactionTypeId == 1) {
                    location.path('/viewloantrxn/' + loanId + '/trxnId/' + transactionId);
                };
            };

            /***
             * we are using orderBy(https://docs.angularjs.org/api/ng/filter/orderBy) filter to sort fields in ui
             * api returns dates in array format[yyyy, mm, dd], converting the array of dates to date object
             * @param dateFieldName
             */
            scope.convertDateArrayToObject = function(dateFieldName){
                for(var i in scope.loandetails.transactions){
                    scope.loandetails.transactions[i][dateFieldName] = new Date(scope.loandetails.transactions[i].date);
                }
            };

            scope.clickEvent = function (eventName, accountId) {
                eventName = eventName || "";
                switch (eventName) {
                    case "addloancharge":
                        location.path('/addloancharge/' + accountId);
                        break;
                    case "addcollateral":
                        location.path('/addcollateral/' + accountId);
                        break;
                    case "assignloanofficer":
                    case "changeloanofficer":
                        location.path('/assignloanofficer/' + accountId);
                        break;
                    case "modifyapplication":
                        location.path('/editloanaccount/' + accountId);
                        break;
                    case "approve":
                        location.path('/loanaccount/' + accountId + '/approve');
                        break;
                    case "reject":
                        location.path('/loanaccount/' + accountId + '/reject');
                        break;
                    case "withdrawnbyclient":
                        location.path('/loanaccount/' + accountId + '/withdrawnByApplicant');
                        break;
                    case "delete":
                        resourceFactory.LoanAccountResource.delete({loanId: accountId}, {}, function (data) {
                            var destination = '/viewgroup/' + data.groupId;
                            if (data.clientId) destination = '/viewclient/' + data.clientId;
                            location.path(destination);
                        });
                        break;
                    case "undoapproval":
                        location.path('/loanaccount/' + accountId + '/undoapproval');
                        break;
                    case "disburse":
                        location.path('/loanaccount/' + accountId + '/disburse');
                        break;
                    case "disbursetosavings":
                        location.path('/loanaccount/' + accountId + '/disbursetosavings');
                        break;
                    case "undodisbursal":
                        location.path('/loanaccount/' + accountId + '/undodisbursal');
                        break;
                    case "makerepayment":
                        location.path('/loanaccount/' + accountId + '/repayment');
                        break;
                    case "prepayment":
                        location.path('/loanaccount/' + accountId + '/prepayloan');
                        break;
                    case "waiveinterest":
                        location.path('/loanaccount/' + accountId + '/waiveinterest');
                        break;
                    case "writeoff":
                        location.path('/loanaccount/' + accountId + '/writeoff');
                        break;
                    case "recoverypayment":
                        location.path('/loanaccount/' + accountId + '/recoverypayment');
                        break;
                    case "close-rescheduled":
                        location.path('/loanaccount/' + accountId + '/close-rescheduled');
                        break;
                    case "transferFunds":
                        if (scope.loandetails.clientId) {
                            location.path('/accounttransfers/fromloans/' + accountId);
                        }
                        break;
                    case "close":
                        location.path('/loanaccount/' + accountId + '/close');
                        break;
                    case "createguarantor":
                        location.path('/guarantor/' + accountId);
                        break;
                    case "listguarantor":
                        location.path('/listguarantors/' + accountId);
                        break;
                    case "recoverguarantee":
                        location.path('/loanaccount/' + accountId + '/recoverguarantee');
                        break;
                    case "unassignloanofficer":
                        location.path('/loanaccount/' + accountId + '/unassignloanofficer');
                        break;
                    case "loanscreenreport":
                        location.path('/loanscreenreport/' + accountId);
                        break;
                    case "reschedule":
                        location.path('/loans/' +accountId + '/reschedule');
                        break;
                    case "adjustrepaymentschedule":
                        location.path('/adjustrepaymentschedule/'+accountId) ;
                        break ;
                    case "foreclosure":
                        location.path('loanforeclosure/' + accountId);
                        break;
                }
            };

            scope.delCharge = function (id) {
                $uibModal.open({
                    templateUrl: 'delcharge.html',
                    controller: DelChargeCtrl,
                    resolve: {
                        ids: function () {
                            return id;
                        }
                    }
                });
            };

            scope.allowShowTransactionCalculation = function(transaction) {
                if (transaction.type.value == 'Repayment') {
                    return false;
                } else if (transaction.manuallyReversed!=true && transaction.penaltyChargesPortion) {
                    return true;
                }
                return false;
            }

            scope.allowShowTransactionReceipt = function(transaction) {
                if (transaction.type.value == 'Repayment' && transaction.manuallyReversed!=true) {
                    return true;
                }
                return false;
            }

            scope.showTransactionCalculation = function(ev, transactionId) {
                resourceFactory.loanTrxnsResource.get({ loanId: routeParams.id, transactionId: transactionId, charge: 'true' },
                function (data) {
                    $mdDialog.show({
                        controller: DialogCalcsController,
                        templateUrl: 'views/loans/viewloantransactioncalcs.tmpl.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose:true,
                        fullscreen: true, // Only for -xs, -sm breakpoints.
                        locals: {
                            data: {
                              transactionId: scope.transactionId,
                              loanTransaction: data,
                              overdueCharges: scope.loandetails.overdueCharges,
                              daysInYear: scope.loandetails.daysInYearType.id
                            }
                        },
                    });                    
                });
            };

            scope.showTransactionReceipt = function(ev, transactionId) {
                scope.transactionId = transactionId;
                scope.reportName = "Receipt " + transactionId;
                scope.formData.outputType = 'PDF';
                scope.baseURL = $rootScope.hostUrl + API_VERSION + "/runreports/" + encodeURIComponent("Loan Transaction Receipt");
                scope.baseURL += "?output-type=" + encodeURIComponent(scope.formData.outputType) + "&tenantIdentifier=" + $rootScope.tenantIdentifier+"&locale="+scope.optlang.code;

                var reportParams = "";
                var paramName = "R_transactionId";
                reportParams += encodeURIComponent(paramName) + "=" + encodeURIComponent(transactionId);
                if (reportParams > "") {
                    scope.baseURL += "&" + reportParams;
                }
                // allow untrusted urls for iframe http://docs.angularjs.org/error/$sce/insecurl
                scope.viewReportDetails = $sce.trustAsResourceUrl(scope.baseURL);

                $mdDialog.show({
                  controller: DialogReceiptController,
                  templateUrl: 'views/loans/viewloantransactionreceipt.tmpl.html',
                  parent: angular.element(document.body),
                  targetEvent: ev,
                  clickOutsideToClose:true,
                  fullscreen: true, // Only for -xs, -sm breakpoints.
                  locals: {
                      pdfUrl: scope.baseURL,
                      pdfName: scope.reportName,
                      data: {
                        transactionId: scope.transactionId,
                        reportName: scope.reportName,
                        baseURL: scope.baseURL
                      }
                  },
                });
            };
        
            function DialogReceiptController(scope, $mdDialog, data) {
                scope.data = data;
                scope.closeDialog = function() {
                  $mdDialog.hide();
                }
            }
        
            function DialogCalcsController(scope, $mdDialog, data) {
                scope.loanTransaction = data.loanTransaction;
                const overdueCharges = data.overdueCharges;
                var days = 0;
                const loanCharge = scope.loanTransaction.loanCharge;
                for (var i=0; i < overdueCharges.length; i++) {
                    const item = overdueCharges[i];
                    if (item.name == loanCharge.name) {
                        days = (loanCharge.amountOrPercentage / (item.amount / data.daysInYear)).toFixed(0);
                        break;
                    }
                }
                scope.days = days;
                scope.closeDialog = function() {
                  $mdDialog.hide();
                }
            }

            var DelChargeCtrl = function ($scope, $uibModalInstance, ids) {
                $scope.delete = function () {
                    resourceFactory.LoanAccountResource.delete({loanId: routeParams.id, resourceType: 'charges', chargeId: ids}, {}, function (data) {

                        $uibModalInstance.close('delete');
                        route.reload();
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

            resourceFactory.LoanAccountResource.getLoanAccountDetails({loanId: routeParams.id, associations: 'all',exclude: 'guarantors,futureSchedule'}, function (data) {
                scope.loandetails = data;
                scope.convertDateArrayToObject('date');
                scope.recalculateInterest = data.recalculateInterest || true;
                scope.isWaived = scope.loandetails.repaymentSchedule.totalWaived > 0;
                scope.date.fromDate = new Date(data.timeline.actualDisbursementDate);
                scope.date.toDate = new Date();
                scope.status = data.status.value;
                scope.chargeAction = data.status.value == "Submitted and pending approval" ? true : false;
                scope.decimals = data.currency.decimalPlaces;
                scope.accountNo = data.accountNo;

                scope.freePeriods = data.graceOnPrincipalPayment;

                if (scope.loandetails.charges) {
                    scope.charges = scope.loandetails.charges;
                    for (var i in scope.charges) {
                        if (scope.charges[i].paid || scope.charges[i].waived || scope.charges[i].chargeTimeType.value == 'Disbursement' || scope.loandetails.status.value != 'Active') {
                            var actionFlag = true;
                        }
                        else {
                            var actionFlag = false;
                        }
                        scope.charges[i].actionFlag = actionFlag;
                    }

                    scope.chargeTableShow = true;
                }
                else {
                    scope.chargeTableShow = false;
                }
                if (scope.status == "Submitted and pending approval" || scope.status == "Active" || scope.status == "Approved") {
                    scope.choice = true;
                }
                if (data.status.value == "Submitted and pending approval") {
                    scope.buttons = { singlebuttons: [
                        {
                            name: "button.addloancharge",
                            icon: "fa fa-plus",
                            taskPermissionName: 'CREATE_LOANCHARGE'
                        },
                        {
                            name: "button.approve",
                            icon: "fa fa-check",
                            taskPermissionName: 'APPROVE_LOAN'
                        },
                        {
                            name: "button.modifyapplication",
                            icon: "fa fa-pincel-square-o",
                            taskPermissionName: 'UPDATE_LOAN'
                        },
                        {
                            name: "button.reject",
                            icon: "fa fa-times",
                            taskPermissionName: 'REJECT_LOAN'
                        }
                    ],
                        options: [
                            {
                                name: (scope.loandetails.loanOfficerName?"button.changeloanofficer":"button.assignloanofficer"),
                                taskPermissionName: 'UPDATELOANOFFICER_LOAN'
                            },
                            {
                                name: "button.withdrawnbyclient",
                                taskPermissionName: 'WITHDRAW_LOAN'
                            },
                            {
                                name: "button.delete",
                                taskPermissionName: 'DELETE_LOAN'
                            },
                            {
                                name: "button.addcollateral",
                                taskPermissionName: 'CREATE_COLLATERAL'
                            },
                            {
                                name: "button.listguarantor",
                                taskPermissionName: 'READ_GUARANTOR'
                            },
                            {
                                name: "button.createguarantor",
                                taskPermissionName: 'CREATE_GUARANTOR'
                            },
                            {
                                name: "button.loanscreenreport",
                                taskPermissionName: 'READ_LOAN'
                            }
                        ]

                    };
                    if(data.isVariableInstallmentsAllowed) {
                        scope.buttons.options.push({
                            name: "button.adjustrepaymentschedule",
                            taskPermissionName: 'ADJUST_REPAYMENT_SCHEDULE'
                        }) ;
                    }
                }

                if (data.status.value == "Approved") {
                    scope.buttons = { singlebuttons: [
                        {
                            name: (scope.loandetails.loanOfficerName?"button.changeloanofficer":"button.assignloanofficer"),
                            icon: "fa fa-user",
                            taskPermissionName: 'UPDATELOANOFFICER_LOAN'
                        },
                        {
                            name: "button.disburse",
                            icon: "fa fa-flag",
                            taskPermissionName: 'DISBURSE_LOAN'
                        },
                        {
                            name: "button.disbursetosavings",
                            icon: "fa fa-flag",
                            taskPermissionName: 'DISBURSETOSAVINGS_LOAN'
                        },
                        {
                            name: "button.undoapproval",
                            icon: "fa fa-undo",
                            taskPermissionName: 'APPROVALUNDO_LOAN'
                        }
                    ],
                        options: [
                            {
                                name: "button.addloancharge",
                                taskPermissionName: 'CREATE_LOANCHARGE'
                            },
                            {
                                name: "button.listguarantor",
                                taskPermissionName: 'READ_GUARANTOR'
                            },
                            {
                                name: "button.createguarantor",
                                taskPermissionName: 'CREATE_GUARANTOR'
                            },
                            {
                                name: "button.loanscreenreport",
                                taskPermissionName: 'READ_LOAN'
                            }
                        ]

                    };
                }

                if (data.status.value == "Active") {
                    scope.buttons = { singlebuttons: [
                        {
                            name: "button.addloancharge",
                            icon: "fa fa-plus",
                            taskPermissionName: 'CREATE_LOANCHARGE'
                        },
                        {
                            name: "button.makerepayment",
                            icon: "fa fa-dollar",
                            taskPermissionName: 'REPAYMENT_LOAN'
                        },
                        {
                            name: "button.undodisbursal",
                            icon: "fa fa-undo",
                            taskPermissionName: 'DISBURSALUNDO_LOAN'
                        }
                    ],
                        options: [
                            {
                                name: "button.waiveinterest",
                                taskPermissionName: 'WAIVEINTERESTPORTION_LOAN'
                            },
                            {
                                name: "button.reschedule",
                                taskPermissionName: 'CREATE_RESCHEDULELOAN'
                            },
                            {
                                name: "button.writeoff",
                                taskPermissionName: 'WRITEOFF_LOAN'
                            },
                            {
                                name: "button.close-rescheduled",
                                taskPermissionName: 'CLOSEASRESCHEDULED_LOAN'
                            },
                            {
                                name: "button.close",
                                taskPermissionName: 'CLOSE_LOAN'
                            },
                            {
                                name: "button.loanscreenreport",
                                taskPermissionName: 'READ_LOAN'
                            },
                            {
                                name: "button.listguarantor",
                                taskPermissionName: 'READ_GUARANTOR'
                            },
                            {
                                name: "button.createguarantor",
                                taskPermissionName: 'CREATE_GUARANTOR'
                            },
                            {
                                name: "button.recoverguarantee",
                                taskPermissionName: 'RECOVERGUARANTEES_LOAN'
                            }
                        ]
                    };

                    if (data.canDisburse) {
                        scope.buttons.singlebuttons.splice(1, 0, {
                            name: "button.disburse",
                            icon: "fa fa-flag",
                            taskPermissionName: 'DISBURSE_LOAN'
                        });
                        scope.buttons.singlebuttons.splice(1, 0, {
                            name: "button.disbursetosavings",
                            icon: "fa fa-flag",
                            taskPermissionName: 'DISBURSETOSAVINGS_LOAN'
                        });
                    }
                    if (!data.loanOfficerName) {
                        scope.buttons.singlebuttons.splice(1, 0, {
                            name: "button.assignloanofficer",
                            icon: "fa fa-user",
                            taskPermissionName: 'UPDATELOANOFFICER_LOAN'
                        });
                    }

                    if (scope.recalculateInterest) {
                        scope.buttons.singlebuttons.splice(1, 0, {
                            name: "button.prepayment",
                            icon: "fa fa-money",
                            taskPermissionName: 'REPAYMENT_LOAN'
                        });
                    }
                }
                if (data.status.value == "Overpaid") {
                    scope.buttons = { singlebuttons: [
                        {
                            name: "button.transferFunds",
                            icon: "fa fa-exchange",
                            taskPermissionName: 'CREATE_ACCOUNTTRANSFER'
                        }
                    ]
                    };
                }
                if (data.status.value == "Closed (written off)") {
                    scope.buttons = { singlebuttons: [
                        {
                            name: "button.recoverypayment",
                            icon: "fa fa-briefcase",
                            taskPermissionName: 'RECOVERYPAYMENT_LOAN'
                        }
                    ]
                    };
                }

                const today = new Date();
                for (var i in scope.loandetails.repaymentSchedule.periods) {
                    const period = scope.loandetails.repaymentSchedule.periods[i];
                    if ((typeof period.period != "undefined") && (period.totalInstallmentAmountForPeriod > 0)) {
                        if (period.complete == true) {
                            if (period.period > scope.freePeriods) {
                                scope.payments.paid++;
                            }
                        } else {
                            scope.payments.pending++;
                        }

                        // Expired payments
                        const dueDate = new Date(period.dueDate);
                        if (+dueDate <= +today) {
                            scope.payments.expired++;
                        }
                        scope.payments.total++;
                    }
                }

                /*
                resourceFactory.standingInstructionTemplateResource.get({fromClientId: scope.loandetails.clientId,fromAccountType: 1,fromAccountId: routeParams.id},function (response) {
                    scope.standinginstruction = response;
                    scope.searchTransaction();
                });
                */
            });

            resourceFactory.loanTrxnsTemplateResource.get({ loanId: routeParams.id, command: 'prepayLoan' }, function (data) {
                scope.prepayloan = data;
                scope.prepay = {
                    principalPortion: data.principalPortion,
                    interestPortion: data.interestPortion,
                    feeChargesPortion: data.feeChargesPortion,
                    penaltyChargesPortion: data.penaltyChargesPortion,
                    total: (data.principalPortion + data.interestPortion + data.feeChargesPortion + data.penaltyChargesPortion)
                }
            });

            var fetchFunction = function (offset, limit, callback) {
                var params = {};
                params.offset = offset;
                params.limit = limit;
                params.locale = scope.optlang.code;
                params.fromAccountId = routeParams.id;
                params.fromAccountType = 1;
                params.clientId = scope.loandetails.clientId;
                params.clientName = scope.loandetails.clientName;
                params.dateFormat = scope.df;

                resourceFactory.standingInstructionResource.search(params, callback);
            };

            scope.searchTransaction = function () {
                scope.displayResults = true;
                scope.instructions = paginatorService.paginate(fetchFunction, 14);
                scope.isCollapsed = false;
            };

            scope.refresh = function () {
                route.reload();
            };
            
            scope.deletestandinginstruction = function (id) {
                $uibModal.open({
                    templateUrl: 'delInstruction.html',
                    controller: DelInstructionCtrl,
                    resolve: {
                        ids: function () {
                            return id;
                        }
                    }
                });
            };

            var DelInstructionCtrl = function ($scope, $uibModalInstance, ids) {
                $scope.delete = function () {
                    resourceFactory.standingInstructionResource.cancel({standingInstructionId: ids}, function (data) {
                        scope.searchTransaction();
                        $uibModalInstance.close('delete');
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

            scope.getNotes = function () {
                resourceFactory.loanResource.getAllNotes({loanId: routeParams.id,resourceType:'notes'}, function (data) {
                    scope.loanNotes = data;
                });
            }

            scope.saveNote = function () {
                resourceFactory.loanResource.save({loanId: routeParams.id, resourceType: 'notes'}, this.formData, function (data) {
                    var today = new Date();
                    temp = { id: data.resourceId, note: scope.formData.note, createdByUsername: "test", createdOn: today };
                    scope.loanNotes.push(temp);
                    scope.formData.note = "";
                    scope.predicate = '-id';
                });
            };

            scope.getLoanDocuments = function () {
                resourceFactory.LoanDocumentResource.getLoanDocuments({loanId: routeParams.id}, function (data) {
                    for (var i in data) {
                        var loandocs = {};
                        loandocs = API_VERSION + '/loans/' + data[i].parentEntityId + '/documents/' + data[i].id + '/attachment?tenantIdentifier=' + $rootScope.tenantIdentifier;
                        data[i].docUrl = loandocs;
                        if (data[i].fileName)
                            if (data[i].fileName.toLowerCase().indexOf('.jpg') != -1 || data[i].fileName.toLowerCase().indexOf('.jpeg') != -1 || data[i].fileName.toLowerCase().indexOf('.png') != -1)
                                data[i].fileIsImage = true;
                        if (data[i].type)
                             if (data[i].type.toLowerCase().indexOf('image') != -1)
                                data[i].fileIsImage = true;
                    }
                    scope.loandocuments = data;
                });

            };

            scope.getDataTables = function () {
                resourceFactory.DataTablesResource.getAllDataTables({apptable: 'm_loan'}, function (data) {
                    scope.loandatatables = data;
                    if(scope.datatableLoaded == false) {
                        for(var i in data) {
                            if(data[i].registeredTableName) {
                                scope.dataTableChange(data[i].registeredTableName);
                            }
                        }
                        scope.datatableLoaded = true;
                    }
                });
            }

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
                	datatabledetail.isMultirow = data.datatableData.columnHeaderData[0].columnName == "id" ? true : false;
                    datatabledetail.showDataTableAddButton = !datatabledetail.isData || datatabledetail.isMultirow;
                    datatabledetail.showDataTableEditButton = datatabledetail.isData && !datatabledetail.isMultirow;
                    datatabledetail.singleRow = [];
                    datatabledetail.dataTableScoring = 0;
                    var columnHeaderData = data.datatableData.columnHeaderData;
                    for (var i in columnHeaderData) {
                        if (columnHeaderData[i].columnCode) {
                            for (var j in columnHeaderData[i].columnValues) {
                                for (var k in data.data) {
                                    if (data.data[k].row[i] == columnHeaderData[i].columnValues[j].id) {
                                        data.data[k].row[i] = {
                                        		value: columnHeaderData[i].columnValues[j].value,
                                                score: columnHeaderData[i].columnValues[j].score
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (datatabledetail.isData) {
                        for (var i in data.datatableData.columnHeaderData) {
                            if (!datatabledetail.isMultirow) {
                            	if (data.datatableData.columnHeaderData[i].columnName != "loan_id") {
                                    datatabledetail.singleRow.push(data.data[0].rows[i]);                         		
                            	}
                            }
                        }
                    }
                    scope.datatabledetails.push(datatabledetail);
                });
            };
            
            scope.getDatatableColumn = function (tableName, columnName) {
                console.log("data " + tableName + " : " + columnName);
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

            scope.export = function () {
                scope.report = true;
                scope.printbtn = false;
                scope.viewReport = false;
                scope.viewLoanReport = true;
                scope.viewTransactionReport = false;
            };

            scope.viewBalanceTransactionReport = function () {
                scope.report = true;
                scope.printbtn = true;
                scope.viewReport = true;
                scope.viewBalanceTransactionReport = true;
                scope.hidePentahoReport = true;
                scope.formData.outputType = 'PDF';
                scope.baseURL = $rootScope.hostUrl + API_VERSION + "/runreports/" + encodeURIComponent("saldos_y_movimientos");
                scope.baseURL += "?output-type=" + encodeURIComponent(scope.formData.outputType) + "&tenantIdentifier=" + $rootScope.tenantIdentifier+"&locale="+scope.optlang.code;
                var reportParams = "";
                paramName = "R_accountNo";
                reportParams += encodeURIComponent(paramName) + "=" + encodeURIComponent(scope.accountNo);
                if (reportParams.length > 0) {
                    scope.baseURL += "&" + reportParams;
                }
              // allow untrusted urls for iframe http://docs.angularjs.org/error/$sce/insecurl
              scope.viewReportDetails = $sce.trustAsResourceUrl(scope.baseURL);
            };

            scope.viewJournalEntries = function(){
                location.path("/searchtransaction/").search({loanId: scope.loandetails.id});
            };

            scope.viewLoanDetails = function () {
                scope.report = false;
                scope.hidePentahoReport = true;
                scope.viewReport = false;
            };

            scope.viewLoanCollateral = function (collateralId){
                location.path('/loan/'+scope.loandetails.id+'/viewcollateral/'+collateralId).search({status:scope.loandetails.status.value});
            };

            scope.viewDataTable = function (registeredTableName,data){
                if (scope.datatabledetails.isMultirow) {
                    location.path("/viewdatatableentry/"+registeredTableName+"/"+scope.loandetails.id+"/"+data.row[0]);
                }else{
                    location.path("/viewsingledatatableentry/"+registeredTableName+"/"+scope.loandetails.id);
                }
            };

            scope.viewLoanChargeDetails = function (chargeId) {
                location.path('/loan/'+scope.loandetails.id+'/viewcharge/'+chargeId).search({loanstatus:scope.loandetails.status.value});
            };

            scope.viewprintdetails = function () {
                //scope.printbtn = true;
                scope.report = true;
                scope.viewTransactionReport = false;
                scope.viewReport = true;
                scope.hidePentahoReport = true;
                scope.formData.outputType = 'PDF';
                scope.baseURL = $rootScope.hostUrl + API_VERSION + "/runreports/" + encodeURIComponent("Client Loan Account Schedule");
                scope.baseURL += "?output-type=" + encodeURIComponent(scope.formData.outputType) + "&tenantIdentifier=" + $rootScope.tenantIdentifier+"&locale="+scope.optlang.code;

                var reportParams = "";
                scope.startDate = dateFilter(scope.date.fromDate, 'yyyy-MM-dd');
                scope.endDate = dateFilter(scope.date.toDate, 'yyyy-MM-dd');
                var paramName = "R_startDate";
                reportParams += encodeURIComponent(paramName) + "=" + encodeURIComponent(scope.startDate)+ "&";
                paramName = "R_endDate";
                reportParams += encodeURIComponent(paramName) + "=" + encodeURIComponent(scope.endDate)+ "&";
                paramName = "R_selectLoan";
                reportParams += encodeURIComponent(paramName) + "=" + encodeURIComponent(scope.loandetails.accountNo);
                if (reportParams > "") {
                    scope.baseURL += "&" + reportParams;
                }
                // allow untrusted urls for iframe http://docs.angularjs.org/error/$sce/insecurl
                scope.viewReportDetails = $sce.trustAsResourceUrl(scope.baseURL);

            };

            scope.viewloantransactionreceipts = function (transactionId) {
                //scope.printbtn = true;
                scope.transactionId = transactionId;
                scope.reportName = "receipt_" + transactionId;
                scope.report = true;
                scope.viewTransactionReport = true;
                scope.viewLoanReport = false;
                scope.viewReport = true;
                scope.hidePentahoReport = true;
                scope.formData.outputType = 'PDF';
                scope.baseURL = $rootScope.hostUrl + API_VERSION + "/runreports/" + encodeURIComponent("Loan Transaction Receipt");
                scope.baseURL += "?output-type=" + encodeURIComponent(scope.formData.outputType) + "&tenantIdentifier=" + $rootScope.tenantIdentifier+"&locale="+scope.optlang.code;

                var reportParams = "";
                var paramName = "R_transactionId";
                reportParams += encodeURIComponent(paramName) + "=" + encodeURIComponent(transactionId);
                if (reportParams > "") {
                    scope.baseURL += "&" + reportParams;
                }
                // allow untrusted urls for iframe http://docs.angularjs.org/error/$sce/insecurl
                scope.viewReportDetails = $sce.trustAsResourceUrl(scope.baseURL);
            };

            scope.viewloantransactionjournalentries = function(transactionId){
                var transactionId = "L" + transactionId;
                if(scope.loandetails.clientId != null && scope.loandetails.clientId != ""){
                    location.path('/viewtransactions/' + transactionId).search({productName: scope.loandetails.loanProductName,loanId:scope.loandetails.id,clientId: scope.loandetails.clientId,
                        accountNo: scope.loandetails.accountNo,clientName: scope.loandetails.clientName});
                }else{
                    location.path('/viewtransactions/' + transactionId).search({productName: scope.loandetails.loanProductName,loanId:scope.loandetails.id,accountNo: scope.loandetails.accountNo,
                        groupId :scope.loandetails.group.id,groupName :scope.loandetails.group.name});

                }
            };

            scope.printReport = function () {
                window.print();
                window.close();
            }

            scope.deleteAll = function (apptableName, entityId) {
                resourceFactory.DataTablesResource.delete({datatablename: apptableName, entityId: entityId, genericResultSet: 'true'}, {}, function (data) {
                    route.reload();
                });
            };

            scope.deleteDocument = function (documentId, index) {
                resourceFactory.LoanDocumentResource.delete({loanId: scope.loandetails.id, documentId: documentId}, '', function (data) {
                    scope.loandocuments.splice(index, 1);
                });
            };

            scope.previewDocument = function (url, fileName) {
                scope.preview =  true;
                scope.fileUrl = scope.hostUrl + url;
                if(fileName.toLowerCase().indexOf('.png') != -1)
                    scope.fileType = 'image/png';
                else if((fileName.toLowerCase().indexOf('.jpg') != -1) || (fileName.toLowerCase().indexOf('.jpeg') != -1))
                    scope.fileType = 'image/jpg';
            };

            scope.downloadDocument = function (documentId) {

            };

            scope.transactionSort = {
                column: 'date',
                descending: true
            };
            scope.changeTransactionSort = function(column) {
                var sort = scope.transactionSort;
                if (sort.column == column) {
                    sort.descending = !sort.descending;
                } else {
                    sort.column = column;
                    sort.descending = true;
                }
            };

            scope.showEdit = function(disbursementDetail){
                if((!disbursementDetail.actualDisbursementDate || disbursementDetail.actualDisbursementDate == null)
                    && scope.status =='Approved'){
                    return true;
                }
                return false;
            };

            scope.showApprovedAmountBasedOnStatus = function () {
                if (scope.status == 'Submitted and pending approval' || scope.status == 'Withdrawn by applicant' || scope.status == 'Rejected') {
                    return false;
                }
                return true;
            };

            scope.showDisbursedAmountBasedOnStatus = function(){
                if(scope.status == 'Submitted and pending approval' ||scope.status == 'Withdrawn by applicant' || scope.status == 'Rejected' ||
                    scope.status == 'Approved'){
                    return false;
                }
                return true;
            };

            scope.checkStatus = function(){
                if(scope.status == 'Active' || scope.status == 'Closed (obligations met)' || scope.status == 'Overpaid' ||
                    scope.status == 'Closed (rescheduled)' || scope.status == 'Closed (written off)'){
                    return true;
                }
                return false;
            };

            scope.showAddDeleteTrancheButtons = function(action){
                scope.return = true;
                if(scope.status == 'Closed (obligations met)' || scope.status == 'Overpaid' ||
                    scope.status == 'Closed (rescheduled)' || scope.status == 'Closed (written off)' ||
                    scope.status =='Submitted and pending approval'){
                    scope.return = false;
                }
                scope.totalDisbursedAmount = 0;
                scope.count = 0;
                for(var i in scope.loandetails.disbursementDetails){
                    if(scope.loandetails.disbursementDetails[i].actualDisbursementDate != null){
                        scope.totalDisbursedAmount += scope.loandetails.disbursementDetails[i].principal;
                    }
                    else{
                        scope.count +=  1;
                    }
                }
                if(scope.totalDisbursedAmount == scope.loandetails.approvedPrincipal || scope.return == false){
                    return false;
                }
                if(scope.count == 0 && action == 'deletedisbursedetails'){
                    return false;
                }

                return true;
            };
        }
    });
    mifosX.ng.application.controller('ViewLoanDetailsController', ['$scope', '$routeParams', 'ResourceFactory','PaginatorService', '$location', '$route', '$uibModal', 'dateFilter', 'API_VERSION', '$sce', '$rootScope', '$mdDialog', mifosX.controllers.ViewLoanDetailsController]).run(function ($log) {
        $log.info("ViewLoanDetailsController initialized");
    });
}(mifosX.controllers || {}));
