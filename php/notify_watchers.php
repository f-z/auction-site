<?php
  require_once('connect_azure_db.php');

  // Retrieving the posted data.
  $json    =  file_get_contents('php://input');
  $obj     =  json_decode($json);

  $auctionID = filter_var($obj->auctionID, FILTER_SANITIZE_NUMBER_INT);
  $newBid = filter_var($obj->highestBid, FILTER_SANITIZE_NUMBER_INT);

  try {

    // Search users who are watching this item
    $searchWatchers = 'SELECT u.firstName, u.email, i.name, b.auctionID, b.buyerID, b.price
    FROM user u
    JOIN bid b ON b.buyerID = u.userID
    AND b.price = 0
    JOIN auction a ON a.auctionID = b.auctionID
    AND a.auctionID = :auctionID
    AND a.endTime > NOW()
    JOIN item i ON a.itemID = i.itemID';

    $stmt = $pdo->prepare($searchWatchers);
    $stmt->bindParam(':auctionID', $auctionID, PDO::PARAM_INT);
    $stmt->execute();
    $watchers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!empty($watchers)) {

        foreach ($watchers as $watcher) {

            $watcher_firstname = $watcher['firstName'];
            $watcher_email = $watcher['email'];
            $item_name = $watcher['name'];
            $auctionID = $watcher['auctionID'];
            $watcher_buyerID = $watcher['buyerID'];

            //Server settings
            $mail->isSMTP();
            $mail->SMTPDebug = 2;
            $mail->Host = 'smtp.gmail.com';
            $mail->Port = 587;
            $mail->SMTPSecure = 'tls'; // enable 'tls'  to prevent security issues
            $mail->SMTPAuth = true;
            $mail->Username = 'uclbay.gc06@gmail.com';
            $mail->Password = 'uclbay@gc06';
            // walkaround to bypass server errors
            $mail->SMTPOptions = array(
            'ssl' => array(
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
                )
            );
            $mail->Debugoutput = 'html';
            $mail->setFrom('uclbay.gc06@gmail.com', 'UCLBay');

            $mail->addAddress($watcher_email, $watcher_firstname);
            $mail->Subject = 'Someone made a bid on '.$item_name.'';
            $mail->Body = 'Hi '. $watcher_firstname. ', 
                            We are contacting you because you are watching '.$item_name.'. A new bid worth '.$newBid.' pounds was submitted!';

            if ($mail->send()){
            echo ('Congratulations! '.$watcher_firstname.' has been notified!');
            }
        }
    }
 } catch (Exception $e) {
    echo json_encode('Message could not be sent! Mailer Error: ', $mail->ErrorInfo);
    die();
}
?>