<?php
  require_once('connect_azure_db.php');

  // Retrieving the posted data.
  $json    =  file_get_contents('php://input');
  $obj     =  json_decode($json);

  $auctionID = filter_var($obj->auctionID, FILTER_SANITIZE_NUMBER_INT);
  $currentBuyerID = filter_var($obj->buyerID, FILTER_SANITIZE_NUMBER_INT);
  $newBid = filter_var($obj->highestBid, FILTER_SANITIZE_NUMBER_INT);

  try {
    // Retrieving contact details of new highest bidder.
    $sql2 = 'SELECT firstName, email FROM user WHERE `userID`= :buyerID';

    $retrieveEmailCurr = $pdo->prepare($sql2);
    $retrieveEmailCurr->bindParam(':buyerID', $currentBuyerID, PDO::PARAM_INT);
    $retrieveEmailCurr->execute();

    $stmtCur = $retrieveEmailCurr->fetch(PDO::FETCH_ASSOC);

    $firstname = $stmtCur['firstName'];
    $emailCur = $stmtCur['email'];
     
    // Getting current date and time (in London, UK, timezone).
    $timezone = 'Europe/London';
    $timestamp = time();
    $currentTime = new DateTime("now", new DateTimeZone($timezone));
    $currentTime->setTimestamp($timestamp);
    $time = $currentTime->format('Y-m-d H:i:s');
     
    // Include file with mailer settings
    require_once('email_server.php');
    
    $mail->addAddress($emailCur, $firstname);
    $mail->Subject = 'Your bid is winning';
    $mail->Body = 'Hi '.$firstname.',
                    Thanks for placing a bid of '.$newBid.' pounds. It has been accepted. You are currently the highest bidder ('.$time.')!';  
        
    if($mail->send()) {
      echo json_encode('Email to current bidder has been sent!');
    }
    } catch (Exception $e) {
       echo json_encode('Message could not be sent! Mailer Error: ', $mail->ErrorInfo);
       die();
   }
?>
