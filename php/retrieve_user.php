<?php
    require_once('connect_azure_db.php');

    // Retrieving the posted data.
    $json    =  file_get_contents('php://input');
    $obj     =  json_decode($json);
    $userID = filter_var($obj->userID, FILTER_SANITIZE_NUMBER_INT);

    try {
        $stmnt = $pdo->prepare('SELECT username FROM user
           WHERE userID= :userID');

        $stmnt->bindParam(':userID', $userID, PDO::PARAM_INT);
        $stmnt->execute();
        $data = $stmnt->fetch(PDO::FETCH_OBJ)) {
        echo json_encode($data);
    }
    catch(PDOException $e) {
        echo $e->getMessage();
        die();
    }
?>
