<?php 
try {
    require_once('connect_local_db.php');
    $get_categories_sql = 'SELECT description FROM category
    ORDER BY description';

} catch (Exception $e) {
    $error = $e->getMessage();
}

?>

<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Sign Up Form</title>
</head>

<body>

    <?php if ($pdo) {
    echo "<p>Connection successful.</p>";
} elseif (isset($error)) {
    echo "<p>$error</p>";
}
?>

<form method="POST" action="insert_item_and_auction.php" enctype="multipart/form-data">
	 <fieldset>

        <!-- item information -->

        <label for="name">Item: </label>
        <input type="text" name="name" id="name">

        <label for="description">Description: </label>
        <input type="text" id="description" name="description">

        <label for="condition">Condition: </label>
        <input type="text" id="condition" name="condition">

        <label for="quantity">quantity: </label>
        <input type="number" name="quantity" id="quantity">

 		<label for="category">Category: </label>
        <select type="text" name="category" id="category">
            <?php foreach($pdo->query($get_categories_sql) as $row){
                echo "<option value='$row[0]'>".$row['description'].'</option>';
            } ?>
        </select>

        <label for="picture">Picture: </label>
        <input type="file" name="picture">

        <!-- auction information -->

        <label for="endDate">End Date: </label>
        <input type="date" name="endDate" id="endDate">

        <label for="endTime">End Time: </label>
        <input type="time" name="endTime" id="endTime">

        <label for="startPrice">Start Price: £</label>
        <input type="number" step=".01" name="startPrice" id="startPrice">

        <label for="reservePrice">Reserve Price: £</label>
        <input type="number" step=".01" name="reservePrice" id="reservePrice">

        <label for="buyNowPrice">Buy-it-now Price: £</label>
        <input type="number" step=".01" name="buyNowPrice" id="buyNowPrice">

        <input type="submit" name="item_data">

    </fieldset>


</form>
</body>
</html>
