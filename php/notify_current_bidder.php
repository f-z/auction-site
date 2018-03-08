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
$currentBuyerID = filter_var($obj->buyerID, FILTER_SANITIZE_NUMBER_INT);

   try {

     // Retrieving contact details of new highest bidder
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
    $mail->setFrom('uclbay.gc06@gmail.com', 'uclbay_gc06');
    $mail->addAddress($emailCur, $firstname);

    $mail->Subject = 'UCL Databases';
    $mail->Debugoutput = 'html';
    $mail->Body = 'Hi '.$firstname.'
                    Your bid has been accepted! You are currently the highest bidder on '.$time.'!';  
        
    // $mail->send();
    
    //  echo json_encode('Message has been sent');
    echo json_encode($emailCur);
    } catch (Exception $e) {
       echo json_encode('Message could not be sent. Mailer Error: ', $mail->ErrorInfo);
       die();
   }
?>
