<?php
    require_once('connect_azure_db.php');

    // Retrieving the posted data.
    $json    =  file_get_contents('php://input');
    $obj     =  json_decode($json);

    // Sanitising URL supplied values.
    $userID = filter_var($obj->userID, FILTER_SANITIZE_NUMBER_INT);

    try {
        $data = array();
        $stmnt = $pdo->prepare('SELECT role FROM user WHERE userID = :userID'); //TODO NEED TO GET PHOTO TOO
        $stmnt->bindParam(':userID', $userID, PDO::PARAM_INT);
        $data = $stmnt->fetch(PDO::FETCH_OBJ);
        echo json_encode($data);
    }
    catch(PDOException $e) {
        echo $e->getMessage();
        die();
    }
?>