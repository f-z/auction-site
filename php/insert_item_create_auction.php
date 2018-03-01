<?php
    require_once('connect_azure_db.php');

    // Retrieving the posted data.
    $json    =  file_get_contents('php://input');
    $obj     =  json_decode($json);

    // Sanitising URL supplied values.
    $name = filter_var($obj->name, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
    // $picture = addslashes(file_get_contents($_FILES['picture']['tmp_name']));
    $picture = filter_var($obj->picture, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
    $description = filter_var($obj->description, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
    $condition = filter_var($obj->condition, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
    $quantity = filter_var($obj->quantity, FILTER_SANITIZE_NUMBER_INT);
    $categoryName = filter_var($obj->categoryName, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
    $sellerID = filter_var($obj->sellerID, FILTER_SANITIZE_NUMBER_INT);

    try {
        $itemQuery = "INSERT INTO `compgc06_group30`.`item` (`name`, `picture`, `description`, `condition`, `quantity`, `categoryName`, `sellerID`) VALUES (?, ?, ?, ?, ?, ?, ?)";

        $insertItem = $pdo->prepare($itemQuery);

        $insertItem->bindParam(1, $name, PDO::PARAM_STR);
        
        $insertItem->bindParam(2, $picture, PDO::PARAM_STR);
        $insertItem->bindParam(3, $description, PDO::PARAM_STR);
        $insertItem->bindParam(4, $condition, PDO::PARAM_STR);
        $insertItem->bindParam(5, $quantity,  PDO::PARAM_INT);
        $insertItem->bindParam(6, $categoryName, PDO::PARAM_STR);
        $insertItem->bindParam(7, $sellerID, PDO::PARAM_INT);

        $insertItem->execute();

        // Adding new auction to database.

        /*
        // Getting current date and time (in London, UK, timezone).
        $itemID = $pdo->lastInsertId();
        $timezone = 'Europe/London';
        $timestamp = time();
        $currentDate = new DateTime("now", new DateTimeZone($timezone));
        $currentDate->setTimestamp($timestamp);
        $startTime = $currentDate->format('Y-m-d H:i:s');
        */

        $startDate = filter_var($obj->startDate, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        $startTime = filter_var($obj->startTime, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        $startTime = $startDate . " " . $startTime;

        $endDate = filter_var($obj->endDate, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        $endTime = filter_var($obj->endTime, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        $endTime = $endDate . " " . $endTime;

        $startPrice = filter_var($obj->startPrice, FILTER_SANITIZE_NUMBER_FLOAT);
        $reservePrice = filter_var($obj->reservePrice, FILTER_SANITIZE_NUMBER_FLOAT);
        $buyNowPrice = filter_var($obj->buyNowPrice, FILTER_SANITIZE_NUMBER_FLOAT);

        $auctionQuery = "INSERT INTO `auction` (startPrice, reservePrice, buyNowPrice, startTime, endTime, itemID) VALUES (?, ?, ?, ?, ?, ?)";

        $insertAuction = $pdo->prepare($auctionQuery);
        
        $insertAuction->bindParam(1, $startPrice, PDO::PARAM_STR);
        $insertAuction->bindParam(2, $reservePrice, PDO::PARAM_STR);
        $insertAuction->bindParam(3, $buyNowPrice, PDO::PARAM_STR);
        $insertAuction->bindParam(4, $startTime, PDO::PARAM_STR);
        $insertAuction->bindParam(5, $endTime, PDO::PARAM_STR);
        $insertAuction->bindParam(6, $itemID, PDO::PARAM_INT);

        $insertAuction->execute();
    }
    catch (Exception $e) {
        $error = $e->getMessage();
    }
?>
