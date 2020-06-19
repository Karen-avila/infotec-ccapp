(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateOfficeController: function (scope, resourceFactory, location, dateFilter) {
            scope.offices = [];
            scope.first = {};
            scope.first.date = new Date();
            scope.restrictDate = new Date();
            scope.formData = {};
            scope.formDat = {};
            scope.address={};
           
            //address
            scope.addressTypes = [];
            scope.countryOptions = [];
            scope.stateOptions = [];
            scope.addressTypeId = {};
            entityname = "ADDRESS";
            scope.addressArray = [];
            scope.formData.address = [];

            angular.extend(
                scope, {
                mapa: {
                    lat: 37.78,
                    lng: -122.42,
                    zoom: 13
                },
            
            });

        

       
              
            resourceFactory.officeResource.getAllOffices(function (data) {
                scope.offices = data;
                scope.formData = {
                    parentId: scope.offices[0].id
                }
            

            });

                 //----------
            resourceFactory.clientTemplateResource.get(function(data) {
                scope.enableAddress = data.isAddressEnabled;
                scope.addressTypes = data.address[0].addressTypeIdOptions.sort(sortBy("name"));
                scope.countryOptions = data.address[0].countryIdOptions.sort(sortBy("name"));
                scope.stateOptions = data.address[0].stateProvinceIdOptions.sort(sortBy("name"));
                resourceFactory.addressFieldConfiguration.get({ entity: entityname }, function(data) {
                    for (var i = 0; i < data.length; i++) {
                        data[i].field = 'scope.' + data[i].field;
                        eval(data[i].field + "=" + data[i].is_enabled);
                    }
                })

            });

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
                const reqDate = dateFilter(scope.first.date, scope.df)
                this.formData.locale = scope.optlang.code
                this.formData.dateFormat = scope.df
                this.formData.openingDate = reqDate
                this.formData.name = this.formData.name ? this.formData.name.toUpperCase() : undefined
                this.formData.city = this.formData.city ? this.formData.city.padStart(3, "0") : undefined
                this.formData.branch = this.formData.branch ? this.formData.branch.padStart(6, "0") : undefined
                resourceFactory.officeResource.save(this.formData, data => {
                    const address=scope.address;
                    const newAddress = {
                           
                        addressTypeId: address.addressTypeId ? address.addressTypeId :'',
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
              
                        resourceFactory.officeAddress.save({ officeId: data.officeId }, newAddress,function(dataaddress){
                            location.path('/viewoffice/' + data.resourceId)
                        });
                          
                    });
            };

          
           function sortBy(property) {
               var sortOrder = 1;

               if(property[0] === "-") {
                   sortOrder = -1;
                   property = property.substr(1);
               }

               return function (a,b) {
                   if(sortOrder == -1){
                       return b[property].localeCompare(a[property]);
                   }else{
                       return a[property].localeCompare(b[property]);
                   }        
               }
               
           }
           
        }
    });
    mifosX.ng.application.controller('CreateOfficeController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.CreateOfficeController]).run(function ($log) {
        $log.info("CreateOfficeController initialized");
    });
}(mifosX.controllers || {}));