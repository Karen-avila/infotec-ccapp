define([
  "mifosX",
  "services/HttpServiceProvider",
  "services/ResourceFactoryProvider",
], {
  configure: function (url) {
    var baseUrl = url || "https://mifos.infotec.mx";
    mifosX.ng.services
      .config([
        "$httpProvider",
        function (httpProvider) {
          httpProvider.defaults.headers.common["Fineract-Platform-TenantId"] =
            "default";
          httpProvider.defaults.headers.common["Content-Encoding"] = "gzip";
        },
      ])
      .run(function ($log) {
        $log.warn("Using live demo server api -> " + baseUrl);
      });
  },
});
