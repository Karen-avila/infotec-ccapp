(function (module) {
    mifosX.controllers = _.extend(module, {
        EditClientController: function (scope, routeParams, resourceFactory, location, http, dateFilter, API_VERSION, Upload, $rootScope) {
            scope.offices = [];
            scope.date = {};
            scope.restrictDate = new Date();
            scope.savingproducts = [];
            scope.clientId = routeParams.id;
            scope.showSavingOptions = 'false';
            scope.opensavingsproduct = 'false';
            scope.showNonPersonOptions = false;
            scope.clientPersonId = 1;
            resourceFactory.clientResource.get({clientId: routeParams.id, template:'true', staffInSelectedOfficeOnly:true}, function (data) {
                scope.offices = data.officeOptions;
                scope.staffs = data.staffOptions;
                scope.savingproducts = data.savingProductOptions;
                scope.genderOptions = data.genderOptions;
                scope.birthPlaceOptions = data.birthPlaceOptions;
                scope.clienttypeOptions = data.clientTypeOptions;
                scope.clientClassificationOptions = data.clientClassificationOptions;
                scope.clientNonPersonConstitutionOptions = data.clientNonPersonConstitutionOptions;
                scope.clientNonPersonMainBusinessLineOptions = data.clientNonPersonMainBusinessLineOptions;
                scope.clientLegalFormOptions = data.clientLegalFormOptions;
                scope.officeId = data.officeId;
                scope.formData = {
                    firstname: data.firstname,
                    lastname: data.lastname,
                    middlename: data.middlename,
                    active: data.active,
                    accountNo: data.accountNo,
                    staffId: data.staffId,
                    externalId: data.externalId,
                    uniqueId: data.uniqueId,
                    rfc: data.rfc,
                    surname: data.surname,
                    isStaff:data.isStaff,
                    mobileNo: data.mobileNo,
                    savingsProductId: data.savingsProductId,
                    genderId: data.gender.id,
                    birthPlaceId: data.birthplace.id,
                    fullname: data.fullname,
                    clientNonPersonDetails : {
                        incorpNumber: data.clientNonPersonDetails.incorpNumber,
                        remarks: data.clientNonPersonDetails.remarks
                    }
                };

                if(data.gender){
                    scope.formData.genderId = data.gender.id;
                }
                
                if(data.birthPlace){
                    scope.formData.birthPlaceId = data.birthPlace.id;
                }

                if(data.clientType){
                    scope.formData.clientTypeId = data.clientType.id;
                }

                if(data.clientClassification){
                    scope.formData.clientClassificationId = data.clientClassification.id;
                }

                if(data.legalForm){
                    scope.displayPersonOrNonPersonOptions(data.legalForm.id);
                    scope.formData.legalFormId = data.legalForm.id;
                }

                if(data.clientNonPersonDetails.constitution){
                    scope.formData.clientNonPersonDetails.constitutionId = data.clientNonPersonDetails.constitution.id;
                }

                if(data.clientNonPersonDetails.mainBusinessLine){
                    scope.formData.clientNonPersonDetails.mainBusinessLineId = data.clientNonPersonDetails.mainBusinessLine.id;
                }

                if (data.savingsProductId != null) {
                    scope.opensavingsproduct = 'true';
                    scope.showSavingOptions = 'true';
                } else if (data.savingProductOptions.length > 0) {
                    scope.showSavingOptions = 'true';
                }

                if (data.dateOfBirth) {
                    var dobDate = dateFilter(data.dateOfBirth, scope.df);
                    scope.date.dateOfBirth = new Date(dobDate);
                }

                if (data.clientNonPersonDetails.incorpValidityTillDate) {
                    var incorpValidityTillDate = dateFilter(data.clientNonPersonDetails.incorpValidityTillDate, scope.df);
                    scope.date.incorpValidityTillDate = new Date(incorpValidityTillDate);
                }

                var actDate = dateFilter(data.activationDate, scope.df);
                scope.date.activationDate = new Date(actDate);
                if (data.active) {
                    scope.choice = 1;
                    scope.showSavingOptions = 'false';
                    scope.opensavingsproduct = 'false';
                }

                if (data.timeline.submittedOnDate) {
                    var submittedOnDate = dateFilter(data.timeline.submittedOnDate, scope.df);
                    scope.date.submittedOnDate = new Date(submittedOnDate);
                }

            });

            scope.displayPersonOrNonPersonOptions = function (legalFormId) {
                if(legalFormId == scope.clientPersonId || legalFormId == null) {
                    scope.showNonPersonOptions = false;
                }else {
                    scope.showNonPersonOptions = true;
                }
            };
            
            scope.createCurpRfc=function (){
            	if (typeof scope.formData !== 'undefined' && scope.formData){
	            	if(scope.formData.firstname && scope.formData.lastname && scope.formData.surname && scope.date.dateOfBirth && scope.formData.genderId && scope.formData.birthPlaceId){
	            		var nombre=scope.formData.middlename?scope.formData.firstname+" "+scope.formData.middlename:scope.formData.firstname;
	            		var genero="";
	            		var lugarNacimiento="";
	            		for(var i in scope.genderOptions){
	            			if(scope.genderOptions[i].id===scope.formData.genderId){
	            				genero=scope.genderOptions[i].name;
	            				break;
	            			}
	            		}
	            		for(var i in scope.birthPlaceOptions){
	            			if(scope.birthPlaceOptions[i].id===scope.formData.birthPlaceId){
	            				lugarNacimiento=scope.birthPlaceOptions[i].name;
	            				break;
	            			}
	            		}
	            		var vcurp=generarCURP(nombre, scope.formData.lastname, scope.formData.surname, 
	            				dateFilter(scope.date.dateOfBirth, "yyyy-MM-dd"), genero, lugarNacimiento);
	            		scope.formData.uniqueId=vcurp;
	            		var vrfc=generarRFC(nombre, scope.formData.lastname, scope.formData.surname, 
	            				dateFilter(scope.date.dateOfBirth, "yyyy-MM-dd"));
	            		scope.formData.rfc=vrfc;
	            	}
            	}
            };
            
            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                if (scope.choice === 1) {
                    if (scope.date.activationDate) {
                        this.formData.activationDate = dateFilter(scope.date.activationDate, scope.df);
                    }
                }
                if(scope.date.dateOfBirth){
                    this.formData.dateOfBirth = dateFilter(scope.date.dateOfBirth,  scope.df);
                }

                if(scope.date.submittedOnDate){
                    this.formData.submittedOnDate = dateFilter(scope.date.submittedOnDate,  scope.df);
                }

                if(scope.date.incorpValidityTillDate){
                    this.formData.clientNonPersonDetails.locale = scope.optlang.code;
                    this.formData.clientNonPersonDetails.dateFormat = scope.df;
                    this.formData.clientNonPersonDetails.incorpValidityTillDate = dateFilter(scope.date.incorpValidityTillDate,  scope.df);
                }

                if(this.formData.legalFormId == scope.clientPersonId || this.formData.legalFormId == null) {
                    delete this.formData.fullname;
                }else {
                    delete this.formData.firstname;
                    delete this.formData.middlename;
                    delete this.formData.lastname;
                    delete this.formData.surname;
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

                resourceFactory.clientResource.update({'clientId': routeParams.id}, this.formData, function (data) {
                    location.path('/viewclient/' + routeParams.id);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditClientController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$http', 'dateFilter', 'API_VERSION', 'Upload', '$rootScope', mifosX.controllers.EditClientController]).run(function ($log) {
        $log.info("EditClientController initialized");
    });
}(mifosX.controllers || {}));
