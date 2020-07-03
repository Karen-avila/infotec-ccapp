(function (module) {
    mifosX.controllers = _.extend(module, {
        UserSettingController: function (scope) {            
            scope.dates = [];
            mifosX.models.DateFormats.forEach(function (format) {
                scope.dates.push(format.local);
            });

            scope.langs = mifosX.models.Langs;
            
            scope.$watch(function () {
                return scope.df;
            }, function () {
                scope.updateDf(scope.df);
            });

            scope.$watch(function () {
                return scope.optlang;
            }, function () {
                scope.changeLang(scope.optlang.code);
            });
        }
    });

    mifosX.ng.application.controller('UserSettingController', ['$scope', mifosX.controllers.UserSettingController]).run(function ($log) {
        $log.info("UserSettingController initialized");
    });
}(mifosX.controllers || {}));