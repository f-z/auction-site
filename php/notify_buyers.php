<?php
  require_once('connect_azure_db.php');

  // Retrieving the posted data.
  $json    =  file_get_contents('php://input');
  $obj     =  json_decode($json);

  $auctionID = filter_var($obj->auctionID, FILTER_SANITIZE_NUMBER_INT);
  $currentBuyerID = filter_var($obj->buyerID, FILTER_SANITIZE_NUMBER_INT);

  try {
    $to = 'fil.zofakis@gmail.com';

    $subject = 'Bid Notification';
      
    $headers = "From: uclbar@gmail.com";
      
    $message = '<p><strong>This is strong text</strong> while this is not.</p>';

    mail($to, $subject, $message, $headers);
  } catch (Exception $e) {
    $error = $e->getMessage();
  }
?>
