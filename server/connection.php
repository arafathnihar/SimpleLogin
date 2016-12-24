<?php

// $config = parse_ini_file('config.ini');
$url = parse_url(getenv("CLEARDB_DATABASE_URL"));

$server = $url["host"];
$username = $url["user"];
$password = $url["pass"];
$db = substr($url["path"], 1);

$db = new PDO(
    'mysql:host=' . $server . ';dbname=' . $db,
    $username,
    $cpassword);

// $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);