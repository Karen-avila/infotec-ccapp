(function (module) {
  mifosX.services = _.extend(module, {
    SessionManager: function (
      webStorage,
      httpService,
      SECURITY,
      resourceFactory,
      localStorageService
    ) {
      var EMPTY_SESSION = {};

      this.get = function (data) {
        var isOauth = SECURITY === "oauth";
        var accessToken = null;
        if (SECURITY === "oauth") {
            accessToken = localStorageService.getFromLocalStorage("tokendetails").access_token;
        }
        if (data.shouldRenewPassword) {
            if (SECURITY === "oauth") {
                httpService.setAuthorization(data.accessToken, SECURITY);
            } else if (SECURITY === "basicauth")  {
                httpService.setAuthorization(data.base64EncodedAuthenticationKey, SECURITY);
            } else if (SECURITY === "jwtauth")  {
                httpService.setAuthorization(data.authenticationToken, SECURITY);
            }
        } else {
          if (SECURITY === "oauth") {
            webStorage.set("sessionData", {
                userId: data.userId,
                authenticationKey: data.accessToken,
                userPermissions: data.permissions,
            });
            httpService.setAuthorization(data.accessToken, SECURITY);

          } else if (SECURITY === "basicauth")  {
            webStorage.set("sessionData", {
                userId: data.userId,
                authenticationKey: data.base64EncodedAuthenticationKey,
                userPermissions: data.permissions,
            });
            httpService.setAuthorization(
                data.base64EncodedAuthenticationKey, SECURITY
            );

          } else if (SECURITY === "jwtauth")  {
            webStorage.set("sessionData", {
                userId: data.userId,
                authenticationKey: data.authenticationToken,
                userPermissions: data.permissions,
            });
            httpService.setAuthorization(
                data.authenticationToken, SECURITY
            );
          }
          return { user: new mifosX.models.LoggedInUser(data) };
        }
      };

      this.clear = function () {
        webStorage.remove("sessionData");
        httpService.cancelAuthorization();
        return EMPTY_SESSION;
      };

      this.restore = function (handler) {
        var sessionData = webStorage.get("sessionData");
        if (sessionData !== null) {
          httpService.setAuthorization(sessionData.authenticationKey, SECURITY);
          resourceFactory.userResource.get(
            { userId: sessionData.userId },
            function (userData) {
              userData.userPermissions = sessionData.userPermissions;
              handler({ user: new mifosX.models.LoggedInUser(userData) });
            }
          );
        } else {
          handler(EMPTY_SESSION);
        }
      };
    },
  });
  mifosX.ng.services
    .service("SessionManager", [
      "webStorage", "HttpService", "SECURITY", "ResourceFactory", "localStorageService",
      mifosX.services.SessionManager,
    ])
    .run(function ($log) {
      $log.info("SessionManager initialized");
    });
})(mifosX.services || {});
