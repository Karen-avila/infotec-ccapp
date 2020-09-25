(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateClientController: function (scope, resourceFactory, location, http, dateFilter, API_VERSION, Upload, $rootScope, routeParams, $uibModal) {
            scope.offices = [];
            scope.staffs = [];
            scope.savingproducts = [];
            scope.first = {};
            scope.initDate = new Date();
            scope.first = {
                date: scope.initDate,
                dateOfBirth: scope.initDate,
                submittedon: scope.initDate
            }
            scope.formData = {};
            scope.formDat = {};
            scope.clientNonPersonDetails = {};
            scope.restrictDate = new Date();
            scope.showSavingOptions = false;
            scope.savings = {};
            scope.savings.opensavingsproduct = false;
            scope.forceOffice = null;
            scope.showNonPersonOptions = false;
            scope.clientPersonId = 1;
            //address
            scope.addressTypes = [];
            scope.countryOptions = [];
            scope.stateOptions = [];
            scope.allMunicipalityOptions = [];
            scope.municipalityOptions = [];
            scope.addressTypeId = {};
            entityname = "ADDRESS";
            scope.addressArray = [];
            scope.formData.address = [];
            scope.address = {};

            //familymembers
            scope.formData.familyMembers = [];
            scope.familyArray = [];
            scope.datatables = [];
            scope.noOfTabs = 1;
            scope.step = '-';
            scope.formData.datatables = [];
            scope.formDat.datatables = [];
            scope.tf = "HH:mm";
            scope.clientId = routeParams.clientId;
            scope.center = {};


            angular.extend(scope, {
                center: {
                    lat: 23.634501,
                    lng: -102.552784,
                    zoom: 4
                }
            });
            scope.elegirdireccion = (item) => {
                angular.extend(scope, {
                    center: {
                        lat: parseFloat(item.boundingbox[0]),
                        lng: parseFloat(item.boundingbox[2]),
                        zoom: 12
                    }
                });
                
                scope.addressArray = [
                    {
                        "latitude": `${item.boundingbox[0]}`,
                        "longitude": `${item.boundingbox[2]}`,
                        "postalCode": item.address.postcode ? item.address.postcode : scope.address.postalCode,
                        "city": item.address.county ? item.address.county : scope.address.city
                    }
                ]
            }
            scope.direccion_buscador = () => {
                fetch(`https://nominatim.openstreetmap.org/search?addressdetails=1&format=json&limit=10&q=${document.getElementById("direccion").value}`)
                    .then((response) => { return response.json(); })
                    .then((json) => { scope.addressresult = json });

            }

            var requestParams = { staffInSelectedOfficeOnly: true };
            if (routeParams.groupId) {
                requestParams.groupId = routeParams.groupId;
            }
            if (routeParams.officeId) {
                requestParams.officeId = routeParams.officeId;
            }
            resourceFactory.clientTemplateResource.get(requestParams, function (data) {
                scope.offices = data.officeOptions;
                scope.staffs = data.staffOptions;
                scope.formData.officeId = scope.offices[0].id;
                scope.savingproducts = data.savingProductOptions;
                scope.genderOptions = data.genderOptions.sort(sortBy("name"));
                scope.birthPlaceOptions = data.birthPlaceOptions.sort(sortBy("name"));
                scope.clienttypeOptions = data.clientTypeOptions.sort(sortBy("name"));
                scope.clientClassificationOptions = data.clientClassificationOptions.sort(sortBy("name"));
                scope.clientNonPersonConstitutionOptions = data.clientNonPersonConstitutionOptions;
                scope.clientNonPersonMainBusinessLineOptions = data.clientNonPersonMainBusinessLineOptions;
                scope.clientLegalFormOptions = data.clientLegalFormOptions;
                scope.datatables = data.datatables;
                if (!_.isUndefined(scope.datatables) && scope.datatables.length > 0) {
                    scope.noOfTabs = scope.datatables.length + 1;
                    angular.forEach(scope.datatables, function (datatable, index) {
                        if (!_.isUndefined(datatable) && datatable != null) {
                            scope.updateColumnHeaders(datatable.columnHeaderData);
                            angular.forEach(datatable.columnHeaderData, function (colHeader, i) {
                                if (_.isEmpty(scope.formDat.datatables[index])) {
                                    scope.formDat.datatables[index] = { data: {} };
                                }

                                if (_.isEmpty(scope.formData.datatables[index])) {
                                    scope.formData.datatables[index] = {
                                        registeredTableName: datatable.registeredTableName,
                                        data: { locale: scope.optlang.code }
                                    };
                                }

                                if (datatable.columnHeaderData[i].columnDisplayType == 'DATETIME') {
                                    scope.formDat.datatables[index].data[datatable.columnHeaderData[i].columnName] = {};
                                }
                            });
                        }
                    });
                }

                if (data.savingProductOptions.length > 0) {
                    scope.showSavingOptions = true;
                }

                if (routeParams.officeId) {
                    scope.formData.officeId = routeParams.officeId;
                    for (let i in data.officeOptions) {
                        if (data.officeOptions[i].id == routeParams.officeId) {
                            scope.forceOffice = data.officeOptions[i];
                            break;
                        }
                    }
                }

                if (routeParams.groupId) {
                    if (typeof data.staffId !== "undefined") {
                        scope.formData.staffId = data.staffId;
                    }
                }

                scope.enableAddress = data.isAddressEnabled;

                if (scope.enableAddress === true) {
                    scope.addressTypes = data.address[0].addressTypeIdOptions.sort(sortBy("name"));
                    scope.countryOptions = data.address[0].countryIdOptions.sort(sortBy("name"));
                    scope.stateOptions = data.address[0].stateProvinceIdOptions.sort(sortBy("name"));
                    scope.municipalityOptions = data.address[0].municipalityIdOptions.sort(sortBy("name"));
                    scope.allMunicipalityOptions = data.address[0].municipalityIdOptions;
                    resourceFactory.addressFieldConfiguration.get({ entity: entityname }, function (data) {
                        for (let i = 0; i < data.length; i++) {
                            data[i].field = 'scope.' + data[i].field;
                            eval(data[i].field + "=" + data[i].is_enabled);
                        }
                    })
                }

                scope.relationshipIdOptions = data.familyMemberOptions.relationshipIdOptions;
                scope.genderIdOptions = data.familyMemberOptions.genderIdOptions;
                scope.maritalStatusIdOptions = data.familyMemberOptions.maritalStatusIdOptions;
                scope.professionIdOptions = data.familyMemberOptions.professionIdOptions;

            });

            scope.filterMunicipality = function (stateProvinceId) {
                for (let i = 0; i < scope.stateOptions.length; i++) {
                    if (scope.stateOptions[i].id === stateProvinceId) {
                        const state = scope.stateOptions[i].name;
                        scope.municipalityOptions = scope.allMunicipalityOptions.filter(function (item) {
                            return item.description == state;
                        });
                        break;
                    }
                }
            }

            scope.updateColumnHeaders = function (columnHeaderData) {
                var colName = columnHeaderData[0].columnName;
                if (colName == 'id') {
                    columnHeaderData.splice(0, 1);
                }

                colName = columnHeaderData[0].columnName;
                if (colName == 'client_id' || colName == 'office_id' || colName == 'group_id' || colName == 'center_id' || colName == 'loan_id' || colName == 'savings_account_id') {
                    columnHeaderData.splice(0, 1);
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

            // family members
            scope.addFamilyMember = function () {
                scope.familyArray.push({});
            }

            scope.removeFamilyMember = function (index) {
                scope.familyArray.splice(index, 1);
            }
            // end of family members
            scope.displayPersonOrNonPersonOptions = function (legalFormId) {
                if (legalFormId == scope.clientPersonId || legalFormId == null) {
                    scope.showNonPersonOptions = false;
                } else {
                    scope.showNonPersonOptions = true;
                }
            };

            scope.changeOffice = function (officeId) {
                resourceFactory.clientTemplateResource.get({
                    staffInSelectedOfficeOnly: true, officeId: officeId
                }, function (data) {
                    scope.staffs = data.staffOptions;
                    scope.savingproducts = data.savingProductOptions;
                });
            };

            scope.setChoice = function () {
                if (this.formData.active) {
                    scope.choice = 1;
                }
                else if (!this.formData.active) {
                    scope.choice = 0;
                }
            };
            if (routeParams.groupId) {
                scope.cancel = '#!/viewgroup/' + routeParams.groupId
                scope.groupid = routeParams.groupId;
            } else {
                scope.cancel = "#!/clients"
            }

            scope.fieldType = function (type) {
                var fieldType = "";
                if (type) {
                    if (type == 'CODELOOKUP' || type == 'CODEVALUE') {
                        fieldType = 'SELECT';
                    } else if (type == 'DATE') {
                        fieldType = 'DATE';
                    } else if (type == 'DATETIME') {
                        fieldType = 'DATETIME';
                    } else if (type == 'BOOLEAN') {
                        fieldType = 'BOOLEAN';
                    } else {
                        fieldType = 'TEXT';
                    }
                }
                return fieldType;
            };

            scope.dateTimeFormat = function (colHeaders) {
                angular.forEach(colHeaders, function (colHeader, i) {
                    if (colHeaders[i].columnDisplayType == 'DATETIME') {
                        return scope.df + " " + scope.tf;
                    }
                });
                return scope.df;
            };

            scope.createCurpRfc = function () {
                if (scope.formData.firstname && scope.formData.lastname && scope.formData.surname && scope.first.dateOfBirth && scope.formData.genderId && scope.formData.birthPlaceId) {
                    var nombre = scope.formData.middlename ? scope.formData.firstname + " " + scope.formData.middlename : scope.formData.firstname;
                    var genero = "";
                    var lugarNacimiento = "";
                    for (let i in scope.genderIdOptions) {
                        if (scope.genderIdOptions[i].id === scope.formData.genderId) {
                            genero = scope.genderIdOptions[i].name;
                            break;
                        }
                    }
                    for (let i in scope.birthPlaceOptions) {
                        if (scope.birthPlaceOptions[i].id === scope.formData.birthPlaceId) {
                            lugarNacimiento = scope.birthPlaceOptions[i].name;
                            break;
                        }
                    }
                    var vcurp = generarCURP(nombre, scope.formData.lastname, scope.formData.surname,
                        dateFilter(scope.first.dateOfBirth, "yyyy-MM-dd"), genero, lugarNacimiento);
                    scope.formData.uniqueId = vcurp;
                    var vrfc = generarRFC(nombre, scope.formData.lastname, scope.formData.surname,
                        dateFilter(scope.first.dateOfBirth, "yyyy-MM-dd"));
                    scope.formData.rfc = vrfc;
                }
            };

            scope.$watch('formData.firstname', function (value) {
                scope.createCurpRfc();
            });

            scope.$watch('formData.lastname', function (value) {
                scope.createCurpRfc();
            });

            scope.$watch('formData.surname', function (value) {
                scope.createCurpRfc();
            });

            scope.$watch('formData.genderId', function (value) {
                scope.createCurpRfc();
            });

            scope.$watch('formData.birthPlaceId', function (value) {
                scope.createCurpRfc();
            });

            scope.$watch('first.dateOfBirth', function (value) {
                scope.createCurpRfc();
            });




            scope.submit = function () {
                var reqDate = dateFilter(scope.first.date, scope.df);

                this.formData.locale = scope.optlang.code;
                this.formData.active = this.formData.active || false;
                this.formData.dateFormat = scope.df;
                this.formData.activationDate = reqDate;

                if (!_.isUndefined(scope.datatables) && scope.datatables.length > 0) {
                    angular.forEach(scope.datatables, function (datatable, index) {
                        scope.columnHeaders = datatable.columnHeaderData;
                        angular.forEach(scope.columnHeaders, function (colHeader, i) {
                            scope.dateFormat = scope.df + " " + scope.tf
                            if (scope.columnHeaders[i].columnDisplayType == 'DATE') {
                                if (!_.isUndefined(scope.formDat.datatables[index].data[scope.columnHeaders[i].columnName])) {
                                    scope.formData.datatables[index].data[scope.columnHeaders[i].columnName] = dateFilter(scope.formDat.datatables[index].data[scope.columnHeaders[i].columnName],
                                        scope.dateFormat);
                                    scope.formData.datatables[index].data.dateFormat = scope.dateFormat;
                                }
                            } else if (scope.columnHeaders[i].columnDisplayType == 'DATETIME') {
                                if (!_.isUndefined(scope.formDat.datatables[index].data[scope.columnHeaders[i].columnName].date) && !_.isUndefined(scope.formDat.datatables[index].data[scope.columnHeaders[i].columnName].time)) {
                                    scope.formData.datatables[index].data[scope.columnHeaders[i].columnName] = dateFilter(scope.formDat.datatables[index].data[scope.columnHeaders[i].columnName].date, scope.df)
                                        + " " + dateFilter(scope.formDat.datatables[index].data[scope.columnHeaders[i].columnName].time, scope.tf);
                                    scope.formData.datatables[index].data.dateFormat = scope.dateFormat;
                                }
                            }
                        });
                    });
                } else {
                    delete scope.formData.datatables;
                }

                if (routeParams.groupId) {
                    this.formData.groupId = routeParams.groupId;
                }

                if (routeParams.officeId) {
                    this.formData.officeId = routeParams.officeId;
                }

                if (scope.first.submitondate) {
                    reqDate = dateFilter(scope.first.submitondate, scope.df);
                    this.formData.submittedOnDate = reqDate;
                }

                if (scope.first.dateOfBirth) {
                    this.formData.dateOfBirth = dateFilter(scope.first.dateOfBirth, scope.df);
                }

                if (this.formData.legalFormId == scope.clientPersonId || this.formData.legalFormId == null) {
                    delete this.formData.fullname;
                } else {
                    delete this.formData.firstname;
                    delete this.formData.middlename;
                    delete this.formData.lastname;
                    delete this.formData.surname;
                }

                if (scope.first.incorpValidityTillDate) {
                    this.formData.clientNonPersonDetails.locale = scope.optlang.code;
                    this.formData.clientNonPersonDetails.dateFormat = scope.df;
                    this.formData.clientNonPersonDetails.incorpValidityTillDate = dateFilter(scope.first.incorpValidityTillDate, scope.df);
                }

                if (!scope.savings.opensavingsproduct) {
                    this.formData.savingsProductId = null;
                }

                if (scope.enableAddress === true) {
                    scope.formData.address = [];
                    for (let i = 0; i < scope.addressArray.length; i++) {
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
                        if (scope.addressArray[i].addressLine4) {
                            temp.addressLine4 = scope.addressArray[i].addressLine4;
                        }
                        if (scope.addressArray[i].addressLine5) {
                            temp.addressLine5 = scope.addressArray[i].addressLine5;
                        }
                        if (scope.addressArray[i].addressLine6) {
                            temp.addressLine6 = scope.addressArray[i].addressLine6;
                        }
                        if (scope.addressArray[i].townVillage) {
                            temp.townVlage = scope.addressArray[i].townVillage;
                        }
                        if (scope.addressArray[i].city) {
                            temp.city = scope.addressArray[i].city;
                        }
                        if (scope.addressArray[i].countyDistrict) {
                            temp.countyDistrict = scope.addressArray[i].countyDistrict;
                        }
                        if (scope.addressArray[i].countryId) {
                            temp.countryId = scope.addressArray[i].countryId;
                        }
                        if (scope.addressArray[i].municipalityId) {
                            temp.municipalityId = scope.addressArray[i].municipalityId;
                        }
                        if (scope.addressArray[i].antiquity) {
                            temp.antiquity = scope.addressArray[i].antiquity;
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
                        scope.formData.address.push(temp);
                    }
                }

                // family array
                for (let i = 0; i < scope.familyArray.length; i++) {
                    var temp = new Object();
                    if (scope.familyArray[i].relationshipId) {
                        temp.relationshipId = scope.familyArray[i].relationshipId;
                    }
                    if (scope.familyArray[i].firstName) {
                        temp.firstName = scope.familyArray[i].firstName;
                    }
                    if (scope.familyArray[i].middleName) {
                        temp.middleName = scope.familyArray[i].middleName;
                    }
                    if (scope.familyArray[i].lastName) {
                        temp.lastName = scope.familyArray[i].lastName;
                    }
                    if (scope.familyArray[i].qualification) {
                        temp.qualification = scope.familyArray[i].qualification;
                    }
                    if (scope.familyArray[i].mobileNumber) {
                        temp.mobileNumber = scope.familyArray[i].mobileNumber;
                    }
                    if (scope.familyArray[i].age) {
                        temp.age = scope.familyArray[i].age;
                    }
                    if (scope.familyArray[i].isDependent) {
                        temp.isDependent = scope.familyArray[i].isDependent;
                    }
                    if (scope.familyArray[i].genderId) {
                        temp.genderId = scope.familyArray[i].genderId;
                    }
                    if (scope.familyArray[i].professionId) {
                        temp.professionId = scope.familyArray[i].professionId;
                    }
                    if (scope.familyArray[i].maritalStatusId) {
                        temp.maritalStatusId = scope.familyArray[i].maritalStatusId;
                    }
                    if (scope.familyArray[i].dateOfBirth) {
                        temp.dateOfBirth = dateFilter(scope.familyArray[i].dateOfBirth, scope.df);
                    }

                    temp.locale = scope.optlang.code;
                    temp.dateFormat = scope.df;
                    scope.formData.familyMembers.push(temp);
                }

                if (this.formData.firstname) {
                    this.formData.firstname = this.formData.firstname.toUpperCase();
                }
                if (this.formData.middlename) {
                    this.formData.middlename = this.formData.middlename.toUpperCase();
                }
                if (this.formData.lastname) {
                    this.formData.lastname = this.formData.lastname.toUpperCase();
                }
                if (this.formData.surname) {
                    this.formData.surname = this.formData.surname.toUpperCase();
                }
                if (this.formData.fullname) {
                    this.formData.fullname = this.formData.fullname.toUpperCase();
                }
                if (this.formData.externalId) {
                    this.formData.externalId = this.formData.externalId.toUpperCase();
                }
                if (this.formData.uniqueId) {
                    this.formData.uniqueId = this.formData.uniqueId.toUpperCase();
                }
                this.formData.groupLoanCounter = 0;
                scope.clientData = this.formData;
                // Validate 
                if (this.formData.legalFormId == scope.clientPersonId || this.formData.legalFormId == null) {
                    scope.validateDuplicates(this.formData.uniqueId);
                } else {
                    resourceFactory.clientResource.save(scope.clientData, function (data) {
                        location.path('/viewclient/' + data.clientId);
                    });
                }
            }

            var ClientDuplicateCtrl = function ($scope, $uibModalInstance) {
                $scope.duplicateData = scope.duplicateData;

                $scope.done = function () {
                    $uibModalInstance.close('cancel');
                };
            }

            // Duplicates validation
            scope.validateDuplicates = function (uniqueId) {
                var duplicateData = {};
                duplicateData.uniqueId = uniqueId.toUpperCase();
                resourceFactory.clientDuplicatesResource.duplicates(duplicateData, function (data) {
                    if (data.clientId) {
                        scope.duplicateData = data.changes;
                        $uibModal.open({
                            templateUrl: 'duplicated.html',
                            controller: ClientDuplicateCtrl
                        });
                    } else {
                        resourceFactory.clientResource.save(scope.clientData, function (data) {
                            location.path('/viewclient/' + data.clientId);
                        });
                    }
                });
            }

            /**
             * Function to sort alphabetically an array of objects by some specific key.
             * 
             * @param {String} property Key of the object to sort.
             */
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
    mifosX.ng.application.controller('CreateClientController', ['$scope', 'ResourceFactory', '$location', '$http', 'dateFilter', 'API_VERSION', 'Upload', '$rootScope', '$routeParams', '$uibModal', mifosX.controllers.CreateClientController]).run(function ($log) {
        $log.info("CreateClientController initialized");
    });
}(mifosX.controllers || {}));
