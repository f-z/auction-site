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
  $highestBidderID = filter_var($obj->prevBidderID, FILTER_SANITIZE_NUMBER_INT);
  $newBuyerID = filter_var($obj->newBuyer, FILTER_SANITIZE_NUMBER_INT);
  
    try {
        
        if ($highestBidderID == $newBuyerID) {
            break;
        } else {
            
            // Retrieving userID of previous highest bidder
             $sql = 'SELECT firstName, email FROM user
             WHERE userID = :buyerID';
             $retrieveBidder = $pdo->prepare($sql);
             $retrieveBidder->bindParam(':buyerID', $highestBidderID, PDO::PARAM_INT);
             $retrieveBidder->execute();
             $prevBidder = $retrieveBidder->fetch(PDO::FETCH_ASSOC);
             
             $emailPrev = $prevBidder['email'];
             $namePrev = $prevBidder['firstName'];
        //      if (strcmp($emailCur, $emailPrev) != 0) {
                
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
            $mail->addAddress($emailPrev, $namePrev);
            $mail->Subject = 'UCL Databases';
            $mail->Debugoutput = 'html';
            $mail->Body = 'Hi '.$namePrev.', 
                             You were outbid! Do not hesitate to jump back in! We still have what you are looking for!';  
                 
            $mail->send();
            //   echo json_encode($mail);
             echo json_encode('Email to previous bidder has been sent!');
            
        }
     
     
} catch (Exception $e) {
    echo json_encode('Message could not be sent. Mailer Error: ', $mail->ErrorInfo);
    die();
}
?>