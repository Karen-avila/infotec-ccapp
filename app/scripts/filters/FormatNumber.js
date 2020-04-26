(function (module) {
    mifosX.filters = _.extend(module, {
        FormatNumber: function ($filter, localStorageService) {
            return function (input, fractionSize) {
                if (isNaN(input)) {
                    return input;
                } else {
                    //TODO- Add number formatting also
                    if (input != "" && input != undefined) {
                        const numDecimals = localStorageService.getFromLocalStorage('numDecimals');
                        return $filter('number')(input, numDecimals);
                    };
                };
            }
        }
    });
    mifosX.ng.application.filter('FormatNumber', ['$filter', 'localStorageService', mifosX.filters.FormatNumber]).run(function ($log) {
        $log.info("FormatNumber filter initialized");
    });
}(mifosX.filters || {}));
