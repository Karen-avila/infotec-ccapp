/**
 * Created by nikpa on 26-06-2017.
 */

(function (module) {
    mifosX.controllers = _.extend(module, {
        AddFamilyMembersController: function (scope, resourceFactory, routeParams, dateFilter, location) {
            scope.formData = {
                age: null,
                qualification: null
            };
            scope.date = {};
            scope.clientId = routeParams.clientId;
            scope.familyMemberId = routeParams.familyMemberId;
            scope.restrictDate = new Date();
            
            resourceFactory.familyMemberTemplate.get({ clientId: scope.clientId }, function (data) {
                scope.relationshipIdOptions = data.relationshipIdOptions;
                scope.genderIdOptions = data.genderIdOptions;
                scope.maritalStatusIdOptions = data.maritalStatusIdOptions;
                scope.professionIdOptions = data.professionIdOptions;
            });

            scope.routeTo = function () {
                location.path('/viewclient/' + scope.clientId);
            }

            scope.numberOnly = function(event) {
                const charCode = (event.which) ? event.which : event.keyCode;
                if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                  return false;
                }
                return true;
            }

            scope.calculateAge = function(birthday) { 
                var ageDifMs = Date.now() - birthday.getTime();
                var ageDate = new Date(ageDifMs); 
                scope.formData.age = Math.abs(ageDate.getUTCFullYear() - 1970);
            }

            scope.submit = function () {
                this.formData.firstName = this.formData.firstName ? this.formData.firstName.toUpperCase() : "";
                this.formData.middleName = this.formData.middleName ? this.formData.middleName.toUpperCase() : "";
                this.formData.lastName = this.formData.lastName ? this.formData.lastName.toUpperCase() : "";
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;

                if (scope.date.dateOfBirth) {
                    this.formData.dateOfBirth = dateFilter(scope.date.dateOfBirth, scope.df);
                }
                resourceFactory.familyMembers.save({ clientId: scope.clientId }, scope.formData, function (data) {
                    location.path('/viewclient/' + scope.clientId);
                })
            }
        }

    });
    mifosX.ng.application.controller('AddFamilyMembersController', ['$scope', 'ResourceFactory', '$routeParams', 'dateFilter', '$location', mifosX.controllers.AddFamilyMembersController]).run(function ($log) {
        $log.info("AddFamilyMemberController initialized");
    });

}
    (mifosX.controllers || {}));
