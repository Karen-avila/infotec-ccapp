(function (module) {
    mifosX.controllers = _.extend(module, {
        AddFinancialMappingController: function (scope, resourceFactory, location) {
            scope.formData = {};

            resourceFactory.officeToGLAccountMappingResource.get({mappingId:'template'}, function (data) {
                scope.formData.financialActivityId = 100;
                scope.glAccountOptions = data.glAccountOptions;
                scope.financialActivityOptions = data.financialActivityOptions;
                scope.accountOptions = scope.glAccountOptions.assetAccountOptions;
            });

            scope.updateActivityOptions = function(activityId){
                if(activityId === 100 || activityId === 101 || activityId === 102 || activityId === 103){
                    scope.accountOptions = scope.glAccountOptions.assetAccountOptions;
                }else if(activityId === 200 || activityId === 201){
                    scope.accountOptions = scope.glAccountOptions.liabilityAccountOptions;
                }else if(activityId === 300){
                    scope.accountOptions = scope.glAccountOptions.equityAccountOptions;
                }
            };

            scope.submit = function () {
                resourceFactory.officeToGLAccountMappingResource.create(this.formData, function (data) {
                    location.path('/viewfinancialactivitymapping/' + data.resourceId);
                });
            };
        
            scope.searchText = "";
            scope.selectedItem = null;

            scope.getItemText = function(item) {
                return item.glCode + " " + item.name;
            }

            scope.querySearch = function(query) {
                const value = query.toLowerCase();
                var results = scope.accountOptions.filter(function(item) {
                    return (item.glCode.indexOf(value) > 0) || (item.name.toLowerCase().indexOf(value) > 0);
                });
                return results;
            }
        
            scope.selectedItemChange = function(item) {
                scope.formData.glAccountId = item.id;
            }
        }
    });
    mifosX.ng.application.controller('AddFinancialMappingController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.AddFinancialMappingController]).run(function ($log) {
        $log.info("AddFinancialMappingController initialized");
    });
}(mifosX.controllers || {}));
