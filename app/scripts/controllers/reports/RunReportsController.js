(function (module) {
  mifosX.controllers = _.extend(module, {

      RunReportsController: function (scope, routeParams, resourceFactory, dateFilter, http, API_VERSION, $rootScope, $sce, MIN_DATEPICKER, MAX_DATEPICKER) {
          scope.isCollapsed = false; //displays options div on startup
          scope.hideTable = true; //hides the results div on startup
          scope.hidePentahoReport = true; //hides the results div on startup
          scope.hideChart = true;
          scope.piechart = false;
          scope.barchart = false;
          scope.formData = {};
          scope.reportParams = new Array();
          scope.reportDateParams = new Array();
          scope.reqFields = new Array();
          scope.reportTextParams = new Array();
          scope.reportData = {
            columnHeaders: [],
            data: []
          };
          scope.baseURL = "";
          scope.csvData = [];
          scope.row = [];
          scope.reportDescription = routeParams.description;
          scope.reportName = routeParams.name;
          scope.reportType = routeParams.type;
          scope.reportId = routeParams.reportId;
          scope.pentahoReportParameters = [];
          scope.type = "pie";
          scope.decimals = [0, 1, 2, 3, 4];
          scope.delimiters = [
            { value: "colon", label: "colon", char: "," },
            { value: "semicolon", label: "semicolon", char: ";" },
            { value: "pipe", label: "pipe", char: "|" },
          ];
          scope.delimiterChoice = ",";
          scope.formats = [
            { value: "HTML", label: "showreport", contentType: "text/html" },
            { value: "XLS", label: "exportexcel", contentType: "application/vnd.ms-excel" },
            { value: "XLSX", label: "exportexcel2", contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
            { value: "CSV", label: "exportcsv", contentType: "text/csv" },
            { value: "PDF", label: "pdfformat", contentType: "application/pdf" },
          ];
          scope.minDate = new Date(MIN_DATEPICKER);
          scope.maxDate = new Date(MAX_DATEPICKER);

          scope.highlight = function (id) {
              var i = document.getElementById(id);
              if (i.className == 'selected-row') {
                  i.className = 'text-pointer';
              } else {
                  i.className = 'selected-row';
              }
          };
          if (scope.reportType == 'Pentaho') {
              scope.formData.outputType = 'HTML';
          };

          resourceFactory.runReportsResource.getReport({reportSource: 'FullParameterList', parameterType: true, 
            R_reportListing: "'" + routeParams.name + "'"}, function (data) {
              for (var i in data.data) {
                  var temp = {
                      name: data.data[i].rows[0].value,
                      variable: data.data[i].rows[1].value,
                      label: data.data[i].rows[2].value,
                      displayType: data.data[i].rows[3].value,
                      formatType: data.data[i].rows[4].value,
                      defaultVal: data.data[i].rows[5].value,
                      selectOne: data.data[i].rows[6].value,
                      selectAll: data.data[i].rows[7].value,
                      parentParameterName: data.data[i].rows[8].value,
                      inputName: "R_" + data.data[i].rows[1].value //model name
                  };
                  scope.reqFields.push(temp);
                  if (temp.displayType == 'select') {
                      intializeParams(temp, {});
                  } else if (temp.displayType == 'date') {
                      scope.reportDateParams.push(temp);
                      scope.formData[temp.inputName] = new Date();
                  } else if (temp.displayType == 'text') {
                      scope.reportTextParams.push(temp);
                  }
              }
          });

          if (scope.reportType == "Pentaho" || scope.reportType == "Jasper") {
            resourceFactory.reportsResource.get({id: scope.reportId, fields: 'reportParameters'}, function (data) {
                scope.pentahoReportParameters = data.reportParameters || [];
            });
          }
    
          function getSuccuessFunction(paramData) {
              var successFunction = function (data) {
                  var selectData = [];
                  var isExistedRecord = false;
                  for (var i in data.data) {
                      selectData.push({id: data.data[i].rows[0].value, name: data.data[i].rows[1].value});
                  }
                  for (var j in scope.reportParams) {
                      if (scope.reportParams[j].name == paramData.name) {
                          scope.reportParams[j].selectOptions = selectData;
                          isExistedRecord = true;
                      }
                  }
                  if (!isExistedRecord) {
                      if(paramData.selectAll == 'Y'){
                          selectData.push({id: "-1", name: "All"});
                      }
                      paramData.selectOptions = selectData;
                      scope.reportParams.push(paramData);
                  }
              };
              return successFunction;
          }

          function intializeParams(paramData, params) {
              scope.errorStatus = undefined;
              scope.errorDetails = [];
              params.reportSource = paramData.name;
              params.parameterType = true;
              var successFunction = getSuccuessFunction(paramData);
              resourceFactory.runReportsResource.getReport(params, successFunction);
          }

          function getContenType(outputType) {
            var contentType = "text/html";
            for (var i=0; i<scope.formats.length; i++) {
                const item = scope.formats[i];
                if (item.value === outputType) {
                    contentType = item.contentType;
                    break;
                }
            }
            return contentType;
          }

          scope.getDependencies = function (paramData) {
              for (var i = 0; i < scope.reqFields.length; i++) {
                  var temp = scope.reqFields[i];
                  if (temp.parentParameterName == paramData.name) {
                      if (temp.displayType == 'select') {
                          var parentParamValue = this.formData[paramData.inputName];
                          if (parentParamValue != undefined) {
                              eval("var params={};params." + paramData.inputName + "='" + parentParamValue + "';");
                              intializeParams(temp, params);
                          }
                      } else if (temp.displayType == 'date') {
                          scope.reportDateParams.push(temp);
                      }
                  }
              }
          };

          scope.checkStatus = function () {
              var collapsed = false;
              if (scope.isCollapsed) {
                  collapsed = true;
              }
              return collapsed;
          };

          function invalidDate(checkDate) {
              // validates for yyyy-mm-dd returns true if invalid, false is valid
              var dateformat = /^\d{4}(\-|\/|\.)\d{1,2}\1\d{1,2}$/;

              if (!(dateformat.test(checkDate))) {
                  return true;
              } else {
                  var dyear = checkDate.substring(0, 4);
                  var dmonth = checkDate.substring(5, 7) - 1;
                  var dday = checkDate.substring(8);

                  var newDate = new Date(dyear, dmonth, dday);
                  return !((dday == newDate.getDate()) && (dmonth == newDate.getMonth()) && (dyear == newDate.getFullYear()));
              }
          }

          function removeErrors() {
              var $inputs = $(':input');
              $inputs.each(function () {
                  $(this).removeClass("validationerror");
              });
          }

          function parameterValidationErrors() {
              var tmpStartDate = "";
              var tmpEndDate = "";
              scope.errorDetails = [];
              for (var i in scope.reqFields) {
                  var paramDetails = scope.reqFields[i];
                  switch (paramDetails.displayType) {
                      case "select":
                          var selectedVal = scope.formData[paramDetails.inputName];
                          if (selectedVal == undefined || selectedVal == 0) {
                              var fieldId = '#' + paramDetails.inputName;
                              $(fieldId).addClass("validationerror");
                              var errorObj = new Object();
                              errorObj.field = paramDetails.inputName;
                              errorObj.code = 'error.message.report.parameter.required';
                              errorObj.args = {params: []};
                              errorObj.args.params.push({value: paramDetails.label});
                              scope.errorDetails.push(errorObj);
                          }
                          break;
                      case "date":
                          var tmpDate = scope.formData[paramDetails.inputName];
                          if (tmpDate == undefined || !(tmpDate > "")) {
                              var fieldId = '#' + paramDetails.inputName;
                              $(fieldId).addClass("validationerror");
                              var errorObj = new Object();
                              errorObj.field = paramDetails.inputName;
                              errorObj.code = 'error.message.report.parameter.required';
                              errorObj.args = {params: []};
                              errorObj.args.params.push({value: paramDetails.label});
                              scope.errorDetails.push(errorObj);
                          }
                          if (tmpDate && invalidDate(tmpDate) == true) {
                              var fieldId = '#' + paramDetails.inputName;
                              $(fieldId).addClass("validationerror");
                              var errorObj = new Object();
                              errorObj.field = paramDetails.inputName;
                              errorObj.code = 'error.message.report.invalid.value.for.parameter';
                              errorObj.args = {params: []};
                              errorObj.args.params.push({value: paramDetails.label});
                              scope.errorDetails.push(errorObj);
                          }

                          if (paramDetails.variable == "startDate") tmpStartDate = tmpDate;
                          if (paramDetails.variable == "endDate") tmpEndDate = tmpDate;
                          break;
                      case "text":
                          var selectedVal = scope.formData[paramDetails.inputName];
                          if (selectedVal == undefined || selectedVal == 0) {
                              var fieldId = '#' + paramDetails.inputName;
                              $(fieldId).addClass("validationerror");
                              var errorObj = new Object();
                              errorObj.field = paramDetails.inputName;
                              errorObj.code = 'error.message.report.parameter.required';
                              errorObj.args = {params: []};
                              errorObj.args.params.push({value: paramDetails.label});
                              scope.errorDetails.push(errorObj);
                          }
                          break;
                      default:
                          var errorObj = new Object();
                          errorObj.field = paramDetails.inputName;
                          errorObj.code = 'error.message.report.parameter.invalid';
                          errorObj.args = {params: []};
                          errorObj.args.params.push({value: paramDetails.label});
                          scope.errorDetails.push(errorObj);
                          break;
                  }
              }

              if (tmpStartDate > "" && tmpEndDate > "") {
                  if (tmpStartDate > tmpEndDate) {
                      var errorObj = new Object();
                      errorObj.field = paramDetails.inputName;
                      errorObj.code = 'error.message.report.incorrect.values.for.date.fields';
                      errorObj.args = {params: []};
                      errorObj.args.params.push({value: paramDetails.label});
                      scope.errorDetails.push(errorObj);
                  }
              }
          }

          function buildReportParms() {
              var paramCount = 1;
              var reportParams = "";
              for (var i = 0; i < scope.reqFields.length; i++) {
                  var reqField = scope.reqFields[i];
                  for (var j = 0; j < scope.pentahoReportParameters.length; j++) {
                      var tempParam = scope.pentahoReportParameters[j];
                      if (reqField.name == tempParam.parameterName) {
                          var paramName = "R_" + tempParam.reportParameterName;
                          if (paramCount > 1) reportParams += "&"
                          reportParams += encodeURIComponent(paramName) + "=" + encodeURIComponent(scope.formData[scope.reqFields[i].inputName]);
                          paramCount = paramCount + 1;
                      }
                  }
              }
              return reportParams;
          }

          scope.xFunction = function () {
              return function (d) {
                  return d.key;
              };
          };
          scope.yFunction = function () {
              return function (d) {
                  return d.values;
              };
          };
          scope.setTypePie = function () {
              if (scope.type == 'bar') {
                  scope.type = 'pie';
              }
          };
          scope.setTypeBar = function () {
              if (scope.type == 'pie') {
                  scope.type = 'bar';
              }
          };
          scope.colorFunctionPie = function () {
              return function (d, i) {
                  return colorArrayPie[i];
              };
          };
          scope.isDecimal = function(index){
              if(scope.reportData.columnHeaders && scope.reportData.columnHeaders.length > 0){
                  for(var i=0; i<scope.reportData.columnHeaders.length; i++){
                      if(scope.reportData.columnHeaders[index].columnType == 'DECIMAL'){
                          return true;
                      }
                  }
              }
              return false;
          };

          scope.getDelimiter = function(delChar) {
            for (var delimiter in scope.delimiters) {
                if (delimiter.char == delChar) {
                    return delimiter.value;
                }
            }
            return ",";
          }

          scope.runReport = function () {
              //clear the previous errors
              scope.errorDetails = [];
              removeErrors();

              //update date fields with proper dateformat
              for (var i in scope.reportDateParams) {
                  if (scope.formData[scope.reportDateParams[i].inputName]) {
                      scope.formData[scope.reportDateParams[i].inputName] = dateFilter(scope.formData[scope.reportDateParams[i].inputName], 'yyyy-MM-dd');
                  }
              }
  
              //Custom validation for report parameters
              parameterValidationErrors();
              if (scope.errorDetails.length == 0) {
                  scope.isCollapsed = true;
                  switch (scope.reportType) {
                      case "Table":
                      case "SMS":
                          scope.hideTable = false;
                          scope.hidePentahoReport = true;
                          scope.hideChart = true;
                          scope.formData.reportSource = scope.reportName;
                          scope.formData['R_delimiter'] = scope.getDelimiter(scope.delimiterChoice);
                          resourceFactory.runReportsResource.getReport(scope.formData, function (data) {
                              //clear the csvData array for each request
                              scope.csvData = [];
                              scope.reportData.columnHeaders = data.columnHeaders;
                              scope.reportData.data = data.data;
                              for (var i in data.columnHeaders) {
                                  scope.row.push(data.columnHeaders[i].columnName);
                              }
                              scope.csvData.push(scope.row);
                              for (var k in data.data) {
                                  const rows = data.data[k].rows;
                                  var items = [];
                                  for (var l in rows) {
                                      items.push(rows[l].value);
                                  }
                                  scope.csvData.push(items.join(scope.delimiterChoice));
                              }
                          });
                          break;

                      case "Pentaho":
                          scope.hideTable = true;
                          scope.hidePentahoReport = false;
                          scope.hideChart = true;

                          var reportURL = $rootScope.hostUrl + API_VERSION + "/runreports/" + encodeURIComponent(scope.reportName);
                          reportURL += "?output-type=" + encodeURIComponent(scope.formData.outputType) + "&tenantIdentifier=" + $rootScope.tenantIdentifier + "&locale=" + scope.optlang.code + "&dateFormat=" + scope.df;

                          var inQueryParameters = buildReportParms();
                          if (inQueryParameters > "") reportURL += "&" + inQueryParameters;

                          // Allow untrusted urls for the ajax request.
                          // http://docs.angularjs.org/error/$sce/insecurl
                          reportURL = $sce.trustAsResourceUrl(reportURL);
                          reportURL = $sce.valueOf(reportURL);
                          var config = { responseType: 'arraybuffer' };
                          http.get(reportURL, config).
                            then(function onSuccess(response) {
                                scope.contentType = getContenType(scope.formData.outputType);
                                var file = new Blob([response.data], {type: scope.contentType});
                                var fileContent = URL.createObjectURL(file);
                                // Pass the form data to the iframe as a data url.
                                scope.baseURL = $sce.trustAsResourceUrl(fileContent);
                            });
                          break;
                      case "Chart":
                          scope.hideTable = true;
                          scope.hidePentahoReport = true;
                          scope.hideChart = false;
                          scope.formData.reportSource = scope.reportName;
                          resourceFactory.runReportsResource.getReport(scope.formData, function (data) {
                              scope.reportData.columnHeaders = data.columnHeaderData;
                              scope.reportData.data = data.data;
                              scope.chartData = [];
                              scope.barData = [];
                              var l = data.data.length;
                              for (var i = 0; i < l; i++) {
                                  scope.row = {};
                                  scope.row.key = data.data[i].rows[0];
                                  scope.row.values = data.data[i].rows[1];
                                  scope.chartData.push(scope.row);
                              }
                              var x = {};
                              x.key = "summary";
                              x.values = [];
                              for (var m = 0; m < l; m++) {
                                  var inner = [data.data[m].rows[0], data.data[m].rows[1]];
                                  x.values.push(inner);
                              }
                              scope.barData.push(x);
                          });
                          break;
                      default:
                          var errorObj = new Object();
                          errorObj.field = scope.reportType;
                          errorObj.code = 'error.message.report.type.is.invalid';
                          errorObj.args = {params: []};
                          errorObj.args.params.push({value: scope.reportType});
                          scope.errorDetails.push(errorObj);
                          break;
                  }
              }
          };
      }
  });
  mifosX.ng.application.controller('RunReportsController', ['$scope', '$routeParams', 'ResourceFactory', 'dateFilter', '$http', 'API_VERSION', '$rootScope', '$sce', 'MIN_DATEPICKER', 'MAX_DATEPICKER', mifosX.controllers.RunReportsController]).run(function ($log) {
      $log.info("RunReportsController initialized");
  });
}(mifosX.controllers || {}));