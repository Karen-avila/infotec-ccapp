(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateOfficeController: function (scope, resourceFactory, location, dateFilter) {
            scope.offices = [];
            scope.first = {};
            scope.first.date = new Date();
            scope.restrictDate = new Date();
            scope.formData = {};
            scope.formDat = {};
            scope.address = {};

            //address
            scope.addressTypes = [];
            scope.countryOptions = [];
            scope.stateOptions = [];
            scope.addressTypeId = {};
            entityname = "ADDRESS";
            scope.addressArray = [];
            scope.formData.address = [];
            scope.addressresult = [];

            resourceFactory.officeResource.getAllOffices(function (data) {
                scope.offices = data;
                scope.formData = {
                    parentId: scope.offices[0].id
                }
            });

            //----------
            resourceFactory.clientTemplateResource.get(function (data) {
                scope.addressTypes = data.address[0].addressTypeIdOptions.sort(sortBy("name"));
                scope.countryOptions = data.address[0].countryIdOptions.sort(sortBy("name"));
                scope.stateOptions = data.address[0].stateProvinceIdOptions.sort(sortBy("name"));
                resourceFactory.addressFieldConfiguration.get({ entity: entityname }, function (data) {
                    for (var i = 0; i < data.length; i++) {
                        data[i].field = 'scope.' + data[i].field;
                        eval(data[i].field + "=" + data[i].is_enabled);
                    }
                })

            });

            scope.minDat = function () {
                for (var i = 0; i < scope.offices.length; i++) {
                    if ((scope.offices[i].id) === (scope.formData.parentId)) {
                        return scope.offices[i].openingDate;
                    }
                }
            };
            var map = new L.map('map', { zoomControl: true });
            var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            osmAttribution = 'Map data &copy; 2012 <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
            layer_osm = new L.TileLayer(osmUrl, { maxZoom: 13, attribution: osmAttribution });
            map.setView(new L.LatLng(23.634501, -102.552784), 5).addLayer(layer_osm);

            scope.elegirdireccion = (item) => {
                map.setView(new L.LatLng(item.boundingbox[0], item.boundingbox[2]), 18).addLayer(layer_osm);
                scope.address.latitude = `${item.boundingbox[0]}`
                scope.address.longitude = `${item.boundingbox[2]}`
                scope.address.postalCode = item.address.postcode ? item.address.postcode : scope.address.postalCode;
                scope.address.city = item.address.county ? item.address.county : scope.address.city;
                
                scope.addressTypes = data.address[0].addressTypeIdOptions.sort(sortBy("name"));
                console.log(item);
            }

            scope.direccion_buscador = () => {
                fetch(`https://nominatim.openstreetmap.org/search?addressdetails=1&format=json&limit=10&q=${document.getElementById("direccion").value}`)
                    .then((response) => { return response.json(); })
                    .then((json) => { scope.addressresult = json });
            }

            scope.submit = function () {
                
                const reqDate = dateFilter(scope.first.date, scope.df)
                this.formData.locale = scope.optlang.code
                this.formData.dateFormat = scope.df
                this.formData.openingDate = reqDate
                this.formData.name = this.formData.name ? this.formData.name.toUpperCase() : undefined
                this.formData.city = this.formData.city ? this.formData.city.padStart(3, "0") : undefined
                this.formData.branch = this.formData.branch ? this.formData.branch.padStart(6, "0") : undefined
                resourceFactory.officeResource.save(this.formData, data => {
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
                    console.log(JSON.stringify(newAddress));

                    debugger;

                    resourceFactory.officeAddress.save({ officeId: data.officeId }, newAddress, function (dataaddress) {
                        location.path('/viewoffice/' + data.resourceId)
                    });

                });
            };


            function sortBy(property) {
                var sortOrder = 1;

                if (property[0] === "-") {
                    sortOrder = -1;
                    property = property.substr(1);
                }

                return function (a, b) {
                    if (sortOrder == -1) {
                        return b[property].localeCompare(a[property]);
                    } else {
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