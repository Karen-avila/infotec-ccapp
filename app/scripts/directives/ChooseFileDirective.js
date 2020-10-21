(function (module) {
    mifosX.directives = _.extend(module, {
        ChooseFileDirective: function () {
            return {
                link: function (scope, elem, attrs) {
                  var button = elem.find('button');
                  var input = angular.element(elem[0].querySelector('input#fileInput'));
                  button.bind('click', function() {
                    input[0].click();
                  });
                  input.bind('change', function(e) {
                    scope.$apply(function() {
                      var files = e.target.files;
                      if (files[0]) {
                        scope.fileName = files[0].name;
                      } else {
                        scope.fileName = null;
                      }
                    });
                  });
                }
            }
        }
    });
}(mifosX.directives || {}));

mifosX.ng.application.directive("chooseFile", ['$parse', mifosX.directives.ChooseFileDirective]).run(function ($log) {
  $log.info("ChooseFileDirective initialized");
});
