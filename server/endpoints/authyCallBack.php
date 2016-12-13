<?php

require_once '../vendor/autoload.php';
include("../connection.php");
include("utill.php");

$data = json_decode(file_get_contents("php://input"));

$file = 'debug.log';

$current = file_get_contents($file);

$current .= $data->authy_id.' ';
$current .= $data->status;

file_put_contents($file, $current);

if ($data->authy_id) {
    $q = "UPDATE users SET authy_status=:authy_status WHERE authy_id =:authy_id";
    $query = $db->prepare($q);
    $query->execute(array(
        ":authy_id" => $data->authy_id,
        ":authy_status" => $data->status
    ));
    $respond = array('valid' => true, 'message' => 'Login Success');
    respondWithSuccess($respond);
}