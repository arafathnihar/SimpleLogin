(function () {
    angular
        .module("SimpleLogin")
        .controller("RegistrationController", function ($state, $scope, WebService, $timeout) {
            var vm = this;
            vm.registration = {
                'phone': '',
                'username': '',
                'countryCode': 'lk',
                'email': '',
                'password': ''
            };
            vm.failed = false;
            vm.failMessage = '';
            vm.success = false;
            vm.successMessage = '';

            vm.signUp = signUp;

            function signUp() {
                if ($scope.registrationForm.$valid) {
                    vm.registration.countryCode = angular.element("#phone_number_input").intlTelInput("getSelectedCountryData").dialCode;
                    var reqestObject = WebService.makeRequestObject('../server/endpoints/signup.php', 'POST', vm.registration, 'application/json');
                    WebService
                        .callWebService(reqestObject)
                        .then(callBack);
                }
            }

            function callBack(data) {
                if (data.valid) {
                    vm.success = true;
                    vm.successMessage = data.message;
                    $timeout(function () {
                        vm.success = false;
                        vm.successMessage = '';
                        $state.go('login');
                    }, 1000)
                } else {
                    vm.failed = true;
                    vm.failMessage = data.message;
                    $timeout(function () {
                        vm.failed = false;
                        vm.failMessage = '';
                    }, 1000)
                }
            }
        });
})();

