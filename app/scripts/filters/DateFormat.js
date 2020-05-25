(function (module) {
    mifosX.filters = _.extend(module, {
        DateFormat: function (dateFilter, localStorageService) {
            return function (input, format) {
                if (input) {
                    var dateFormat = localStorageService.getFromLocalStorage('dateformat');
                    if (typeof format !== 'undefined') {
                        dateFormat = format;
                    }
                    var tDate = new Date(input);
                    return dateFilter(tDate, dateFormat);
                }
                return '';
            }
        }
    });
    mifosX.ng.application.filter('DateFormat', ['dateFilter', 'localStorageService', mifosX.filters.DateFormat]).run(function ($log) {
        $log.info("DateFormat filter initialized");
    });
}(mifosX.filters || {}));
