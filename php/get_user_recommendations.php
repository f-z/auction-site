<?php 

  require_once('connect_azure_db.php');

    // Retrieving the posted data.
    $json    =  file_get_contents('php://input');
    $obj     =  json_decode($json);

    // Sanitising URL supplied values.
    $userID = filter_var($obj->userID, FILTER_SANITIZE_NUMBER_INT); 

    try{

    $stmnt = $pdo->prepare('SELECT other_user_views.userID AS other_userID, COUNT(*) AS same_auction_count
        FROM viewing AS other_user_views 
        JOIN viewing AS current_user_views 
        ON current_user_views.auctionID =  other_user_views.auctionID 
          AND current_user_views.userID = :userID
            AND current_user_views.userID != other_user_views.userID
        
        GROUP BY other_user_views.userID
        ORDER BY same_auction_count DESC
        LIMIT 3');

        // Binding the provided username to our prepared statement.
        $stmnt->bindParam(':userID', $userID, PDO::PARAM_INT);

        $stmnt->execute();

        $similarUserIds=array();
            // Fetching the row.
        while($row =  $stmnt->fetch(PDO::FETCH_NUM)){
            $similarUserIds[] = $row[0];
        }

        //data containing objects
        $data = array();
        $limit = 4;

        foreach($similarUserIds AS $value){

            $stmnt = $pdo->prepare('SELECT v.auctionID, i.itemID, i.name, i.photo, i.description, i.`condition`, i.quantity, i.categoryName, i.sellerID, 
                        a.auctionID, a.startPrice, a.reservePrice, a.buyNowPrice, a.endTime, 
                        CASE WHEN MAX(b.price) > 0 THEN MAX(b.price) END AS highestBid
                    FROM viewing AS v
                    LEFT JOIN auction AS a ON v.auctionID = a.auctionID
                    LEFT JOIN item AS i ON a.itemID = i.itemID 
                    LEFT JOIN bid as b ON v.auctionID = b.auctionID
                    WHERE v.userID = :other_userID
                    AND v.auctionID NOT IN (
                        SELECT auctionID
                        FROM viewing AS v1
                        WHERE v1.userID = :userID)
                    GROUP BY b.auctionID
                    LIMIT :returnLimit');

            $stmnt->bindParam(':userID', $userID, PDO::PARAM_INT);
            $stmnt->bindParam(':other_userID', $value, PDO::PARAM_INT);
            $stmnt->bindParam(':returnLimit', $limit, PDO::PARAM_INT);
            $limit = $limit - 1;
            $stmnt->execute();

            $results = array();

            while( $row = $stmnt->fetch(PDO::FETCH_OBJ)){
                $results[] = $row;
            }
                
            if(empty($data)){
                $data = $results;
            } elseif(!empty($results)) {
                $data = array_merge($data, $results);
            }
        }
    
        $data = array_filter($data);
        $data = array_unique($data, SORT_REGULAR);
        $data = array_values($data);

        echo json_encode($data);

}  catch(PDOException $e) {
        echo $e->getMessage();
        die();
    }
?>
