<?php

require_once '../vendor/autoload.php';
include("../connection.php");
include("utill.php");

$userData = json_decode(file_get_contents("php://input"));

$check = $db->query("SELECT * FROM users WHERE tocken = '$userData->token' AND authy_status='approved'");

$check = $check->fetchAll();

if (count($check) == 1) {
    echo "authorized";
} else {
    echo "unauthorized";
}