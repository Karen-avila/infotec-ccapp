(function (module) {
    mifosX.controllers = _.extend(module, {
        MainController: function (scope, location, sessionManager, translate, $rootScope, localStorageService, keyboardManager, Idle, tmhDynamicLocale,
            $http) {
            $http.get('release.json').then(function (data) {
                scope.version = data.data.version;
                scope.releasedate = data.data.releasedate;
            });

            scope.toggleSearch = false;
            scope.islogofoldernamefetched = false;
            scope.islogofoldernameconfig = false;
            scope.isFaviconPath = false;
            scope.isHeaderLogoPath = false;
            scope.isBigLogoPath = false;
            scope.isLargeLogoPath = false;

            if (!scope.islogofoldernamefetched && $rootScope.tenantIdentifier && $rootScope.tenantIdentifier != "default") {
                scope.islogofoldernamefetched = true;
                $http({ method: 'GET', url: 'scripts/config/LogoConfig.json' }).then(function (datas) {
                    for (var i in datas) {
                        var data = datas[i];
                        if (data.tenantIdentifier != undefined && data.tenantIdentifier == $rootScope.tenantIdentifier) {
                            if (data.logofoldername != undefined && data.logofoldername != "") {
                                scope.islogofoldernameconfig = true;
                                scope.logofoldername = data.logofoldername;
                                if (data.faviconPath) {
                                    scope.isFaviconPath = true;
                                    scope.faviconPath = data.faviconPath;
                                }
                                if (data.bigLogoPath) {
                                    scope.isBigLogoPath = true;
                                    scope.bigLogoPath = data.bigLogoPath;
                                }
                                if (data.headerLogoPath) {
                                    scope.isHeaderLogoPath = true;
                                    scope.headerLogoPath = data.headerLogoPath;
                                }
                                if (data.largeLogoPath) {
                                    scope.isLargeLogoPath = true;
                                    scope.largeLogoPath = data.largeLogoPath;
                                }
                            }
                        }
                    }
                });
            }

            scope.$on('scrollbar.show', function () {
                console.log('Scrollbar show');
            });
            scope.$on('scrollbar.hide', function () {
                console.log('Scrollbar hide');
            });

            scope.$on('configJsonObj', function (e, response) {
                scope.response = response;
            });
            scope.activity = {};
            scope.activityQueue = [];
            if (localStorageService.getFromLocalStorage('Location')) {
                scope.activityQueue = localStorageService.getFromLocalStorage('Location');
            }
            scope.loadSC = function () {
                if (!localStorageService.getFromLocalStorage('searchCriteria'))
                    localStorageService.addToLocalStorage('searchCriteria', {})
                scope.searchCriteria = localStorageService.getFromLocalStorage('searchCriteria');
            };
            scope.saveSC = function () {
                localStorageService.addToLocalStorage('searchCriteria', scope.searchCriteria);
            };
            scope.loadSC();
            scope.setDf = function () {
                if (localStorageService.getFromLocalStorage('dateformat')) {
                    scope.dateformat = localStorageService.getFromLocalStorage('dateformat');
                } else {
                    localStorageService.addToLocalStorage('dateformat', 'dd MMMM yyyy');
                    scope.dateformat = 'dd MMMM yyyy';
                }
                scope.df = scope.dateformat;
                scope.dft = scope.dateformat + ' ' + 'HH:mm:ss'
            };

            scope.getDateFormat = function () {
                if (localStorageService.getFromLocalStorage('dateformat')) {
                    return localStorageService.getFromLocalStorage('dateformat');
                } else {
                    return 'dd MMMM yyyy';
                }
            };

            scope.setDecimals = function () {
                if (localStorageService.getFromLocalStorage('numDecimals')) {
                    scope.nd = localStorageService.getFromLocalStorage('numDecimals');
                } else {
                    scope.nd = 2;
                    localStorageService.addToLocalStorage('numDecimals', scope.nd);
                }
            };

            scope.updateDf = function (dateFormat) {
                localStorageService.addToLocalStorage('dateformat', dateFormat);
                scope.dateformat = dateFormat;
                scope.setDf();
            };

            scope.updateDecimals = function (decimals) {
                localStorageService.addToLocalStorage('numDecimals', decimals);
                scope.setDecimals();
            };
            
            scope.setDf();
            scope.setDecimals();
            $rootScope.setPermissions = function (permissions) {
                $rootScope.permissionList = permissions;
                localStorageService.addToLocalStorage('userPermissions', permissions);
                $rootScope.$broadcast('permissionsChanged')
            };

            $rootScope.getOfficeData = function () {
                const userData = localStorageService.getFromLocalStorage('userData');
                const officeData = {id: userData.officeId, name: userData.officeName};
                return officeData;
            };

            $rootScope.hasPermission = function (permission) {
                permission = permission.trim();
                //FYI: getting all permissions from localstorage, because if scope changes permissions array will become undefined
                $rootScope.permissionList = localStorageService.getFromLocalStorage('userPermissions');
                //If user is a Super user return true
                var _ = require('underscore');
                if ($rootScope.permissionList && _.contains($rootScope.permissionList, "ALL_FUNCTIONS")) {
                    return true;
                } else if ($rootScope.permissionList && permission && permission != "") {
                    //If user have all read permission return true
                    if (permission.substring(0, 5) == "READ_" && _.contains($rootScope.permissionList, "ALL_FUNCTIONS_READ")) {
                        return true;
                    } else if (_.contains($rootScope.permissionList, permission)) {
                        //check for the permission if user doesn't have any special permissions
                        return true;
                    } else {
                        //return false if user doesn't have permission
                        return false;
                    }
                } else {
                    //return false if no value assigned to has-permission directive
                    return false;
                }
                ;
            };

            scope.$watch(function () {
                return location.path();
            }, function () {
                scope.activity = location.path();
                scope.activityQueue.push(scope.activity);
                localStorageService.addToLocalStorage('Location', scope.activityQueue);
            });

            //Logout the user if Idle
            scope.started = false;
            scope.$on('$idleTimeout', function () {
                scope.logout();
                Idle.unwatch();
                scope.started = false;
            });

            // Log out the user when the window/tab is closed.
            window.onunload = function () {
                // scope.logout();
                Idle.unwatch();
                scope.started = false;
            };

            scope.start = function (session) {
                if (session) {
                    Idle.watch();
                    scope.started = true;
                }
            };

            scope.leftnav = false;
            scope.$on("UserAuthenticationTwoFactorRequired", function (event, data) {
                if (sessionManager.get(data)) {
                    scope.start(scope.currentSession);
                }
            });

            scope.$on("UserAuthenticationSuccessEvent", function (event, data) {
                scope.authenticationFailed = false;
                scope.resetPassword = data.shouldRenewPassword;
                if (sessionManager.get(data)) {
                    scope.currentSession = sessionManager.get(data);
                    scope.start(scope.currentSession);
                    if (scope.currentSession.user && scope.currentSession.user.userPermissions) {
                        $rootScope.setPermissions(scope.currentSession.user.userPermissions);
                        // $rootScope.setOfficeData(scope.currentSession.officeId, scope.currentSession.officeName);
                    }
                    location.path('/home').replace();
                } else {
                    scope.loggedInUserId = data.userId;
                }
            });

            var setSearchScopes = function () {
                var all = { name: "label.search.scope.all", value: "clients,clientIdentifiers,groups,savings,shares,loans" };
                var clients = {
                    name: "label.search.scope.clients.and.clientIdentifiers",
                    value: "clients,clientIdentifiers"
                };
                var groups = {
                    name: "label.search.scope.groups.and.centers",
                    value: "groups"
                };
                var savings = { name: "label.input.adhoc.search.loans", value: "loans" };
                var shares = { name: "label.search.scope.shares", value: "shares" };
                var loans = { name: "label.search.scope.savings", value: "savings" };
                scope.searchScopes = [all, clients, groups, loans, savings, shares];
                scope.currentScope = all;
            }

            setSearchScopes();

            scope.changeScope = function (searchScope) {
                scope.currentScope = searchScope;
            }

            scope.searchText = "";
            scope.searchAll = function (searchString) {
                var exactMatch = false;
                if (searchString != null) {
                    searchString = searchString.replace(/(^"|"$)/g, '');
                    scope.showSearchBar(!scope.toggleSearch);
                    location.path('/search/' + searchString).search({ exactMatch: exactMatch, resource: scope.currentScope.value });
                }
            };
            scope.text = ' ';

            scope.logout = function () {
                $rootScope.$broadcast("OnUserPreLogout");
                scope.currentSession = sessionManager.clear();
                scope.resetPassword = false;
                location.path('/').replace();
            };

            scope.langs = mifosX.models.Langs;
            scope.decimals = [0,1,2,4,6,8];

            if (localStorageService.getFromLocalStorage('Language')) {
                var temp = localStorageService.getFromLocalStorage('Language');
                for (var i in mifosX.models.Langs) {
                    if (mifosX.models.Langs[i].code == temp.code) {
                        scope.optlang = mifosX.models.Langs[i];
                        tmhDynamicLocale.set(mifosX.models.Langs[i].code);
                    }
                }
            } else {
                for (var i = 0; i < scope.langs.length; i++) {
                    if (scope.langs[i].default == true) {
                        scope.optlang = scope.langs[i];
                        tmhDynamicLocale.set(scope.langs[i].code);
                        break;
                    }
                }
            }
            translate.use(scope.optlang.code);
            localStorageService.addToLocalStorage('Language', scope.optlang);

            scope.isActive = function (route) {
                if (route == 'clients') {
                    var temp = ['/clients', '/groups', '/centers'];
                    for (var i in temp) {
                        if (temp[i] == location.path()) {
                            return true;
                        }
                    }
                }
                else if (route == 'acc') {
                    var temp1 = ['/accounting', '/freqposting', '/accounting_coa', '/journalentry', '/accounts_closure', '/Searchtransaction', '/accounting_rules'];
                    for (var i in temp1) {
                        if (temp1[i] == location.path()) {
                            return true;
                        }
                    }
                }
                else if (route == 'rep') {
                    var temp2 = ['/reports/all', '/reports/clients', '/reports/loans', '/reports/funds', '/reports/accounting', 'reports/savings'];
                    for (var i in temp2) {
                        if (temp2[i] == location.path()) {
                            return true;
                        }
                    }
                }
                else if (route == 'admin') {
                    var temp3 = ['/users/', '/organization', '/system', '/products', '/global'];
                    for (var i in temp3) {
                        if (temp3[i] == location.path()) {
                            return true;
                        }
                    }
                }
                else {
                    var active = route === location.path();
                    return active;
                }
            };

            keyboardManager.bind('ctrl+shift+n', function () {
                location.path('/nav/offices');
            });
            keyboardManager.bind('ctrl+shift+i', function () {
                location.path('/tasks');
            });
            keyboardManager.bind('ctrl+shift+o', function () {
                location.path('/entercollectionsheet');
            });
            keyboardManager.bind('ctrl+shift+c', function () {
                location.path('/createclient');
            });
            keyboardManager.bind('ctrl+shift+g', function () {
                location.path('/creategroup');
            });
            keyboardManager.bind('ctrl+shift+q', function () {
                location.path('/createcenter');
            });
            keyboardManager.bind('ctrl+shift+f', function () {
                location.path('/freqposting');
            });
            keyboardManager.bind('ctrl+shift+e', function () {
                location.path('/accounts_closure');
            });
            keyboardManager.bind('ctrl+shift+j', function () {
                location.path('/journalentry');
            });
            keyboardManager.bind('ctrl+shift+a', function () {
                location.path('/accounting');
            });
            keyboardManager.bind('ctrl+shift+r', function () {
                location.path('/reports/all');
            });
            keyboardManager.bind('ctrl+s', function () {
                document.getElementById('save').click();
            });
            keyboardManager.bind('ctrl+r', function () {
                document.getElementById('run').click();
            });
            keyboardManager.bind('ctrl+shift+x', function () {
                document.getElementById('cancel').click();
            });
            keyboardManager.bind('ctrl+shift+l', function () {
                document.getElementById('logout').click();
            });
            keyboardManager.bind('alt+x', function () {
                document.getElementById('search').focus();
            });
            keyboardManager.bind('ctrl+shift+h', function () {
                document.getElementById('help').click();
            });
            keyboardManager.bind('ctrl+n', function () {
                document.getElementById('next').click();
            });
            keyboardManager.bind('ctrl+p', function () {
                document.getElementById('prev').click();
            });
            scope.changeLang = function (langCode) {
                if (langCode) {
                    for (var i = 0; i < scope.langs.length; i++) {
                        if (scope.langs[i].code === langCode) {
                            scope.optlang = scope.langs[i];
                            localStorageService.addToLocalStorage('Language', scope.optlang);
                            tmhDynamicLocale.set(scope.langs[i].code);
                            translate.use(scope.optlang.code);
                            break;
                        }
                    }
                }
            };

            scope.showSearchBar = function(toggleSearch) {
                scope.toggleSearch = toggleSearch;
                scope.searchText = ""; 
            };

            scope.helpf = function () {
                // first, create addresses array
                var addresses = ["https://mifosforge.jira.com/wiki/display/docs/User+Setup", "https://mifosforge.jira.com/wiki/display/docs/Organization",
                    "https://mifosforge.jira.com/wiki/display/docs/System", "https://mifosforge.jira.com/wiki/dosearchsite.action?queryString=products&startIndex=0&where=docs",
                    "https://mifosforge.jira.com/wiki/pages/viewpage.action?pageId=67141762", "https://mifosforge.jira.com/wiki/dosearchsite.action?queryString=report&startIndex=0&where=docs",
                    "https://mifosforge.jira.com/wiki/dosearchsite.action?queryString=accounting&startIndex=0&where=docs", "https://mifosforge.jira.com/wiki/display/docs/Manage+Clients",
                    "https://mifosforge.jira.com/wiki/display/docs/Manage+Groups", "https://mifosforge.jira.com/wiki/display/docs/Manage+Centers",
                    "https://mifosforge.jira.com/wiki/display/docs/User+Manual", "https://mifosforge.jira.com/wiki/display/docs/Manage+Offices",
                    "https://mifosforge.jira.com/wiki/display/docs/Manage+Holidays", "https://mifosforge.jira.com/wiki/display/docs/Manage+Employees",
                    "https://mifosforge.jira.com/wiki/display/docs/Manage+Funds", "https://mifosforge.jira.com/wiki/display/docs/Bulk+Loan+Reassignment",
                    "https://mifosforge.jira.com/wiki/display/docs/Currency+Configuration", "https://mifosforge.jira.com/wiki/display/docs/Standing+Instructions+History",
                    "https://mifosforge.jira.com/wiki/display/docs/Manage+Data+Tables", "https://mifosforge.jira.com/wiki/pages/viewpage.action?pageId=67895350",
                    "https://mifosforge.jira.com/wiki/display/docs/Manage+Roles+and+Permissions", "https://mifosforge.jira.com/wiki/display/docs/Maker-Checker",
                    "https://mifosforge.jira.com/wiki/display/docs/Manage+Hooks", "https://mifosforge.jira.com/wiki/display/docs/Audit+Trails",
                    "https://mifosforge.jira.com/wiki/display/docs/Manage+Reports", "https://mifosforge.jira.com/wiki/display/docs/Manage+Scheduler+Jobs",
                    "https://mifosforge.jira.com/wiki/display/docs/Global+Configuration", "https://mifosforge.jira.com/wiki/dosearchsite.action?queryString=account%20number%20preferences&startIndex=0&where=docs",
                    "https://mifosforge.jira.com/wiki/dosearchsite.action?queryString=loan%20products&startIndex=0&where=docs", "https://mifosforge.jira.com/wiki/dosearchsite.action?queryString=saving%20products&startIndex=0&where=docs",
                    "https://mifosforge.jira.com/wiki/dosearchsite.action?queryString=charges&startIndex=0&where=docs", "https://mifosforge.jira.com/wiki/dosearchsite.action?queryString=products%20mix&startIndex=0&where=docs",
                    "https://mifosforge.jira.com/wiki/dosearchsite.action?queryString=fixed%20deposit%20products&startIndex=0&where=docs", "https://mifosforge.jira.com/wiki/dosearchsite.action?queryString=recurring%20deposit%20products&startIndex=0&where=docs",
                    "https://mifosforge.jira.com/wiki/pages/viewpage.action?pageId=67895308", "https://mifosforge.jira.com/wiki/display/docs/Add+Journal+Entries",
                    "https://mifosforge.jira.com/wiki/dosearchsite.action?queryString=search%20journal%20entries&startIndex=0&where=docs", "https://mifosforge.jira.com/wiki/dosearchsite.action?queryString=accounts%20linked&startIndex=0&where=docs",
                    "https://mifosforge.jira.com/wiki/display/docs/Chart+of+Accounts+and+General+Ledger+Setup", "https://mifosforge.jira.com/wiki/display/docs/Closing+Entries",
                    "https://mifosforge.jira.com/wiki/pages/viewpage.action?pageId=67895308", "https://mifosforge.jira.com/wiki/display/docs/Accruals"];
                // array is huge, but working good
                // create second array with address models
                var addrmodels = ['/users/', '/organization', '/system', '/products', '/templates', '', '/accounting',
                    '/clients', '/groups', '/centers', '', '/offices', '/holidays', '/employees', '/funds/',
                    '/bulkloan', '/currconfig', '/standinginstructions/history', '/datatables', '/codes', '/admin/roles',
                    '/admin/viewmctasks', '/hooks', '/audit', '/reports', '/jobs', '/global', '/accountnumberpreferences', '/loanproducts',
                    '/savingproducts', '/charges', '/productmix', '/fixeddepositproducts', '/recurringdepositproducts', '/freqposting',
                    '/journalentry', '/searchtransaction', '/financialactivityaccountmappings', '/accounting_coa', '/accounts_closure', '/accounting_rules', '/run_periodic_accrual'];
                // * text-based address-recognize system *
                var actualadr = location.absUrl();  // get full URL
                var lastchar = 0;
                for (var i = 0; i < actualadr.length; i++) {
                    if (actualadr.charAt(i) == '#') {
                        lastchar = i + 1;
                        break;
                        // found '#' and save position of it
                    }
                }//for

                var whereweare = actualadr.substring(lastchar); // cut full URL to after-'#' part

                // string after '#' is compared with model
                var addrfound = false;
                if (whereweare == '/reports/all' || whereweare == '/reports/clients' || whereweare == '/reports/loans' || whereweare == '/reports/savings' || whereweare == '/reports/funds' || whereweare == '/reports/accounting' || whereweare == '/xbrl') {
                    window.open(addresses[5]);
                    addrfound = true;
                } else {
                    for (var i = 0; i < addrmodels.length; i++) {
                        if (i != 5 && i != 10) {
                            if (whereweare == addrmodels[i]) {
                                addrfound = true;
                                window.open(addresses[i]);
                                break;
                            }
                        }
                    }//for
                }//else
                if (addrfound == false) window.open(addresses[10]); // substring not matching to any model -> open start user manual page

            };//helpf

            //hides loader
            scope.domReady = true;

            sessionManager.restore(function (session) {
                scope.currentSession = session;
                scope.start(scope.currentSession);
                if (session.user != null && session.user.userPermissions) {
                    $rootScope.setPermissions(session.user.userPermissions);
                    localStorageService.addToLocalStorage('userPermissions', session.user.userPermissions);
                }
            });
        }
    });
    mifosX.ng.application.controller('MainController', [
        '$scope',
        '$location',
        'SessionManager',
        '$translate',
        '$rootScope',
        'localStorageService',
        'keyboardManager', 'Idle',
        'tmhDynamicLocale',
        '$http',
        mifosX.controllers.MainController
    ]).run(function ($log) {
        $log.info("MainController initialized");
    });
}(mifosX.controllers || {}));
