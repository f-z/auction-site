<?php
  require_once('connect_azure_db.php');

  // Retrieving the posted data.
  $json    =  file_get_contents('php://input');
  $obj     =  json_decode($json);

  $auctionID = filter_var($obj->auctionID, FILTER_SANITIZE_NUMBER_INT);
  $currentBuyerID = filter_var($obj->buyerID, FILTER_SANITIZE_NUMBER_INT);

  try {

    // Retrieving userID of previous highest bidder
    $sql = 'SELECT buyerID FROM bid
    WHERE `auctionID`= :auctionID
    AND price= (select MAX(price) FROM bid where `auctionID` = :auctionID2);';

    $retrieveBidder = $pdo->prepare($sql);
    $retrieveBidder->bindParam(':auctionID', $auctionID, PDO::PARAM_INT);
    $retrieveBidder->bindParam(':auctionID2', $auctionID, PDO::PARAM_INT);
    $retrieveBidder->execute();

    $prevBidder = $retrieveBidder->fetch(PDO::FETCH_ASSOC);

    // Retrieving email of previous highest bidder
    $sql1 = 'SELECT email FROM user WHERE `userID`= :prevBidder';
    
    $retrieveEmail = $pdo->prepare($sql1);
    $retrieveEmail->bindParam(':prevBidder', $prevBidder['buyerID'], PDO::PARAM_INT);
    $retrieveEmail->execute();
    
    $stmt1 = $retrieveEmail->fetch(PDO::FETCH_ASSOC);
    
    $emailPrev = $stmt1['email'];

    // Retrieving contact details of new highest bidder
    $sql2 = 'SELECT firstName, email FROM user WHERE `userID`= :buyerID';

    $retrieveEmailCurr = $pdo->prepare($sql2);
    $retrieveEmailCurr->bindParam(':buyerID', $currentBuyerID, PDO::PARAM_INT);
    $retrieveEmailCurr->execute();

    $stmtCur = $retrieveEmailCurr->fetch(PDO::FETCH_ASSOC);

    $firstname = $row['firstName'];
    $emailCur = $row['email'];

    // Sending email to current highest bidder
    require 'email_server.php';
    
    $mail->addAddress($email, $firstname);
    
    $mail->Subject = 'Risk Assessment Update (NHS Falls)';
    
    $mail->Body = '
    Hi '.$firstname.',
    
    Thanks for placing a bid. You are the highest bidder on '.$time.'!';  
    
    $mail->send();
    
    json_encode($prevBidder);
    } catch (Exception $e) {
      $error = $e->getMessage();
      json_encode($error);
      die();
  }
?>
