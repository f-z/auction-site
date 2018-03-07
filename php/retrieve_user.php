<?php
    require_once('connect_azure_db.php');

    // Retrieving the posted data.
    $json    =  file_get_contents('php://input');
    $obj     =  json_decode($json);

    // Sanitising URL supplied values.
    $userID = filter_var($obj->userID, FILTER_SANITIZE_NUMBER_INT);

    try {
        $stmnt = $pdo->prepare('SELECT username FROM user
           WHERE userID = :userID');

-       // Binding the provided username to our prepared statement.
        $stmnt->bindParam(':userID', $userID, PDO::PARAM_INT);
        $stmnt->execute();

        // Declaring an empty array to store the data we retrieve from the database in.
        $data = $stmnt->fetch(PDO::FETCH_OBJ);
        echo json_encode($data);
    }
    catch(PDOException $e) {
        echo $e->getMessage();
        die();
    }
?>
