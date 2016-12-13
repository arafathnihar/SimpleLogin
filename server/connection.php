<?php
$config = parse_ini_file('config.ini');
$db = new PDO(
    'mysql:host=' . $config['HOST'] . ';dbname=' . $config['DBNAME'] . ';port=' . $config['PORT'],
    $config['USERNAME'],
    $config['PASSWORD']);

$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);