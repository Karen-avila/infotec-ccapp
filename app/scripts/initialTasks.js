
(function (mifosX) {
    var defineHeaders = function ($httpProvider, $translateProvider, ResourceFactoryProvider, HttpServiceProvider, IdleProvider, KeepaliveProvider) {
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

        //Set headers
        $httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
        $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
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
