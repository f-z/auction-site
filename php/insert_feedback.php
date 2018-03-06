<?php
  require_once('connect_azure_db.php');

  // Retrieving the posted data.
  $json    =  file_get_contents('php://input');
  $obj     =  json_decode($json);

  $buyerRating =  filter_var($obj->buyerRating, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
  $buyerComment =  filter_var($obj->buyerComment, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
  $sellerRating =  filter_var($obj->sellerRating, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
  $sellerComment =  filter_var($obj->sellerComment, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
  $buyerID = filter_var($obj->buyerID, FILTER_SANITIZE_NUMBER_INT);
  $sellerID = filter_var($obj->sellerID, FILTER_SANITIZE_NUMBER_INT);
  $auctionID = filter_var($obj->auctionID, FILTER_SANITIZE_NUMBER_INT);

  try {
    $sql = 'INSERT INTO `feedback` (buyerRating, buyerComment, sellerRating, sellerComment, buyerID, sellerID, auctionID) VALUES (:buyerRating, :buyerComment, :sellerRating, :sellerComment, :buyerID, :sellerID, :auctionID)';

    $insertFeedback = $pdo->prepare($sql);

    $insertFeedback->bindParam(':buyerRating', $buyerRating, PDO::PARAM_STR);
    $insertFeedback->bindParam(':buyerComment', $buyerComment, PDO::PARAM_STR);
    $insertFeedback->bindParam(':sellerRating', $sellerRating, PDO::PARAM_STR);
    $insertFeedback->bindParam(':sellerComment', $sellerComment, PDO::PARAM_STR);
    $insertFeedback->bindParam(':buyerID', $buyerID, PDO::PARAM_INT);
    $insertFeedback->bindParam(':sellerID', $sellerID, PDO::PARAM_INT);
    $insertFeedback->bindParam(':auctionID', $auctionID, PDO::PARAM_INT);

    $insertFeedback->execute();

    echo json_encode(array('message' => 'Congratulations, your feedback has been recorded!'));
    } catch (Exception $e) {
      $error = $e->getMessage();
    }
?>
