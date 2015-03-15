angular.module('app.routes', ['ngRoute'])
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'pages/home',
                controller: 'mainController',
                controllerAs: 'main'
            });

        $locationProvider.html5Mode(true);
    });