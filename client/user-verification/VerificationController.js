(function () {
    angular
        .module('SimpleLogin')
        .controller('VerificationController', function ($state, WebService, $timeout, $scope, blockUI) {
            blockUI.stop();
            var vm = this;
            vm.verification = {
                'method': '',
                'softToken': '',
                'authy_id': ''
            };
            vm.failed = false;
            vm.failMessage = '';
            vm.success = false;
            vm.successMessage = '';
            vm.tokenForm = false;
            vm.sendSoftToken = sendSoftToken;

            if ($state.params) {
                vm.verification.method = $state.params.method;
                if (vm.verification.method == 'ONE_TOUCH') {
                    vm.tokenForm = false;
                    checkOneTouch();
                } else if (vm.verification.method == 'SOFT_TOKEN') {
                    vm.tokenForm = true;
                    vm.verification.authy_id = $state.params.authy_id;
                }
            }

            function sendSoftToken(endpoint) {
                if ($scope.verificationForm.$valid) {
                    var reqestObject = WebService.makeRequestObject('../server/endpoints/softToken.php', 'POST', vm.verification, 'application/json');
                    WebService
                        .callWebService(reqestObject)
                        .then(callBackSoftToken);
                }
            }

            function callBackSoftToken(data) {
                if (data.valid) {
                    vm.success = true;
                    vm.successMessage = data.message;
                    if (data.token)
                        localStorage.setItem("token", data.token);
                    $timeout(function () {
                        vm.success = false;
                        vm.successMessage = '';
                        $state.go('home');
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

            var count = 0;

            function checkOneTouch() {
                if (localStorage['token']) {
                    var token = {
                        'token': ''
                    };
                    token.token = localStorage['token'];
                    var reqestObject = WebService.makeRequestObject('../server/endpoints/checkToken.php', 'POST', token, 'application/json');
                    WebService
                        .callWebService(reqestObject, 'Waiting for one touch verification..')
                        .then(callBackOneTouch);

                    function callBackOneTouch(data) {
                        if (data == 'authorized') {
                            vm.success = true;
                            vm.successMessage = 'Authorized';
                            $timeout(function () {
                                vm.success = false;
                                vm.successMessage = '';
                                blockUI.stop();
                                $state.go('home');
                            }, 1000);
                        } else {
                            blockUI.start('Waiting for one touch verification..');
                            $timeout(function () {
                                vm.success = false;
                                vm.successMessage = '';
                                if (count < 10) {
                                    checkOneTouch();
                                    count++;
                                } else {
                                    blockUI.stop();
                                    $state.go('login');
                                }
                            }, 3000);
                        }
                    }
                } else {
                    blockUI.stop();
                    $state.go('login');
                }
            }

        });
})();

