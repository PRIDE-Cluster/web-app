/**
 * @author Jose A. Dianes <jdianes@ebi.ac.uk>
 *
 * The Cluster Service represents the PRIDE Cluster Web-Service through a series of singletons
 * that can be injected into other components (e.g. Controllers) in order to asynchronously access
 * the back-end data.
 *
 * Each singleton represents a web-service end point and can potentially define multiple operations.
 *
 * NOTE: the Cluster WS uses 0-based paging
 *
 */
var clusterWsUrl = "//www.ebi.ac.uk/pride/ws/cluster/cluster";
//var clusterWsUrl = "//localhost:9091/pride/ws/cluster/cluster";

var clusterService = angular.module('prideClusterApp.clusterService', ['ngResource']);

/* Services */
clusterService.factory('ClusterSummary', ['$resource',
    function($resource) {
        return $resource(
                clusterWsUrl + '/list?q=:queryTerm&peptide=:peptide&modFilters=:modFilters&speciesFilters=:speciesFilters&sort=:sortField&order=:sortOrder&facets=true&highlights=true&page=:pageNumber&size=:pageSize&callback=JSON_CALLBACK',
                {
                    queryTerm: '',
                    pageNumber: 0,
                    pageSize: 20,
                    modFilters:[],
                    speciesFilters:[],
                    sortField:'',
                    sortOrder:''
                },
                {
                    list: {
                        method:'JSONP',
                        params:{},
                        isArray:false,
                        callback: 'JSON_CALLBACK'
                    },
                    nearest: {
                        method: 'JSONP',
                        params: {},
                        url: clusterWsUrl+"/nearest?precursor=:precursor&peaks=:peaks&callback=JSON_CALLBACK",
                        isArray:false,
                        callback: 'JSON_CALLBACK'
                    }
                }
        );
    }
]);

clusterService.factory('ClusterDetail', ['$resource',
    function($resource){
        return $resource(
                clusterWsUrl + '/:clusterId' + '?callback=JSON_CALLBACK',
                {},
                {
                    get: {
                        method:'JSONP',
                        params:{clusterId:'cluster'},
                        isArray:false,
                        callback: 'JSON_CALLBACK'
                    }
                }
        );
    }
]);

clusterService.factory('ClusterSpecies', ['$resource',
    function($resource){
        return $resource(
            clusterWsUrl + '/:clusterId/species' + '?callback=JSON_CALLBACK',
            {},
            {
                get: {
                    method:'JSONP',
                    params:{clusterId:'cluster'},
                    isArray:false,
                    callback: 'JSON_CALLBACK'
                }
            }
        );
    }
]);

clusterService.factory('ClusterModifications', ['$resource',
    function($resource){
        return $resource(
            clusterWsUrl + '/:clusterId/modification' + '?callback=JSON_CALLBACK',
            {},
            {
                get: {
                    method:'JSONP',
                    params:{clusterId:'cluster'},
                    isArray:false,
                    callback: 'JSON_CALLBACK'
                }
            }
        );
    }
]);

clusterService.factory('ClusterPeptides', ['$resource',
    function($resource){
        return $resource(
            clusterWsUrl + '/:clusterId/peptide?callback=JSON_CALLBACK',
            {},
            {
                get: {
                    method:'JSONP',
                    params:{clusterId:'cluster'},
                    isArray:false,
                    callback: 'JSON_CALLBACK'
                }
            }
        );
    }
]);

clusterService.factory('ClusterPSMs', ['$resource',
    function($resource){
        return $resource(
            clusterWsUrl + '/:clusterId/psm?sequence=:sequence&mod=:modifications&project=:projects&page=:pageNumber&size=:pageSize&callback=JSON_CALLBACK',
            {
                sequence: '',
                modifications: '',
                projects: '',
                pageNumber: 0,
                pageSize: 20
            },
            {
                get: {
                    method:'JSONP',
                    params:{clusterId:'cluster'},
                    isArray:false,
                    callback: 'JSON_CALLBACK'
                }
            }
        );
    }
]);

clusterService.factory('ClusterProjects', ['$resource',
    function($resource){
        return $resource(
            clusterWsUrl + '/:clusterId/project?sequence=:sequence&mod=:modifications&callback=JSON_CALLBACK',
            {
                sequence: '',
                modifications: ''
            },
            {
                get: {
                    method:'JSONP',
                    params:{clusterId:'cluster'},
                    isArray:false,
                    callback: 'JSON_CALLBACK'
                }
            }
        );
    }
]);

clusterService.factory('ClusterStats', ['$resource',
    function($resource){
        return $resource(
            clusterWsUrl + '/:clusterId/deltaMz?callback=JSON_CALLBACK',
            {},
            {
                delta: {
                    method:'JSONP',
                    params:{clusterId:'cluster'},
                    url: clusterWsUrl + '/:clusterId/deltaMz?callback=JSON_CALLBACK',
                    isArray:false,
                    callback: 'JSON_CALLBACK'
                },
                similarity: {
                    method:'JSONP',
                    params:{clusterId:'cluster'},
                    url: clusterWsUrl + '/:clusterId/similarity?callback=JSON_CALLBACK',
                    isArray:false,
                    callback: 'JSON_CALLBACK'
                }
            }
        );
    }
]);