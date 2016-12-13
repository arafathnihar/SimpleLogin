<?php

require_once '../vendor/autoload.php';
include("../connection.php");
include("utill.php");

$config = parse_ini_file('../config.ini');

$userData = json_decode(file_get_contents("php://input"));

$password = sha1($userData->password);
$username = $userData->username;

$userInfo = $db->query("SELECT * FROM users WHERE username='$username' AND user_password='$password'");
$userInfo = $userInfo->fetchAll();


if (count($userInfo) == 1) {
    $data = $userInfo[0];
    // oneTouch
    if ($data['authy_status'] != 'unverified') {
        $data['authy_status'] = 'unverified';
        $q = "UPDATE users SET authy_status=:authy_status WHERE id =:id";
        $query = $db->prepare($q);
        $query->execute(array(
            ":authy_status" => $data['authy_status'],
            ":id" => $data['id']
        ));
    }

    if ($userData->verificationMethod) {
        $params = array(
            'api_key' => $config['AUTHY_API_KEY'],
            'message' => 'Request to Login to simple login app',
            'details[Email]' => $data['email'],
        );

        $defaults = array(
            CURLOPT_URL => "https://api.authy.com/onetouch/json/users/" . $data['authy_id'] . "/approval_requests",
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $params,
        );

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt_array($ch, $defaults);
        $output = curl_exec($ch);
        curl_close($ch);
        $json = json_decode($output);
        if ($json->success) {
            $q = "UPDATE users SET tocken=:token WHERE id =:id";
            $query = $db->prepare($q);
            $token = uniqid() . uniqid() . uniqid();
            $query->execute(array(
                ":token" => $token,
                ":id" => $data['id']
            ));
            $respond = array('valid' => true, 'token' => $token);
            respondWithSuccess($respond);
        } else {
            respondWithError('One touch request failed');
        }
    } else {
        $respond = array('valid' => true, 'authy_id' => simple_encrypt($data['authy_id']));
        respondWithSuccess($respond);
    }

} else {
    respondWithError('The username and password combination you entered is incorrect.');
}


//This function is used to encrypt data.
function simple_encrypt($text, $salt = "VUHuiU6b8jgieEG0p79Yx9T4G8Zqp880") {
    return trim(base64_encode(mcrypt_encrypt(MCRYPT_RIJNDAEL_256, $salt, $text, MCRYPT_MODE_ECB, mcrypt_create_iv(mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB), MCRYPT_RAND))));
}
