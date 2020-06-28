(function (module) {
    mifosX.controllers = _.extend(module, {
        EditFinancialActivityMappingController: function (scope, resourceFactory, location,routeParams) {
            scope.formData = {};
            scope.accountOptions = [];
            resourceFactory.officeToGLAccountMappingResource.withTemplate({mappingId: routeParams.mappingId},function (data) {
                scope.mapping = data;
                scope.glAccountOptions = data.glAccountOptions;
                scope.formData.financialActivityId = data.financialActivityData.id;
                scope.formData.glAccountId = data.glAccountData.id;
                scope.financialActivityOptions = data.financialActivityOptions;
                scope.updateActivityOptions(scope.formData.financialActivityId);
            });

            scope.updateActivityOptions = function(activityId){
                if(activityId === 100 || activityId === 101 || activityId === 102 || activityId === 103){
                    scope.accountOptions = scope.glAccountOptions.assetAccountOptions;
                }else if(activityId === 200 || activityId === 201){
                    scope.accountOptions = scope.glAccountOptions.liabilityAccountOptions;
                }else if(activityId === 300){
                    scope.accountOptions = scope.glAccountOptions.equityAccountOptions;
                }
                setSelectedItem(scope.formData.glAccountId);
            };

            function setSelectedItem(glAccountId) {
                for (var i=0; i<scope.accountOptions.length; i++) {
                    const item = scope.accountOptions[i];
                    if (item.id == glAccountId) {
                        scope.selectedItem = item;
                        break;
                    }
                }
            }

            scope.submit = function () {
                resourceFactory.officeToGLAccountMappingResource.update({mappingId: routeParams.mappingId},this.formData, function (data) {
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
    mifosX.ng.application.controller('EditFinancialActivityMappingController', ['$scope', 'ResourceFactory', '$location','$routeParams', mifosX.controllers.EditFinancialActivityMappingController]).run(function ($log) {
        $log.info("EditFinancialActivityMappingController initialized");
    });
}(mifosX.controllers || {}));
