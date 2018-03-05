<?php
  require_once('connect_azure_db.php');

  // Retrieving the posted data.
  $json    =  file_get_contents('php://input');
  $obj     =  json_decode($json);

  // Sanitising URL supplied values.
  $auctionID = filter_var($obj->auctionID, FILTER_SANITIZE_STRING);

  try {
    // $sql = 'SELECT * FROM bid WHERE auctionID = ? AND price IN (SELECT MAX(price) FROM bid WHERE auctionID = ?);';
    $sql = 'SELECT COUNT(bidID) AS count, MAX(price) AS highest FROM bid WHERE auctionID = ?;';
    $retrieveBid = $pdo->prepare($sql);
    $retrieveBid->bindParam(1, $auctionID, PDO::PARAM_INT);
    $retrieveBid->execute();

    // Declaring an empty array to store the data we retrieve from the database in.
    $data = array();

    $data = $retrieveBid->fetch(PDO::FETCH_OBJ);

    // Returning data as JSON.
    echo json_encode($data);
  }
  catch (Exception $e) {
    $error = $e->getMessage();
    die();
  }
?>