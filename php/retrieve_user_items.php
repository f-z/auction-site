<?php
    require_once('connect_azure_db.php');

    // Retrieving the posted data.
    $json    =  file_get_contents('php://input');
    $obj     =  json_decode($json);

    // Sanitising URL supplied values.
    $userID = filter_var($obj->userID, FILTER_SANITIZE_NUMBER_INT);

    try {

        // Declaring an empty array to store the data we retrieve from the database in.
        $data = array();

        //Retrieving auctions: 

        $data['auctions']=array();
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

        // Binding the provided username to our prepared statement.
        $auctionStmnt->bindParam(':sellerID', $userID, PDO::PARAM_INT);
        $auctionStmnt->execute();

        // Fetching the row.
        while($row = $auctionStmnt->fetch(PDO::FETCH_OBJ)) {
            // Assigning each row of data to an associative array.
            $data['auctions'][] = $row;
        }


        //retieving user bids
        $data['bids']=array();

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
            $data['bids'][] = $row;
        }
        // Returning data as JSON.
        echo json_encode($data);
    }
    catch(PDOException $e) {
        echo $e->getMessage();
        die();
    }
?>
