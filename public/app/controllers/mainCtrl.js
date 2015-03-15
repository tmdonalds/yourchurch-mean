angular.module('mainCtrl', [])
.controller('mainController', function ($rootScope, $location, Auth) {
    var vm = this;

        vm.loggedIn = false;

        // function to handle login form
        vm.doLogin = function() {
            vm.processing = true;

            // clear the error
            vm.error = '';

            Auth.login(vm.loginData.username, vm.loginData.password)
                .success(function(data) {
                    vm.processing = false;

                    // if a user successfully logs in, redirect to users page
                    if (data.success)
                        $location.path('/users');
                    else
                        vm.error = data.message;

                });
        };

        // function to handle logging out
        vm.doLogout = function() {
            Auth.logout();
            vm.user = '';

            $location.path('/login');
        };
});