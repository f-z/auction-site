<?php
    require_once('connect_azure_db.php');

    // Retrieving the posted data.
    $json    =  file_get_contents('php://input');
    $obj     =  json_decode($json);

    // Sanitising URL supplied values.
    $itemID = filter_var($obj->itemID, FILTER_SANITIZE_NUMBER_INT);

    // Attempting to query database table
    // and retrieve auction information for the specified item from the database.
    try {
        $stmnt = $pdo->prepare('SELECT * FROM auction WHERE itemID = :itemID');
        
        // Binding the provided item ID to our prepared statement.
        $stmnt->bindParam(':itemID', $itemID, PDO::PARAM_INT);

        $stmnt->execute();
        
        // Fetching the row.
        while($row = $stmnt->fetch(PDO::FETCH_OBJ)) {
           // Assigning each row of data to an associative array.
           $data[] = $row;
        }

        // Returning data as JSON.
        echo json_encode($data);
    }
    catch(PDOException $e) {
        echo $e->getMessage();
        die();
    }
?>
