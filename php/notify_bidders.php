<?php
// Allowing access.
header('Access-Control-Allow-Origin: *');

// Defining database connection parameters.
$hn      = 'compgc06-team-30-server.mysql.database.azure.com';
$un      = 'team-30-admin@compgc06-team-30-server';
$pwd     = 'MariaDB?Really?';
$db      = 'compgc06_group30';
$cs      = 'utf8';

// Setting up the PDO parameters.
$dsn 	= "mysql:host=" . $hn . ";port=3306;dbname=" . $db . ";charset=" . $cs;
$opt 	= array(
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ,
                    PDO::ATTR_EMULATE_PREPARES   => false,
                );
try {
    // Creating a PDO instance (connecting to the database).
    $pdo 	= new PDO($dsn, $un, $pwd, $opt);   
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Load composer's autoloader.
require_once('./vendor/autoload.php');

$sql = 'SELECT u.firstName, u.email, i.name, b.auctionID, b.buyerID
        FROM user u
        JOIN bid b ON b.buyerID = u.userID
        AND b.price != (SELECT max(b2.price) FROM bid b2, auction a2 WHERE b2.auctionID = b.auctionID)
        JOIN auction a ON a.auctionID = b.auctionID
        AND b.isNotified = 0
        AND a.endTime < NOW()
        JOIN item i ON a.itemID = i.itemID
        GROUP BY u.userID;';

$stmt = $pdo->prepare($sql);
$stmt->execute();
$bidders = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach($bidders as $bidder){

    $firstname = $bidder['firstName'];
    $email = $bidder['email'];
    $item_name = $bidder['name'];
    $auctionID = $bidder['auctionID'];
    $buyerID = $bidder['buyerID'];

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
        $mail->Subject = ''.$item_name.' was sold';
        $mail->Debugoutput = 'html';
        $mail->Body = 'Hi '. $firstname. ', 
                          This item is unfortunately now sold, but there is more!';
             
        if ($mail->send()){
            $sql2 = 'UPDATE bid SET isNotified = 1 WHERE auctionID = :auctionID AND buyerID = :buyerID;';
            $stmt2 = $pdo->prepare($sql2);
            $stmt2->bindParam(':auctionID', $auctionID, PDO::PARAM_INT);
            $stmt2->bindParam(':buyerID', $buyerID, PDO::PARAM_INT);
            $stmt2->execute();
        }
    } catch (Exception $e) {
        echo json_encode('Message could not be sent. Mailer Error: ', $mail->ErrorInfo);
        die();
    }
}
?>
