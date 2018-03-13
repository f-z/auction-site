<?php
    require_once('connect_azure_db.php');

    // Retrieving the posted data.
    $json    =  file_get_contents('php://input');
    $obj     =  json_decode($json);

    // Sanitising URL supplied values.
    $auctionID = filter_var($obj->auctionID, FILTER_SANITIZE_NUMBER_INT);
    $userID = filter_var($obj->userID, FILTER_SANITIZE_NUMBER_INT);

    try {

        $query = 'SELECT * FROM `viewings` WHERE auctionID=:auctionID AND userID=:userID';
        $findViews = $pdo->prepare($query);
        $findViews>bindParam(':auctionID', $auctionID, PDO::PARAM_INT);
        $findViews>bindParam(':userID', $userID, PDO::PARAM_INT);
        $findViews->execute();
        $result = $findViews->fetch(PDO::FETCH_OBJ);

        if (empty($result)) { // If user has not viewed the auction before

            $incrementQuery =  'INSERT INTO `viewings` (auctionID, userID, viewCount) 
                                VALUES (:auctionID, :userID, 1)';

            $incrementViewings = $pdo->prepare($incrementQuery);
            $incrementViewings->bindParam(':auctionID', $auctionID, PDO::PARAM_INT);
            $incrementViewings->bindParam(':userID', $userID, PDO::PARAM_INT); 
            $incrementViewings->execute();

         }else { // If user has already viewed the auction

            $incrementQuery = 'UPDATE viewings 
                            SET viewCount = viewCount + 1 
                             WHERE auctionID = :auctionID AND userID = :userID';

            $incrementViewings = $pdo->prepare($incrementQuery);
            $incrementViewings->bindParam(':auctionID', $auctionID, PDO::PARAM_INT);
            $incrementViewings->bindParam(':userID', $userID, PDO::PARAM_INT); 
            $incrementViewings->execute();
        }

        $query = 'SELECT COUNT(userID) AS distinctViewings, SUM(viewCount) AS totalViewings 
                    FROM `viewings` WHERE auctionID=:auctionID';
        
        $findViews = $pdo->prepare($query);
        $findViews>bindParam(':auctionID', $auctionID, PDO::PARAM_INT);
        $findViews->execute();
        $data = $findViews->fetch(PDO::FETCH_OBJ);
  
        echo json_encode($data);
    }
    catch (Exception $e) {
        $error = $e->getMessage();
        echo($error);
    }
?>
