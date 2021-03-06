(function (module) {
    mifosX.controllers = _.extend(module, {
        AccCreateGLAccountController: function (scope, resourceFactory, location, $routeParams) {
            scope.coadata = [];
            scope.accountTypes = [];
            scope.usageTypes = [];
            scope.headerTypes = [];
            scope.searchText = "";
            scope.selectedItem = null;

            resourceFactory.accountCoaTemplateResource.get({ type: '0' }, function (data) {
                scope.coadata = data;
                scope.accountTypes = data.accountTypeOptions;
                scope.usageTypes = data.usageOptions;

                scope.formData = {
                    manualEntriesAllowed: true,
                    type: scope.accountTypes[0].id,
                    usage: scope.usageTypes[0].id
                };
                scope.formData.type;
                scope.formData.parentId;

                for (var i = 0; i < data.accountTypeOptions.length; i++) {
                    if (data.accountTypeOptions[i].value == $routeParams.acctype) {
                        scope.formData.type = scope.accountTypes[i].id;
                    }
                }

                //by default display assetTagsOptions and assetHeaderAccountOptions
                scope.types = data.allowedAssetsTagOptions,
                scope.headerTypes = data.assetHeaderAccountOptions;
                scope.changeType();

                for (var i = 0; i < scope.headerTypes.length; i++) {
                    if (scope.headerTypes[i].id == $routeParams.parent) {
                        // console.log($routeParams.parent + scope.headerTypes[i].id)
                        scope.formData.parentId = scope.headerTypes[i].id;
                    }
                }

            });

            scope.changeType = function () {
                if (scope.formData.type == 1) {
                    scope.types = scope.coadata.allowedAssetsTagOptions;
                    scope.headerTypes = scope.coadata.assetHeaderAccountOptions
                } else if (scope.formData.type == 2) {
                    scope.types = scope.coadata.allowedLiabilitiesTagOptions;
                    scope.headerTypes = scope.coadata.liabilityHeaderAccountOptions;
                } else if (scope.formData.type == 3) {
                    scope.types = scope.coadata.allowedEquityTagOptions;
                    scope.headerTypes = scope.coadata.equityHeaderAccountOptions;
                } else if (scope.formData.type == 4) {
                    scope.types = scope.coadata.allowedIncomeTagOptions;
                    scope.headerTypes = scope.coadata.incomeHeaderAccountOptions;
                } else if (scope.formData.type == 5) {
                    scope.types = scope.coadata.allowedExpensesTagOptions;
                    scope.headerTypes = scope.coadata.expenseHeaderAccountOptions;
                } else if (scope.formData.type == 6) {
                    scope.types = scope.coadata.allowedDebitOrderTagOptions;
                    scope.headerTypes = scope.coadata.debitOrderHeaderAccountOptions;
                } else if (scope.formData.type == 7) {
                    scope.types = scope.coadata.allowedCreditOrderTagOptions;
                    scope.headerTypes = scope.coadata.creditOrderHeaderAccountOptions;
                } else {
                    scope.types = [];
                    scope.headerTypes = [];
                }
            };

            scope.getItemText = function(item) {
                return item.glCode + " " + item.name;
            }

            scope.querySearch = function(query) {
                const value = query.toLowerCase();
                var results = scope.headerTypes.filter(function(item) {
                    return (item.glCode.indexOf(value) > 0) || (item.name.toLowerCase().indexOf(value) > 0);
                });
                return results;
            }
        
            scope.selectedItemChange = function(item) {
                scope.formData.parentId = item.id;
            }

            if ($routeParams.parent) {
                scope.cancel = '#!/viewglaccount/' + $routeParams.parent
            } else {
                scope.cancel = "#!/accounting_coa"
            }

            scope.submit = function () {
                this.formData.name = this.formData.name.toUpperCase();
                resourceFactory.accountCoaResource.save(this.formData, function (data) {
                    location.path('/viewglaccount/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('AccCreateGLAccountController', ['$scope', 'ResourceFactory', '$location', '$routeParams', mifosX.controllers.AccCreateGLAccountController]).run(function ($log) {
        $log.info("AccCreateGLAccountController initialized");
    });
}(mifosX.controllers || {}));
