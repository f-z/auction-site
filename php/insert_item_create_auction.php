<?php
    require_once('connect_azure_db.php');

    // Retrieving the posted data.
    $json    =  file_get_contents('php://input');
    $obj     =  json_decode($json);

    // Sanitising URL supplied values.
    $name = filter_var($obj->name, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
    $description = filter_var($obj->description, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
    $condition = filter_var($obj->condition, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
    $quantity = filter_var($obj->quantity, FILTER_SANITIZE_INT);
    $categoryID = filter_var($obj->categoryID, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);

    $picture = addslashes(file_get_contents($_FILES['picture']['tmp_name']));

    try {
        // Retrieving the categoryID to store in the items table.
        // $q = $pdo->query("SELECT categoryID FROM `category` WHERE categoryID='$categoryID'");
        // $categoryID = $q->fetchColumn();

        // TODO: Need to retrieve the sellerID when they log in
        $sellerID = 1;

        $itemQuery = 'INSERT INTO `item` (name, picture, description, `condition`, quantity, categoryID, sellerID) 
        VALUES (:name, :picture, :description, :condition, :quantity, :categoryID, :sellerID)';

        $insertItem = $pdo->prepare($itemQuery);

        $insertItem->bindParam(':name', $name, PDO::PARAM_STR);
        $insertItem->bindParam(':picture', $picture, PDO::PARAM_LOB); // BLOB for picture
        $insertItem->bindParam(':description', $description, PDO::PARAM_LOB); // and long description
        $insertItem->bindParam(':condition', $condition, PDO::PARAM_STR);
        $insertItem->bindParam(':quantity', $quantity,  PDO::PARAM_INT);
        $insertItem->bindParam(':categoryID', $categoryID, PDO::PARAM_INT);
        $insertItem->bindParam(':sellerID', $sellerID, PDO::PARAM_INT);

        $insertItem->execute();
        
        // Adding new auction to database:
        $itemID = $pdo->lastInsertId();
        $startTime = date('Y-m-d H:i:s'); // auction start time is when form is submitted
        $endDate = $_POST['endDate'];
        $endDate = date("Y-m-d", strtotime($endDate));
        $endTime = $_POST['endTime'];
        $day = filter_var($obj->day, FILTER_SANITIZE_NUMBER_INT);
        $month = filter_var($obj->month, FILTER_SANITIZE_NUMBER_INT);
        $year = filter_var($obj->year, FILTER_SANITIZE_NUMBER_INT);

        // Converting to date format.
        $DOB = date(DATE_ATOM, mktime(0, 0, 0, $day, $month, $year));            

        $startPrice = filter_var($obj->startPrice, FILTER_SANITIZE_INT);
        $reservePrice = filter_var($obj->reservePrice, FILTER_SANITIZE_INT);
        $buyNowPrice = filter_var($obj->buyNowPrice, FILTER_SANITIZE_INT);

        $auctionQuery = 'INSERT INTO `auction` (startPrice, reservePrice, buyNowPrice, startTime, endTime, itemID)
        VALUES (:startPrice, :reservePrice, :buyNowPrice, :startTime, :endTime, :itemID)';

        $insertAuction = $pdo->prepare($auctionQuery);
        
        $insertAuction->bindParam(':startPrice', $startPrice, PDO::PARAM_STR);
        $insertAuction->bindParam(':reservePrice', $reservePrice, PDO::PARAM_STR);
        $insertAuction->bindParam(':buyNowPrice', $buyNowPrice, PDO::PARAM_STR);
        $insertAuction->bindParam(':startTime', $startTime, PDO::PARAM_STR);
        $insertAuction->bindParam(':endTime', $combinedEndTime, PDO::PARAM_STR);
        $insertAuction->bindParam(':itemID', $itemID, PDO::PARAM_INT);

        $insertAuction->execute();
    }
    catch (Exception $e) {
    $error = $e->getMessage();
    }
?>