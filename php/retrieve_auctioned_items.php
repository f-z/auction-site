<?php
    require_once('connect_azure_db.php');

    $data = array();

    // Attempting to query database table and retrieve data.
    try {
       $stmt = $pdo->query('SELECT * FROM item, auction WHERE item.itemID = auction.itemID');
       
       while($row = $stmt->fetch(PDO::FETCH_OBJ))
       {
          // Assigning each row of data to associative array.
          $data[] = $row;
       }
 
       // Returning data as JSON.
       echo json_encode($data);
    }
    catch(PDOException $e)
    {
       echo $e->getMessage();
    }
?>
