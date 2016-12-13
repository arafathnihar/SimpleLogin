(function () {
    angular.module('SimpleLogin', ['ui.router', 'internationalPhoneNumber', 'ngMessages', 'ui.toggle', 'ngDialog', 'blockUI']);

    angular
        .module('SimpleLogin')
        .config(configuration);

    /**
     *
     * @param $stateProvider
     * @param $urlRouterProvider
     * @param ipnConfig
     */
    function configuration($stateProvider, $urlRouterProvider, ipnConfig) {
        ipnConfig.utilsScript = 'bower_components/intl-tel-input/lib/libphonenumber/build/utils.js';
        $urlRouterProvider.otherwise('/registration');
        $stateProvider
            .state('registration', {
                url: '/registration',
                controller: 'RegistrationController',
                controllerAs: 'vm',
                templateUrl: 'user-registration/registration.html'
            });
        $stateProvider
            .state('login', {
                url: '/login',
                controller: 'LoginController',
                controllerAs: 'vm',
                templateUrl: 'user-login/login.html'
            });
        $stateProvider
            .state('verification', {
                url: '/verification/:method/:authy_id',
                params: {
                    method: 'ONE_TOUCH',
                    authy_id: ''
                },
                controller: 'VerificationController',
                controllerAs: 'vm',
                templateUrl: 'user-verification/verification.html'
            });
        $stateProvider
            .state('home', {
                url: '/home',
                controller: 'HomeController',
                controllerAs: 'vm',
                templateUrl: 'home/home.html'
            });
    }
})();