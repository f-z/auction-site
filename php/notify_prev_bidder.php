<?php
  require_once('connect_azure_db.php');

    // Retrieving the posted data.
    $json    =  file_get_contents('php://input');
    $obj     =  json_decode($json);
    $auctionID = filter_var($obj->auctionID, FILTER_SANITIZE_NUMBER_INT);
    $highestBidderID = filter_var($obj->prevBidderID, FILTER_SANITIZE_NUMBER_INT);
    $newBuyerID = filter_var($obj->newBuyer, FILTER_SANITIZE_NUMBER_INT);

    try {
        if (!($highestBidderID == $newBuyerID)) {
            // Retrieving userID of previous highest bidder
            $sql = 'SELECT firstName, email FROM user
            WHERE userID = :buyerID';
            $retrieveBidder = $pdo->prepare($sql);
            $retrieveBidder->bindParam(':buyerID', $highestBidderID, PDO::PARAM_INT);
            $retrieveBidder->execute();
            $prevBidder = $retrieveBidder->fetch(PDO::FETCH_ASSOC);
             
            $emailPrev = $prevBidder['email'];
            $namePrev = $prevBidder['firstName'];
                
            // Include file with mailer settings
            require_once('email_server.php');

            $mail->addAddress($emailPrev, $namePrev);
            $mail->Subject = 'You were outbid!';
            $mail->Body = 'Hi '.$namePrev.', 
                             You were outbid! Do not hesitate to jump back in! The item is still up for grabs!';  
                 
            if ($mail->send()){
                echo json_encode('Email to previous bidder has been sent!');
            }
        } else {
            echo json_encode('You are previous bidder');
        }
    } catch (Exception $e) {
        echo json_encode('Message could not be sent. Mailer Error: ', $mail->ErrorInfo);
        die();
    }
?>
