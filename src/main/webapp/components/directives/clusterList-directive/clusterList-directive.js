/**
 * @author Jose A. Dianes <jdianes@ebi.ac.uk>
 *
 * The prc-cluster-list directive allows us to reuse a list of cluster everywhere we want to show it (e.g.
 * in the clusterList-view)
 *
 */

var clusterListDirective = angular.module('prideClusterApp.clusterListDirective', [])

clusterListDirective.directive('prcClusterList', ['ClusterSummary', function(ClusterSummary) {
    return {
        restrict: 'E',
        scope: {
            queryTerm: '=query',
            pageNumber: '=page',
            pageSize: '=size'
        },
        controller: 'ClusterListDirectiveCtrl',
        templateUrl: 'components/directives/clusterList-directive/clusterList-directive.html'
    };
}]);


clusterListDirective.controller('ClusterListDirectiveCtrl', ['$scope', '$routeParams', 'ClusterSummary',
    function($scope, $routeParams, ClusterSummary) {

        ClusterSummary.list(
            { queryTerm:$scope.queryTerm, pageNumber:$scope.pageNumber, pageSize:$scope.pageSize },
            function(clusters) {
                $scope.clusters = clusters.results;
                $scope.totalResults = clusters.totalResults;
                $scope.query = $routeParams.q;
                $scope.pageNumber = $routeParams.page;
                $scope.pageSize = $routeParams.size;
                $scope.numPages = Math.floor($scope.totalResults / $scope.pageSize);
            }
        );
    }
]);