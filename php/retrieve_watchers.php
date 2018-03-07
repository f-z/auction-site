<?php

  require_once('connect_azure_db.php');

  // Retrieving the posted data.
  $json    =  file_get_contents('php://input');
  $obj     =  json_decode($json);

  // Sanitising URL supplied values.
  $auctionID = filter_var($obj->auctionID, FILTER_SANITIZE_NUMBER_INT);

  try {
    // $sql = 'SELECT COUNT(bidID) AS count, MAX(price) as highest FROM bid WHERE auctionID = :auctionID;';

    $sql = 'SELECT COUNT(bidID) AS watchers FROM bid WHERE auctionID = :auctionID AND price=0';
    $retrieveCount = $pdo->prepare($sql);
    $retrieveCount->bindParam(':auctionID', $auctionID, PDO::PARAM_INT);
    $retrieveCount->execute();

    $data= $retrieveCount->fetch(PDO::FETCH_OBJ);

    // Returning data as JSON.
    echo json_encode($data);
  }
  catch (Exception $e) {
    $error = $e->getMessage();
    die();
  }
?>
