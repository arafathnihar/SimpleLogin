<?php

require_once '../vendor/autoload.php';
include("../connection.php");
include("utill.php");

$config = parse_ini_file('../config.ini');

$userData = json_decode(file_get_contents("php://input"));

$authy_api = new \Authy\AuthyApi($config['AUTHY_API_KEY']);

$user = $authy_api->registerUser($userData->email, $userData->phone, $userData->countryCode);

if ($user->ok()) {
    $userData->authy_id = $user->id();
    $check = checkUserDetails($userData, $db);
    if ($check['valid']) {
        if (createNewUser($userData, $db) == true) {
            $respond = array('valid' => true, 'message' => 'Successfully created an account');
            respondWithSuccess($respond);
        } else {
            respondWithError('Database Error');
        }
    } else {
        respondWithError($check['message']);
    }
} else {
    respondWithError('Could not create a user in Authy');
}


function createNewUser($data, $db) {
    $q = "INSERT INTO users(username, email, user_password, country_code, phone_number, authy_id) 
                  VALUES (:username, :email, :user_password, :country_code, :phone_number, :authy_id)";
    $query = $db->prepare($q);
    $execute = $query->execute(array(
        ':username' => $data->username,
        ':email' => $data->email,
        ':user_password' => sha1($data->password),
        ':country_code' => $data->countryCode,
        ':phone_number' => $data->phone,
        ':authy_id' => $data->authy_id
    ));
    return $execute;
}

function checkUserDetails($data, $db) {
    $check = array('valid' => true, 'message' => '');
    $q = "SELECT * FROM users WHERE username =" . "'" . $data->username . "'";
    $result = $db->query($q);
    if ($result->fetch(PDO::FETCH_ASSOC)) {
        $check = array('valid' => false, 'message' => 'User name already exist!');
    } else {
        $q = "SELECT * FROM users WHERE email =" . "'" . $data->email . "'";
        $result = $db->query($q);
        if ($result->fetch(PDO::FETCH_ASSOC)) {
            $check = array('valid' => false, 'message' => 'Email already exist!');
        } else {
            $q = "SELECT * FROM users WHERE phone_number =" . "'" . $data->phone . "'";
            $result = $db->query($q);
            if ($result->fetch(PDO::FETCH_ASSOC)) {
                $check = array('valid' => false, 'message' => 'Phone number already exist!');
            }
        }
    }
    return $check;
}
