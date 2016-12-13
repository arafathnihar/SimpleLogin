<?php

/**
 * @param $message
 */
function respondWithError($message) {
    $respond = array('valid' => false, 'message' => '');
    if (isset($message))
        $respond['message'] = $message;
    header('Content-Type: application/json');
    http_response_code(403);
    echo json_encode($respond);
}

/**
 * @param $respond
 */
function respondWithSuccess($respond) {
    header('Content-Type: application/json');
    http_response_code(200);
    echo json_encode($respond);
}

