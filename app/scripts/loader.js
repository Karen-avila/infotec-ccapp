(function () {
    require.config({
        paths: {
            'jquery': '../bower_components/jquery/dist/jquery',
            'microplugin':'../bower_components/microplugin/src/microplugin',
            'sifter':'../bower_components/sifter/sifter.min',
            'selectize':'../bower_components/selectize/dist/js/standalone/selectize.min',
            'angular': '../bower_components/angular/angular',
            'angular-resource': '../bower_components/angular-resource/angular-resource',
            'angular-route': '../bower_components/angular-route/angular-route',
            'angular-translate': '../bower_components/angular-translate/angular-translate',
            'angular-translate-loader-static-files': '../bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files',
            'angular-aria': '../bower_components/angular-aria/angular-aria.min',
            'angular-mocks': '../bower_components/angular-mocks/angular-mocks',
            'angular-material': '../bower_components/angular-material/angular-material.min',
            'md.data.table': '../bower_components/angular-material-data-table/dist/md-data-table.min',
            'angular-loading-bar': '../bower_components/angular-loading-bar/build/loading-bar.min',
            'angularui': '../bower_components/angular-bootstrap/ui-bootstrap',
            'angularuitpls': '../bower_components/angular-bootstrap/ui-bootstrap-tpls',
            'bootstrap': '../bower_components/bootstrap-sass/assets/javascripts/bootstrap.min',
            'chosen': '../bower_components/angular-bootstrap/ui-bootstrap-csp.css',
            'bootstrap-csp': '../bower_components/angular-bootstrap/ui-bootstrap-csp.css',
            'underscore': '../bower_components/underscore/underscore',
            'webstorage': '../bower_components/angular-webstorage/angular-webstorage',
            'pdfMake': '../bower_components/pdfmake/build/pdfmake',
            'vfs_fonts': '../bower_components/pdfmake/build/vfs_fonts',
            'angular-animate': '../bower_components/angular-animate/angular-animate',
            'angular-touch': '../bower_components/angular-touch/angular-touch',
            'require-css': '../bower_components/require-css/css',
            'lodash': '../bower_components/lodash/dist/lodash.min',
            'd3': '../bower_components/d3/d3.min',
            'nvd3': '../bower_components/nvd3/build/nv.d3.min',
            'nvd3ChartDirectives': '../scripts/modules/angularjs-nvd3-directives',
            'styles': '../styles',
            'test': '../../test/functional',
            'notificationWidget': '../scripts/modules/notificationWidget',
            'configurations': '../scripts/modules/configurations',
            'angularFileUpload': '../bower_components/angularjs-file-upload/ng-file-upload',
            'angularFileUploadShim': '../bower_components/angularjs-file-upload/ng-file-upload-shim.min',
            'ngSanitize': '../bower_components/angular-sanitize/angular-sanitize',
            'ckEditor': '../bower_components/ckeditor/ckeditor',
            'ngIdle': '../bower_components/ng-idle/angular-idle',
            'LocalStorageModule': '../scripts/modules/localstorage',
            'ngCsv': "../scripts/modules/csv",
            'chosen.jquery.min': "../scripts/modules/chosen.jquery.min",
            'frAngular': '../scripts/modules/KeyboardManager',
            'httpErrorHandler': '../scripts/modules/httpErrorHandler',
            'modified.datepicker': '../scripts/modules/datepicker',
            'Q': '../bower_components/q/q',
            'tmh.dynamicLocale': '../bower_components/angular-dynamic-locale/tmhDynamicLocale.min',
            'angular-wizard': '../scripts/modules/angular-wizard',
            'webcam-directive':'../bower_components/webcam-directive/dist/webcam.min',
            'angular-utils-pagination':'../bower_components/angular-utils-pagination/dirPagination',
            'ng-scrollbar':'../bower_components/ng-scrollbar/dist/ng-scrollbar',
            'ng-scrollbar-css':'../bower_components/ng-scrollbar/dist/ng-scrollbar.css',
            'styles-css': '../styles/styles.css',
            'ui-config': '../scripts/config/UIconfig.json',
            'moment': '../bower_components/moment/min/moment-with-locales.min',
            'pdf': '../bower_components/pdfjs/src/pdf',
            'CURPUtils': '../scripts/js/CURPUtils',
            'RFCUtils': '../scripts/js/RFCUtils'
        },
        shim: {
            'selectize': {deps: ['jquery', 'microplugin', 'sifter']},
            'angular': { deps: ['jquery','chosen.jquery.min'],exports: 'angular' },
            'angular-resource': { deps: ['angular'] },
            'angular-aria': { deps: ['angular'] },
            'angular-route': { deps: ['angular'] },
            'angular-translate': { deps: ['angular'] },
            'angular-translate-loader-static-files': {deps: ['angular' , 'angular-translate'] },
            'angular-touch': {deps: ['angular']},
            'angular-animate': {deps: ['angular']},
            'angular-material': { deps: ['angular','angular-animate'] },
            'md.data.table': { deps: ['angular','angular-material'] },
            'angularui': { deps: ['angular', 'angular-touch', 'angular-animate'] },
            'angularuitpls': { deps: ['angular' , 'angularui' ] },
            'angular-mocks': { deps: ['angular'] },
            'angular-loading-bar': { deps: ['angular'] },
            'bootstrap' : {deps:['jquery']},
            'Q': {deps: ['angular']},
            'ngSanitize': {deps: ['angular', 'Q'], exports: 'ngSanitize'},
            'webstorage': { deps: ['angular'] },
            'lodash': { deps: ['angular'] },
            'pdfMake': { deps: ['angular'] },
            'vfs_fonts': { deps: ['angular', 'pdfMake'] },
            'd3': {deps: ['angular'], exports: 'd3'},
            'nvd3': { deps: ['angular', 'd3']},
            'nvd3ChartDirectives': {deps: ['angular', 'nvd3']},
            'configurations': {deps: ['angular']},
            'notificationWidget': {deps: ['angular', 'jquery'], exports: 'notificationWidget'},
            'angularFileUpload': {deps: ['angular', 'jquery', 'angularFileUploadShim'], exports: 'angularFileUpload'},
            'ckEditor': {deps: ['jquery']},
            'ngIdle': {deps: ['angular']},
            'LocalStorageModule': {deps: ['angular']},
            'ngCsv': {deps: ['angular']},
            'chosen.jquery.min': {deps: ['jquery']},
            'frAngular': {deps: ['angular']},
            'httpErrorHandler': {deps: ['angular']},
            'modified.datepicker': {deps: ['angular']},
            'tmh.dynamicLocale': {deps: ['angular']},
            'webcam-directive': {deps: ['angular']},
            'angular-wizard': {deps: ['angular', 'underscore']},
            'angular-utils-pagination': {deps: ['angular']},
            'ng-scrollbar': {deps: ['angular']},
            'pdf': {deps: ['angular']},
            'moment': {deps: ['angular'], exports: 'moment'},
            'CURPUtils': {deps: ['moment']},
            'RFCUtils': {deps: ['moment']},
            'mifosX': {
                deps: [
                    'jquery',
                    'microplugin',
                    'sifter',
                    'selectize',
                    'angular',
                    'angular-resource',
                    'angular-aria',
                    'angular-route',
                    'angular-translate',
                    'angular-translate-loader-static-files',
                    'angular-animate',
                    'angular-material',
                    'md.data.table',
                    'angular-touch',
                    'angular-loading-bar',
                    'angularui',
                    'angularuitpls',
                    'webstorage',
                    'pdfMake',
                    'lodash',
                    'vfs_fonts',
                    'nvd3ChartDirectives',
                    'notificationWidget',
                    'angularFileUpload',
                    'modified.datepicker',
                    'ngSanitize',
                    'ckEditor',
                    'ngIdle',
                    'configurations',
                    'LocalStorageModule',
                    'angularFileUploadShim',
                    'ngCsv',
                    'chosen.jquery.min',
                    'frAngular',
                    'httpErrorHandler',
                    'Q',
                    'tmh.dynamicLocale',
                    'webcam-directive',
                    'angular-wizard',
                    'angular-utils-pagination',
                    'ng-scrollbar',
                    'moment',
                    'pdf',
                    'CURPUtils',
                    'RFCUtils'
                ],
                exports: 'mifosX'
            }
        },
        packages: [
            {
                name: 'css',
                location: '../bower_components/require-css',
                main: 'css'
            }
        ]
    });

    require(['mifosXComponents'], function (componentsInit) {
        componentsInit().then(function(){
            require(['test/testInitializer'], function (testMode) {
                if (!testMode) {
                    angular.bootstrap(document, ['MifosX_Application']);
                }
            });
        });
    });
}());
