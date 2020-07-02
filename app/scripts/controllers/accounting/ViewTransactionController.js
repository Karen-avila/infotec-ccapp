(function (module) {
  mifosX.controllers = _.extend(module, {
    ViewTransactionController: function (
      scope,
      routeParams,
      resourceFactory,
      location,
      route,
      $mdDialog
    ) {
      scope.flag = false;
      scope.manualEntry = false;
      scope.productName = routeParams.productName;
      //scope.clientName = routeParams.clientName;
      scope.accountNo = routeParams.accountNo;
      //scope.clientId = routeParams.clientId;
      scope.loanId = routeParams.loanId;
      scope.savingId = routeParams.savingId;
      //scope.groupId = routeParams.groupId;
      //scope.groupName = routeParams.groupName;
      scope.journalEntryTransactionId = routeParams.transactionId;
      if (
        scope.journalEntryTransactionId != null &&
        scope.journalEntryTransactionId != ""
      ) {
        scope.journalEntryTransactionId = scope.journalEntryTransactionId.substring(
          1,
          scope.journalEntryTransactionId.length
        );
      }

      resourceFactory.journalEntriesResource.get(
        { transactionId: routeParams.transactionId, transactionDetails: true },
        function (data) {
          scope.transactionNumber = routeParams.transactionId;
          scope.transactions = data.pageItems;
          for (var i in data.pageItems) {
            scope.manualEntry = data.pageItems[i].manualEntry;
            if (data.pageItems[i].reversed == false) {
              scope.flag = true;
            }
          }
        }
      );

      scope.confirmation = function (ev, trxnid) {
        $mdDialog.show({
            controller: ConfirmationCtrl,
            templateUrl: 'views/accounting/confirmation.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: true, // Only for -xs, -sm breakpoints.
            locals: {
                data: {
                  id: trxnid
                }
            },
        });  
      };

      var ConfirmationCtrl = function (scope, $mdDialog, data) {
          scope.data = data;
          scope.closeDialog = function() {
            $mdDialog.hide();
          }
          scope.transactionnumber = scope.data.id.transactionId;
          scope.redirect = function () {
            $mdDialog.hide();
            location.path("/viewtransactions/" + scope.data.id.transactionId);
          };
      }

      scope.showTransaction = function (ev, transaction) {
        $mdDialog.show({
            controller: ViewJournalEntryCtrl,
            templateUrl: 'views/accounting/viewjournalentry.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: true, // Only for -xs, -sm breakpoints.
            locals: {
                data: {
                  transaction: transaction
                }
            },
        }); 
      };

      var ViewJournalEntryCtrl = function (scope, $mdDialog, data) {
        scope.data = data;
        scope.closeDialog = function() {
          $mdDialog.hide();
        }
        scope.transaction = scope.data.transaction;
      };

      scope.reverseTransaction = function (ev, transactionId) {
        $mdDialog.show({
            controller: ReverseJournalEntriesCtrl,
            templateUrl: 'views/accounting/reverseTransaction.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: true, // Only for -xs, -sm breakpoints.
            locals: {
                data: {
                  transactionId: transactionId
                }
            },
        }); 
      };

      var ReverseJournalEntriesCtrl = function (scope, $mdDialog, data) {
        scope.closeDialog = function() {
          $mdDialog.hide();
        }
        scope.data = {
          reverseComments: "",
        };
        scope.reverse = function () {
          reverseData = {
            transactionId: data.transactionId,
            comments: scope.data.reverseComments,
          };
          
          resourceFactory.journalEntriesResource.reverse(reverseData, function (
            data
          ) {
              $mdDialog.hide();

              scope.trxnid = data;
              scope.confirmation();

              route.reload();
          });
        };
      };
    },
  });
  mifosX.ng.application
    .controller("ViewTransactionController", [
      "$scope",
      "$routeParams",
      "ResourceFactory",
      "$location",
      "$route",
      "$mdDialog",
      mifosX.controllers.ViewTransactionController,
    ])
    .run(function ($log) {
      $log.info("ViewTransactionController initialized");
    });
})(mifosX.controllers || {});
