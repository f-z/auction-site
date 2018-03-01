<?php
  require_once('connect_azure_db.php');

  // Retrieving the posted data.
  $json    =  file_get_contents('php://input');
  $obj     =  json_decode($json);

  // Sanitising URL supplied values.
  $endTime = filter_var($obj->endTime, FILTER_SANITIZE_STRING);

  try {
    $sql = 'SELECT * FROM bid WHERE auctionID = ? AND price IN (SELECT MAX(price) FROM bid WHERE auctionID = ?);';

    $retrieveBid = $pdo->prepare($sql);
    $retrieveBid->bindParam(1, $auctionID, PDO::PARAM_INT);
    $retrieveBid->bindParam(2, $auctionID, PDO::PARAM_INT);
    $retrieveBid->execute();

    // Declaring an empty array to store the data we retrieve from the database in.
    $data = array();

    while($row = $retrieveBid->fetch(PDO::FETCH_OBJ)) {
      // Assigning each row of data to associative array.
      $data[] = $row;
    }

    // Returning data as JSON.
    echo json_encode($data);
  }
  catch (Exception $e) {
    $error = $e->getMessage();
    die();
  }
?>
