<?php

  require_once('connect_azure_db.php');

  $json    =  file_get_contents('php://input');
  $obj     =  json_decode($json);

  $sellerID = filter_var($obj->sellerID, FILTER_SANITIZE_NUMBER_INT);

  try {

      //Get average rating
      $averageRatingQuery = 'SELECT AVG(f.buyerRating) as average, u.username 
                            FROM feedback AS f
                            INNER JOIN `user` AS u ON u.userID = f.sellerID
                            WHERE sellerID = :sellerID';

      $getSellersAverage = $pdo->prepare($averageRatingQuery);
      $getSellersAverage->bindParam(':sellerID', $sellerID, PDO::PARAM_INT);
      $getSellersAverage->execute();
      $sellersAverage = $getSellersAverage->fetch(PDO::FETCH_OBJ);
      $data = $sellersAverage;

      echo json_encode($data);
  }
  catch (Exception $e) {
    $error = $e->getMessage();
    die();
  }
?>
