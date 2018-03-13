<?php
  require_once('connect_azure_db.php');

  // Retrieving the posted data.
  $json    =  file_get_contents('php://input');
  $obj     =  json_decode($json);

  $buyerID =  filter_var($obj->buyerID, FILTER_SANITIZE_NUMBER_INT);
  $auctionID = filter_var($obj->auctionID, FILTER_SANITIZE_NUMBER_INT);
  $price = filter_var($obj->price, FILTER_SANITIZE_NUMBER_FLOAT);

  try {
                
    // Inserting new bid
    $sql3 = 'INSERT INTO `bid` (price, `time`, buyerID, auctionID) VALUES (:price, :time, :buyerID, :auctionID)';

    $insertBid = $pdo->prepare($sql3);

    $insertBid->bindParam(':price', $price, PDO::PARAM_STR); // Needs to be string, if number is float.
    $insertBid->bindParam(':buyerID', $buyerID, PDO::PARAM_INT);

    // Getting current date and time (in London, UK, timezone).
    $timezone = 'Europe/London';
    $timestamp = time();
    $currentTime = new DateTime("now", new DateTimeZone($timezone));
    $currentTime->setTimestamp($timestamp);
    $time = $currentTime->format('Y-m-d H:i:s');

    $insertBid->bindParam(':time', $time, PDO::PARAM_STR);  
    $insertBid->bindParam(':auctionID', $auctionID, PDO::PARAM_INT);

    $insertBid->execute();
    
    // Sending email to current highest bidder
    $mail->addAddress($email, $firstname);

    $mail->Subject = 'Risk Assessment Update (NHS Falls)';
    
    $mail->Body    = '
    Hi '.$firstname.',

    Thanks for placing a bid. You are the highest bidder on '.$time;  

    $mail->send();
    echo json_encode('Congratulations! Your bid has been added!');
  } catch (Exception $e) {
      $error = $e->getMessage(); 
  }
?>
