(function () {
    angular
        .module('SimpleLogin')
        .controller('HomeController', function ($scope, WebService, $timeout, $state,blockUI) {
            var vm = this;
            vm.failed = false;
            vm.failMessage = '';
            vm.success = false;
            vm.successMessage = '';
            vm.logOut = logOut;
            checkToken();
            function checkToken() {
                var token = {
                    'token': ''
                };
                if (localStorage['token'])
                    token.token = localStorage['token'];
                var reqestObject = WebService.makeRequestObject('../server/endpoints/checkToken.php', 'POST', token, 'application/json');
                WebService
                    .callWebService(reqestObject)
                    .then(callBack);
            }

            function callBack(data) {
                blockUI.stop();
                if (data == 'authorized') {
                    vm.success = true;
                    vm.successMessage = 'Authorized';
                    $timeout(function () {
                        vm.success = false;
                        vm.successMessage = '';
                    }, 1000);
                } else {
                    logOut();
                }
            }

            function logOut() {
                localStorage.removeItem("token");
                $state.go('login');
            }
        });
})();

