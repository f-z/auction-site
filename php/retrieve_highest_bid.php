<?php
    require_once('connect_azure_db.php');

    // Retrieving the posted data.
    $json    =  file_get_contents('php://input');
    $obj     =  json_decode($json);

    $auctionID = filter_var($obj->auctionID, FILTER_SANITIZE_INT);

      try {

      	$sql = 'SELECT MAX(price) as price
        FROM `bid` 
        WHERE auctionID = :auctionID';

        $retrieveBid = $pdo->prepare($sql);
        $retrieveBid->bindParam(':auctionID', $auctionID, PDO::PARAM_INT);
      	$retrieveBid->execute();

        $data = $retrieveBid ->fetch(PDO::FETCH_OBJ);
        // Returning data as JSON.
        echo json_encode($data);

      }
       catch (Exception $e) {
    $error = $e->getMessage();
      }

?>