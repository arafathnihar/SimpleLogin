(function () {

    angular
        .module('SimpleLogin')
        .factory('WebService', WebService);

    function WebService($http, blockUI) {
        var service;
        service = {
            callWebService: callWebService,
            makeRequestObject: makeRequestObject
        };
        return service;

        /**
         *
         * @param request
         * @returns {*}
         */
        function callWebService(request, message) {
            if (message)
                blockUI.start(message);
            else
                blockUI.start('Please Wait...');

            return $http(request)
                .then(requestSuccess)
                .catch(requestFail);

            /**
             *
             * @param response
             * @returns {*}
             */
            function requestSuccess(response) {
                if (response.status == 200) {
                    if ($http.pendingRequests.length == 0)
                        blockUI.stop();
                    return response.data;
                }
            }

            /**
             *
             * @param error
             * @returns {*}
             */
            function requestFail(error) {
                console.log('error', error.status, error.data);
                if ($http.pendingRequests.length == 0)
                    blockUI.stop();
                return error.data;
            }
        }

        /**
         *
         * @param urlParam
         * @param methodParam
         * @param dataParam
         * @param ContentType
         * @returns {{url: *, method: *, headers: {Content-Type: *}}}
         */
        function makeRequestObject(urlParam, methodParam, dataParam, ContentType) {
            if (!ContentType)
                ContentType = 'application/x-www-form-urlencoded';
            var request = {
                url: urlParam,
                method: methodParam,
                headers: {
                    'Content-Type': ContentType
                }
            };
            if (dataParam) {
                if (methodParam == 'POST' || methodParam == 'PUT')
                    request.data = dataParam;
                else
                    request.url += decodeURIComponent(dataParam);
            }
            return request;
        }
    }
})();