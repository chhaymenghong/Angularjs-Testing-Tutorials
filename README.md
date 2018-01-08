Welcome to tutorials on how to test Angularjs app

1. Setup: How to get started with testing Angularjs using Jasmine, Karma and Angularjs
    + Install Karma ( npm install -D karma ).
        - We use Karma to run out test against real browsers or headless browser ( phantomjs )
        - Karma allows us to run out test codes against multiple browsers at the same time
        - We can run it locally or on CI
        - We can use Istanbul to automatically generate coverage reports
    + Install Karma Cli so that we can run the karma command from anywhere ( npm install -g karma-cli )
        - Install this so that we don't have to reach into node_modules folder to run karma
    + Install Jasmine add-on that we want to use to write tests ( npm install -D karma-jasmine )
    + Install browser add-on for Karma to run the tests against ( npm install -D karma-chrome-launcher
        - install as many browser add-on as needed ( npm install -D karma-phantomjs-launcher )
    + Setup Karma config file for the following purposes ( karma init )
        - specify what testing framework to use
        - specify what browser to use
        - specify what app files and testing files to include in the browser for testing
        - specify what files to exclude
        - as a result karma.conf.js file will be created with all the configurations that we specify
    + Install jasmine-core which contains all Jasmine testing lib ( npm install -D jasmine-core )
    + To run karma, use this command: karma start karma.config.js
        - To make it easier, we can instead use npm to run this command by specifying this in the package.json file
        under the script property:
           "scripts": {
               "test": "node_modules/karma/bin/karma start karma.config.js"
             }
    + Install Angularjs ( npm install --save angular
    + Include the Angularjs lib in the karma.conf.js so that it will be loaded when running karma
    + Install Angular-mocks ( npm install --D angular-mocks ). This is used for testing Angularjs codes
    + Include the angular-mocks lib in the karma.conf.js so that it will be loaded when running karma

2. Tutorials on using jasmine with angular-mocks(ngMock) to test Angularjs

    + If you are using WebStorm, to enable auto-complete for Jasmine codes:
        - Go to Preferences-->Languages & Frameworks-->Javascript-->Libraries
        - Click on download and find the jasmine


    + ngMock has two main functions
        - module: used to load modules
        - inject: is a wrapper on top of Angularjs $injector service. We can use this to get instances
         of components from modules. Also inject is also responsible for loading ngMock and Angularjs module, so
         to actually test Angularjs code we have to call inject whereas module only load the module we need.
        - dump: serialize common objects for debugging (pretty print). ( Note that karma has the same method call dump which is = to
        console.log


    + To test angular codes we need to do the following:

        - Load a real module or prototype one in the test codes. There are actually three ways to include a module:
            1. string: angular.mock.module('appModuleName')
                - This will load our real app module which contains everything that is registered with it including
                 controllers, services, directives....
            2. function: manually create a module using anonymous function ( good for TDD through code prototyping in the test itself )
                - angular.mock.module(function($provide) {
                    $provide.factory('serviceName', function() {
                        return { functionName: function()}
                    })
                })
                - This creates a module and a service. We can later on convert this prototype codes into actual code.
                - This form also allows us to inject all sorts of service whereas the third option doesn't allow for that.
            3. object: manually create a module using object literal
                - angular.mock.module({
                    serviceName: {
                        functionName: function(){}
                    }
                })
                - This form doesn't allow us to inject any services.
                - If we want to use TDD development we should follow method 2 and 3 to prototype codes and make tests pass
                and then turn them into production codes. If not, consider using the 1 method by inject actual production module.

        - Inject stuffs using angular.mock.inject:
            - angular.mock.inject(function(_serviceName_){})

    + Testing codes that use $http service
        - $http service make use of $httpBackend which interact directly with ajax to send a request to the server.
        ngMock replace this $httpBackend with a mocked version instead, so that all the app codes that make request
        to the server won't actually interact with ajax, but instead with the mocked version of $httpBackend. This also
        means that we can't real http requests when using ngMock unless we do special hack.
        - So to actually test a service using $http, we have to use the following:
            - $httpBackend.when('methodName', 'url') return an object that has "respond" as a method
                1. used to mock what data to return for this methodName and url
                2. can be used multiple time
                3. order doesn't matter
            - $httpBackend.expect('methodName', 'url') return an object that has
                1. used for actually testing how the requests are being made ( strict usage testing )
                 ( whether the url is specified correctly, whether the data received or sent is specified correctly )
                2. can be used only one time
                3. order of requests in the app codes matter ( so this means that we can also test to make sure that
                a bunch of http requests are made in the right order.
            - instead of specify a string url, we can instead use a regex or a function that return true or false
                - $httpBackend.when('methodName', function(url) { return url.index('some string that we wish to see in url') !== -1;})
                This is useful because we can return the same data for different kinda of url
                - $httpBackend.expect('methodName', function(url) { return url.index('some string that we wish to see in url') !== -1;})
                This is useful if we want the url to match a collection of url
            - call $httpBackend.verifyNoOutstandingExpectation() and $httpBackend.verifyNoOutstandingRequest() in the afertEach
            block to make sure that the test fails when we don't forget to make call to function that issue http requests
            that we are expecting. Also to make sure that if we are calling any function that issue http requests, all those
            requests are flushed.






