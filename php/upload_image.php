<?php
    require_once('connect_azure_db.php');

    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    $target_dir = "./upload/";
    $name = $_POST['name'];
    print_r($_FILES);
    $target_file = $target_dir . basename($_FILES["file"]["name"]);

    move_uploaded_file($_FILES["file"]["tmp_name"], $target_file);
?>