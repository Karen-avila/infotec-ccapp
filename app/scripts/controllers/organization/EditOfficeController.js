(function (module) {
    mifosX.controllers = _.extend(module, {
        EditOfficeController: function (scope, routeParams, resourceFactory, location, dateFilter) {
            scope.formData = {};
            scope.first = {};
            scope.restrictDate = new Date();
            //direcciones
            scope.addressTypes = [];
            scope.countryOptions = [];
            scope.stateOptions = [];
            scope.addressTypeId = {};
            scope.addressType = {};
            entityname = "ADDRESS";
            scope.addStatus = "";
            scope.editable = false;
            addresstypid = routeParams.addrType;
            isActive = {};
            var addressId = routeParams.addrId;

            resourceFactory.clientaddressFields.get(function (data) {
                scope.addressTypes = data.addressTypeIdOptions;
                scope.countryOptions = data.countryIdOptions;
                scope.stateOptions = data.stateProvinceIdOptions;
            })

            resourceFactory.officeResource.getAllOffices(function (data) {
                scope.parentId = data[0].id;
            });

            resourceFactory.officeResource.get({ officeId: routeParams.id, template: 'true' }, function (data) {
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

                scope.address = {
                    addressLine1: data.address.addressLine1,
                    addressLine2: data.address.addressLine2,
                    addressLine3: data.address.addressLine3,
                    city: data.address.city,
                    isActive: data.address.isActive,
                    latitude: data.address.latitude,
                    longitude: data.address.longitude,
                    postalCode: data.address.postalCode,
                    stateProvinceId: data.address.stateProvinceId,
                    street: data.address.street
                }

                // Country
                for (let i=0; i<scope.countryOptions.length; i++) {
                    if (scope.countryOptions[i].name === data.address.countryName) {
                        scope.address.countryId = scope.countryOptions[i].id;
                        break;
                    }
                }
                for (let i=0; i<scope.stateOptions.length; i++) {
                    if (scope.stateOptions[i].name === data.address.stateName) {
                        scope.address.stateProvinceId = scope.stateOptions[i].id;
                        break;
                    }
                }
                for (let i=0; i<scope.addressTypes.length; i++) {
                    if (scope.addressTypes[i].name === data.address.addressType) {
                        scope.address.addressTypeId  = scope.addressTypes[i].id;
                        break;
                    }
                }
            
            });
            var map = new L.map('map', { zoomControl: true });
            var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            osmAttribution = 'Map data &copy; 2012 <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
            layer_osm = new L.TileLayer(osmUrl, { maxZoom: 13, attribution: osmAttribution });
            map.setView(new L.LatLng(23.634501, -102.552784), 5).addLayer(layer_osm);

            scope.elegirdireccion = (item) => {
                map.setView(new L.LatLng(item.boundingbox[0], item.boundingbox[2]), 10).addLayer(layer_osm);
                scope.address.latitude = `${item.boundingbox[0]}`
                scope.address.longitude = `${item.boundingbox[2]}`
            }

            scope.direccion_buscador = () => {
                fetch(`http://nominatim.openstreetmap.org/search?format=json&limit=5&q=${document.getElementById("direccion").value}`)
                    .then((response) => { return response.json(); })
                    .then((json) => { scope.addressresult = json });
            }

            scope.submit = function () {
                var reqDate = dateFilter(scope.first.date, scope.df);
                this.formData.locale = scope.optlang.code
                this.formData.dateFormat = scope.df
                this.formData.openingDate = reqDate;
                this.formData.name = this.formData.name.toUpperCase();
                this.formData.city = this.formData.city.padStart(3, "0");
                this.formData.branch = this.formData.branch.padStart(6, "0");
                resourceFactory.officeResource.update({ 'officeId': routeParams.id }, this.formData, data => {

                    const address = scope.address;
                    const newAddress = {

                        addressTypeId: address.addressTypeId ? address.addressTypeId : '',
                        street: address.street ? address.street : '',
                        addressLine1: address.addressLine1 ? address.addressLine1 : '',
                        addressLine2: address.addressLine2 ? address.addressLine2 : '',
                        addressLine3: address.addressLine3 ? address.addressLine3 : '',
                        city: address.city ? address.city : '',
                        countryId: address.countryId ? address.countryId : '',
                        stateProvinceId: address.stateProvinceId ? address.stateProvinceId : '',
                        postalCode: address.postalCode ? address.postalCode : '',
                        latitude: address.latitude ? address.latitude : 0,
                        longitude: address.longitude ? address.longitude : 0,
                        isActive: address.isActive ? address.isActive : false,
                        locale: scope.optlang.code
                    };

                    resourceFactory.officeAddress.put({ officeId: data.officeId }, newAddress, function (dataaddress) {
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
