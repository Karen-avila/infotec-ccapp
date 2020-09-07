(function (module) {
    mifosX.controllers = _.extend(module, {
        EditAddressController: function ($scope, resourceFactory, routeParams, location) {

            $scope.formData = {};
            $scope.addressTypes = [];
            $scope.countryOptions = [];
            $scope.stateOptions = [];
            $scope.municipalityOptions = [];
            $scope.allMunicipalityOptions = [];
            $scope.addressTypeId = {};
            $scope.clients = {};
            $scope.addressType = {};
            entityname = "ADDRESS";
            $scope.addStatus = "";
            $scope.editable = false;
            $scope.clientId = routeParams.clientId;
            $scope.addresstypid = routeParams.addrType;
            $scope.addressId = routeParams.addressId;

            isActive = {};
          
            resourceFactory.clientaddressFields.get(function (data) {
                $scope.addressTypes = data.addressTypeIdOptions;
                $scope.countryOptions = data.countryIdOptions;
                $scope.municipalityOptions = data.municipalityIdOptions;
                $scope.allMunicipalityOptions = data.municipalityIdOptions;
                $scope.stateOptions = data.stateProvinceIdOptions;
            })

            resourceFactory.addressFieldConfiguration.get({ entity: entityname }, function (data) {
                for (var i = 0; i < data.length; i++) {
                    data[i].field = '$scope.' + data[i].field;
                    eval(data[i].field + "=" + data[i].is_enabled);
                }
            })

            $scope.routeTo = function () {
                location.path('/viewclient/' + $scope.clientId);
            }

            resourceFactory.clientAddress.get({ clientId: $scope.clientId, addressId: $scope.addressId }, function (data) {
                $scope.editable = true;
                if (data.addressId == $scope.addressId) {
                    if (data.street) {
                        $scope.formData.street = data.street;
                    }
                    if (data.addressTypeId) {
                        $scope.formData.addressTypeId = data.addressTypeId;
                    }
                    if (data.addressLine1) {
                        $scope.formData.addressLine1 = data.addressLine1;
                    }
                    if (data.addressLine2) {
                        $scope.formData.addressLine2 = data.addressLine2;
                    }
                    if (data.addressLine3) {
                        $scope.formData.addressLine3 = data.addressLine3;
                    }
                    if (data.addressLine4) {
                        $scope.formData.addressLine4 = data.addressLine4;
                    }
                    if (data.addressLine5) {
                        $scope.formData.addressLine5 = data.addressLine5;
                    }
                    if (data.addressLine6) {
                        $scope.formData.addressLine6 = data.addressLine6;
                    }
                    if (data.townVillage) {
                        $scope.formData.townVillage = data.townVillage;
                    }
                    if (data.city) {
                        $scope.formData.city = data.city;
                    }
                    if (data.countyDistrict) {
                        $scope.formData.countyDistrict = data.countyDistrict;
                    }
                    if (data.municipalityId) {
                        $scope.formData.municipalityId = data.municipalityId;
                    }
                    if (data.antiquity) {
                        $scope.formData.antiquity = data.antiquity;
                    }
                    if (data.stateProvinceId) {
                        $scope.formData.stateProvinceId = data.stateProvinceId;
                    }
                    if (data.countryId) {
                        $scope.formData.countryId = data.countryId;
                    }
                    if (data.postalCode) {
                        $scope.formData.postalCode = data.postalCode;
                    }
                    if (data.latitude) {
                        $scope.formData.latitude = data.latitude;
                    }
                    if (data.longitude) {
                        $scope.formData.longitude = data.longitude;
                    }
                    if (data.isActive) {
                        $scope.formData.isActive = data.isActive;
                    }
                }
            });

            $scope.filterMunicipality = function () {
                for (var i=0; i < $scope.stateOptions.length; i++) {
                    if ($scope.stateOptions[i].id === $scope.formData.stateProvinceId) {
                        const state = $scope.stateOptions[i].name;
                        $scope.municipalityOptions = $scope.allMunicipalityOptions.filter(function(item) {
                            return item.description == state;
                        });
                        break;
                    }
                }
            }

            $scope.updateaddress = function () {
                $scope.formData.locale = "en";
                $scope.formData.addressId = $scope.addressId;
                $scope.formData.street = $scope.formData.street.toUpperCase();
                if (typeof $scope.formData.addressLine1 != "undefined") {
                  $scope.formData.addressLine1 = $scope.formData.addressLine1.toUpperCase();
                }
                if (typeof $scope.formData.addressLine2 != "undefined") {
                  $scope.formData.addressLine2 = $scope.formData.addressLine2.toUpperCase();
                }
                if (typeof $scope.formData.addressLine3 != "undefined") {
                  $scope.formData.addressLine3 = $scope.formData.addressLine3.toUpperCase();
                }
                if (typeof $scope.formData.addressLine4 != "undefined") {
                  $scope.formData.addressLine4 = $scope.formData.addressLine4.toUpperCase();
                }
                if (typeof $scope.formData.addressLine5 != "undefined") {
                  $scope.formData.addressLine5 = $scope.formData.addressLine5.toUpperCase();
                }
                if (typeof $scope.formData.addressLine6 != "undefined") {
                  $scope.formData.addressLine6 = $scope.formData.addressLine6.toUpperCase();
                }
                
                resourceFactory.clientAddresses.put({ 'clientId': $scope.clientId }, $scope.formData, function (data) {
                    location.path('/viewclient/' + $scope.clientId);
                });
            }
        }

    });
    mifosX.ng.application.controller('EditAddressController', ['$scope', 'ResourceFactory', '$routeParams', '$location', mifosX.controllers.EditAddressController]).run(function ($log) {
        $log.info("EditAddressController initialized");
    });

}
    (mifosX.controllers || {}));