
(function (mifosX) {
    var defineHeaders = function ($httpProvider, $translateProvider, ResourceFactoryProvider, HttpServiceProvider, IdleProvider, KeepaliveProvider, $mdThemingProvider, $mdDateLocaleProvider, cfpLoadingBarProvider) {
        var mainLink = getLocation(window.location.href);
        var baseApiUrl = "https://mifos.infotec.mx";
        var host = "";
        var portNumber = "";
        //accessing from openmf server
        if (mainLink.hostname.indexOf('openmf.org') >= 0) {
            var hostname = window.location.hostname;
            domains = hostname.split('.');
            // For multi tenant hosting
            if (domains[0] == "demo") {
                $httpProvider.defaults.headers.common['Fineract-Platform-TenantId'] = 'default';
                ResourceFactoryProvider.setTenantIdenetifier('default');
            } else {
                $httpProvider.defaults.headers.common['Fineract-Platform-TenantId'] = domains[0];
                ResourceFactoryProvider.setTenantIdenetifier(domains[0]);
            }
            host = "https://" + mainLink.hostname;
        }
        //accessing from a file system or other servers
        else {
            if (mainLink.hostname != "") {
                baseApiUrl = "https://" + mainLink.hostname + (mainLink.port ? ':' + mainLink.port : '');
            }

            if (QueryParameters["baseApiUrl"]) {
                baseApiUrl = QueryParameters["baseApiUrl"];
            }
            var queryLink = getLocation(baseApiUrl);
            host = "https://" + queryLink.hostname + (queryLink.port ? ':' + queryLink.port : '');
            portNumber = queryLink.port;

            $httpProvider.defaults.headers.common['Fineract-Platform-TenantId'] = 'default';
            ResourceFactoryProvider.setTenantIdenetifier('default');
            if (QueryParameters["tenantIdentifier"]) {
                $httpProvider.defaults.headers.common['Fineract-Platform-TenantId'] = QueryParameters["tenantIdentifier"];
                ResourceFactoryProvider.setTenantIdenetifier(QueryParameters["tenantIdentifier"]);
            }
        }

        ResourceFactoryProvider.setBaseUrl(host);
        HttpServiceProvider.addRequestInterceptor('baseUrl', function (config) {
            var _ = require('underscore');
            return _.extend(config, {url: host + config.url });
        });
        // HTTP error handler for 401 error
        // $httpProvider.interceptors.push('handleResponseError401');

        // Enable CORS! (see e.g. http://enable-cors.org/)
        $httpProvider.defaults.useXDomain = true;
        // delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $httpProvider.defaults.headers.common['X-Requested-With'] = "XMLHttpRequest";

        //Set headers
        $httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
        $httpProvider.defaults.headers.common['Content-Encoding'] = 'gzip';

        // Configure i18n and preffer language
        //$translateProvider.translations('en', translationsEN);
        $translateProvider.useSanitizeValueStrategy('escaped');
        $translateProvider.useStaticFilesLoader({
            prefix: 'global-translations/locale-',
            suffix: '.json'
        });

        $translateProvider.preferredLanguage('es-mx');
        $translateProvider.fallbackLanguage('en');
        //Timeout settings.
        IdleProvider.idle(30*60); //Idle time (seconds)
        IdleProvider.timeout(10); // in seconds
        KeepaliveProvider.interval(15*60); //keep-alive ping

        var moment = require("moment");
        moment.locale('es');
        // moment.tz.setDefault("America/Mexico_City");

        // Set month and week names for the general $mdDateLocale service
        var localeData = moment.localeData();
        $mdDateLocaleProvider.months      = localeData._months;
        $mdDateLocaleProvider.shortMonths = moment.monthsShort();
        $mdDateLocaleProvider.days        = localeData._weekdays;
        $mdDateLocaleProvider.shortDays   = localeData._weekdaysMin;
        // Optionaly let the week start on the day as defined by moment's locale data
        $mdDateLocaleProvider.firstDayOfWeek = localeData._week.dow;
      
        // Format and parse dates based on moment's 'L'-format
        $mdDateLocaleProvider.parseDate = function(dateString) {
            if (!dateString || dateString === 'undefined') {
                return dateString;
            }
            console.log((typeof dateString));
            if (typeof dateString !== 'undefined') {
                var m = moment(dateString, 'L', true);
                console.log("parse " + dateString + " : " + m.isValid());
                return m.isValid() ? m.toDate() : new Date(NaN);
            }
        };
      
        $mdDateLocaleProvider.formatDate = function(date) {
            if (!date || date === 'undefined') {
                return date;
            }
            console.log((typeof date));
            if (typeof date !== 'undefined' ) {
                var m = moment(date);
                return m.isValid() ? m.format('L') : '';
            }
        };

        // Theme
        $mdThemingProvider.definePalette('mcgpalette0', {
            '50': 'e5ebea',
            '100': 'bfceca',
            '200': '94aea6',
            '300': '698d82',
            '400': '487468',
            '500': '285c4d',
            '600': '245446',
            '700': '1e4a3d',
            '800': '184134',
            '900': '0f3025',
            'A100': '6effc9',
            'A200': '3bffb6',
            'A400': '08ffa3',
            'A700': '00ed95',
            'contrastDefaultColor': 'light',
            'contrastDarkColors': [
            '50',
            '100',
            '200',
            '300',
            'A100',
            'A200',
            'A400',
            'A700'
            ],
            'contrastLightColors': [
            '400',
            '500',
            '600',
            '700',
            '800',
            '900'
            ]
        });
        $mdThemingProvider.definePalette('mcgpalette1', {
            '50': 'fdfdfc',
            '100': 'fbfaf7',
            '200': 'f9f6f2',
            '300': 'f6f2ec',
            '400': 'f4f0e8',
            '500': 'f2ede4',
            '600': 'f0ebe1',
            '700': 'eee8dd',
            '800': 'ece5d9',
            '900': 'e8e0d1',
            'A100': 'ffffff',
            'A200': 'ffffff',
            'A400': 'ffffff',
            'A700': 'ffffff',
            'contrastDefaultColor': 'light',
            'contrastDarkColors': [
            '50',
            '100',
            '200',
            '300',
            '400',
            '500',
            '600',
            '700',
            '800',
            '900',
            'A100',
            'A200',
            'A400',
            'A700'
            ],
            'contrastLightColors': []
        });
        $mdThemingProvider.theme('default')
            .primaryPalette('mcgpalette0')
            .accentPalette('mcgpalette1');
        $mdThemingProvider.theme('mifos')
            .primaryPalette('mcgpalette0')
            .accentPalette('mcgpalette1');

        cfpLoadingBarProvider.includeSpinner = false;
        cfpLoadingBarProvider.latencyThreshold = 500;
    };
    mifosX.ng.application.config(defineHeaders).run(function ($log, Idle) {
        $log.info("Initial tasks are done!");
        Idle.watch();
    });
}(mifosX || {}));

getLocation = function (href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
};

QueryParameters = (function () {
    var result = {};
    if (window.location.search) {
        // split up the query string and store in an associative array
        var params = window.location.search.slice(1).split("&");
        for (var i = 0; i < params.length; i++) {
            var tmp = params[i].split("=");
            result[tmp[0]] = unescape(tmp[1]);
        }
    }
    return result;
}());
