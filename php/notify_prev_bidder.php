<?php
  require_once('connect_azure_db.php');
  
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

//Load composer's autoloader
require_once('./vendor/autoload.php');

$mail = new PHPMailer(true);


  // Retrieving the posted data.
  $json    =  file_get_contents('php://input');
  $obj     =  json_decode($json);

  $auctionID = filter_var($obj->auctionID, FILTER_SANITIZE_NUMBER_INT);
  $emailCur = filter_var($obj->emailPrev, FILTER_SANITIZE_NUMBER_INT);

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
     $sql1 = 'SELECT firstName, email FROM user WHERE `userID`= :prevBidder';
    
     $retrieveEmail = $pdo->prepare($sql1);
     $retrieveEmail->bindParam(':prevBidder', $prevBidder['buyerID'], PDO::PARAM_INT);
     $retrieveEmail->execute();
    
     $stmt1 = $retrieveEmail->fetch(PDO::FETCH_ASSOC);
    
     $firstnamePrev = $stmt1['firstName'];
     $emailPrev = $stmt1['email'];

     if (strcmp($emailCur, $emailPrev) != 0) {
        
        $mail = new PHPMailer(true);

        //Server settings
        $mail->isSMTP();
        $mail->SMTPDebug = 2;
        $mail->Host = 'smtp.gmail.com';
        $mail->Port = 587;
        $mail->SMTPSecure = 'tls'; // enable 'tls'  to prevent security issues
        $mail->SMTPAuth = true;
        $mail->Username = 'uclbay.gc06@gmail.com';
        $mail->Password = 'uclbay_gc06';
        // walkaround to bypass server errors
        $mail->SMTPOptions = array(
        'ssl' => array(
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true
        )
        );
        $mail->Subject = 'UCL Databases';
        $mail->Debugoutput = 'html';
   
        $mail->setFrom('uclbay.gc06@gmail.com', 'uclbay_gc06');
        $mail->addAddress($emailPrev, $firstnamePrev);
   
        $mail->Subject = 'UCL Databases';
        $mail->Debugoutput = 'html';
        $mail->Body = 'Hi '.$firstnamePrev.'
                         You were outbid! Do not hesitate to jump back in! We still have what you are looking for!';  
             
        // $mail->send();
       }
     
     echo json_encode($emailPrev);
} catch (Exception $e) {
   echo json_encode('Message could not be sent. Mailer Error: ', $mail->ErrorInfo);
   die();
}

?>