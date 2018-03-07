<?php

// This script allows to specify email server settings

// Import PHPMailer classes
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

//Load composer's autoloader
require 'phpmailer/vendor/autoload.php';
require 'phpmailer/src/PHPMailer.php';
require 'phpmailer/src/SMTP.php';
require 'phpmailer/src/Exception.php';

//Create a new PHPMailer instance. Passing `true` enables exceptions
$mail = new PHPMailer(true);

//Server settings
//Enable SMTP debug
// 0 = off (for production use)
// 1 = client messages
// 2 = client and server messages
$mail -> SMTPDebug = 0;

$mail->isSMTP();

// Set hostname
$mail->Host = 'smtp.gmail.com';

$mail->SMTPAuth = true;
$mail->Username = 'uclbay.gc06@gmail.com';
$mail->Password = 'uclbay_gc06';
// enable 'tls'  to prevent security issues
$mail->SMTPSecure = 'tls';
$mail->Port = 25;
// walkaround to bypass server errors
$mail->SMTPOptions = array(
'ssl' => array(
    'verify_peer' => false,
    'verify_peer_name' => false,
    'allow_self_signed' => true
)
);

//Set message sender
$mail -> setFrom('uclbay.gc06@gmail.com', 'UCL Database');

//Setting email format to html
$mail->isHTML(true);
?>