(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewClientController: function (scope, $mdDialog, routeParams, route, location, resourceFactory, http, $uibModal, API_VERSION, $rootScope, $sce, Upload) {
            scope.client = [];
            scope.identitydocuments = [];
            scope.buttons = [];
            scope.clientdocuments = [];
            scope.datatabledetails = [];
            scope.scoringDetails = [];
            scope.scoringInternalPoints = 0;
            scope.scoringExternalPoints = 0;
            scope.scoringInternalSubTotal = 0;
            scope.scoringInternalTotal = 0;
            scope.scoringExternalTotal = 0;
            scope.scoringTotalTotal = 0;
            scope.staffData = {};
            scope.formData = {};
            scope.openLoan = true;
            scope.openSaving = true;
            scope.openShares = true;
            scope.updateDefaultSavings = false;
            scope.charges = [];
            scope.datatableLoaded = false;
            scope.clientId = routeParams.id;
            scope.selectedIndex = 1;
            scope.fileData = null;
           
            // address
            scope.addresses = [];
            scope.view = {};
            scope.view.data = [];
            // scope.families=[];
            var entityname = "ADDRESS";
            formdata = {};

            
            scope.showMap = function (ev) {
                $mdDialog.show({
                    controller: ViewMapController,
                    templateUrl: 'views/clients/viewmap.tmpl.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: true,

                });
            };

            var ViewMapController = function (scope, $mdDialog) {
                scope.center = {};
                scope.closeDialog = function () {
                    $mdDialog.hide();
                }
                resourceFactory.clientAddresses.get({ clientId: scope.clientId }, function (data) {
                    scope.addresses = data;
                    for (i = 0; i < data.length; i++) {
                        var mainMarker = {
                            lat: parseFloat(data[i].latitude),
                            lng: parseFloat(data[i].longitude),
                            focus: true,
                            message: "Ubicación",
                            draggable: true
                        };

                        angular.extend(scope, {
                            center: {
                                lat: parseFloat(data[i].latitude),
                                lng: parseFloat(data[i].longitude),
                                zoom: 16
                            },
                            markers: {
                                mainMarker: angular.copy(mainMarker)
                            },
                            position: {
                                lat: parseFloat(data[i].latitude),
                                lng: parseFloat(data[i].longitude),
                            },
                            events: { // or just {} //all events
                                markers: {
                                    enable: ['dragend']
                                    //logic: 'emit'
                                }
                            }
                        });
                    }
                })

               
            };

            resourceFactory.addressFieldConfiguration.get({ entity: entityname }, function (data) {
                for (var i = 0; i < data.length; i++) {
                    data[i].field = 'scope.view.' + data[i].field;
                    eval(data[i].field + "=" + data[i].is_enabled);
                }
            });

            scope.getAddresses = function () {
                resourceFactory.clientAddresses.getAll({ clientId: scope.clientId }, function (data) {
                    scope.addresses = data;
                })
            }

            scope.routeTo = function () {
                location.path('/address/' + scope.clientId); // + '?clientId=' + routeParams.id + '&clientName=' + scope.client.displayName);
            }

            scope.ChangeAddressStatus = function (id, status, addressId) {
                formdata.isActive = !status
                formdata.addressId = addressId
                resourceFactory.clientAddresses.put({ clientId: id }, formdata, function (data) {
                    route.reload();
                })
            }

            scope.routeToEdit = function (addressType, addressId) {
                location.path('/editAddress/' + scope.clientId + '/' + addressType + '/' + addressId); // + '?clientId=' + routeParams.id + '&clientName=' + scope.client.displayName);
            }
            // end of address

            scope.isLegalEntity = function () {
                if (typeof scope.client == "undefined" || typeof scope.client.legalForm == "undefined") {
                    return true;
                }
                return (scope.client.legalForm.value == 'MORAL');
            }

            // family members
            scope.families = [];

            scope.getFamilyMembers = function () {
                resourceFactory.familyMembers.get({ clientId: scope.clientId }, function (data) {
                    scope.families = data;
                });
            }

            scope.deleteFamilyMember = function (clientFamilyMemberId) {
                resourceFactory.familyMember.delete({ clientId: scope.clientId, clientFamilyMemberId: clientFamilyMemberId }, function (data) {
                    route.reload();
                })
            }

            scope.editFamilyMember = function (clientFamilyMemberId) {
                location.path('/editfamilymember/' + scope.clientId + '/' + clientFamilyMemberId);
            }

            scope.routeToaddFamilyMember = function () {
                location.path('/addfamilymembers/' + scope.clientId);
            }

            scope.routeToLoan = function (id) {
                location.path('/viewloanaccount/' + id);
            };
            scope.routeToChargeOverview = function () {
                location.path(scope.pathToChargeOverview());
            };

            scope.pathToChargeOverview = function () {
                return ('/viewclient/' + scope.client.id + '/chargeoverview');
            }

            scope.routeToCharge = function (chargeId) {
                location.path('/viewclient/' + scope.client.id + '/charges/' + chargeId);
            };

            scope.routeToSaving = function (id, depositTypeCode) {
                if (depositTypeCode === "depositAccountType.savingsDeposit") {
                    location.path('/viewsavingaccount/' + id);
                } else if (depositTypeCode === "depositAccountType.fixedDeposit") {
                    location.path('/viewfixeddepositaccount/' + id);
                } else if (depositTypeCode === "depositAccountType.recurringDeposit") {
                    location.path('/viewrecurringdepositaccount/' + id);
                }
            };

            scope.routeToShareAccount = function (id) {
                location.path('/viewshareaccount/' + id)
            };

            scope.getDatatableColumn = function (tableName, columnName) {
                var temp = columnName.split("_cd_");
                if (temp[1] && temp[1] != "") {
                    columnName = temp[1];
                }
                return tableName + '.' + columnName;
            }

            scope.getDatatableValue = function (data) {
                if (data === null) {
                    return '';
                }
                if (typeof data != "undefined") {
                    if (typeof data.value != "undefined") {
                        if (typeof data.score != "undefined") {
                            return data.value + ' (' + data.score + ')';
                        } else {
                            return data.value;
                        }
                    }
                } else {
                    return '';
                }
            }

            scope.haveFile = [];
            resourceFactory.clientResource.get({ clientId: scope.clientId }, function (data) {
                scope.client = data;
                scope.isClosedClient = scope.client.status.value == 'Closed';
                scope.staffData.staffId = data.staffId;
                if (data.imagePresent) {
                    http({
                        method: 'GET',
                        url: $rootScope.hostUrl + API_VERSION + '/clients/' + scope.clientId + '/images?maxHeight=150'
                    }).then(function (imageData) {
                        scope.image = imageData.data;
                    });
                }
                http({
                    method: 'GET',
                    url: $rootScope.hostUrl + API_VERSION + '/clients/' + scope.clientId + '/documents'
                }).then(function (docsData) {
                    var docId = -1;
                    for (var i = 0; i < docsData.data.length; ++i) {
                        if (docsData.data[i].name == 'clientSignature') {
                            docId = docsData.data[i].id;
                            scope.signature_url = $rootScope.hostUrl + API_VERSION + '/clients/' + scope.clientId + '/documents/' + docId + '/attachment?tenantIdentifier=' + $rootScope.tenantIdentifier;
                        }
                    }
                });

                scope.navigateToSavingsOrDepositAccount = function (eventName, accountId, savingProductType) {
                    switch (eventName) {

                        case "deposit":
                            if (savingProductType == 100)
                                location.path('/savingaccount/' + accountId + '/deposit');
                            if (savingProductType == 300)
                                location.path('/recurringdepositaccount/' + accountId + '/deposit');
                            break;
                        case "withdraw":
                            if (savingProductType == 100)
                                location.path('/savingaccount/' + accountId + '/withdrawal');
                            if (savingProductType == 300)
                                location.path('/recurringdepositaccount/' + accountId + '/withdrawal');
                            break;
                    }
                }

                var clientStatus = new mifosX.models.ClientStatus();
                if (clientStatus.statusKnown(data.status.value)) {
                    scope.buttons = clientStatus.getStatus(data.status.value);
                    scope.savingsActionbuttons = [
                        {
                            name: "button.deposit",
                            type: "100",
                            icon: "fa fa-arrow-up",
                            taskPermissionName: "DEPOSIT_SAVINGSACCOUNT",
                            check:"BlockCredit"
                        },
                        {
                            name: "button.withdraw",
                            type: "100",
                            icon: "fa fa-arrow-down",
                            taskPermissionName: "WITHDRAW_SAVINGSACCOUNT",
                            check:"BlockDebit"
                        },
                        {
                            name: "button.deposit",
                            type: "300",
                            icon: "fa fa-arrow-up",
                            taskPermissionName: "DEPOSIT_RECURRINGDEPOSITACCOUNT"
                        },
                        {
                            name: "button.withdraw",
                            type: "300",
                            icon: "fa fa-arrow-down",
                            taskPermissionName: "WITHDRAW_RECURRINGDEPOSITACCOUNT"
                        }
                    ];
                }

                if (data.status.value == "Pending" || data.status.value == "Active" || data.status.value == "Validated") {
                    if (data.staffId) {

                    }
                    else {
                        scope.buttons.push(clientStatus.getStatus("Assign Staff"));
                    }
                }

                scope.buttonsArray = {
                    options: [
                        {
                            name: "button.clientscreenreports"
                        }
                    ]
                };
                scope.buttonsArray.singlebuttons = scope.buttons;
            });

            scope.getClientReports = function () {
                resourceFactory.runReportsResource.get({ reportSource: 'ClientReports', genericResultSet: 'false', R_clientId: scope.clientId }, function (data) {
                    scope.clientReports = data;
                });
            }
            scope.getClientReports();

            scope.deleteClient = function () {
                $uibModal.open({
                    templateUrl: 'deleteClient.html',
                    controller: ClientDeleteCtrl
                });
            };

            scope.uploadPic = function () {
                $uibModal.open({
                    templateUrl: 'uploadpic.html',
                    controller: UploadPicCtrl
                });
            };

            scope.markAsValidated = function () {
                $uibModal.open({
                    templateUrl: 'validateClient.html',
                    controller: ClientValidateCtrl
                });
            }

            var UploadPicCtrl = function ($scope, $uibModalInstance) {
                $scope.upload = function (file) {
                    if (file) {
                        Upload.upload({
                            url: $rootScope.hostUrl + API_VERSION + '/clients/' + scope.clientId + '/images',
                            data: {},
                            file: file
                        }).then(function (imageData) {
                            // to fix IE not refreshing the model
                            if (!scope.$$phase) {
                                scope.$apply();
                            }
                            $uibModalInstance.close('upload');
                            route.reload();
                        });
                    }
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

            scope.capturePic = function () {
                $uibModal.open({
                    templateUrl: 'capturepic.html',
                    controller: CapturePicCtrl,
                    windowClass: 'modalwidth700'
                });
            };

            var CapturePicCtrl = function ($scope, $uibModalInstance) {

                $scope.picture = null;
                $scope.error = null;
                $scope.videoChannel = {
                    video: null,
                    videoWidth: 320,
                    videoHeight: 240
                };
                $scope.stream = null;

                $scope.onVideoSuccess = function () {
                    $scope.error = null;
                };

                $scope.onStream = function (stream) {
                    $scope.stream = stream
                }

                $scope.onVideoError = function (err) {
                    if (typeof err != "undefined")
                        $scope.error = err.message + '(' + err.name + ')';
                };

                $scope.takeScreenshot = function () {
                    if ($scope.videoChannel.video) {
                        var picCanvas = document.createElement('canvas');
                        var width = $scope.videoChannel.video.width;
                        var height = $scope.videoChannel.video.height;

                        picCanvas.width = width;
                        picCanvas.height = height;
                        var ctx = picCanvas.getContext("2d");
                        ctx.drawImage($scope.videoChannel.video, 0, 0, width, height);
                        var imageData = ctx.getImageData(0, 0, width, height);
                        document.querySelector('#clientSnapshot').getContext("2d").putImageData(imageData, 0, 0);
                        $scope.picture = picCanvas.toDataURL();
                    }
                };

                $scope.uploadscreenshot = function () {
                    if ($scope.picture != null) {
                        http({
                            method: 'POST',
                            url: $rootScope.hostUrl + API_VERSION + '/clients/' + scope.clientId + '/images',
                            data: $scope.picture
                        }).then(function (imageData) {
                            if (!scope.$$phase) {
                                scope.$apply();
                            }
                            $scope.stream.getVideoTracks()[0].stop();
                            $uibModalInstance.close('upload');
                            route.reload();
                        });
                    }
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                    $scope.stream.getVideoTracks()[0].stop();
                };
                $scope.reset = function () {
                    $scope.picture = null;
                }
            };

            scope.deletePic = function () {
                $uibModal.open({
                    templateUrl: 'deletePic.html',
                    controller: DeletePicCtrl
                });
            };

            var DeletePicCtrl = function ($scope, $uibModalInstance) {
                $scope.delete = function () {
                    http({
                        method: 'DELETE',
                        url: $rootScope.hostUrl + API_VERSION + '/clients/' + scope.clientId + '/images',
                    }).then(function (imageData) {
                        if (!scope.$$phase) {
                            scope.$apply();
                        }
                        $uibModalInstance.close('delete');
                        route.reload();
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

            scope.uploadSig = function () {
                $uibModal.open({
                    templateUrl: 'uploadsig.html',
                    controller: UploadSigCtrl
                });
            };

            scope.reportsClient = function (rep) {
                $uibModal.open({
                    templateUrl: 'reporte.html',
                    controller: function ($scope, $uibModalInstance) {
                        var aux = angular.copy(routeParams);
                        routeParams.name = rep.report_name;
                        routeParams.type = 'Jasper';
                        routeParams.reportId = rep.id;
                        routeParams.clientAccountNo = scope.client.accountNo;
                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                            routeParams = aux;
                            route.reload();
                        }
                    },
                    backdrop: 'static',
                    keyboard: false
                });
            };

            scope.refresh = function () {
                route.reload();
            };

            var UploadSigCtrl = function ($scope, $uibModalInstance) {
                $scope.upload = function (file) {
                    if (file) {
                        Upload.upload({
                            url: $rootScope.hostUrl + API_VERSION + '/clients/' + scope.clientId + '/documents',
                            data: {
                                name: 'clientSignature',
                                description: 'client signature'
                            },
                            file: file
                        }).then(function (imageData) {
                            // to fix IE not refreshing the model
                            if (!scope.$$phase) {
                                scope.$apply();
                            }
                            $uibModalInstance.close('upload');
                            route.reload();
                        });
                    }
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

            scope.deleteSig = function () {
                $uibModal.open({
                    templateUrl: 'deletesig.html',
                    controller: DeleteSigCtrl
                });
            };

            var DeleteSigCtrl = function ($scope, $uibModalInstance) {
                http({
                    method: 'GET',
                    url: $rootScope.hostUrl + API_VERSION + '/clients/' + scope.clientId + '/documents'
                }).then(function (docsData) {
                    $scope.docId = -1;
                    for (var i = 0; i < docsData.data.length; ++i) {
                        if (docsData.data[i].name == 'clientSignature') {
                            $scope.docId = docsData.data[i].id;
                            scope.signature_url = $rootScope.hostUrl + API_VERSION + '/clients/' + scope.clientId + '/documents/' + docId + '/attachment?tenantIdentifier=' + $rootScope.tenantIdentifier;
                        }
                    }
                });
                $scope.delete = function (file) {
                    http({
                        method: 'DELETE',
                        url: $rootScope.hostUrl + API_VERSION + '/clients/' + scope.clientId + '/documents/' + $scope.docId
                    }).then(function () {
                        if (!scope.$$phase) {
                            scope.$apply();
                        }
                        $uibModalInstance.close('upload');
                        route.reload();
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

            scope.unassignStaffCenter = function () {
                $uibModal.open({
                    templateUrl: 'clientunassignstaff.html',
                    controller: ClientUnassignCtrl
                });
            };

            var ClientDeleteCtrl = function ($scope, $uibModalInstance) {
                $scope.delete = function () {
                    resourceFactory.clientResource.delete({ clientId: scope.clientId }, {}, function (data) {
                        $uibModalInstance.close('delete');
                        location.path('/clients');
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

            var ClientValidateCtrl = function ($scope, $uibModalInstance) {
                $scope.note = "";
                $scope.validateClient = function (isValidated) {
                    resourceFactory.clientResource.update({ clientId: scope.clientId, command: 'validate' }, { "isValidated": isValidated, "notes": $scope.note }, function (data) {
                        $uibModalInstance.close('validate');
                        //route.reload();
                        window.history.back();
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

            var ClientUnassignCtrl = function ($scope, $uibModalInstance) {
                $scope.unassign = function () {
                    resourceFactory.clientResource.save({ clientId: scope.clientId, command: 'unassignstaff' }, scope.staffData, function (data) {
                        $uibModalInstance.close('unassign');
                        route.reload();
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

            resourceFactory.clientAccountResource.get({ clientId: scope.clientId }, function (data) {
                scope.clientAccounts = data;

                if (data.savingsAccounts) {
                    for (var i in data.savingsAccounts) {
                        if (data.savingsAccounts[i].status.value == "Active") {
                            scope.updateDefaultSavings = true;
                            break;
                        }
                    }
                    scope.totalAllSavingsAccountsBalanceBasedOnCurrency = [];
                    for (var i in data.savingsAccounts) {
                        if (!scope.isSavingClosed(data.savingsAccounts[i])) {
                            var isNewEntryMap = true;
                            for (var j in scope.totalAllSavingsAccountsBalanceBasedOnCurrency) {
                                if (scope.totalAllSavingsAccountsBalanceBasedOnCurrency[j].code === data.savingsAccounts[i].currency.code) {
                                    isNewEntryMap = false;
                                    var totalSavings = scope.totalAllSavingsAccountsBalanceBasedOnCurrency[j].totalSavings + data.savingsAccounts[i].accountBalance;
                                    scope.totalAllSavingsAccountsBalanceBasedOnCurrency[j].totalSavings = totalSavings;
                                }
                            }
                            if (isNewEntryMap) {
                                var map = {};
                                map.code = data.savingsAccounts[i].currency.code;
                                map.totalSavings = data.savingsAccounts[i].accountBalance;
                                scope.totalAllSavingsAccountsBalanceBasedOnCurrency.push(map);
                            }
                        }
                    }
                }
            });

            scope.getCharges = function () {
                resourceFactory.clientChargesResource.getCharges({ clientId: scope.clientId, pendingPayment: true }, function (data) {
                    scope.charges = data.pageItems;
                });
            }

            scope.isClosed = function (loanaccount) {
                if (loanaccount.status.code === "loanStatusType.closed.written.off" ||
                    loanaccount.status.code === "loanStatusType.closed.obligations.met" ||
                    loanaccount.status.code === "loanStatusType.closed.reschedule.outstanding.amount" ||
                    loanaccount.status.code === "loanStatusType.withdrawn.by.client" ||
                    loanaccount.status.code === "loanStatusType.rejected") {
                    return true;
                } else {
                    return false;
                }
            };

            scope.isSavingClosed = function (savingaccount) {
                if (savingaccount.status.code === "savingsAccountStatusType.withdrawn.by.applicant" ||
                    savingaccount.status.code === "savingsAccountStatusType.closed" ||
                    savingaccount.status.code === "savingsAccountStatusType.pre.mature.closure" ||
                    savingaccount.status.code === "savingsAccountStatusType.rejected") {
                    return true;
                } else {
                    return false;
                }
            };

            scope.isShareClosed = function (shareAccount) {
                if (shareAccount.status.code === "shareAccountStatusType.closed" ||
                    shareAccount.status.code === "shareAccountStatusType.rejected") {
                    return true;
                } else {
                    return false;
                }
            };

            scope.setLoan = function () {
                if (scope.openLoan) {
                    scope.openLoan = false
                } else {
                    scope.openLoan = true;
                }
            };

            scope.setSaving = function () {
                if (scope.openSaving) {
                    scope.openSaving = false;
                } else {
                    scope.openSaving = true;
                }
            };

            scope.setShares = function () {
                if (scope.openShares) {
                    scope.openShares = false;
                } else {
                    scope.openShares = true;
                }
            };

            scope.getNotes = function () {
                resourceFactory.clientNotesResource.getAllNotes({ clientId: scope.clientId }, function (data) {
                    scope.clientNotes = data;
                });
            }

            scope.getClientFiles = function () {
                scope.getClientIdentityDocuments();
                scope.getClientDocuments();
                scope.getFamilyMembers();
                scope.getAddresses();
                scope.getClabe();
                scope.getLastNote();
            }

            scope.getClientIdentityDocuments = function () {
                resourceFactory.clientResource.getAllClientDocuments({ clientId: scope.clientId, anotherresource: 'identifiers' }, function (data) {
                    scope.identitydocuments = data;
                    for (var i = 0; i < scope.identitydocuments.length; i++) {
                        // 2 es INE en pruebas - tenemos que usar el correspondiente a Clave Elector
                        if (scope.identitydocuments[i].documentType.id == 2) {
                            scope.identityClaveElector = scope.identitydocuments[i].documentKey;
                        }
                        resourceFactory.clientIdentifierResource.get({ clientIdentityId: scope.identitydocuments[i].id }, function (data) {
                            for (var j = 0; j < scope.identitydocuments.length; j++) {
                                if (data.length > 0 && scope.identitydocuments[j].id == data[0].parentEntityId) {
                                    for (var l in data) {

                                        var loandocs = {};
                                        loandocs = API_VERSION + '/' + data[l].parentEntityType + '/' + data[l].parentEntityId + '/documents/' + data[l].id + '/attachment?tenantIdentifier=' + $rootScope.tenantIdentifier;
                                        data[l].docUrl = loandocs;
                                    }
                                    scope.identitydocuments[j].documents = data;
                                }
                            }
                        });
                    }
                });
            };

            scope.getLastNote = function () {
                resourceFactory.clientLastNote.get({ clientId: scope.clientId }, function (data) {
                    scope.lastNote = data.note;
                })
            }

            scope.getClabe = function () {
                resourceFactory.DataTablesResource.getTableDetails({
                    datatablename: 'cs_extra_data',
                    entityId: scope.clientId,
                    genericResultSet: 'true'
                }, function (data) {
                    if (typeof data.data[0] != "undefined" ) {
                        for (var i = 0; i < data.data[0].rows.length; ++i) {
                            if (data.data[0].rows[i].name == 'clabe') {
                                scope.clabe = data.data[0].rows[i].value;
                            }
                            if (data.data[0].rows[i].name == 'regimen') {
                                scope.regimenfiscal = data.data[0].rows[i].value;
                            }
                            if (data.data[0].rows[i].name == 'giro') {
                                scope.giro = data.data[0].rows[i].value;
                            }
                        }
                    }
                })
            }

            scope.getDataTablesAndScoring = function () {
                if (scope.datatableLoaded == false) {
                    scope.scoringDetails = [];
                    scope.scoringInternalSubTotal = 0;
                    scope.scoringInternalPoints = 0;
                    scope.scoringExternalPoints = 0; //scope.getRandomInt(300, 850);
                    scope.getExternalScoring();
                    scope.scoringTotalTotal = 0;
                    scope.getDataTables();
                }
            }

            scope.getExternalScoring = function () {
                resourceFactory.DataTablesResource.getTableDetails({
                    datatablename: "VALIDACION",
                    entityId: scope.clientId, genericResultSet: 'true'
                }).$promise.then(function (data) {
                    if (data.data.length > 0 && typeof data.data[0] !== 'undefined') {
                        var rows = data.data[0].rows;
                        for (var i=0; i<rows.length; i++) {
                            const row = rows[i];
                            if (row.name == "CREDTO" || row.name == "CREDITO") {
                                const rowValue = JSON.parse(row.value.replace("(0)", "").trim());
                                if (typeof rowValue !== 'undefined' && typeof rowValue.scores !== 'undefined' && typeof rowValue.scores[0] !== 'undefined') {
                                    scope.scoringExternalPoints = rowValue.scores[0].valor * 1;
                                    scope.calculateScoring();
                                }
                            }
                        }
                    }
                });
            }

            scope.$watch("scoringInternalSubTotal", function (newValue, oldValue) {
                var scoringInternal = newValue;
                scope.getExternalScoring();
                scope.scoringExternalTotal = scope.reScale(scope.scoringExternalPoints, 300, 850);
                scope.scoringInternalTotal = scope.reScale(scoringInternal, 4.05, 90.9);
                scope.calculateScoring();
            });

            scope.getDataTables = function () {
                resourceFactory.DataTablesResource.getAllDataTables({ apptable: 'm_client' }).$promise.then(function (data) {
                    scope.clientdatatables = data;
                    if (scope.datatableLoaded == false) {
                        for (var i in data) {
                            if (data[i].registeredTableName) {
                                scope.dataTableChange(data[i].registeredTableName);
                            }
                        }
                        scope.datatableLoaded = true;
                    }
                });
            }

            scope.calculateScoring = function () {
                // Scoring Total
                scope.scoringTotalTotal = (scope.scoringInternalTotal * 0.2) +
                    (scope.scoringExternalTotal * 0.8);
            }

            scope.dataTableChange = function (registeredTableName) {
                resourceFactory.DataTablesResource.getTableDetails({
                    datatablename: registeredTableName,
                    entityId: scope.clientId, genericResultSet: 'true'
                }).$promise.then(function (data) {
                    var datatabledetail = data;
                    datatabledetail.registeredTableName = registeredTableName;
                    datatabledetail.isData = false;
                    if (data.data) {
                        datatabledetail.isData = data.data.length > 0 ? true : false;
                    }
                    const columnHeaders = datatabledetail.datatableData.columnHeaderData;
                    datatabledetail.isMultirow = columnHeaders[0].columnName == "id" ? true : false;
                    datatabledetail.showDataTableAddButton = !datatabledetail.isData || datatabledetail.isMultirow;
                    datatabledetail.showDataTableEditButton = datatabledetail.isData && !datatabledetail.isMultirow;
                    datatabledetail.singleRow = [];
                    if (datatabledetail.isData) {
                        for (var i in columnHeaders) {
                            if (!datatabledetail.isMultirow) {
                                if (columnHeaders[i].columnName != "client_id") {
                                    datatabledetail.singleRow.push(data.data[0].rows[i]);
                                }
                            }
                        }
                    }
                    if (datatabledetail.datatableData.isScoring) {
                        scope.scoringInternalPoints += datatabledetail.points;
                        scope.scoringInternalSubTotal += datatabledetail.scoring;
                        scope.scoringDetails.push({
                            table: datatabledetail.datatableData.description,
                            points: datatabledetail.points,
                            weight: (datatabledetail.datatableData.scoringWeight / 100).toFixed(2),
                            value: datatabledetail.scoring
                        });
                    }

                    scope.datatabledetails.push(datatabledetail);
                });
            };

            scope.reScale = function (value, min, max) {
                return ((value - min) / (max - min)).toFixed(2);
            }

            scope.getDataTableScoring = function () {
                if (scope.dataTableScoring == 0) return "";
                return scope.dataTableScoring;
            }

            scope.getRandomInt = function (min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            scope.viewstandinginstruction = function () {
                location.path('/liststandinginstructions/' + scope.client.officeId + '/' + scope.client.id);
            };
            scope.createstandinginstruction = function () {
                location.path('/createstandinginstruction/' + scope.client.officeId + '/' + scope.client.id + '/fromsavings');
            };
            scope.deleteAll = function (apptableName, entityId) {
                resourceFactory.DataTablesResource.delete({ datatablename: apptableName, entityId: entityId, genericResultSet: 'true' }, {}, function (data) {
                    route.reload();
                });
            };

            scope.getClientDocuments = function () {
                resourceFactory.clientDocumentsResource.getAllClientDocuments({ clientId: scope.clientId }, function (data) {
                    for (var l in data) {

                        var loandocs = {};
                        loandocs = API_VERSION + '/' + data[l].parentEntityType + '/' + data[l].parentEntityId + '/documents/' + data[l].id + '/attachment?tenantIdentifier=' + $rootScope.tenantIdentifier;
                        data[l].docUrl = loandocs;
                        if (data[l].fileName)
                            if (data[l].fileName.toLowerCase().indexOf('.jpg') != -1 || data[l].fileName.toLowerCase().indexOf('.jpeg') != -1 || data[l].fileName.toLowerCase().indexOf('.png') != -1)
                                data[l].fileIsImage = true;
                        if (data[l].type)
                            if (data[l].type.toLowerCase().indexOf('image') != -1)
                                data[l].fileIsImage = true;
                    }
                    scope.clientdocuments = data;
                });
            };

            scope.deleteDocument = function (documentId, index) {
                resourceFactory.clientDocumentsResource.delete({ clientId: scope.clientId, documentId: documentId }, '', function (data) {
                    scope.clientdocuments.splice(index, 1);
                });
            };

            scope.previewDocument = function (index, resourceId, name) {
                resourceFactory.clientDocumentResource.getClientDocument({clientId: scope.clientId, documentId: resourceId}, function (data) {
                    scope.fileType = data.contentType;
                    scope.preview = true;
                    scope.clientdocuments[index].visited = true;
                    scope.fileData = $sce.trustAsResourceUrl("data:" + scope.fileType + ";base64," + data.data);
                    if (name) {
                        scope.highlight = name.toLowerCase();
                    }
                });
            };

            scope.closeDocumentPreview = function () {
                scope.preview = false;
                scope.fileData = null;
                scope.highlight = "";
            };

            scope.viewDataTable = function (registeredTableName, data) {
                if (scope.datatabledetails.isMultirow) {
                    location.path("/viewdatatableentry/" + registeredTableName + "/" + scope.client.id + "/" + data.row[0]);
                } else {
                    location.path("/viewsingledatatableentry/" + registeredTableName + "/" + scope.client.id);
                }
            };

            scope.downloadDocument = function (documentId) {
                resourceFactory.clientDocumentsResource.get({ clientId: scope.clientId, documentId: documentId }, '', function (data) {
                    scope.clientdocuments.splice(index, 1);
                });
            };

            scope.isLoanNotClosed = function (loanaccount) {
                if (loanaccount.status.code === "loanStatusType.closed.written.off" ||
                    loanaccount.status.code === "loanStatusType.closed.obligations.met" ||
                    loanaccount.status.code === "loanStatusType.closed.reschedule.outstanding.amount" ||
                    loanaccount.status.code === "loanStatusType.withdrawn.by.client" ||
                    loanaccount.status.code === "loanStatusType.rejected") {
                    return false;
                } else {
                    return true;
                }
            };

            scope.isSavingNotClosed = function (savingaccount) {
                if (savingaccount.status.code === "savingsAccountStatusType.withdrawn.by.applicant" ||
                    savingaccount.status.code === "savingsAccountStatusType.closed" ||
                    savingaccount.status.code === "savingsAccountStatusType.pre.mature.closure" ||
                    savingaccount.status.code === "savingsAccountStatusType.rejected") {
                    return false;
                } else {
                    return true;
                }
            };

            scope.isShareNotClosed = function (shareAccount) {
                if (shareAccount.status.code === "shareAccountStatusType.closed" ||
                    shareAccount.status.code === "shareAccountStatusType.rejected") {
                    return false;
                } else {
                    return true;
                }
            };
            scope.saveNote = function () {
                resourceFactory.clientResource.save({ clientId: scope.clientId, anotherresource: 'notes' }, this.formData, function (data) {
                    var today = new Date();
                    temp = { id: data.resourceId, note: scope.formData.note, createdByUsername: "test", createdOn: today };
                    scope.clientNotes.unshift(temp);
                    scope.formData.note = "";
                    scope.predicate = '-id';
                });
            }

            scope.showEditNote = function (clientId, clientNote, index) {
                $uibModal.open({
                    templateUrl: 'editNote.html',
                    controller: EditNoteCtrl,
                    resolve: {
                        items: function () {
                            return {
                                clientId: clientId,
                                clientNote: clientNote,
                                index: index
                            }
                        }
                    },
                    size: "lg"
                });
            }

            scope.showDeleteNote = function (clientId, clientNote, index) {
                $uibModal.open({
                    templateUrl: 'deleteNote.html',
                    controller: DeleteNoteCtrl,
                    resolve: {
                        items: function () {
                            return {
                                clientId: clientId,
                                clientNote: clientNote,
                                index: index
                            }
                        }
                    },
                    size: "lg"
                });
            }

            var EditNoteCtrl = function ($scope, $uibModalInstance, items) {
                scope.editData = {};
                editData = {};
                $scope.editNote = function (clientId, entityId, index, editData) {
                    resourceFactory.clientNotesResource.put({ clientId: items.clientId, noteId: items.clientNote }, { note: this.editData.editNote }, function (data) {
                        scope.clientNotes[items.index].note = $scope.editData.editNote;
                        scope.editData.editNote = "";
                        $uibModalInstance.close();
                    });
                };
                $scope.cancel = function (index) {
                    $uibModalInstance.dismiss('cancel');
                };
            };

            var DeleteNoteCtrl = function ($scope, $uibModalInstance, items) {
                $scope.deleteNote = function (clientId, entityId, index) {
                    resourceFactory.clientNotesResource.delete({ clientId: items.clientId, noteId: items.clientNote }, '', function (data) {
                        $uibModalInstance.close();
                        scope.clientNotes.splice(items.index, 1);
                    });
                };
                $scope.cancel = function (index) {
                    $uibModalInstance.dismiss('cancel');
                };
            };

            scope.deleteClientIdentifierDocument = function (clientId, entityId, index) {
                resourceFactory.clientIdenfierResource.delete({ clientId: clientId, id: entityId }, '', function (data) {
                    scope.identitydocuments.splice(index, 1);
                });
            };

            scope.downloadClientIdentifierDocument = function (identifierId, documentId) {
                console.log(identifierId, documentId);
            };

            scope.waiveCharge = function (chargeId) {
                resourceFactory.clientChargesResource.waive({ clientId: scope.clientId, resourceType: chargeId }, function (data) {
                    route.reload();
                });
            }

            scope.showSignature = function () {
                $uibModal.open({
                    templateUrl: 'clientSignature.html',
                    controller: ViewLargerClientSignature,
                    size: "lg"
                });
            };

            scope.showWithoutSignature = function () {
                $uibModal.open({
                    templateUrl: 'clientWithoutSignature.html',
                    controller: ViewClientWithoutSignature,
                    size: "lg"
                });
            };

            scope.showPicture = function () {
                $uibModal.open({
                    templateUrl: 'photo-dialog.html',
                    controller: ViewLargerPicCtrl,
                    size: "lg"
                });
            };

            

            var ViewClientWithoutSignature = function ($scope, $uibModalInstance) {
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
                $scope.uploadSig = function () {
                    $uibModalInstance.dismiss('cancel');
                    scope.uploadSig();
                };
            };

            var ViewLargerClientSignature = function ($scope, $uibModalInstance) {
                var loadSignature = function () {
                    http({
                        method: 'GET',
                        url: $rootScope.hostUrl + API_VERSION + '/clients/' + scope.clientId + '/documents'
                    }).then(function (docsData) {
                        $scope.docId = -1;
                        for (var i = 0; i < docsData.data.length; ++i) {
                            if (docsData.data[i].name == 'clientSignature') {
                                $scope.docId = docsData.data[i].id;
                                scope.signature_url = $rootScope.hostUrl + API_VERSION + '/clients/' + scope.clientId + '/documents/' + $scope.docId + '/attachment?tenantIdentifier=' + $rootScope.tenantIdentifier;
                            }
                        }
                        if (scope.signature_url != null) {
                            http({
                                method: 'GET',
                                url: $rootScope.hostUrl + API_VERSION + '/clients/' + scope.clientId + '/documents/' + $scope.docId + '/attachment?tenantIdentifier=' + $rootScope.tenantIdentifier
                            }).then(function (docsData) {
                                $scope.largeImage = scope.signature_url;
                            });
                        }
                    });
                };
                loadSignature();
                $scope.deleteSig = function () {
                    $uibModalInstance.dismiss('cancel');
                    scope.deleteSig();
                };
                $scope.uploadSig = function () {
                    $uibModalInstance.dismiss('cancel');
                    scope.uploadSig();
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

            var ViewLargerPicCtrl = function ($scope, $uibModalInstance) {
                var loadImage = function () {
                    if (scope.client.imagePresent) {
                        http({
                            method: 'GET',
                            url: $rootScope.hostUrl + API_VERSION + '/clients/' + scope.clientId + '/images?maxWidth=860'
                        }).then(function (imageData) {
                            $scope.largeImage = imageData.data;
                        });
                    }
                };
                loadImage();
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

        }
    });

    mifosX.ng.application.controller('ViewClientController', ['$scope', '$mdDialog', '$routeParams', '$route', '$location', 'ResourceFactory', '$http', '$uibModal', 'API_VERSION', '$rootScope', '$sce', 'Upload', mifosX.controllers.ViewClientController]).run(function ($log) {
        $log.info("ViewClientController initialized");
    });
}(mifosX.controllers || {}));