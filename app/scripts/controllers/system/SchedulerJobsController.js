(function (module) {
    mifosX.controllers = _.extend(module, {
        SchedulerJobsController: function (scope, resourceFactory, route, location, $mdDialog) {
            var jobIdArray = [];
            scope.activeall = false;
            scope.selected = [];

            scope.query = {
                order: "displayName",
                limit: 25,
                page: 1,
            };
        
            scope.options = {
                boundaryLinks: true,
                rowSelection: true,
            };

            resourceFactory.jobsResource.get(function (data) {
                scope.jobs = data;
            });

            resourceFactory.schedulerResource.get(function (data) {
                scope.schedulerstatus = data.active === true ? 'Active' : 'Standby';
            });

            scope.errorLog = function (id){
                scope.id = id;
                $uibModal.open({
                    templateUrl: 'errorlog.html',
                    controller: ErrorLogCtrl,
                    resolve: {
                        ids: function () {
                            return id;
                        }
                    }
                });
                $mdDialog.show({
                    controller: ErrorLogCtrl,
                    templateUrl: 'errorlog.html',

                    controller: DialogCalcsController,
                    templateUrl: 'views/system/viewJobErrorLog.tmpl.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true,
                    fullscreen: true, // Only for -xs, -sm breakpoints.
                    locals: {
                        data: {
                            jobId: id
                        }
                    },
                });  
            };

            var ErrorLogCtrl = function ($scope, $mdDialog, data) {
                for (var i in scope.jobs) {
                    if (scope.jobs[i].jobId === ids) {
                        var index = i;
                    }
                }

                $scope.error = scope.jobs[index].lastRunHistory.jobRunErrorLog;
                scope.closeDialog = function() {
                    $mdDialog.hide();
                }
            };

            scope.routeTo = function (id) {
                location.path('/viewschedulerjob/'+id);
            };

            scope.runSelectedJobs = function () {
                scope.sentForExecution = [];
                scope.selected.forEach(function (job) {
                    scope.sentForExecution.push(job.displayName);
                });

                scope.selected.forEach(function (job) {
                    resourceFactory.jobsResource.save({jobId: job.jobId, command : 'executeJob'}, {}, function(data){
                    });
                });
            }

            scope.suspendJobs = function () {
                resourceFactory.schedulerResource.save({command : 'stop'}, {}, function(data) {
                    route.reload();
                });
            };

            scope.activeJobs = function () {
                resourceFactory.schedulerResource.save({command : 'start'}, {}, function(data) {
                    route.reload();
                });
            };

            scope.refresh = function () {
                route.reload();
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
    mifosX.ng.application.controller('SchedulerJobsController', ['$scope', 'ResourceFactory', '$route','$location', '$mdDialog', mifosX.controllers.SchedulerJobsController]).run(function($log) {
      $log.info("SchedulerJobsController initialized");
    });
}(mifosX.controllers || {}));
