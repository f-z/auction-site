<?php
    require_once('connect_azure_db.php');

    // Retrieving the posted data.
    $json    =  file_get_contents('php://input');
    $obj     =  json_decode($json);

    // Sanitising URL supplied values.
    $auctionID = filter_var($obj->auctionID, FILTER_SANITIZE_NUMBER_INT);

    try {
        $incrementQuery = "UPDATE `compgc06_group30`.`auction` SET viewings = viewings + 1 WHERE auctionID = ?";

        $incrementViewings = $pdo->prepare($incrementQuery);

        $incrementViewings->bindParam(1, $auctionID, PDO::PARAM_INT);

        $incrementViewings->execute();

        $returnQuery = "SELECT viewings FROM auction WHERE auctionID = ?";

        $returnViewings = $pdo->prepare($returnQuery);

        $returnViewings->bindParam(1, $auctionID, PDO::PARAM_INT);

        $returnViewings->execute();

        // Declaring an empty array to store the data we retrieve from the database in.
        $data = array();

        $data = $returnViewings->fetch(PDO::FETCH_OBJ);

        // Returning data as JSON.
        echo json_encode($data);
    }
    catch (Exception $e) {
        $error = $e->getMessage();
    }
?>
