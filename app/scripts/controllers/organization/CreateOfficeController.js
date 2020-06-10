(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateOfficeController: function (scope, resourceFactory, location, dateFilter) {
            scope.offices = [];
            scope.first = {};
            scope.first.date = new Date();
            scope.restrictDate = new Date();
            scope.formData = {};
            scope.formDat = {};
           
            //address
            scope.addressTypes = [];
            scope.countryOptions = [];
            scope.stateOptions = [];
            scope.addressTypeId = {};
            entityname = "ADDRESS";
            scope.addressArray = [];
            scope.formData.address = [];

      
            resourceFactory.officeResource.getAllOffices(function (data) {
                scope.offices = data;
                scope.formData = {
                    parentId: scope.offices[0].id
                }
            

            });
                 //----------
            resourceFactory.clientTemplateResource.get(function(data) {
                scope.enableAddress = data.isAddressEnabled;
                scope.addressTypes = data.address[0].addressTypeIdOptions;
                scope.countryOptions = data.address[0].countryIdOptions;
                scope.stateOptions = data.address[0].stateProvinceIdOptions;
                resourceFactory.addressFieldConfiguration.get({ entity: entityname }, function(data) {
                    for (var i = 0; i < data.length; i++) {
                        data[i].field = 'scope.' + data[i].field;
                        eval(data[i].field + "=" + data[i].is_enabled);
                    }
                })

            });
            //---------
             scope.minDat = function() {
                 for(var i=0;i<scope.offices.length;i++) {
                     if ((scope.offices[i].id) === (scope.formData.parentId)) {
                         return scope.offices[i].openingDate;
                     }
                 }
                };


                 // address
            scope.addAddress = function () {
                scope.addressArray.push({});
            }

            scope.removeAddress = function (index) {
                scope.addressArray.splice(index, 1);
            }
            // end of address

            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                var reqDate = dateFilter(scope.first.date, scope.df);
                this.formData.dateFormat = scope.df;
                this.formData.openingDate = reqDate;
                this.formData.name = this.formData.name.toUpperCase();
                this.formData.city = this.formData.city.padStart(3, "0");
                this.formData.branch = this.formData.branch.padStart(6, "0");

                resourceFactory.officeResource.save(this.formData, function (data) {
                    location.path('/viewoffice/' + data.resourceId);
                });
            
                    scope.formData.address = [];
                    for (var i = 0; i < scope.addressArray.length; i++) {
                        var temp = new Object();

                        if (scope.addressArray[i].addressTypeId) {
                            temp.addressTypeId = scope.addressArray[i].addressTypeId;
                        }
                        if (scope.addressArray[i].street) {
                            temp.street = scope.addressArray[i].street;
                        }
                        if (scope.addressArray[i].addressLine1) {
                            temp.addressLine1 = scope.addressArray[i].addressLine1;
                        }
                        if (scope.addressArray[i].addressLine2) {
                            temp.addressLine2 = scope.addressArray[i].addressLine2;
                        }
                        if (scope.addressArray[i].addressLine3) {
                            temp.addressLine3 = scope.addressArray[i].addressLine3;
                        }
                    
                   
                        if (scope.addressArray[i].city) {
                            temp.city = scope.addressArray[i].city;
                        }
                      
                        if (scope.addressArray[i].countryId) {
                            temp.countryId = scope.addressArray[i].countryId;
                        }
                      
                        if (scope.addressArray[i].stateProvinceId) {
                            temp.stateProvinceId = scope.addressArray[i].stateProvinceId;
                        }
                        if (scope.addressArray[i].postalCode) {
                            temp.postalCode = scope.addressArray[i].postalCode;
                        }
                        if (scope.addressArray[i].latitude) {
                            temp.latitude = scope.addressArray[i].latitude;
                        }
                        if (scope.addressArray[i].longitude) {
                            temp.longitude = scope.addressArray[i].longitude;
                        }
                        if (scope.addressArray[i].isActive) {
                            temp.isActive = scope.addressArray[i].isActive;
                        }
                        if (scope.addressArray[i].locale) {
                            temp.locale = scope.addressArray[i].locale;
                        }
                   
                        scope.formData.address.push(temp);
                    
                }
                resourceFactory.officeAddress.save(this.formData, function (data) {
                    location.path('/viewoffice/' + data.resourceId);
                });
              
              
            };
        }
    });
    mifosX.ng.application.controller('CreateOfficeController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.CreateOfficeController]).run(function ($log) {
        $log.info("CreateOfficeController initialized");
    });
}(mifosX.controllers || {}));