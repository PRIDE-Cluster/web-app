/**
 * @author Rui Wang <rwang@ebi.ac.uk>
 *
 */
var apiPageView = angular.module('prideClusterApp.apiPageView', ['ngRoute']);

apiPageView.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/api', {
            templateUrl: 'views/api-view/apiPage-v1.html',
            controller: 'ApiPageViewCtrl'
        });
    }
]);

apiPageView.controller('ApiPageViewCtrl', function($scope, $location, $anchorScroll) {
    $scope.scrollTo = function(id) {
        $location.hash(id);
        $anchorScroll();
    }
});