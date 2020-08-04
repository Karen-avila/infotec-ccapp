/**
 * Created by nikpa on 22-06-2017.
 */
(function (module) {
    mifosX.controllers = _.extend(module, {
        EditFamilyMemberController: function (scope, resourceFactory, routeParams, dateFilter, location) {

            scope.formData = {};
            scope.date = {};
            scope.dateofbirth = new Date();
            scope.clientId = routeParams.clientId;
            familyMemberId = routeParams.familyMemberId;

            resourceFactory.familyMemberTemplate.get({ clientId: scope.clientId }, function (data) {
                scope.relationshipIdOptions = data.relationshipIdOptions;
                scope.genderIdOptions = data.genderIdOptions;
                scope.maritalStatusIdOptions = data.maritalStatusIdOptions;
                scope.professionIdOptions = data.professionIdOptions;

            });

            resourceFactory.familyMember.get({ clientId: scope.clientId, clientFamilyMemberId: familyMemberId }, function (data) {
                scope.formData = data;

                if (data.dateOfBirth) {
                    var dobDate = dateFilter(data.dateOfBirth, scope.df);
                    scope.date.dateOfBirth = new Date(dobDate);
                    calculateAge(scope.date.dateOfBirth);
                }
            });

            scope.calculateAge = function(birthday) { 
                var ageDifMs = Date.now() - birthday.getTime();
                var ageDate = new Date(ageDifMs); 
                scope.formData.age = Math.abs(ageDate.getUTCFullYear() - 1970);
            }

            scope.routeTo = function () {
                location.path('/viewclient/' + scope.clientId);
            }

            scope.updateClientMember = function () {
                delete scope.formData.maritalStatus;
                delete scope.formData.gender;
                delete scope.formData.profession;
                delete scope.formData.relationship;

                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;

                if (scope.date.dateOfBirth) {
                    this.formData.dateOfBirth = dateFilter(scope.date.dateOfBirth, scope.df);
                }
                resourceFactory.familyMember.put({ clientId: scope.clientId, clientFamilyMemberId: familyMemberId }, scope.formData, function (data) {
                    location.path('/viewclient/' + scope.clientId);
                })
            }

        }


    });
    mifosX.ng.application.controller('EditFamilyMemberController', ['$scope', 'ResourceFactory', '$routeParams', 'dateFilter', '$location', mifosX.controllers.EditFamilyMemberController]).run(function ($log) {
        $log.info("EditFamilyMemberController initialized");
    });

}
    (mifosX.controllers || {}));
