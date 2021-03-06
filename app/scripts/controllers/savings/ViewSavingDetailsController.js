(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewSavingDetailsController: function (
            scope,
            routeParams,
            resourceFactory,
            paginatorService,
            location,
            $uibModal,
            route,
            $sce,
            $rootScope
        ) {
            scope.report = false;
            scope.hidePentahoReport = true;
            scope.showActiveCharges = true;
            scope.formData = {};
            scope.date = {};
            scope.staffData = {};
            scope.fieldOfficers = [];
            scope.savingaccountdetails = [];
            scope.savingNotes = [];
            scope.officeData = $rootScope.getOfficeData();

            scope.query = {
                order: "date",
                limit: 25,
                page: 1,
            };

            scope.options = {
                boundaryLinks: true,
                rowSelection: true,
            };

            scope.isDebit = function (savingsTransactionType) {
                return (
                    savingsTransactionType.withdrawal == true ||
                    savingsTransactionType.feeDeduction == true ||
                    savingsTransactionType.overdraftInterest == true ||
                    savingsTransactionType.withholdTax == true
                );
            };

            scope.routeTo = function (
                savingsAccountId,
                transactionId,
                accountTransfer,
                transferId
            ) {
                if (accountTransfer) {
                    location.path("/viewaccounttransfers/" + transferId);
                } else {
                    location.path(
                        "/viewsavingtrxn/" + savingsAccountId + "/trxnId/" + transactionId
                    );
                }
            };

            /***
             * we are using orderBy(https://docs.angularjs.org/api/ng/filter/orderBy) filter to sort fields in ui
             * api returns dates in array format[yyyy, mm, dd], converting the array of dates to date object
             * @param dateFieldName
             */
            scope.convertDateArrayToObject = function (dateFieldName) {
                for (var i in scope.savingaccountdetails.transactions) {
                    scope.savingaccountdetails.transactions[i][dateFieldName] = new Date(
                        scope.savingaccountdetails.transactions[i].date
                    );
                }
            };
            scope.isRecurringCharge = function (charge) {
                return (
                    charge.chargeTimeType.value == "Monthly Fee" ||
                    charge.chargeTimeType.value == "Annual Fee" ||
                    charge.chargeTimeType.value == "Weekly Fee"
                );
            };

            scope.viewsavingtransactionjournalentries = function (transactionId) {
                var transactionId = "S" + transactionId;
                if (
                    scope.savingaccountdetails.clientId != null &&
                    scope.savingaccountdetails.clientId != ""
                ) {
                    location
                        .path("/viewtransactions/" + transactionId)
                        .search({
                            productName: scope.savingaccountdetails.savingsProductName,
                            savingId: scope.savingaccountdetails.id,
                            accountNo: scope.savingaccountdetails.accountNo,
                        });
                } else {
                    location
                        .path("/viewtransactions/" + transactionId)
                        .search({
                            productName: scope.savingaccountdetails.loanProductName,
                            loanId: scope.savingaccountdetails.id,
                            accountNo: scope.savingaccountdetails.accountNo,
                            groupId: scope.savingaccountdetails.group.id,
                            groupName: scope.savingaccountdetails.group.name,
                        });
                }
            };

            scope.viewCharge = function (id) {
                location
                    .path(
                        "/savings/" + scope.savingaccountdetails.id + "/viewcharge/" + id
                    )
                    .search({ status: scope.savingaccountdetails.status.value });
            };

            scope.clickEvent = function (eventName, accountId) {
                eventName = eventName || "";
                switch (eventName) {
                    case "modifyapplication":
                        location.path("/editsavingaccount/" + accountId);
                        break;
                    case "approve":
                        location.path("/savingaccount/" + accountId + "/approve");
                        break;
                    case "reject":
                        location.path("/savingaccount/" + accountId + "/reject");
                        break;
                    case "withdrawnbyclient":
                        location.path(
                            "/savingaccount/" + accountId + "/withdrawnByApplicant"
                        );
                        break;
                    case "delete":
                        resourceFactory.savingsResource.delete(
                            { accountId: accountId },
                            {},
                            function (data) {
                                var destination = "/viewgroup/" + data.groupId;
                                if (data.clientId) destination = "/viewclient/" + data.clientId;
                                location.path(destination);
                            }
                        );
                        break;
                    case "undoapproval":
                        location.path("/savingaccount/" + accountId + "/undoapproval");
                        break;
                    case "activate":
                        location.path("/savingaccount/" + accountId + "/activate");
                        break;
                    case "deposit":
                        location.path("/savingaccount/" + accountId + "/deposit");
                        break;
                    case "withdraw":
                        location.path("/savingaccount/" + accountId + "/withdrawal");
                        break;
                    case "addcharge":
                        location.path("/savingaccounts/" + accountId + "/charges");
                        break;
                    case "calculateInterest":
                        resourceFactory.savingsResource.save(
                            { accountId: accountId, command: "calculateInterest" },
                            {},
                            function (data) {
                                route.reload();
                            }
                        );
                        break;
                    case "postInterest":
                        resourceFactory.savingsResource.save(
                            { accountId: accountId, command: "postInterest" },
                            {},
                            function (data) {
                                route.reload();
                            }
                        );
                        break;
                    case "applyAnnualFees":
                        location.path(
                            "/savingaccountcharge/" +
                            accountId +
                            "/applyAnnualFees/" +
                            scope.annualChargeId
                        );
                        break;
                    case "transferFunds":
                        if (scope.savingaccountdetails.clientId) {
                            location.path("/accounttransfers/fromsavings/" + accountId);
                        }
                        break;
                    case "close":
                        location.path("/savingaccount/" + accountId + "/close");
                        break;
                    case "block":
                        location.path("/savingaccount/" + accountId + "/block");
                        break;
                    case "unblock":
                        location.path("/savingaccount/" + accountId + "/unblock");
                        break;
                    case "unblock":
                        location.path("/savingaccount/" + accountId + "/unblock");
                        break;
                    case "assignSavingsOfficer":
                        location.path("/assignsavingsofficer/" + accountId);
                        break;
                    case "unAssignSavingsOfficer":
                        location.path("/unassignsavingsofficer/" + accountId);
                        break;
                    case "enableWithHoldTax":
                        var changes = {
                            withHoldTax: true,
                        };
                        resourceFactory.savingsResource.update(
                            { accountId: accountId, command: "updateWithHoldTax" },
                            changes,
                            function (data) {
                                route.reload();
                            }
                        );
                        break;
                    case "disableWithHoldTax":
                        var changes = {
                            withHoldTax: false,
                        };
                        resourceFactory.savingsResource.update(
                            { accountId: accountId, command: "updateWithHoldTax" },
                            changes,
                            function (data) {
                                route.reload();
                            }
                        );
                        break;
                    case "retainedBalance":
                        location.path("/retainedbalance/" + accountId);
                        break;
                    case "postInterestAsOn":
                        location.path("/savingaccount/" + accountId + "/postInterestAsOn");
                        break;
                }
            };

            resourceFactory.savingsResource.get(
                { accountId: routeParams.id, associations: "all" },
                function (data) {
                    scope.savingaccountdetails = data;
                    scope.savingaccountdetails.availableBalance = scope
                        .savingaccountdetails.enforceMinRequiredBalance
                        ? scope.savingaccountdetails.summary.availableBalance -
                        scope.savingaccountdetails.minRequiredOpeningBalance
                        : scope.savingaccountdetails.summary.availableBalance;
                    scope.convertDateArrayToObject("date");
                    if (scope.savingaccountdetails.groupId) {
                        resourceFactory.groupResource.get(
                            { groupId: scope.savingaccountdetails.groupId },
                            function (data) {
                                scope.groupLevel = data.groupLevel;
                            }
                        );
                    }
                    scope.showonhold = true;
                    if (angular.isUndefined(data.onHoldFunds)) {
                        scope.showonhold = false;
                    }
                    scope.staffData.staffId = data.staffId;
                    scope.date.toDate = new Date();
                    scope.date.fromDate = new Date(data.timeline.activatedOnDate);

                    scope.status = data.status.value;
                    if (
                        scope.status == "Submitted and pending approval" ||
                        scope.status == "Active" ||
                        scope.status == "Approved"
                    ) {
                        scope.choice = true;
                    }
                    scope.chargeAction =
                        data.status.value == "Submitted and pending approval"
                            ? true
                            : false;
                    scope.chargePayAction = data.status.value == "Active" ? true : false;
                    if (scope.savingaccountdetails.charges) {
                        scope.charges = scope.savingaccountdetails.charges;
                        scope.chargeTableShow = true;
                    } else {
                        scope.chargeTableShow = false;
                    }
                    if (data.status.value == "Submitted and pending approval") {
                        scope.buttons = {
                            singlebuttons: [
                                {
                                    name: "button.modifyapplication",
                                    icon: "fa fa-pencil ",
                                    taskPermissionName: "UPDATE_SAVINGSACCOUNT",
                                },
                                {
                                    name: "button.approve",
                                    icon: "fa fa-check",
                                    taskPermissionName: "APPROVE_SAVINGSACCOUNT",
                                },
                            ],
                            options: [
                                {
                                    name: "button.reject",
                                    taskPermissionName: "REJECT_SAVINGSACCOUNT",
                                },
                                {
                                    name: "button.withdrawnbyclient",
                                    taskPermissionName: "WITHDRAW_SAVINGSACCOUNT",
                                },
                                {
                                    name: "button.addcharge",
                                    taskPermissionName: "CREATE_SAVINGSACCOUNTCHARGE",
                                },
                                {
                                    name: "button.delete",
                                    taskPermissionName: "DELETE_SAVINGSACCOUNT",
                                },
                            ],
                        };
                    }

                    if (data.status.value == "Approved") {
                        scope.buttons = {
                            singlebuttons: [
                                {
                                    name: "button.undoapproval",
                                    icon: "fa faf-undo",
                                    taskPermissionName: "APPROVALUNDO_SAVINGSACCOUNT",
                                },
                                {
                                    name: "button.activate",
                                    icon: "fa fa-check",
                                    taskPermissionName: "ACTIVATE_SAVINGSACCOUNT",
                                },
                                {
                                    name: "button.addcharge",
                                    icon: "fa fa-plus",
                                    taskPermissionName: "CREATE_SAVINGSACCOUNTCHARGE",
                                },
                            ],
                        };
                    }

                    if (data.status.value == "Active") {
                        scope.buttons = {
                            singlebuttons: [
                                {
                                    name: "button.postInterestAsOn",
                                    icon: "icon-arrow-right",
                                    taskPermissionName: "POSTINTEREST_SAVINGSACCOUNT",
                                },
                                {
                                    name: "button.calculateInterest",
                                    icon: "fa fa-table",
                                    taskPermissionName: "CALCULATEINTEREST_SAVINGSACCOUNT",
                                },
                            ],
                            options: [
                                {
                                    name: "button.postInterest",
                                    taskPermissionName: "POSTINTEREST_SAVINGSACCOUNT",
                                },
                                {
                                    name: "button.addcharge",
                                    taskPermissionName: "CREATE_SAVINGSACCOUNTCHARGE",
                                },
                                {
                                    name: "button.close",
                                    taskPermissionName: "CLOSE_SAVINGSACCOUNT",
                                },
                            ],
                        };

                        if (data.subStatus.value == "Block" || data.subStatus.value == "BlockDebit" || data.subStatus.value == "BlockCredit") {
                            scope.buttons.options.splice(2, 0, {
                                name: "button.unblock",
                                taskPermissionName: "UNBLOCK_SAVINGSACCOUNT",
                            });
                        }
                        if (data.subStatus.value == "BlockCredit") {
                            scope.buttons.singlebuttons.splice(2, 0, {
                                name: "button.withdraw",
                                icon: "fa fa-arrow-down",
                                taskPermissionName: "WITHDRAW_SAVINGSACCOUNT",
                            });

                        }
                        else if (data.subStatus.value == "BlockDebit") {
                            scope.buttons.singlebuttons.splice(1, 0, {
                                name: "button.deposit",
                                icon: "fa fa-arrow-up",
                                taskPermissionName: "DEPOSIT_SAVINGSACCOUNT",
                            });

                        }
                        else {
                            scope.buttons.singlebuttons.splice(1, 0, {
                                name: "button.deposit",
                                icon: "fa fa-arrow-up",
                                taskPermissionName: "DEPOSIT_SAVINGSACCOUNT",
                            });
                            scope.buttons.singlebuttons.splice(2, 0, {
                                name: "button.withdraw",
                                icon: "fa fa-arrow-down",
                                taskPermissionName: "WITHDRAW_SAVINGSACCOUNT",
                            });
                            scope.buttons.options.splice(2, 0, {
                                name: "button.block",
                                taskPermissionName: "BLOCK_SAVINGSACCOUNT",
                            });
                        }

                        if (data.clientId) {
                            scope.buttons.options.push({
                                name: "button.transferFunds",
                                taskPermissionName: "CREATE_ACCOUNTTRANSFER",
                            });
                        }
                        if (data.charges) {
                            for (var i in scope.charges) {
                                if (scope.charges[i].name == "Annual fee - INR") {
                                    scope.buttons.options.push({
                                        name: "button.applyAnnualFees",
                                        taskPermissionName: "APPLYANNUALFEE_SAVINGSACCOUNT",
                                    });
                                    scope.annualChargeId = scope.charges[i].id;
                                }
                            }
                        }
                        if (data.taxGroup) {
                            if (data.withHoldTax) {
                                scope.buttons.options.push({
                                    name: "button.disableWithHoldTax",
                                    taskPermissionName: "UPDATEWITHHOLDTAX_SAVINGSACCOUNT",
                                });
                            } else {
                                scope.buttons.options.push({
                                    name: "button.enableWithHoldTax",
                                    taskPermissionName: "UPDATEWITHHOLDTAX_SAVINGSACCOUNT",
                                });
                            }
                        }
                    }

                    if (data.annualFee) {
                        var annualdueDate = [];
                        annualdueDate = data.annualFee.feeOnMonthDay;
                        annualdueDate.push(new Date().getFullYear());
                        scope.annualdueDate = new Date(annualdueDate);
                    }

                    resourceFactory.standingInstructionTemplateResource.get(
                        {
                            fromClientId: scope.savingaccountdetails.clientId,
                            fromAccountType: 2,
                            fromAccountId: routeParams.id,
                        },
                        function (response) {
                            scope.standinginstruction = response;
                            scope.searchTransaction();
                        }
                    );
                }
            );

            var fetchFunction = function (offset, limit, callback) {
                var params = {};
                params.offset = offset;
                params.limit = limit;
                params.locale = scope.optlang.code;
                params.fromAccountId = routeParams.id;
                params.fromAccountType = 2;
                params.clientId = scope.savingaccountdetails.clientId;
                params.clientName = scope.savingaccountdetails.clientName;
                params.dateFormat = scope.df;

                resourceFactory.standingInstructionResource.search(params, callback);
            };

            scope.searchTransaction = function () {
                scope.displayResults = true;
                scope.instructions = paginatorService.paginate(fetchFunction, 14);
                scope.isCollapsed = false;
            };

            resourceFactory.DataTablesResource.getAllDataTables(
                { apptable: "m_savings_account" },
                function (data) {
                    scope.savingdatatables = data;
                }
            );

            scope.saveNote = function () {
                resourceFactory.savingsNotesResource.save({ savingsId: routeParams.id }, this.formData, function (data) {
                    var today = new Date();
                    temp = { id: data.resourceId, note: scope.formData.note, createdByUsername: "test", createdOn: today };
                    scope.savingNotes.push(temp);
                    scope.formData.note = "";
                    scope.predicate = '-id';
                });
            };

            scope.dataTableChange = function (datatable) {
                resourceFactory.DataTablesResource.getTableDetails(
                    {
                        datatablename: datatable.registeredTableName,
                        entityId: routeParams.id,
                        genericResultSet: "true",
                    },
                    function (data) {
                        scope.datatabledetails = data;
                        scope.datatabledetails.isData = data.data.length > 0 ? true : false;
                        scope.datatabledetails.isMultirow =
                            data.datatableData.columnHeaderData[0].columnName == "id" ? true : false;
                        scope.showDataTableAddButton =
                            !scope.datatabledetails.isData ||
                            scope.datatabledetails.isMultirow;
                        scope.showDataTableEditButton =
                            scope.datatabledetails.isData &&
                            !scope.datatabledetails.isMultirow;
                        scope.singleRow = [];
                        for (var i in data.datatableData.columnHeaderData) {
                            if (scope.datatabledetails.columnHeaders[i].columnCode) {
                                for (var j in scope.datatabledetails.columnHeaders[i]
                                    .columnValues) {
                                    for (var k in data.data) {
                                        if (
                                            data.data[k].row[i] ==
                                            scope.datatabledetails.columnHeaders[i].columnValues[j].id
                                        ) {
                                            data.data[k].row[i] =
                                                scope.datatabledetails.columnHeaders[i].columnValues[
                                                    j
                                                ].value;
                                        }
                                    }
                                }
                            }
                        }
                        if (scope.datatabledetails.isData) {
                            for (var i in data.datatableData.columnHeaderData) {
                                if (!scope.datatabledetails.isMultirow) {
                                    var row = {};
                                    row.key = data.datatableData.columnHeaderData[i].columnName;
                                    row.value = data.data[0].row[i];
                                    scope.singleRow.push(row);
                                }
                            }
                        }
                    }
                );
            };

            scope.export = function () {
                scope.report = true;
                scope.printbtn = false;
                scope.viewReport = false;
                scope.viewSavingReport = true;
                scope.viewTransactionReport = false;
            };

            scope.refresh = function () {
                route.reload();
            };

            scope.viewJournalEntries = function () {
                location
                    .path("/searchtransaction/")
                    .search({ savingsId: scope.savingaccountdetails.id });
            };

            scope.viewDataTable = function (registeredTableName, data) {
                if (scope.datatabledetails.isMultirow) {
                    location.path(
                        "/viewdatatableentry/" +
                        registeredTableName +
                        "/" +
                        scope.savingaccountdetails.id +
                        "/" +
                        data.row[0]
                    );
                } else {
                    location.path(
                        "/viewsingledatatableentry/" +
                        registeredTableName +
                        "/" +
                        scope.savingaccountdetails.id
                    );
                }
            };

            scope.viewSavingDetails = function () {
                scope.report = false;
                scope.hidePentahoReport = true;
                scope.viewReport = false;
            };

            scope.viewPrintDetails = function () {
                var reportName = "savingsAccountStatement";
                var d = new Date();
                scope.formData = {
                    "output-type": "PDF",
                    base64: true,
                    locale: scope.optlang.code,
                    R_AccountNo: scope.savingaccountdetails.accountNo,
                    R_year: d.getFullYear(),
                    R_month: d.getMonth(),
                    reportSource: reportName
                }
                scope.fileData = "";
                resourceFactory.runReportsResource.getReport(scope.formData, function (data) {
                    scope.fileType = "application/pdf";
                    scope.fileData = $sce.trustAsResourceUrl("data:" + scope.fileType + ";base64," + data.data);
                    scope.report = true;
                    scope.viewTransactionReport = false;
                    scope.viewReport = true;
                    scope.hidePentahoReport = true;
                }, function (error) {
                    console.log(JSON.stringify(error));
                });
            };

            scope.showSavingsTransactionReceipts = function (transactionType) {
                return (transactionType === "Deposit" || transactionType === "Withdrawal");
            }

            scope.viewSavingsTransactionReceipts = function (transactionId, transactionType) {
                scope.report = true;
                scope.viewTransactionReport = true;
                scope.viewSavingReport = false;
                scope.printbtn = false;
                scope.viewReport = true;
                scope.hidePentahoReport = true;

                const transactionTypeCap = transactionType.charAt(0).toUpperCase() + transactionType.slice(1)
                var reportName = transactionTypeCap + " Receipt";
                scope.formData = {
                    "output-type": "PDF",
                    base64: true,
                    locale: scope.optlang.code,
                    R_transactionId: encodeURIComponent(transactionId),
                    reportSource: reportName
                }
                scope.fileData = "";
                resourceFactory.runReportsResource.getReport(scope.formData, function (data) {
                    scope.fileType = "application/pdf";
                    scope.fileData = $sce.trustAsResourceUrl("data:" + scope.fileType + ";base64," + data.data);
                }, function (error) {
                    console.log(JSON.stringify(error));
                });
            };

            

scope.viewSavingAccountBalance = function () {
    scope.report = true;
    scope.viewTransactionReport = true;
    scope.viewSavingReport = false;
    scope.printbtn = false;
    scope.viewReport = true;
    scope.hidePentahoReport = true;
    
    var reportName = "Balance Inquiry Receipt";
    scope.formData = {
    "output-type": "PDF",
    base64: true,
    locale: scope.optlang.code,
    R_officeId: encodeURIComponent(210032),
    R_accountNo: encodeURIComponent(scope.savingaccountdetails.accountNo), 
    reportSource: reportName
    }
    scope.fileData = "";
    resourceFactory.runReportsResource.getReport(scope.formData, function (data) {
    scope.fileType = "application/pdf";
    scope.fileData = $sce.trustAsResourceUrl("data:" + scope.fileType + ";base64," + data.data);
    }, function (error) {
    console.log(JSON.stringify(error));
    });
    };
    
    
            scope.viewSavingAccountReceipts = function () {
                scope.report = true;
                scope.viewTransactionReport = true;
                scope.viewSavingReport = false;
                scope.printbtn = false;
                scope.viewReport = true;
                scope.hidePentahoReport = true;

       
                var reportName =  "Balance Inquiry Receipt";
                scope.formData = {
                    "output-type": "PDF",
                    base64: true,
                    locale: scope.optlang.code,
                    R_accountNo: encodeURIComponent(scope.savingaccountdetails.accountNo),
                    R_officeName:  $rootScope.currentSession.officeName,
                    R_officeId:  $rootScope.currentSession.officeId,
                    reportSource: reportName
                }
                scope.fileData = "";
                resourceFactory.runReportsResource.getReport(scope.formData, function (data) {
                    scope.fileType = "application/pdf";
                    scope.fileData = $sce.trustAsResourceUrl("data:" + scope.fileType + ";base64," + data.data);
                }, function (error) {
                    console.log(JSON.stringify(error));
                });
            };
            scope.deletestandinginstruction = function (id) {
                $uibModal.open({
                    templateUrl: "delInstruction.html",
                    controller: DelInstructionCtrl,
                    resolve: {
                        ids: function () {
                            return id;
                        },
                    },
                });
            };

            scope.getNotes = function () {
                resourceFactory.savingsNotesResource.get({ savingsId: routeParams.id }, function (data) {
                    scope.savingNotes = data;
                });
            }

            var DelInstructionCtrl = function ($scope, $uibModalInstance, ids) {
                $scope.delete = function () {
                    resourceFactory.standingInstructionResource.cancel(
                        { standingInstructionId: ids },
                        function (data) {
                            scope.searchTransaction();
                            $uibModalInstance.close("delete");
                        }
                    );
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss("cancel");
                };
            };

            scope.printReport = function () {
                window.print();
                window.close();
            };

            scope.deleteAll = function (apptableName, entityId) {
                resourceFactory.DataTablesResource.delete(
                    {
                        datatablename: apptableName,
                        entityId: entityId,
                        genericResultSet: "true",
                    },
                    {},
                    function (data) {
                        route.reload();
                    }
                );
            };

            scope.modifyTransaction = function (accountId, transactionId) {
                location.path(
                    "/savingaccount/" +
                    accountId +
                    "/modifytransaction?transactionId=" +
                    transactionId
                );
            };

            scope.transactionSort = {
                column: "date",
                descending: true,
            };

            scope.changeTransactionSort = function (column) {
                var sort = scope.transactionSort;
                if (sort.column == column) {
                    sort.descending = !sort.descending;
                } else {
                    sort.column = column;
                    sort.descending = true;
                }
            };

            scope.checkStatus = function () {
                if (
                    scope.status == "Active" ||
                    scope.status == "Closed" ||
                    scope.status == "Transfer in progress" ||
                    scope.status == "Transfer on hold" ||
                    scope.status == "Premature Closed" ||
                    scope.status == "Matured"
                ) {
                    return true;
                }
                return false;
            };
        },
    });
    mifosX.ng.application
        .controller("ViewSavingDetailsController", [
            "$scope",
            "$routeParams",
            "ResourceFactory",
            "PaginatorService",
            "$location",
            "$uibModal",
            "$route",
            "$sce",
            "$rootScope",
            mifosX.controllers.ViewSavingDetailsController,
        ])
        .run(function ($log) {
            $log.info("ViewSavingDetailsController initialized");
        });
})(mifosX.controllers || {});