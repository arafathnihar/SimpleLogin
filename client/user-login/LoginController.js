(function () {
    angular
        .module('SimpleLogin')
        .controller('LoginController', function ($scope, WebService, $timeout, $state, blockUI) {
            var vm = this;
            vm.login = {
                'username': '',
                'password': '',
                'verificationMethod': true
            };
            vm.failed = false;
            vm.failMessage = '';
            vm.success = false;
            vm.successMessage = '';
            vm.authyId = '';
            vm.userLogin = userLogin;

            function userLogin() {
                if ($scope.loginForm.$valid) {
                    var reqestObject = WebService.makeRequestObject('../server/endpoints/login.php', 'POST', vm.login, 'application/json');
                    WebService
                        .callWebService(reqestObject)
                        .then(callBack);
                }
            }

            function callBack(data) {
                blockUI.stop();
                if (data.valid) {
                    vm.success = true;
                    vm.successMessage = data.message;
                    if (data.authy_id)
                        vm.authyId = data.authy_id;
                    if (data.token)
                        localStorage.setItem("token", data.token);
                    $timeout(function () {
                        vm.success = false;
                        vm.successMessage = '';
                        goToVerification();
                    }, 2000);
                } else {
                    vm.failed = true;
                    vm.failMessage = data.message;
                    $timeout(function () {
                        vm.failed = false;
                        vm.failMessage = '';
                    }, 2000);
                }
            }

            function goToVerification() {
                if (vm.login.verificationMethod) {
                    $state.go('verification', {
                        method: 'ONE_TOUCH'
                    });
                } else {
                    $state.go('verification', {
                        method: 'SOFT_TOKEN',
                        authy_id: vm.authyId
                    });
                }
            }
        });
})();

