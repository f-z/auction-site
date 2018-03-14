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

    if ($insertBid->execute()){

      // Sending email to current highest bidder
      $mail->addAddress($email, $firstname);

      $mail->Subject = 'Risk Assessment Update (NHS Falls)';
      
      $mail->Body    = '
      Hi '.$firstname.',

      Thanks for placing a bid. You are the highest bidder on '.$time;  

      if ($mail->send()){
        echo json_encode('Congratulations! Your bid has been added!');
        $mailer->ClearAllRecipients(); // clear all
      }
      
      // Search users who are watching this item
      $searchWatchers = 'SELECT u.firstName, u.email, i.name, b.auctionID, b.buyerID, b.price
        FROM user u
        JOIN bid b ON b.buyerID = u.userID
        AND b.price = 0
        JOIN auction a ON a.auctionID = b.auctionID
        AND a.auctionID = :auctionID
        AND a.endTime > NOW()
        JOIN item i ON a.itemID = i.itemID';

        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':auctionID', $auctionID, PDO::PARAM_INT);
        $stmt->execute();
        $watchers = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($watchers as $watcher) {

          $watcher_firstname = $watcher['firstName'];
          $watcher_email = $watcher['email'];
          $item_name = $watcher['name'];
          $auctionID = $watcher['auctionID'];
          $watcher_buyerID = $watcher['buyerID'];

          $mail->Subject = 'UCL Databases';
          $mail->Debugoutput = 'html';
          $mail->setFrom('uclbay.gc06@gmail.com', 'UCLBay');
          $mail->addAddress($watcher_email, $watcher_firstname);
          $mail->Subject = 'Someone made a bid on '.$item_name.'';
          $mail->Debugoutput = 'html';
          $mail->Body = 'Hi '. $watcher_firstname. ', 
                            We are contacting you because you are watching '.$item_name.'. A new bid of '.$price.' was submitted!';

          if ($mail->send()){
            echo ('Congratulations! Watcher has been notified!');
            $mailer->ClearAllRecipients(); // clear all
          }

        }
      }
    } catch (Exception $e) {
      $error = $e->getMessage();
      echo $error;
  }
?>
