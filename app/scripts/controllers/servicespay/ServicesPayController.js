(function(module) {
    mifosX.controllers = _.extend(module, {
        ServicesPayController: function(scope, location, resourceFactory, translate) {

            scope.template=[];
            scope.sumaDenominations=0;
            scope.formData={};
            scope.formData.amount=0;
            scope.paymenttTypesId= 1;
            scope.first = {
                date: new Date()
            };
            scope.restrictDate = new Date();
            scope.showOptionsNonCash  = false;
            scope.formData.denominations = [{denominacion:"1000",cantidad:0,total:0} ,{denominacion:"500",cantidad:0,total:0},
            {denominacion:"200",cantidad:0,total:0},{denominacion:"100",cantidad:0,total:0},{denominacion:"50",cantidad:0,total:0}, {denominacion:"20",cantidad:0,total:0}];  
            resourceFactory.paymentTypeResource.getAll(function (data) {
                scope.paymentTypes = data;
            });

            resourceFactory.thirdPartyServicesResource.getAllServices(function (data) {
                scope.paymentthirdServices = data;
            });

            scope.Total= function(denomination,index)
            {
              scope.formData.denominations[index].total=  (scope.formData.denominations[index].cantidad * denomination);
              scope.sumaDenominations=0;
              scope.formData.denominations.forEach(element => {
                scope.sumaDenominations=scope.sumaDenominations + element.total;
              });
            };
                 scope.showPaymentTypeOptions = function (paymentTypeId) {
                  if (paymentTypeId == scope.paymenttTypesId || paymentTypeId == null) {
                      scope.showOptionsNonCash = false;
                  } else {
                      scope.showOptionsNonCash = true;
                  }
              };
            scope.numeros = function(e){
           
              let key = window.Event ? e.which : e.keyCode
              console.log("entro",key);
             if (key >= 48 && key <= 57)
             {
    
             }
             else{
              e.preventDefault();
             }
            };
          },
        });
    mifosX.ng.application.controller('ServicesPayController', ['$scope', '$location', 'ResourceFactory', mifosX.controllers.ServicesPayController]).run(function($log) {
        $log.info("ServicesPayController initialized");
    });
}(mifosX.controllers || {}));