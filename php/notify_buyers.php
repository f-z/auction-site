<?php
    require_once('connect_azure_db.php');

    // Retrieving the posted data.
    $json    =  file_get_contents('php://input');
    $obj     =  json_decode($json);

    $auctionID =  filter_var($obj->auctionID, FILTER_SANITIZE_NUMBER_INT);

    try {

    } catch (Exception $e) {
      $error = $e->getMessage();
    }
?>
