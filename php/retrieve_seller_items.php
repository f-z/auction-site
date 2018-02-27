<?php
    require_once('connect_azure_db.php');

    // Retrieving the posted data.
    $json    =  file_get_contents('php://input');
    $obj     =  json_decode($json);

    // Sanitising URL supplied values.
    $sellerID = filter_var($obj->sellerID, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);

    try {
        $stmnt = $pdo->prepare('SELECT * FROM item AS i, auction as a WHERE sellerID = :sellerID AND i.itemID = a.itemID');

        // Binding the provided username to our prepared statement.
        $stmnt->bindParam(':sellerID', $sellerID, PDO::PARAM_STR);

        $stmnt->execute();
 
        // Declaring an empty array to store the data we retrieve from the database in.
        $data = array();

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
