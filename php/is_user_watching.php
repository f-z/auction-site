<?php
    require_once('connect_azure_db.php');

    // Retrieving the posted data.
    $json    =  file_get_contents('php://input');
    $obj     =  json_decode($json);

    // Sanitising URL supplied values.
    $buyerID = filter_var($obj->buyerID, FILTER_SANITIZE_NUMBER_INT); 
    $auctionID = filter_var($obj->auctionID, FILTER_SANITIZE_NUMBER_INT); 


    try {
        //Retrieving item: 
         
        $stmnt = $pdo->prepare('SELECT MAX(b.price) AS maxbid FROM auction as a 
            LEFT JOIN bid AS b 
            ON b.auctionID = a.auctionID 
            WHERE a.auctionID = :auctionID AND b.buyerID = :buyerID
            HAVING maxbid = 0');
       
        // Binding the provided username to our prepared statement.
        $stmnt->bindParam(':auctionID', $auctionID, PDO::PARAM_INT);
        $stmnt->bindParam(':buyerID', $buyerID, PDO::PARAM_INT);

        $stmnt->execute();

        $data = array();
         while($row = $stmnt->fetch(PDO::FETCH_OBJ)){
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
