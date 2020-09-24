(function (module) {
    mifosX.filters = _.extend(module, {
        DateTimeFormat: function (dateFilter, localStorageService) {
            return function (input, format) {
                if (input) {
                    var dateFormat = localStorageService.getFromLocalStorage('dateformat');
                    if (typeof format !== 'undefined') {
                        dateFormat = format;
                    }
                    dateFormat = dateFormat + " HH:mm";
                    var tDate = new Date(input);
                    return dateFilter(tDate, dateFormat);
                }
                return '';
            }
        }
    });
    mifosX.ng.application.filter('DateTimeFormat', ['dateFilter', 'localStorageService', mifosX.filters.DateTimeFormat]).run(function ($log) {
        $log.info("DateTimeFormat filter initialized");
    });
}(mifosX.filters || {}));
