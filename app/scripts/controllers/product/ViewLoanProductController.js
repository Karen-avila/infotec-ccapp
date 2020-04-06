(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewLoanProductController: function (scope, routeParams, location, anchorScroll, resourceFactory, filter) {
            scope.loanproduct = [];
            scope.isAccountingEnabled = false;
            scope.isAccrualAccountingEnabled = false;
            scope.includeOrderAccounts = false;

            resourceFactory.loanProductResource.get({ loanProductId: routeParams.id, template: 'true' }, function (data) {
                scope.loanproduct = data;
                if (data.accountingRule.id == 2 || data.accountingRule.id == 3 || data.accountingRule.id == 4) {
                    scope.isAccountingEnabled = true;

                    if (scope.loanproduct.accountingMappings.orderInterestAccountId) {
                        scope.includeOrderAccounts = true;
                    }
                }

                if (data.accountingRule.id == 3 || data.accountingRule.id == 4) {
                    scope.isAccrualAccountingEnabled = true;
                }
                if (scope.loanproduct.allowAttributeOverrides != null) {
                    scope.amortization = scope.loanproduct.allowAttributeOverrides.amortizationType;
                    scope.arrearsTolerance = scope.loanproduct.allowAttributeOverrides.inArrearsTolerance;
                    scope.graceOnArrearsAging = scope.loanproduct.allowAttributeOverrides.graceOnArrearsAgeing;
                    scope.interestCalcPeriod = scope.loanproduct.allowAttributeOverrides.interestCalculationPeriodType;
                    scope.interestMethod = scope.loanproduct.allowAttributeOverrides.interestType;
                    scope.graceOnPrincipalAndInterest = scope.loanproduct.allowAttributeOverrides.graceOnPrincipalAndInterestPayment;
                    scope.repaymentFrequency = scope.loanproduct.allowAttributeOverrides.repaymentEvery;
                    scope.transactionProcessingStrategy = scope.loanproduct.allowAttributeOverrides.transactionProcessingStrategyId;
                }
                if (scope.amortization || scope.arrearsTolerance || scope.graceOnArrearsAging ||
                    scope.interestCalcPeriod || scope.interestMethod || scope.graceOnPrincipalAndInterest ||
                    scope.repaymentFrequency || scope.transactionProcessingStrategy == true) {
                    scope.allowAttributeConfiguration = true;
                }
                else {
                    scope.allowAttributeConfiguration = false;
                }

            });

            scope.scrollto = function (link) {
                location.hash(link);
                anchorScroll();
            };

            scope.downloadPDF = function () {
                const loan = scope.loanproduct;
                var dataTable01 = [];
                dataTable01.push([filter('translate')('label.heading.description'), loan.description]);
                dataTable01.push([filter('translate')('label.heading.shortname'), loan.shortName]);
                if (typeof loan.fundName !== 'undefined') {
                    dataTable01.push([filter('translate')('label.heading.fundname'), loan.fundName]);
                } else {
                    dataTable01.push([filter('translate')('label.heading.fundname'), '']);
                }
                if (typeof loan.startDate !== 'undefined') {
                    dataTable01.push([filter('translate')('label.heading.startdate'), filter('DateFormat')(loan.startDate)]);
                } else {
                    dataTable01.push([filter('translate')('label.heading.startdate'), '']);
                }
                if (typeof loan.closeDate !== 'undefined') {
                    dataTable01.push([filter('translate')('label.heading.closedate'), filter('DateFormat')(loan.closeDate)]);
                } else {
                    dataTable01.push([filter('translate')('label.heading.closedate'), '']);
                }
                dataTable01.push([filter('translate')('label.heading.includeborrowercycle'), filter('translate')(loan.includeInBorrowerCycle)]);
                dataTable01.push([filter('translate')('label.heading.currency'), filter('translate')(loan.currency.name)]);
                dataTable01.push([filter('translate')('label.heading.decimalplaces'), loan.currency.decimalPlaces]);
                dataTable01.push([filter('translate')('label.heading.currencyinmultiplesof'), loan.currency.inMultiplesOf]);
                dataTable01.push([filter('translate')('label.input.installmentinmultiplesof'), loan.installmentAmountInMultiplesOf]);                

                var dataTable02 = [];
                dataTable02.push([filter('translate')('label.input.useborrowerloancounter'), filter('translate')(loan.useBorrowerCycle)]);
                dataTable02.push([filter('translate')('label.heading.principal'), 
                    filter('number')(loan.principal) + ' Min: ' + filter('number')(loan.minPrincipal) + ' Max: ' + filter('number')(loan.maxPrincipal)]);
                dataTable02.push([filter('translate')('label.heading.numofrepayments'), 
                    filter('number')(loan.numberOfRepayments) + ' Min: ' + filter('number')(loan.minNumberOfRepayments) + ' Max: ' + filter('number')(loan.maxNumberOfRepayments)]);
                dataTable02.push([filter('translate')('label.input.repayevery'), loan.repaymentEvery + ' ' + filter('translate')(loan.repaymentFrequencyType.value)]);

                var dataTable03 = [];
                dataTable03.push([filter('translate')('label.heading.amortization'), filter('translate')(loan.amortizationType.value)]);
                dataTable03.push([filter('translate')('label.heading.interestmethod'), filter('translate')(loan.interestType.value)]);
                dataTable03.push([filter('translate')('label.heading.isequalamortization'), filter('translate')(loan.isEqualAmortization)]);
                dataTable03.push([filter('translate')('label.heading.interestcalculationperiod'), filter('translate')(loan.interestCalculationPeriodType.value)]);
                dataTable03.push([filter('translate')('label.heading.allowpartialperiodinterestcalcualtion'), filter('translate')(loan.allowPartialPeriodInterestCalcualtion)]);
                dataTable03.push([filter('translate')('label.heading.arrearstolerance'), filter('number')(loan.inArrearsTolerance)]);
                dataTable03.push([filter('translate')('label.heading.repaymentstrategy'), filter('translate')(loan.transactionProcessingStrategyName)]);

                const docDefinition = {
                    header: function () {
                        return [
                            {
                                style: 'table',
                                margin: [62, 35, 62, 35],
                                table: {
                                    widths: ['*', '*'],
                                    headerRows: 0,
                                    body: [
                                        [
                                            { text: loan.name, style: 'topHeader', alignment: 'left' }
                                        ]
                                    ]
                                },
                                layout: 'noBorders'
                            }
                        ]
                    },
                    footer: function (currentPage, pageCount) {
                        return [
                            { text: currentPage.toString(), alignment: 'center', style: 'footer' }
                        ]
                    },
                    content: [
                        {text: loan.name, style: 'header'},
                        {text: filter('translate')('label.heading.details'), style: 'header'},
                        {
                            widths: ['*', '*'],
                            headerRows: 0,
                            table: {
                                widths: [ 'auto', 'auto' ],
                                body: dataTable01
                            }
                        },
                        {text: filter('translate')('label.heading.terms'), style: 'header'},
                        {
                            widths: ['*', '*'],
                            headerRows: 0,
                            table: {
                                widths: [ 'auto', 'auto' ],
                                body: dataTable02
                            }
                        },
                        {text: filter('translate')('label.heading.settings'), style: 'header'},
                        {
                            widths: ['*', '*'],
                            headerRows: 0,
                            table: {
                                widths: [ 'auto', 'auto' ],
                                body: dataTable03
                            }
                        }
                    ],
                    pageSize: 'LETTER',
                    pageMargins: [40, 60, 60, 60],
                    styles: {
                        topHeader: {
                            fontSize: 20,
                            bold: true,
                            margin: [0, 6, 0, 30],
                            alignment: 'left'
                        },
                        table: {
                            fontSize: 8,
                            alignment: 'left',
                            color: 'black',
                            margin: [0, 5, 0, 15]
                        },
                        header: {
                            fontSize: 16,
                            bold: true,
                            margin: [0, 10, 0, 15],
                            alignment: 'left'
                        },
                        footer: {
                            fontSize: 8,
                            margin: [0, 25, 0, 17],
                            alignment: 'center'
                        }
                    }
                };
                pdfMake.createPdf(docDefinition).download(loan.name + '.pdf');
            }
        }
    });
    mifosX.ng.application.controller('ViewLoanProductController', ['$scope', '$routeParams', '$location', '$anchorScroll', 'ResourceFactory', '$filter', mifosX.controllers.ViewLoanProductController]).run(function ($log) {
        $log.info("ViewLoanProductController initialized");
    });
}(mifosX.controllers || {}));
