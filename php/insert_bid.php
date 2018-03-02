<?php
    require_once('connect_azure_db.php');

    // Retrieving the posted data.
    $json    =  file_get_contents('php://input');
    $obj     =  json_decode($json);

    $buyerID =  filter_var($obj->buyerID, FILTER_SANITIZE_NUMBER_INT);
    $auctionID = filter_var($obj->auctionID, FILTER_SANITIZE_NUMBER_INT);
    $price = filter_var($obj->price, FILTER_SANITIZE_NUMBER_FLOAT);

      try {


      	$sql = 'INSERT INTO `bid` (price, `time`, buyerID, auctionID) 
        VALUES (:price, :tim, :buyerID, :auctionID)';

        $insertBid = $pdo->prepare($sql);

        $insertItem->bindParam(':price', $price, PDO::PARAM_STR);//Needs to be string if number is float
      	$insertItem->bindParam(':buyerID', $buyerID, PDO::PARAM_INT);
      	$time = date('Y-m-d H:i:s');
      	$insertItem->bindParam(':tim', $time, PDO::PARAM_STR);  
      	$insertItem->bindParam(':auctionID', $auctionID, PDO::PARAM_INT);

      	$insertBid->execute();

        echo json_encode(array('message' => 'Congratulations, your bid has been placed!'));

      }
       catch (Exception $e) {
    $error = $e->getMessage();
    }

?>