(function (module) {
    mifosX.controllers = _.extend(module, {
        SavingAccountActionsController: function (scope, rootScope, resourceFactory, location, routeParams, dateFilter, API_VERSION,
            $sce) {

                scope.template=[];
                scope.sumaDenominations=0;
                scope.formData={};
                scope.formData.amount=0;

            scope.action = routeParams.action || "";
            scope.accountId = routeParams.id;
            scope.savingAccountId = routeParams.id;
            scope.formData = {};
            scope.entityformData = {};
            scope.entityformData.datatables = {};
            scope.restrictDate = new Date();
            scope.isTransaction = false;
            scope.transactionAmountField = false;
            scope.showPaymentDetails = false;
            scope.paymentTypes = [];
            scope.submittedDatatables = [];
            scope.tf = "HH:mm";
            scope.dateFormat = scope.df;
            scope.dateTimeFormat = scope.df + " " + scope.tf;
            var submitStatus = [];
            scope.substatus = '';
            
           
          

            rootScope.RequestEntities = function (entity, status, productId) {
                resourceFactory.entityDatatableChecksResource.getAll({ limit: -1 }, function (response) {
                    var _ = require('underscore');
                    scope.entityDatatableChecks = _.filter(response.pageItems, function (datatable) {
                        var specificProduct = (datatable.entity == entity && datatable.status.value == status && datatable.productId == productId);
                        var AllProducts = (datatable.entity == entity && datatable.status.value == status);
                        return (datatable.productId ? specificProduct : AllProducts);
                    });
                    scope.entityDatatableChecks = _.pluck(scope.entityDatatableChecks, 'datatableName');
                    scope.datatables = [];
                    var k = 0;
                    _.each(scope.entityDatatableChecks, function (entitytable) {
                        resourceFactory.DataTablesResource.getTableDetails({ datatablename: entitytable, entityId: routeParams.id, genericResultSet: 'true' }, function (data) {
                            data.registeredTableName = entitytable;
                            const columnHeaders = data.datatableData.columnHeaderData;
                            var colName = columnHeaders[0].columnName;
                            if (colName == 'id') {
                                data.datatableData.columnHeaderData.splice(0, 1);
                            }

                            colName = columnHeaders[0].columnName;
                            if (colName == 'client_id' || colName == 'office_id' || colName == 'group_id' || colName == 'center_id' || colName == 'loan_id' || colName == 'savings_account_id') {
                                data.datatableData.columnHeaderData.splice(0, 1);
                                scope.isCenter = (colName == 'center_id') ? true : false;
                            }

                            data.noData = (data.data.length == 0);
                            if (data.noData) {
                                scope.datatables.push(data);
                                scope.entityformData.datatables[k] = { data: {} };
                                submitStatus[k] = "save";
                                _.each(data.datatableData.columnHeaderData, function (Header) {
                                    if (Header.columnDisplayType == 'DATETIME') {
                                        scope.entityformData.datatables[k].data[Header.columnName] = {};
                                    }
                                    else {
                                        scope.entityformData.datatables[k].data[Header.columnName] = "";
                                    }
                                });
                                k++;
                                scope.isEntityDatatables = true;
                            }
                        });
                    });
                });
            };

            scope.viewSavingDetails = function () {
                location.path('/viewsavingaccount/' + routeParams.id);
            };

            scope.fetchEntities = function (entity, status, productId) {
                if (!productId) {
                    resourceFactory.savingsResource.get({ accountId: routeParams.id, associations: 'all' },
                        function (data) {
                            scope.productId = data.savingsProductId;
                            rootScope.RequestEntities(entity, status, scope.productId);
                            scope.substatus = data.subStatus.value;

                        });
                }
                else {
                    rootScope.RequestEntities(entity, status, productId);
                }
            };

            function asyncLoop(iterations, func, callback) {
                var index = 0;
                var done = false;
                var loop = {
                    next: function () {
                        if (done) {
                            return;
                        }

                        if (index < iterations) {
                            index++;
                            func(loop);

                        } else {
                            done = true;
                            callback();
                        }
                    },

                    iteration: function () {
                        return index - 1;
                    },

                    break: function () {
                        done = true;
                    }
                };
                loop.next();
                return loop;
            }

            scope.fieldType = function (type) {
                var fieldType = "";
                if (type) {
                    if (type == 'CODELOOKUP' || type == 'CODEVALUE') {
                        fieldType = 'SELECT';
                    } else if (type == 'DATE') {
                        fieldType = 'DATE';
                    } else if (type == 'DATETIME') {
                        fieldType = 'DATETIME';
                    } else if (type == 'BOOLEAN') {
                        fieldType = 'BOOLEAN';
                    } else {
                        fieldType = 'TEXT';
                    }
                }
                return fieldType;
            };

            switch (scope.action) {
                case "approve":
                    scope.title = 'label.heading.approvesavingaccount';
                    scope.labelName = 'label.input.savingaccountapprovedOnDate';
                    scope.modelName = 'approvedOnDate';
                    scope.formData[scope.modelName] = new Date();
                    scope.showDateField = true;
                    scope.showNoteField = true;
                    scope.taskPermissionName = 'APPROVE_SAVINGSACCOUNT';
                    scope.fetchEntities('m_savings_account', 'APPROVE');
                    break;
                case "reject":
                    scope.title = 'label.heading.rejectsavingaccount';
                    scope.labelName = 'label.input.rejectedon';
                    scope.modelName = 'rejectedOnDate';
                    scope.formData[scope.modelName] = new Date();
                    scope.showDateField = true;
                    scope.showNoteField = true;
                    scope.taskPermissionName = 'REJECT_SAVINGSACCOUNT';
                    scope.fetchEntities('m_savings_account', 'REJECT');
                    break;
                case "withdrawnByApplicant":
                    scope.title = 'label.heading.withdrawsavingaccount';
                    scope.labelName = 'label.input.withdrawnon';
                    scope.modelName = 'withdrawnOnDate';
                    scope.formData[scope.modelName] = new Date();
                    scope.showDateField = true;
                    scope.showNoteField = true;
                    scope.taskPermissionName = 'WITHDRAW_SAVINGSACCOUNT';
                    break;
                case "undoapproval":
                    scope.title = 'label.heading.undoapprovesavingaccount';
                    scope.showDateField = false;
                    scope.showNoteField = true;
                    scope.taskPermissionName = 'APPROVALUNDO_SAVINGSACCOUNT';
                    break;
                case "activate":
                    scope.title = 'label.heading.activatesavingaccount';
                    scope.labelName = 'label.input.activatedon';
                    scope.modelName = 'activatedOnDate';
                    scope.formData[scope.modelName] = new Date();
                    scope.showDateField = true;
                    scope.showNoteField = false;
                    scope.taskPermissionName = 'ACTIVATE_SAVINGSACCOUNT';
                    scope.fetchEntities('m_savings_account', 'ACTIVATE');
                    break;
                case "deposit":
                    resourceFactory.savingsTrxnsTemplateResource.get({ savingsId: scope.accountId }, function (data) {
                        scope.paymentTypes = data.paymentTypeOptions;
                    });
                    scope.title = 'label.heading.depositmoneytosavingaccount';
                    scope.labelName = 'label.input.transactiondate';
                    scope.modelName = 'transactionDate';
                    scope.formData[scope.modelName] = new Date();
                    scope.showDateField = true;
                    scope.showNoteField = true;
                    scope.isTransaction = true;
                    scope.transactionAmountField = true;
                    scope.showPaymentDetails = false;
                    scope.taskPermissionName = 'DEPOSIT_SAVINGSACCOUNT';
                    break;
                case "postInterestAsOn":
                    resourceFactory.savingsTrxnsTemplateResource.get({ savingsId: scope.accountId }, function (data) {
                        scope.accountnumber = data.accountNo;
                    });
                    scope.labelName = 'label.input.transactiondate';
                    scope.modelName = 'transactionDate';
                    scope.formData[scope.modelName] = new Date();
                    scope.showDateField = true;
                    scope.showAccountNumber = true;
                    scope.taskPermissionName = 'POSTINTEREST_SAVINGSACCOUNT';
                    break;
                case "withdrawal":
                    resourceFactory.savingsTrxnsTemplateResource.get({ savingsId: scope.accountId }, function (data) {
                        scope.paymentTypes = data.paymentTypeOptions;
                    });
                    scope.title = 'label.heading.withdrawmoneyfromsavingaccount';
                    scope.labelName = 'label.input.transactiondate';
                    scope.modelName = 'transactionDate';
                    scope.formData[scope.modelName] = new Date();
                    scope.showDateField = true;
                    scope.showNoteField = true;
                    scope.isTransaction = true;
                    scope.transactionAmountField = true;
                    scope.showPaymentDetails = false;
                    scope.taskPermissionName = 'WITHDRAWAL_SAVINGSACCOUNT';
                    scope.fetchEntities('m_savings_account', 'WITHDRAWN');
                    break;
                case "applyAnnualFees":
                    resourceFactory.savingsResource.get({ accountId: routeParams.id, resourceType: 'charges', chargeId: routeParams.chargeId },
                        function (data) {
                            scope.formData.amount = data.amount;
                            if (data.dueDate) {
                                var dueDate = dateFilter(data.dueDate, scope.dateFormat);
                                scope.formData.dueDate = new Date(dueDate);
                            }
                        });
                    scope.title = 'label.heading.savingaccountapplyannualFee';
                    scope.labelName = 'label.input.annualfeetransactiondate';
                    scope.modelName = 'dueDate';
                    scope.formData[scope.modelName] = new Date();
                    scope.showDateField = true;
                    scope.showAnnualAmountField = true;
                    scope.showAmountField = false;
                    scope.showNoteField = false;
                    scope.taskPermissionName = 'APPLYANNUALFEE_SAVINGSACCOUNT';
                    break;
                case "block":
                    resourceFactory.codeOptionsResource.get({ codeName: 'savingsaccount_block_reason' }, function (data) {
                        scope.blockReasons = data.codeValues;
                    });

                    resourceFactory.savingsResource.get({ accountId: routeParams.id });
                    scope.title = 'label.heading.block';
                    scope.labelName = 'label.input.block';
                    scope.showNoteField = false;
                    scope.formData.postInterestValidationOnClosure = true;
                    scope.taskPermissionName = 'BLOCK_SAVINGSACCOUNT';
                    scope.fetchEntities('m_savings_account', 'BLOCK');
                    break;
                case "unblock":
                    resourceFactory.codeOptionsResource.get({ codeName: 'savingsaccount_block_reason' }, function (data) {
                        scope.blockReasons = data.codeValues;
                    });

                    resourceFactory.savingsResource.get({ accountId: routeParams.id });
                    scope.title = 'label.heading.unblock';
                    scope.labelName = 'label.input.unblock';
                    scope.showNoteField = false;
                    scope.formData.postInterestValidationOnClosure = true;
                    scope.taskPermissionName = 'UNBLOCK_SAVINGSACCOUNT';
                    scope.fetchEntities('m_savings_account', 'UNBLOCK');
                    break;
                case "close":
                    resourceFactory.savingsTrxnsTemplateResource.get({ savingsId: scope.accountId }, function (data) {
                        scope.paymentTypes = data.paymentTypeOptions;
                    });
                    resourceFactory.savingsResource.get({ accountId: routeParams.id, fields: 'summary' }, function (accountData) {
                        scope.accountBalance = accountData.summary.accountBalance;
                    });
                    scope.title = 'label.heading.closesavingaccount';
                    scope.labelName = 'label.input.closedon';
                    scope.modelName = 'closedOnDate';
                    scope.formData[scope.modelName] = new Date();
                    scope.showDateField = true;
                    scope.showNoteField = true;
                    scope.withdrawBalance = true;
                    scope.postInterestValidationOnClosure = true;
                    scope.formData.postInterestValidationOnClosure = true;
                    scope.taskPermissionName = 'CLOSE_SAVINGSACCOUNT';
                    scope.fetchEntities('m_savings_account', 'CLOSE');
                    break;
                case "modifytransaction":
                    resourceFactory.savingsTrxnsResource.get({ savingsId: scope.accountId, transactionId: routeParams.transactionId, template: 'true' },
                        function (data) {
                            scope.title = 'label.heading.editsavingaccounttransaction';
                            scope.labelName = 'label.input.transactiondate';
                            scope.modelName = 'transactionDate';
                            scope.formData[scope.modelName] = new Date(data.date) || new Date();
                            scope.paymentTypes = data.paymentTypeOptions;
                            scope.formData.transactionAmount = data.amount;
                            if (data.paymentDetailData) {
                                if (data.paymentDetailData.paymentType) {
                                    scope.formData.paymentTypeId = data.paymentDetailData.paymentType.id;
                                }
                                scope.formData.accountNumber = data.paymentDetailData.accountNumber;
                                scope.formData.checkNumber = data.paymentDetailData.checkNumber;
                                scope.formData.routingCode = data.paymentDetailData.routingCode;
                                scope.formData.receiptNumber = data.paymentDetailData.receiptNumber;
                                scope.formData.bankNumber = data.paymentDetailData.bankNumber;
                            }
                        });
                    scope.showDateField = true;
                    scope.showNoteField = false;
                    scope.isTransaction = true;
                    scope.transactionAmountField = true;
                    scope.showPaymentDetails = false;
                    scope.taskPermissionName = 'ADJUSTTRANSACTION_SAVINGSACCOUNT';
                    break;
                case "editsavingcharge":
                    resourceFactory.savingsResource.get({ accountId: routeParams.id, resourceType: 'charges', chargeId: routeParams.chargeId },
                        function (data) {
                            scope.formData.amount = data.amount;
                            if (data.feeOnMonthDay) {
                                scope.dateArray = [];
                                scope.dateArray.push(2013)
                                for (var i in data.feeOnMonthDay) {
                                    scope.dateArray.push(data.feeOnMonthDay[i]);
                                }
                                var feeOnMonthDay = dateFilter(scope.dateArray, scope.dateFormat);
                                scope.formData.feeOnMonthDayFullDate = new Date(feeOnMonthDay);
                                scope.labelName = 'label.heading.savingaccounttransactionDate';
                                scope.modelName = 'feeOnMonthDayFullDate';
                                scope.showDateField = true;
                                scope.showAnnualAmountField = true;
                                scope.showAmountField = false;
                            } else {
                                scope.labelName = 'label.input.amount';
                                scope.modelName = 'amount';
                                scope.showDateField = false;
                                scope.showAnnualAmountField = false;
                                scope.showAmountField = true;
                            }
                        });
                    scope.taskPermissionName = 'UPDATE_SAVINGSACCOUNTCHARGE';
                    break;
                case "deletesavingcharge":
                    scope.showDelete = true;
                    scope.taskPermissionName = 'DELETE_SAVINGSACCOUNTCHARGE';
                    break;
                case "paycharge":
                    scope.formData.dueDate = new Date();
                    resourceFactory.savingsResource.get({
                        accountId: routeParams.id, resourceType: 'charges', chargeId: routeParams.chargeId,
                        command: 'paycharge'
                    }, function (data) {
                        scope.formData.amount = data.amountOutstanding;
                    });
                    scope.labelName = 'label.input.amount';
                    scope.showAmountField = true;
                    scope.paymentDatefield = true;
                    scope.modelName = 'dueDate';
                    scope.taskPermissionName = 'PAY_SAVINGSACCOUNTCHARGE';
                    break;
                case "inactivate":
                    scope.inactivateCharge = true;
                    scope.taskPermissionName = 'INACTIVATE_SAVINGSACCOUNTCHARGE';
                    break;
                case "waive":
                    scope.waiveCharge = true;
                    scope.taskPermissionName = 'WAIVE_SAVINGSACCOUNTCHARGE';
                    break;
            }

            scope.cancel = function () {
                location.path('/viewsavingaccount/' + routeParams.id);
            };

            scope.setTransactionDate = function (inputDate, modelName) {
                var today = new Date(); //Current date
                today.setHours(0, 0, 0, 0);
                inputDate.setHours(0, 0, 0, 0);
                if (inputDate < today) {
                    return scope.dateFormat;
                } else {
                    this.formData[modelName] = new Date();
                    return scope.dateTimeFormat;
                }
            }

            scope.viewSavingsTransactionReceipts = function (transactionType, transactionId) {
                scope.report = true;
                scope.viewTransactionReport = true;
                scope.viewSavingReport = false;
                scope.printbtn = false;
                scope.viewReport = true;
                scope.hidePentahoReport = true;
                scope.formData.outputType = "PDF";

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

            scope.submit = function () {
                var params = { command: scope.action };

                if (scope.action != "undoapproval" && scope.action != "block" && scope.action != "unblock") {
                    this.formData.locale = scope.optlang.code;
                    this.formData.dateFormat = scope.setTransactionDate(this.formData[scope.modelName], scope.modelName);
                }
                if (scope.action == "deposit" || scope.action == "withdrawal" || scope.action == "modifytransaction" || scope.action == "postInterestAsOn") {
                    if (scope.action == "withdrawal") {
                        if (this.formData.transactionDate) {
                            this.formData.transactionDate = dateFilter(this.formData.transactionDate, this.formData.dateFormat);
                        }
                    } else if (scope.action == "deposit") {
                        if (this.formData.transactionDate) {
                            this.formData.transactionDate = dateFilter(this.formData.transactionDate, this.formData.dateFormat);
                        }
                    }
                    if (scope.action == "modifytransaction") {
                        params.command = 'modify';
                        if (this.formData.transactionDate) {
                            this.formData.transactionDate = dateFilter(this.formData.transactionDate, this.formData.dateFormat);
                        }
                        params.transactionId = routeParams.transactionId;
                    }
                    if (scope.action == "postInterestAsOn") {
                        if (this.formData.transactionDate) {
                            this.formData.transactionDate = dateFilter(this.formData.transactionDate, this.formData.dateFormat);
                        }
                        this.formData.isPostInterestAsOn = true;
                    }
                    params.savingsId = scope.accountId;

                    resourceFactory.savingsTrxnsResource.save(params, this.formData, function (data) {
                        scope.viewSavingsTransactionReceipts(scope.action, data.resourceId);
                    });
                } else if (scope.action == "editsavingcharge") {
                    if (this.formData.feeOnMonthDayFullDate) {
                        this.formData.feeOnMonthDay = dateFilter(this.formData.feeOnMonthDayFullDate, scope.dateFormat);
                        this.formData.monthDayFormat = "dd MMM";
                        this.formData.feeOnMonthDay = this.formData.feeOnMonthDay.substring(0, this.formData.feeOnMonthDay.length - 5);
                        delete this.formData.feeOnMonthDayFullDate;
                    }
                    resourceFactory.savingsResource.update({ accountId: routeParams.id, resourceType: 'charges', chargeId: routeParams.chargeId }, this.formData,
                        function (data) {
                            location.path('/viewsavingaccount/' + data.savingsId);
                        });
                } else if (scope.action == "deletesavingcharge") {
                    resourceFactory.savingsResource.delete({ accountId: routeParams.id, resourceType: 'charges', chargeId: routeParams.chargeId }, this.formData,
                        function (data) {
                            location.path('/viewsavingaccount/' + data.savingsId);
                        });
                } else if (scope.action == "paycharge" || scope.action == "waive" || scope.action == "inactivate") {
                    params = { accountId: routeParams.id, resourceType: 'charges', chargeId: routeParams.chargeId, command: scope.action };
                    if (this.formData.dueDate) {
                        this.formData.dueDate = dateFilter(this.formData.dueDate, scope.dateFormat);
                    } else if (this.formData.inactivationOnDate) {
                        this.formData.inactivationOnDate = dateFilter(this.formData.inactivationOnDate, scope.dateFormat);
                    }
                    resourceFactory.savingsResource.save(params, this.formData, function (data) {
                        location.path('/viewsavingaccount/' + data.savingsId);
                    });
                } else {
                    params.accountId = scope.accountId;
                    if (scope.action == "approve") {
                        if (this.formData.approvedOnDate) {
                            this.formData.approvedOnDate = dateFilter(this.formData.approvedOnDate, this.formData.dateFormat);
                        }
                    } else if (scope.action == "withdrawnByApplicant") {
                        if (this.formData.withdrawnOnDate) {
                            this.formData.withdrawnOnDate = dateFilter(this.formData.withdrawnOnDate, this.formData.dateFormat);
                        }
                    } else if (scope.action == "reject") {
                        if (this.formData.rejectedOnDate) {
                            this.formData.rejectedOnDate = dateFilter(this.formData.rejectedOnDate, this.formData.dateFormat);
                        }
                    } else if (scope.action == "activate") {
                        if (this.formData.activatedOnDate) {
                            this.formData.activatedOnDate = dateFilter(this.formData.activatedOnDate, this.formData.dateFormat);
                        }
                    } else if (scope.action == "applyAnnualFees" || scope.action == "paycharge" || scope.action == "waivecharge") {
                        params = { accountId: routeParams.id, resourceType: 'charges', chargeId: routeParams.chargeId, command: 'paycharge' };
                        if (this.formData.dueDate) {
                            this.formData.dueDate = dateFilter(this.formData.dueDate, scope.dateFormat);
                        }
                    } else if (scope.action == "close") {
                        if (this.formData.closedOnDate) {
                            this.formData.closedOnDate = dateFilter(this.formData.closedOnDate, this.formData.dateFormat);
                        }
                    } else if (scope.action == "block") {
                        if (this.formData.blockType == 0) {
                            params = { accountId: routeParams.id, command: 'block' };
                        }
                        if (this.formData.blockType == 1) {
                            params = { accountId: routeParams.id, command: 'blockDebit' };
                        }
                        if (this.formData.blockType == 2) {

                            params = { accountId: routeParams.id, command: 'blockCredit' };
                        }
                    }
                    else if (scope.action == "unblock") {
                        if (scope.substatus == "Block") {
                            params = { accountId: routeParams.id, command: 'unblock' };
                        }
                        else if (scope.substatus == "BlockDebit") {
                            params = { accountId: routeParams.id, command: 'unblockDebit' };
                        }
                        else if (scope.substatus == "BlockCredit") {
                            params = { accountId: routeParams.id, command: 'unblockCredit' };
                        }
                    }

                    resourceFactory.savingsResource.save(params, this.formData, function (data) {
                        location.path('/viewsavingaccount/' + data.savingsId);
                    });
                }
            };

            scope.submitDatatable = function () {
                if (scope.datatables) {
                    asyncLoop(Object.keys(scope.entityformData.datatables).length, function (loop) {
                        var cnt = loop.iteration();
                        var formData = scope.entityformData.datatables[cnt];
                        formData.registeredTableName = scope.datatables[cnt].registeredTableName;

                        var params = {
                            datatablename: formData.registeredTableName,
                            entityId: routeParams.id,
                            genericResultSet: 'true'
                        };

                        angular.extend(formData.data, { dateFormat: scope.dateFormat, locale: scope.optlang.code });

                        _.each(formData.data, function (columnHeader) {
                            if (columnHeader.dateType) {
                                columnHeader = dateFilter(columnHeader.dateType.date, params.dateFormat);
                            }
                            else if (columnHeader.dateTimeType) {
                                columnHeader = dateFilter(columnHeader.dateTimeType.date, scope.dateFormat)
                                    + " " + dateFilter(columnHeader.dateTimeType.time, scope.tf);
                            }
                        });
                        console.log(scope.entityformData);
                        var action = submitStatus[cnt];
                        resourceFactory.DataTablesResource[action](params, formData.data, function (data) {

                            submitStatus[cnt] = "update";
                            scope.submittedDatatables.push(scope.datatables[cnt].registeredTableName);
                            loop.next();
                        }, function () {
                            rootScope.errorDetails[0].push({ datatable: scope.datatables[cnt].registeredTableName });
                            loop.break();
                        });

                    }, function () {
                        scope.submit();
                    });
                }
                else {
                    scope.submit();
                }
            };
        }
    });
    mifosX.ng.application.controller('SavingAccountActionsController', ['$scope', '$rootScope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', 'API_VERSION',
        '$sce', mifosX.controllers.SavingAccountActionsController]).run(function ($log) {
            $log.info("SavingAccountActionsController initialized");
        });
}(mifosX.controllers || {}));
