<?php
    require_once('connect_azure_db.php');

    // Retrieving the posted data.
    $json    =  file_get_contents('php://input');
    $obj     =  json_decode($json);

    // Sanitising URL supplied values.
    $auctionID = filter_var($obj->auctionID, FILTER_SANITIZE_NUMBER_INT); 

    try {
        // Retrieving item.
        $stmnt = $pdo->prepare('SELECT DISTINCT auction.*, item.*, COUNT(`user`.userID) AS userCount
		FROM auction
		JOIN item ON auction.itemID = item.itemID
		JOIN viewings ON auction.auctionID = viewings.auctionID
		JOIN `user` ON viewings.userID = `user`.userID
		JOIN viewings AS viewings1 ON `user`.userID = viewings1.userID
		JOIN auction AS auction1 ON viewings1.auctionID = auction1.auctionID
		WHERE auction1.auctionID = :auctionID AND auction.auctionID != auction1.auctionID 
        AND auction.endTime > NOW()
		GROUP BY auction.auctionID
		ORDER BY userCount DESC
        LIMIT 3
');
       
        // Binding the provided username to our prepared statement.
        $stmnt->bindParam(':auctionID', $auctionID, PDO::PARAM_INT);

        $stmnt->execute();

        $data=array();
            // Fetching the row.
        while($row =  $stmnt->fetch(PDO::FETCH_OBJ)){
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
