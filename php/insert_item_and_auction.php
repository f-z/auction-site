<?php
    require_once('connect_local_db.php');

if(isset($_POST['item_data'])){
    try{

        $name = $_POST['name'];
        $description = $_POST['description'];
        $condition = $_POST['condition'];
        $quantity = $_POST['quantity'];
        $category_description =  $_POST['category'];
        //TODO: Need to check picture file is not too large
        $picture = addslashes(file_get_contents($_FILES['picture']['tmp_name']));

        //Retrieve the categoryID to store in the items table 
        $q= $pdo->query("SELECT categoryID FROM `category` WHERE description='$category_description'");
        $categoryID = $q->fetchColumn();

        //TODO: Need to retrieve the sellerID when they log in
        $sellerID = 1;

        $sql = 'INSERT INTO `item` (name, picture, description, `condition`, quantity, categoryID, sellerID) 
        VALUES (:name, :picture, :description, :condition, :quantity, :categoryID, :sellerID)';

        $insertItem = $pdo->prepare($sql);

        $insertItem->bindParam(':name', $name, PDO::PARAM_STR);
        $insertItem->bindParam(':picture', $picture, PDO::PARAM_LOB);  //BLOB for picture
        $insertItem->bindParam(':description', $description); //BLOB for descriptions?
        $insertItem->bindParam(':condition', $condition, PDO::PARAM_STR);
        $insertItem->bindParam(':quantity', $quantity,  PDO::PARAM_INT);
        $insertItem->bindParam(':categoryID', $categoryID, PDO::PARAM_INT);
        $insertItem->bindParam(':sellerID', $sellerID, PDO::PARAM_INT);

        $insertItem->execute();
        
        //Add new auction to database: 

        $itemID = $pdo->lastInsertId();
        $startTime = date('Y-m-d H:i:s'); // auction start time is when form is submitted

        $endDate = $_POST['endDate'];
        $endDate = date("Y-m-d", strtotime($endDate));
        $endTime = $_POST['endTime'];
        $combinedEndTime = date('Y-m-d H:i:s', strtotime("$endDate $endTime")); //combining date and time to datetime

        $startPrice = $_POST['startPrice'];
        $reservePrice = $_POST['reservePrice'];
        $buyNowPrice = $_POST['buyNowPrice'];

        $sql2 = 'INSERT INTO `auction` (startPrice, reservePrice, buyNowPrice, startTime, endTime, itemID)
        VALUES (:startPrice, :reservePrice, :buyNowPrice, :startTime, :endTime, :itemID)';

        $insertAuction = $pdo->prepare($sql2);
        
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

//    if (isset($error)) {
//   echo $error;
//    }

}

?>