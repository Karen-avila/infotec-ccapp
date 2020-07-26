(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewCodeController: function (scope, routeParams, resourceFactory, location, $uibModal, route) {
            scope.codevalues = [];
            scope.formData = [];
            scope.newcode = {};
            scope.codename = {};

            scope.query = {
                order: "name",
                limit: 25,
                page: 1
            };
        
            scope.options = {
                boundaryLinks: true,
                rowSelection: true,
                pageSelector: true
            };

            resourceFactory.codeResources.get({codeId: routeParams.id}, function (data) {
                scope.code = data;
                scope.codename.name = data.name;
                scope.codename.description = data.description;
            });
            
            resourceFactory.codeValueResource.getAllCodeValues({codeId: routeParams.id}, function (data) {
                scope.codevalues = data;
            });

            scope.delCode = function () {
                $uibModal.open({
                    templateUrl: 'deletecode.html',
                    controller: CodeDeleteCtrl
                });
            };
            scope.showEdit = function (id, name, description, position, cv, isActive, score) {
                scope.formData[id] = {
                    name: name,
                    description:description,
                    position: position,
                    isActive: isActive,
                    score: score
                }
                cv.edit = !cv.edit;
            };
            scope.editCodeValue = function (id, cv) {
                resourceFactory.codeValueResource.update({codeId: routeParams.id, codevalueId: id}, this.formData[id], function (data) {
                    cv.edit = !cv.edit;
                    route.reload();
                });
            };
            scope.showEditCode = function () {
                scope.newcode.edit = !scope.newcode.edit;
                scope.codename.name = scope.code.name;
            };
            scope.updateCode = function () {
                resourceFactory.codeResources.update({codeId: routeParams.id}, this.codename, function (data) {
                    route.reload();
                });
            }
            var CodeDeleteCtrl = function ($scope, $uibModalInstance) {
                $scope.delete = function () {
                    resourceFactory.codeResources.delete({codeId: routeParams.id}, {}, function (data) {
                        $uibModalInstance.close('delete');
                        location.path('/codes');
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };
            var EditCodeValueCtrl = function ($scope, $uibModalInstance, cid) {
                $scope.edit = function () {

                    $uibModalInstance.close('delete');
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };
            scope.deleteCodeValue = function (id) {
                $uibModal.open({
                    templateUrl: 'deletecodevalue.html',
                    controller: CodeValueDeleteCtrl,
                    resolve: {
                        cvid: function () {
                            return id;
                        }
                    }
                });
            };
            var CodeValueDeleteCtrl = function ($scope, $uibModalInstance, cvid) {
                $scope.delete = function () {
                    resourceFactory.codeValueResource.delete({codeId: routeParams.id, codevalueId: cvid}, {}, function (data) {
                        $uibModalInstance.close('delete');
                        route.reload();
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

            scope.filters = [];
            scope.$watch("filter.search", function (newValue, oldValue) {
              if (newValue != undefined) {
                scope.filters = newValue.split(" ");
              }
            });
      
            scope.searachData = {};
      
            scope.customSearch = function (item) {
              scope.searachData.status = true;
      
              angular.forEach(scope.filters, function (value1, key) {
                scope.searachData.tempStatus = false;
                angular.forEach(item, function (value2, key) {
                  var dataType = typeof value2;
      
                  if (dataType == "string" && !value2.includes("object")) {
                    if (value2.toLowerCase().includes(value1)) {
                      scope.searachData.tempStatus = true;
                    }
                  }
                });
                scope.searachData.status =
                  scope.searachData.status & scope.searachData.tempStatus;
              });
      
              return scope.searachData.status;
            };  
        }
    });
    mifosX.ng.application.controller('ViewCodeController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$uibModal', '$route', mifosX.controllers.ViewCodeController]).run(function ($log) {
        $log.info("ViewCodeController initialized");
    });
}(mifosX.controllers || {}));
