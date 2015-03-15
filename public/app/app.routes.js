angular.module('app.routes', ['ngRoute'])
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'pages/home',
                controller: 'mainController',
                controllerAs: 'main'
            })
            // login page
            .when('/login', {
                templateUrl: 'pages/login',
                controller: 'mainController',
                controllerAs: 'login'
            })
            // show all users
            .when('/users', {
                templateUrl: 'pages/users/all',
                controller: 'userController',
                controllerAs: 'user'
            })

            // form to create a new user
            // same view as edit page
            .when('/users/create', {
                templateUrl: 'pages/users/single',
                controller: 'userCreateController',
                controllerAs: 'user'
            })

            // page to edit a user
            .when('/users/:user_id', {
                templateUrl: 'pages/users/single',
                controller: 'userEditController',
                controllerAs: 'user'
            });


        $locationProvider.html5Mode(true);
    });