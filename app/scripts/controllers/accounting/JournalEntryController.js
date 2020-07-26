(function (module) {
    mifosX.controllers = _.extend(module, {
        JournalEntryController: function (scope, resourceFactory, location, dateFilter) {
            scope.formData = {};
            scope.formData.crAccounts = [{}];
            scope.formData.dbAccounts = [{}];
            scope.searchText = "";
            scope.selectedItem = null;
           
            scope.first = {
                date: new Date()
            };
            scope.errorcreditevent = false;
            scope.errordebitevent = false;
            scope.creditaccounttemplate = false;
            scope.debitaccounttemplate = false;
            scope.restrictDate = new Date();
            scope.showPaymentDetails = false;

            resourceFactory.accountCoaResource.getAllAccountCoas({ manualEntriesAllowed: true, usage: 1, disabled: false }, function (data) {
                scope.glAccounts = data;
            });

            resourceFactory.paymentTypeResource.getAll(function (data) {
                scope.paymentTypes = data;
            });

            resourceFactory.currencyConfigResource.get({ fields: 'selectedCurrencyOptions' }, function (data) {
                scope.currencyOptions = data.selectedCurrencyOptions;
                scope.formData.currencyCode = scope.currencyOptions[0].code;
            });

            resourceFactory.officeResource.getAllOffices(function (data) {
                scope.offices = data;
                scope.formData.officeId = scope.offices[0].id;
            });

            //events for credits
            scope.addCrAccount = function () {
                scope.formData.crAccounts.push({});
            }

            scope.removeCrAccount = function (index) {
                scope.formData.crAccounts.splice(index, 1);
            }

            //events for debits
            scope.addDebitAccount = function () {
                scope.formData.dbAccounts.push({});
            }

            scope.removeDebitAccount = function (index) {
                scope.formData.dbAccounts.splice(index, 1);
            }
            
            scope.getItemText = function(item) {
                return item.glCode + " " + item.name;
            }

            scope.querySearch = function(query) {
                const value = query.toLowerCase();
                const results = scope.glAccounts.filter(function(item) {
                    return (item.glCode.indexOf(value) > 0) || (item.name.toLowerCase().indexOf(value) > 0);
                });
                return results;
            }

            scope.selectedcrAccountsItemChange = function(item, i) {
                if(item) this.formData.crAccounts[i].id = item.id;
            }
            scope.selecteddbAccountItemChange = function(item, i) {
                if(item) this.formData.dbAccounts[i].id = item.id;
            }
            
            scope.submit = function () {
                var jeTransaction = new Object();
                var reqDate = dateFilter(scope.first.date, scope.df);
                jeTransaction.locale = scope.optlang.code;
                jeTransaction.dateFormat = scope.df;
                jeTransaction.officeId = this.formData.officeId;
                jeTransaction.transactionDate = reqDate;
                jeTransaction.referenceNumber = this.formData.referenceNumber;
                jeTransaction.comments = this.formData.comments;
                jeTransaction.currencyCode = this.formData.currencyCode;
                jeTransaction.paymentTypeId = this.formData.paymentTypeId;
                jeTransaction.accountNumber = this.formData.accountNumber;
                jeTransaction.checkNumber = this.formData.checkNumber;
                jeTransaction.routingCode = this.formData.routingCode;
                jeTransaction.receiptNumber = this.formData.receiptNumber;
                jeTransaction.bankNumber = this.formData.bankNumber;

                //Construct credits array
                jeTransaction.credits = [];
                for (var i = 0; i < this.formData.crAccounts.length; i++) {
                    var temp = new Object();
                    if (this.formData.crAccounts[i].id) {
                        temp.glAccountId = this.formData.crAccounts[i].id;
                    }
                    temp.amount = this.formData.crAccounts[i].crAmount;
                    jeTransaction.credits.push(temp);
                }
                //construct debits array
                jeTransaction.debits = [];
                for (var i = 0; i < this.formData.dbAccounts.length; i++) {
                    var temp = new Object();
                    if (this.formData.dbAccounts[i].id) {
                        temp.glAccountId = this.formData.dbAccounts[i].id;
                    }
                    temp.amount = this.formData.dbAccounts[i].debitAmount;
                    jeTransaction.debits.push(temp);
                }

                resourceFactory.journalEntriesResource.save(jeTransaction, function (data) {
                    location.path('/viewtransactions/' + data.transactionId);
                });
            }
        }
    });
    mifosX.ng.application.controller('JournalEntryController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.JournalEntryController]).run(function ($log) {
        $log.info("JournalEntryController initialized");
    });
}(mifosX.controllers || {}));