(function (module) {
    mifosX.directives = _.extend(module, {
        D3GraphDirective: function () {
            return {
                restrict: 'E',
                replace: true,
                scope: { val: '=' },
                template: '<div id="bar-graph"></div>',
                link: function (scope, element, attrs) {
                    var d3 = require("d3");
                    var svg = d3.select('#bar-graph').append('svg');
                    var margin = { top: 20, right: 20, bottom: 30, left: 40 };
                    var width = +svg.attr("width") - margin.left - margin.right;
                    var height = +svg.attr("height") - margin.top - margin.bottom;
                    var g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                    // set x scale
                    var x = d3.scaleBand()
                        .rangeRound([0, width])
                        .paddingInner(0.05)
                        .align(0.1);

                    // set y scale
                    var y = d3.scaleLinear()
                        .rangeRound([height, 0]);

                    // set the colors
                    var z = d3.scaleOrdinal().range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

                    var rawData = [];
                    var columns = scope.$parent.graphData[0];
                    var keys = columns.slice(1);
                    for (var i=1; i<scope.$parent.graphData.length; i++) {
                        var row = scope.$parent.graphData[i];
                        var item = {};
                        for (var j=0; j<columns.length; j++) {
                            item[columns[j]] = row[j];
                        }
                        rawData.push(item);
                    }

                    x.domain(rawData.map(function (d) { return d[0]; }));
                    y.domain([0, d3.max(rawData, function (d) { return d.val; })]).nice();
                    z.domain(keys); 

                    g.append("g")
                        .selectAll("g")
                        .data(d3.stack().keys(keys)(rawData))
                        .enter().append("g")
                        .attr("fill", function (d) { return z(d.key); })
                        .selectAll("rect")
                        .data(function (d) { return d; })
                        .enter().append("rect")
                        .attr("x", function (d) { return x(d.data.State); })
                        .attr("y", function (d) { return y(d[1]); })
                        .attr("height", function (d) { return y(d[0]) - y(d[1]); })
                        .attr("width", x.bandwidth())
                        .on("mouseover", function () { tooltip.style("display", null); })
                        .on("mouseout", function () { tooltip.style("display", "none"); })
                        .on("mousemove", function (d) {
                            console.log(d);
                            var xPosition = d3.mouse(this)[0] - 5;
                            var yPosition = d3.mouse(this)[1] - 5;
                            tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
                            tooltip.select("text").text(d[1] - d[0]);
                        });

                    g.append("g")
                        .attr("class", "axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(d3.axisBottom(x));

                    g.append("g")
                        .attr("class", "axis")
                        .call(d3.axisLeft(y).ticks(null, "s"))
                        .append("text")
                        .attr("x", 2)
                        .attr("y", y(y.ticks().pop()) + 0.5)
                        .attr("dy", "0.32em")
                        .attr("fill", "#000")
                        .attr("font-weight", "bold")
                        .attr("text-anchor", "start");

                    var legend = g.append("g")
                        .attr("font-family", "sans-serif")
                        .attr("font-size", 10)
                        .attr("text-anchor", "end")
                        .selectAll("g")
                        .data(keys.slice().reverse())
                        .enter().append("g")
                        .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

                    legend.append("rect")
                        .attr("x", width - 19)
                        .attr("width", 19)
                        .attr("height", 19)
                        .attr("fill", z);

                    legend.append("text")
                        .attr("x", width - 24)
                        .attr("y", 9.5)
                        .attr("dy", "0.32em")
                        .text(function (d) { return d; });

                    // Prep the tooltip bits, initial display is hidden
                    var tooltip = svg.append("g")
                        .attr("class", "tooltip")
                        .style("display", "none");

                    tooltip.append("rect")
                        .attr("width", 60)
                        .attr("height", 20)
                        .attr("fill", "white")
                        .style("opacity", 0.5);

                    tooltip.append("text")
                        .attr("x", 30)
                        .attr("dy", "1.2em")
                        .style("text-anchor", "middle")
                        .attr("font-size", "12px")
                        .attr("font-weight", "bold");
                }
            };
        }
    });
}(mifosX.directives || {}));

mifosX.ng.application.directive("d3Graph", [mifosX.directives.D3GraphDirective]).run(function ($log) {
    $log.info("D3GraphDirective initialized");
});