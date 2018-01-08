angular.module('app').factory('coinListingService', ['$http', '$q', coinListingService]);

function coinListingService($http, $q) {
    var service = {};
    var url = 'https://www.cryptocompare.com/api/data/coinlist/';

    service.getListing = function() {
        var deferred = $q.defer();
        $http.get(url)
            .then(function (data) {
                deferred.resolve(data);
            }, function() {
                deferred.reject();
            });
        return deferred.promise;
    };

    service.makeMultipleRequests = function() {
        var url1 = 'https://www.cryptocompare.com/1';
        var url2 = 'https://www.cryptocompare.com/2';
        var url3 = 'https://www.cryptocompare.com/3';
        $http.get(url1);
        $http.get(url2);
        $http.get(url3);
    };
    return service;

}