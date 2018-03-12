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

$sql = 'SELECT a.auctionID, u.firstName, u.email, i.itemid, i.name
        FROM user u, item i, auction a
        WHERE u.userid = i.sellerID 
        AND i.itemID = a.itemID 
        AND a.endTime < NOW()
        AND a.isNotified = 0';

$stmt = $pdo->prepare($sql);
$stmt->execute();
$sellers = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach($sellers as $seller) {

    $firstname = $seller['firstName'];
    $email = $seller['email'];
    $item_name = $seller['name'];
    $auctionID = $seller['auctionID'];

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
             
        if ($mail->send()){
            $sql2 = 'UPDATE auction SET isNotified = 1 WHERE auctionID = :auctionID;';
            $stmt2 = $pdo->prepare($sql2);
            $stmt2->bindParam(':auctionID', $auctionID, PDO::PARAM_INT);
            $stmt2->execute();
        }
    } catch (Exception $e) {
        echo json_encode('Message could not be sent. Mailer Error: ', $mail->ErrorInfo);
        die();
    }

}
?>
