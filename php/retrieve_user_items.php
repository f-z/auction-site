<?php
    require_once('connect_azure_db.php');

    // Retrieving the posted data.
    $json    =  file_get_contents('php://input');
    $obj     =  json_decode($json);

    // Sanitising URL supplied values.
    $userID = filter_var($obj->userID, FILTER_SANITIZE_NUMBER_INT);
    $includeExpired = filter_var($obj->includeExpired, FILTER_VALIDATE_BOOLEAN); 

    try {

        // Declaring an empty array to store the data we retrieve from the database in.
        $data = array();

        //Retrieving auctions: 

        $data['auctions']=array();

         if($includeExpired == TRUE){
            $auctionStmnt = $pdo->prepare('SELECT i.itemID, i.name, i.photo, i.description, i.condition, i.quantity, i.categoryName, i.sellerID, 
                a.auctionID, a.startPrice, a.reservePrice, a.buyNowPrice, a.endTime, a.viewings, MAX(b.price) AS highestBid 
                FROM item AS i, auction as a 
                LEFT JOIN bid AS b 
                ON a.auctionID = b.auctionID 
                AND b.price = (SELECT MAX(price) FROM bid 
                    WHERE auctionID = a.auctionID
                )
                WHERE i.itemID = a.itemID AND (sellerID = :sellerID) 
                GROUP BY a.auctionID');
        }else{

            $auctionStmnt = $pdo->prepare('SELECT i.itemID, i.name, i.photo, i.description, i.condition, i.quantity, i.categoryName, i.sellerID, 
                a.auctionID, a.startPrice, a.reservePrice, a.buyNowPrice, a.endTime, a.viewings, MAX(b.price) AS highestBid 
                FROM item AS i, auction as a 
                LEFT JOIN bid AS b 
                ON a.auctionID = b.auctionID 
                AND b.price = (SELECT MAX(price) FROM bid 
                    WHERE auctionID = a.auctionID
                )
                WHERE i.itemID = a.itemID AND (sellerID = :sellerID) AND a.endTime > NOW()
                GROUP BY a.auctionID');
        }

        // Binding the provided username to our prepared statement.
        $auctionStmnt->bindParam(':sellerID', $userID, PDO::PARAM_INT);

        $auctionStmnt->execute();
            // Fetching the row.
        while($row = $auctionStmnt->fetch(PDO::FETCH_OBJ)) {
                // Assigning each row of data to an associative array.
        $data['auctions'][] = $row;
        }
     
        //retieving user bids
        $data['topbids']=array();

         $bidsStmnt = $pdo->prepare('SELECT i.itemID, i.name, i.photo, i.description, i.condition, i.quantity, i.categoryName, i.sellerID, 
            a.auctionID, a.startPrice, a.reservePrice, a.buyNowPrice, a.endTime, a.viewings, MAX(b.price) AS highestBid 
            FROM item AS i, auction as a 
            LEFT JOIN bid AS b 
            ON a.auctionID = b.auctionID 
            AND b.price = (SELECT MAX(price) FROM bid 
                WHERE auctionID = a.auctionID
            )
            WHERE i.itemID = a.itemID AND buyerID = :buyerID 
            GROUP BY a.auctionID');

        // Binding the provided username to our prepared statement.
        $bidsStmnt->bindParam(':buyerID', $userID, PDO::PARAM_INT);
        $bidsStmnt->execute();

     // Fetching the row.
        while($row = $bidsStmnt->fetch(PDO::FETCH_OBJ)) {
            // Assigning each row of data to an associative array.
            $data['topbids'][] = $row;
        }

        //retieving user watchingbid
        $data['watching']=array();

         $watchingStmnt = $pdo->prepare('SELECT i.itemID, i.name, i.photo, i.description, i.condition, i.quantity, i.categoryName, i.sellerID, 
            a.auctionID, a.startPrice, a.reservePrice, a.buyNowPrice, a.endTime, a.viewings 
            FROM item AS i, auction as a 
            LEFT JOIN bid AS b 
            ON a.auctionID = b.auctionID 
            WHERE i.itemID = a.itemID AND buyerID = :buyerID AND MAX(b.price) = 0 AND a.endTime > adddate(NOW(),-7)

            GROUP BY a.auctionID');

        // Binding the provided username to our prepared statement.
        $watchingStmnt->bindParam(':buyerID', $userID, PDO::PARAM_INT);
        $watchingStmnt->execute();

     // Fetching the row.
        while($row = $bidsStmnt->fetch(PDO::FETCH_OBJ)) {
            // Assigning each row of data to an associative array.
            $data['watching'][] = $row;
        }

          //retieving user outbid
        $data['outbid']=array();

         $outbidStmnt = $pdo->prepare('SELECT i.itemID, i.name, i.photo, i.description, i.condition, i.quantity, i.categoryName, i.sellerID, 
            a.auctionID, a.startPrice, a.reservePrice, a.buyNowPrice, a.endTime, a.viewings, MAX(b.price) 
            FROM item AS i, auction as a 
            LEFT JOIN bid AS b 
            ON a.auctionID = b.auctionID 
            WHERE i.itemID = a.itemID AND b.buyerID = :buyerID AND b.price > 0 AND a.endTime > adddate(NOW(),-7)
            AND b.buyerID != (SELECT b2.buyerID FROM bid AS b2
                            WHERE b2.price = (SELECT MAX(b3.price) FROM bid as b3
                                            WHERE b3.auctionID = b.auctionID)
                            )
            GROUP BY a.auctionID');

        // Binding the provided username to our prepared statement.
        $outbidStmnt->bindParam(':buyerID', $userID, PDO::PARAM_INT);
        $outbidStmnt->execute();

     // Fetching the row.
        while($row = $outbidStmnt->fetch(PDO::FETCH_OBJ)) {
            // Assigning each row of data to an associative array.
            $data['outbid'][] = $row;
        }

        // Returning data as JSON.
        echo json_encode($data);
    }
    catch(PDOException $e) {
        echo $e->getMessage();
        die();
    }
?>
