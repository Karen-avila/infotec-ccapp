(function(module) {
    mifosX.controllers = _.extend(module, {
        CreateOfficeController: function(scope, resourceFactory, location, dateFilter) {
            scope.offices = [];
            scope.first = {};
            scope.first.date = new Date();
            scope.restrictDate = new Date();
            //--------
            scope.addressTypes = [];
            scope.countryOptions = [];
            scope.stateOptions = [];
            scope.addressTypeId = {};
            entityname = "ADDRESS";
            //--------
            resourceFactory.officeResource.getAllOffices(function(data) {
                scope.offices = data;
                scope.formData = {
                    parentId: scope.offices[0].id
                }
            });

            //----------
            resourceFactory.clientTemplateResource.get(function(data) {

                scope.addressTypes = data.address[0].addressTypeIdOptions;
                scope.countryOptions = data.address[0].countryIdOptions;
                scope.stateOptions = data.address[0].stateProvinceIdOptions;
                /*               scope.municipalityOptions = data.address[0].municipalityIdOptions;
                              scope.allMunicipalityOptions = data.address[0].municipalityIdOptions; */
                resourceFactory.addressFieldConfiguration.get({ entity: entityname }, function(data) {
                    for (var i = 0; i < data.length; i++) {
                        data[i].field = 'scope.' + data[i].field;
                        eval(data[i].field + "=" + data[i].is_enabled);
                    }
                })

            });
            //---------

            scope.minDat = function() {
                for (var i = 0; i < scope.offices.length; i++) {
                    if ((scope.offices[i].id) === (scope.formData.parentId)) {
                        return scope.offices[i].openingDate;
                    }
                }
            };

            scope.submit = function() {
                console.log("Se envia", this.formData);
                this.formData.locale = scope.optlang.code;
                var reqDate = dateFilter(scope.first.date, scope.df);
                this.formData.dateFormat = scope.df;
                this.formData.openingDate = reqDate;
                this.formData.name = this.formData.name.toUpperCase();
                this.formData.city = this.formData.city.padStart(3, "0");
                this.formData.branch = this.formData.branch.padStart(6, "0");
                resourceFactory.officeResource.save(this.formData, function(data) {
                    location.path('/viewoffice/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateOfficeController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.CreateOfficeController]).run(function($log) {
        $log.info("CreateOfficeController initialized");
    });
}(mifosX.controllers || {}));