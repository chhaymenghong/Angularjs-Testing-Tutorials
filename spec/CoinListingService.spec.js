describe('Coin listing service', function() {
    var coinListingService;
    var $httpBackend;


    beforeEach(function() {

        // load crypto module which also contains everything else ( controllers, services, directives )
        angular.mock.module('app');

        // Bootstrap the app by adding ngMock and Angularjs module to a list of modules
        // We can also inject stuff here to use
        // Inject function will remove the trailing underscore
        angular.mock.inject(function(_coinListingService_, _$httpBackend_) {
            coinListingService = _coinListingService_;
            $httpBackend = _$httpBackend_;
        })
    });


    /** Use when with url as a string **/
    it('use $httpBackend when with url as string', function () {
        var fakeData = ['coin1', 'coin2'];var data;

        $httpBackend.when('GET', 'https://www.cryptocompare.com/api/data/coinlist/').respond(200, fakeData);
        coinListingService.getListing().then(function(_data) {
            data = _data.data;
        });

        // Since $http request is asynchronous, whereas our testing code is synchronous, we need to call flush
        // to manually force the request to finish. "flush" also takes in a numeric parameter ( 1, 2, 3 ).
        // We can use that parameter to specify the number of requests for finish. When the param is not specified
        // it flushes all requests.
        $httpBackend.flush();

        expect(fakeData).toEqual(data);
    });


    /** Use when with url as a regex. This is good for providing backend definition for different value of url **/
    it('use $httpBackend "when" with url as regex', function () {
        var fakeData = ['coin1', 'coin2'];var data;
        $httpBackend.when('GET', /https:\/\/www.cryptocompare.com\/api\/data/)
            .respond(200, fakeData);

        coinListingService.getListing().then(function(_data) {
           data = _data.data;
        });

        $httpBackend.flush(1);
        expect(fakeData).toEqual(data);
    });

    /** Use when with url as a function that return true or false. This is good for providing backend definition for different value
     * of url **/
    it('use $httpBackend "when" with url as a function', function () {
        var fakeData = ['coin1', 'coin2'];var data;
        $httpBackend.when('GET', function(url) {
            return url.indexOf('https://www.cryptocompare.com/api/data/') !== -1;
        }).respond(200, fakeData);

        coinListingService.getListing().then(function(_data) {
            data = _data.data;
        });

        $httpBackend.flush(1);
        expect(fakeData).toEqual(data);
    });

    /** Test to make sure that the service can catch error **/
    it('Test to make sure that the service can catch error', function() {
        var fakeData = ['coin1', 'coin2'];var error;
        $httpBackend.when('GET', function(url) {
            return url.indexOf('https://www.cryptocompare.com/api/data/') !== -1;
        }).respond(500, fakeData);

        coinListingService.getListing().then(
            function() {},
            // This function wont get call if the getListing doesn't handle error
            // If it handles the error case, this function will get called and if it gets call
            // we will set the error variable to the right value. As a result, the expectation
            // at the bottom will pass.
            function() {
                error = 'error';
            }
        );

        $httpBackend.flush(1);
        expect(error).toEqual('error');
    });

    afterEach(function() {
        // Verifies that all of the requests defined via the expect api were made. If any of the requests were not made,
        // verifyNoOutstandingExpectation throws an exception. This is used to make sure that certain $http requests were
        // made and also in the right order
        $httpBackend.verifyNoOutstandingExpectation();

        // Verifies that there are no outstanding requests that need to be flushed.
        $httpBackend.verifyNoOutstandingRequest();
    });


    /** use $httpBackend "expect". "expect" is used to test how the request or requests were made **/
    it('use $httpBackend "expect" with string as url', function() {
        var fakeData = ['coin1', 'coin2'];var data;
        // if we are expect a different url string than the one getListing use, the test will fail.
        // (IE: we set(expect) the url to https://www.cryptocompare.com/api/data/, the test will fail
        // because getListing calls $http with this url: https://www.cryptocompare.com/api/data/coinlist/
        $httpBackend.expect('GET', 'https://www.cryptocompare.com/api/data/coinlist/')
            .respond(200, fakeData);

        coinListingService.getListing().then(function(_data) {
            data = _data.data;
        });

        // Also, if we forget to flush, the $http will actually never get called in getListing
        // and as a result, the "expect" wont fail the test either and our broken codes will go undetected.
        // To avoid this, we need to have "verifyNoOutstandingExpectation" and "verifyNoOutstandingRequest"
        // in the afterEach block to ensure two things:
        // 1. that all outstanding requests are flushed
        // 2. that expected requests in the "expect" statements were actually made. If not, throw errors, regardless
        // of whether flush was called or not.
        $httpBackend.flush(1);
        expect(fakeData).toEqual(data);
    });

    /** test to ensure that $http calls are made in a specific order **/
    it('test to ensure that $http calls are made in a specific order', function() {
        var fakeData1 = ['coin1', 'coin2'];
        var fakeData2 = ['coin2', 'coin2'];
        var fakeData3 = ['coin3', 'coin3'];

        // "makeMultipleRequests makes three requests with the following urls in this order
        // If we were to change the order of the expectation, the test will fail. If we want to make sure that
        // a collection of requests are made in a certain order, this is how we would do that.
        $httpBackend.expect('GET', 'https://www.cryptocompare.com/1')
            .respond(200, fakeData1);
        $httpBackend.expect('GET', 'https://www.cryptocompare.com/2')
            .respond(200, fakeData1);
        $httpBackend.expect('GET', 'https://www.cryptocompare.com/3')
            .respond(200, fakeData1);

        coinListingService.makeMultipleRequests();

        $httpBackend.flush(3);
    });
});