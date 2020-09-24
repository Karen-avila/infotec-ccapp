(function (module) {
  mifosX.controllers = _.extend(module, {
    AddressFormController: function (
      $scope,
      resourceFactory,
      routeParams,
      location
    ) {
      $scope.formData = {
        locale: "en",
        latitude: 0,
        longitude: 0
      };
      $scope.addressTypes = [];
      $scope.countryOptions = [];
      $scope.stateOptions = [];
      $scope.municipalityOptions = [];
      $scope.allMunicipalityOptions = [];
      $scope.addressTypeId = {};
      entityname = "ADDRESS";
      $scope.editable = false;
      $scope.clientId = routeParams.id;

      resourceFactory.clientaddressFields.get(function (data) {
        $scope.addressTypes = data.addressTypeIdOptions;
        console.log(data.addressTypeIdOptions);
        $scope.countryOptions = data.countryIdOptions;
        $scope.municipalityOptions = data.municipalityIdOptions;
        $scope.allMunicipalityOptions = data.municipalityIdOptions;
        $scope.stateOptions = data.stateProvinceIdOptions;
      });

      resourceFactory.addressFieldConfiguration.get(
        { entity: entityname },
        function (data) {
          for (var i = 0; i < data.length; i++) {
            data[i].field = "$scope." + data[i].field;
            eval(data[i].field + "=" + data[i].is_enabled);
          }
        }
      );

      $scope.routeTo = function () {
        location.path("/viewclient/" + $scope.clientId);
      };

      $scope.isEditRequired = function (addType) {
        resourceFactory.clientAddresses.get(
          { type: addType, clientId: routeParams.id, status: true },
          function (data) {
            if (data[0]) {
              // index is added just to sense whether it is empty or contains data
              $scope.editable = true;
            } else {
              $scope.editable = false;
            }
          }
        );
      };

      $scope.filterMunicipality = function () {
        for (var i = 0; i < $scope.stateOptions.length; i++) {
          if ($scope.stateOptions[i].id === $scope.formData.stateProvinceId) {
            const state = $scope.stateOptions[i].name;
            $scope.municipalityOptions = $scope.allMunicipalityOptions.filter(
              function (item) {
                return item.description == state;
              }
            );
            break;
          }
        }
      };

      $scope.updateaddress = function () {
        resourceFactory.clientAddresses.put(
          { clientId: routeParams.id, type: $scope.formData.addressTypeId },
          $scope.formData,
          function (data) {
            location.path("/viewclient/" + routeParams.id);
          }
        );
      };

      $scope.submit = function () {
        $scope.formData.street = $scope.formData.street.toUpperCase();
        if (typeof $scope.formData.addressLine1 != "undefined") {
          $scope.formData.addressLine1 = $scope.formData.addressLine1.toUpperCase();
        }
        if (typeof $scope.formData.addressLine2 != "undefined") {
          $scope.formData.addressLine2 = $scope.formData.addressLine2.toUpperCase();
        }
        if (typeof $scope.formData.addressLine3 != "undefined") {
          $scope.formData.addressLine3 = $scope.formData.addressLine3.toUpperCase();
        }
        if (typeof $scope.formData.addressLine4 != "undefined") {
          $scope.formData.addressLine4 = $scope.formData.addressLine4.toUpperCase();
        }
        if (typeof $scope.formData.addressLine5 != "undefined") {
          $scope.formData.addressLine5 = $scope.formData.addressLine5.toUpperCase();
        }
        if (typeof $scope.formData.addressLine6 != "undefined") {
          $scope.formData.addressLine6 = $scope.formData.addressLine6.toUpperCase();
        }

        resourceFactory.clientAddresses.save(
          { clientId: routeParams.id, type: $scope.formData.addressTypeId },
          $scope.formData,
          function (data) {
            location.path("/viewclient/" + $scope.clientId);
          }
        );
      };
    },
  });
  mifosX.ng.application
    .controller("AddressFormController", [
      "$scope",
      "ResourceFactory",
      "$routeParams",
      "$location",
      mifosX.controllers.AddressFormController,
    ])
    .run(function ($log) {
      $log.info("AddressFormController initialized");
    });
})(mifosX.controllers || {});
