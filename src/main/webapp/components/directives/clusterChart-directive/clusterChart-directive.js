/**
 * @author Jose A. Dianes <jdianes@ebi.ac.uk>
 *
 * The prc-cluster-chart directive allows us to reuse a chart of cluster everywhere we want to show it (e.g.
 * in the clusterChart-view)
 *
 * NOTE: the Cluster WS uses 0-based paging while the app uses 1-based paging
 *
 */

var clusterChartDirective = angular.module('prideClusterApp.clusterChartDirective', []);

clusterChartDirective.directive('prcClusterChart', function() {

    return {
        restrict: 'E',
        scope: {
            queryTerm: '=query',
            pageNumber: '=page',
            pageSize: '=size'
        },
        controller: 'ClusterChartDirectiveCtrl',
        templateUrl: 'components/directives/clusterChart-directive/clusterChart-directive.html'
    };
});


clusterChartDirective.controller('ClusterChartDirectiveCtrl', ['$scope', '$routeParams', '$location', 'ClusterSummary',
    function($scope, $routeParams, $location, ClusterSummary) {

        function clusterClicked(clusterId) {
            $scope.$apply(function() {$location.path("/cluster/" + clusterId);});
        }

        ClusterSummary.list(
            {
                queryTerm:$scope.queryTerm,
                pageNumber:$scope.pageNumber-1, // transform to 0-based paging
                pageSize:$scope.pageSize,
                modFilters:$scope.modFilters,
                speciesFilters:$scope.speciesFilters
            },
            function(clusters) {

                $scope.totalResults = clusters.totalResults;
                $scope.query = $routeParams.q;
                $scope.pageNumber = $routeParams.page;
                $scope.pageSize = $routeParams.size;
                $scope.numPages = Math.floor($scope.totalResults / $scope.pageSize);
                $scope.modFilters = $routeParams.modFilters;
                $scope.speciesFilters = $routeParams.speciesFilters;

                var pageOffset = ($scope.pageNumber-1) * $scope.pageSize;
                var pageOffsetEnd = pageOffset + parseInt($scope.pageSize);
                nv.addGraph(function() {
                    var chart = nv.models.scatterChart()
                        .showDistX(true)    //showDist, when true, will display those little distribution lines on the axis.
                        .showYAxis(true)
                        .showControls(false)
                        .showLegend(true)
                        .transitionDuration(350)
                        .color(['#5555bb', '#55bb55', '#bb5555'])
                        .sizeRange([10,1000])
                        .forceX([0.0,1.0])
                        .forceY([pageOffset,pageOffsetEnd]);

                    //Configure how the tooltip looks.
                    chart.tooltipYContent(null);
                    chart.tooltipXContent(function(key, x, y) {
                        var item = clusters.pageSize-y;
                        return '<p>Max Ratio ' + x + '</h5>';
                    });
                    chart.tooltipContent(function(key, x, y) {
                        var item = y - pageOffset;
                        return '<h4>'+ clusters.results[item].sequence + '</h4>' +
                        '<h6>'+ clusters.results[item].numberOfSpectra + ' spectra</h6>' +
                        '<h6>Prec. M/Z '+ clusters.results[item].averagePrecursorMz + '</h6>' +
                        '<h6>Prec. Charge '+ clusters.results[item].averagePrecursorCharge + '</h6>';
                    });

                    // click event handling
                    chart.scatter.dispatch.on("elementClick", function(e) {
                        var clusterId = clusters.results[e.point.y - pageOffset].id;
                        clusterClicked(clusterId);
                    });

                    //Axis settings
                    chart.xAxis.tickFormat(d3.format('.02f'));
                    chart.xAxis.axisLabel("Max. Peptide Ratio");
                    chart.xAxis.axisLabelDistance(50);
//                    chart.xAxis.tickPadding(7);
                    chart.yAxis.axisLabel("Cluster Distance");
                    chart.yAxis.tickValues(d3.range('CLOSE','FAR'));
//                    chart.yAxis.showMaxMin(true);
//                    chart.yAxis.tickFormat(function(d, i){
//                        if (d==0) return "low";
//                        else if (d==100) return "high";
//                    })
                    chart.yAxis.axisLabelDistance(50);

                    chart.margin({bottom: 60, right: 80, left: 80, top: 80});

                    //We want to show shapes other than circles.
                    chart.scatter.onlyCircles(false);

                    var myData = asChartData(
                        clusters.results,
                        $scope.pageNumber,
                        $scope.pageSize
                    );
                    d3.select('#clusterChart svg')
                        .datum(myData)
                        .call(chart);

                    nv.utils.windowResize(chart.update);

                    return chart;
                });

            }
        );


    }
]);

function asChartData(results, pageNumber, pageSize) {
    var pageOffset = (pageNumber-1) * pageSize;
    var chartData = [
        {
            "key":"High Quality",
            "values":[]
        },
        {
            "key":"Medium Quality",
            "values":[]
        },
        {
            "key":"Low Quality",
            "values":[]
        }
    ];
    for (i = 0; i<results.length; i++) {
        chartCluster = {
            "x":results[i].maxRatio,
            "y": i + pageOffset,
            "size":(results[i].numberOfSpectra * 50)
        };
        if (results[i].clusterQuality == 'HIGH') {
            chartData[0].values.push(chartCluster);
        } else if (results[i].clusterQuality == 'MEDIUM') {
            chartData[1].values.push(chartCluster);
        } else if (results[i].clusterQuality == 'LOW') {
            chartData[2].values.push(chartCluster);
        }
    }

    return chartData;
}