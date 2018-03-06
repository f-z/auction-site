<?php
    require_once('connect_azure_db.php');

    // Retrieving the posted data.
    $json    =  file_get_contents('php://input');
    $obj     =  json_decode($json);

    // Sanitising URL supplied values.
    $buyerID = filter_var($obj->buyerID, FILTER_SANITIZE_NUMBER_INT);

    try {
        $stmnt = $pdo->prepare('SELECT b.bidID, b.time, b.buyerID, MAX(b.price) as price,
        i.itemID, i.name, i.picture, i.description, i.`condition`, i.categoryName, i.sellerID, 
        a.reservePrice, a.buyNowPrice, a.endTime, a.viewings, a.auctionID
        FROM bid AS b, item AS i, auction AS a  
        WHERE  b.buyerID = :buyerID
        AND i.itemID = a.itemID
        AND b.auctionID = a.auctionID
        GROUP BY a.auctionID');

        // Binding the provided username to our prepared statement.
        $stmnt->bindParam(':buyerID', $buyerID, PDO::PARAM_INT);

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
