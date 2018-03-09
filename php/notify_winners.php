<?php

require_once('connect_azure_db.php');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Load composer's autoloader.
require_once('./vendor/autoload.php');

$sql = 'SELECT u.userid, u.firstname, u.email, i.itemid, i.name
        FROM user u, item i, auction a
        WHERE u.userid = i.sellerID 
        AND i.itemID = a.itemID 
        AND a.endTime < NOW()';

$stmt = $pdo->prepare($sql);
$stmt->execute();
$sellers = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach($sellers as $seller){

    $firstname = $seller['firstName'];
    $email = $seller['email'];
    $item_name = $seller['name'];

    try {
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
        $mail->addAddress($email, $firstname);
        $mail->Subject = 'Auction Expired';
        $mail->Debugoutput = 'html';
        $mail->Body = 'Hi '.$firstname.', 
                         Your auction for '.$item_name.' has ended!';
             
        $mail->send();
    } catch (Exception $e) {
        echo json_encode('Message could not be sent. Mailer Error: ', $mail->ErrorInfo);
        die();
    }

}
             
?>