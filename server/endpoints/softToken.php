<?php

require_once '../vendor/autoload.php';
include("../connection.php");
include("utill.php");

$config = parse_ini_file('../config.ini');

$userData = json_decode(file_get_contents("php://input"));

$authy_api = new \Authy\AuthyApi($config['AUTHY_API_KEY']);

$authyId = simple_decrypt($userData->authy_id);

$verification = $authy_api->verifyToken($authyId, $userData->softToken);

if ($verification->ok()) {
    $token = uniqid() . uniqid() . uniqid();
    $q = "UPDATE users SET tocken=:token, authy_status=:authy_status WHERE authy_id =:authy_id";
    $query = $db->prepare($q);
    $query->execute(array(
        ":token" => $token,
        ":authy_id" => $authyId,
        ":authy_status" => 'approved'
    ));
    $respond = array('valid' => true, 'message' => 'Login Success', 'token' => $token);
    respondWithSuccess($respond);
} else {
    respondWithError('Incorrect Soft Token');
}

// This function will be used to decrypt data.
function simple_decrypt($text, $salt = "VUHuiU6b8jgieEG0p79Yx9T4G8Zqp880") {
    return trim(mcrypt_decrypt(MCRYPT_RIJNDAEL_256, $salt, base64_decode($text), MCRYPT_MODE_ECB, mcrypt_create_iv(mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB), MCRYPT_RAND)));
}