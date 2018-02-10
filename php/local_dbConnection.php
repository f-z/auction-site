<?php
    // Allowing access
    header('Access-Control-Allow-Origin: *');

    // Connection parameters
    $dsn = 'mysql:host=localhost;port=8889;unix_socket=tmp/mysql/mysql.sock;dbname=compgc06_group30;charset=utf8;';
    $username = 'root';
    $password = 'root';
    $options = array(
        PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8',
    ); 

    // Creating the PDO
    $pdo = new PDO($dsn, $username, $password, $options);
?>