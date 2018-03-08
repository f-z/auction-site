<?php
    require_once('connect_azure_db.php');

    // Retrieving the posted data.
    $json    =  file_get_contents('php://input');
    $obj     =  json_decode($json);

    // Sanitising URL supplied values.
    $role = filter_var($obj->userRole, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
    if ($role == 'buyer') {
        $buyerID = filter_var($obj->userID, FILTER_SANITIZE_NUMBER_INT);
    } else {
        $sellerID = filter_var($obj->userID, FILTER_SANITIZE_NUMBER_INT);
    }

    try {
        if ($role == 'buyer') {
            $stmnt = $pdo->prepare('SELECT i.itemID, i.name, i.photo, i.description, i.condition, i.quantity, i.categoryName, i.sellerID, 
                a.auctionID, a.startPrice, a.reservePrice, a.buyNowPrice, a.endTime, a.viewings, MAX(b.price) AS highestBid 
                FROM item AS i, auction as a 
                LEFT JOIN bid AS b 
                    ON a.auctionID = b.auctionID 
                    AND b.price = (SELECT MAX(price) FROM bid 
                        WHERE auctionID = a.auctionID
                )
                WHERE buyerID = :buyerID 
                AND i.itemID = a.itemID
                GROUP BY a.auctionID');

            // Binding the provided username to our prepared statement.
            $stmnt->bindParam(':buyerID', $buyerID, PDO::PARAM_INT);
        } else {
            $stmnt = $pdo->prepare('SELECT i.itemID, i.name, i.photo, i.description, i.condition, i.quantity, i.categoryName, i.sellerID, 
            a.auctionID, a.startPrice, a.reservePrice, a.buyNowPrice, a.endTime, a.viewings, MAX(b.price) AS highestBid 
            FROM item AS i, auction as a 
            LEFT JOIN bid AS b 
                ON a.auctionID = b.auctionID 
                AND b.price = (SELECT MAX(price) FROM bid 
                    WHERE auctionID = a.auctionID
            )
            WHERE sellerID = :sellerID 
            AND i.itemID = a.itemID
            GROUP BY a.auctionID');

            $stmnt->bindParam(':sellerID', $sellerID, PDO::PARAM_INT);
        }

        $stmnt->execute();
 
        // Declaring an empty array to store the data we retrieve from the database in.
        $data = array();

        // Fetching the row.
        while($row = $stmnt->fetch(PDO::FETCH_OBJ)) {
            // Assigning each row of data to an associative array.
            $data[] = $row;
        }

        // Returning data as JSON.
        echo json_encode($data);
    }
    catch(PDOException $e) {
        echo $e->getMessage();
        die();
    }
?>
