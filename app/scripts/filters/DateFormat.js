(function (module) {
    mifosX.filters = _.extend(module, {
        DateFormat: function (dateFilter, localStorageService) {
            return function (input) {
                if (input) {
                    const dateFormat = localStorageService.getFromLocalStorage('dateformat');
                    var tDate = new Date(input);
                    var localDate = new Date(tDate.getTime()+tDate.getTimezoneOffset()*60*1000);
                    var offset = tDate.getTimezoneOffset() / 60;
                    var hours = tDate.getHours();
                    localDate.setHours(hours - offset);
                    return dateFilter(localDate, dateFormat);
                }
                return '';
            }
        }
    });
    mifosX.ng.application.filter('DateFormat', ['dateFilter', 'localStorageService', mifosX.filters.DateFormat]).run(function ($log) {
        $log.info("DateFormat filter initialized");
    });
}(mifosX.filters || {}));
