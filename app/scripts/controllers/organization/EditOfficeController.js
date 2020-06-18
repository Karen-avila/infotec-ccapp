(function (module) {
    mifosX.controllers = _.extend(module, {
        EditOfficeController: function (scope, routeParams, resourceFactory, location, dateFilter) {
            scope.formData = {};
            scope.first = {};
            scope.restrictDate = new Date();
            //direcciones

            scope.addressTypes=[];
            scope.countryOptions=[];
            scope.stateOptions=[];
            scope.addressTypeId={};
            scope.addressType={};
            entityname="ADDRESS";
            scope.addStatus="";
            scope.editable=false;
            addresstypid= routeParams.addrType;
            isActive={};
            var addressId = routeParams.addrId;


            resourceFactory.clientaddressFields.get(function(data) {
              
                scope.addressTypes = data.addressTypeIdOptions;
                scope.countryOptions = data.countryIdOptions;
                scope.stateOptions = data.stateProvinceIdOptions;
             
               
            })


            resourceFactory.officeResource.getAllOffices(function (data) {
                scope.parentId = data[0].id;
            });

            resourceFactory.officeResource.get({ officeId: routeParams.id, template: 'true'}, function (data) {
                scope.offices = data.allowedParents;
                scope.id = data.id;
                if (data.openingDate) {
                    var editDate = dateFilter(data.openingDate, scope.df);
                    scope.first.date = new Date(editDate);
                }
                scope.formData = {
                    name: data.name,
                    externalId: data.externalId,
                    parentId: data.parentId,
                    city: data.city,
                    branch: data.branch,
                    costCenter: data.costCenter
                }
        
            });

            scope.submit = function () {
                
                var reqDate = dateFilter(scope.first.date, scope.df);
                this.formData.locale = scope.optlang.code
                this.formData.dateFormat = scope.df
                this.formData.openingDate = reqDate;
                this.formData.name = this.formData.name.toUpperCase();
                this.formData.city = this.formData.city.padStart(3, "0");
                this.formData.branch = this.formData.branch.padStart(6, "0");
                resourceFactory.officeResource.update({'officeId': routeParams.id}, this.formData, data => {

                    const address=scope.address;
                    const newAddress = {
                           
                        addressTypeId:address.addressTypeId ? address.addressTypeId :'',
                        street : address.street ? address.street : '',
                        addressLine1: address.addressLine1 ? address.addressLine1 : '',
                        addressLine2: address.addressLine2 ? address.addressLine2 : '',
                        addressLine3: address.addressLine3 ? address.addressLine3 : '',
                        city:address.city ? address.city : '',
                        countryId:address.countryId ? address.countryId : '',
                        stateProvinceId: address.stateProvinceId ? address.stateProvinceId : '',
                        postalCode:address.postalCode ? address.postalCode : '',
                        latitude:address.latitude ? address.latitude :'',
                        longitude:address.longitude ? address.longitude : '',
                        isActive:address.isActive ? address.isActive : false,
                        locale : scope.optlang.code
                       };
                       console.log(JSON.stringify(newAddress));
              
                        resourceFactory.officeAddress.put({ officeId: data.officeId }, newAddress,function(dataaddress){
                            location.path('/viewoffice/' + data.resourceId)
                        });

                });
            };
        }
    });
    mifosX.ng.application.controller('EditOfficeController', ['$scope', '$routeParams', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.EditOfficeController]).run(function ($log) {
        $log.info("EditOfficeController initialized");
    });
}(mifosX.controllers || {}));
