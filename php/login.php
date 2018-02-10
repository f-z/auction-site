<?php
session_start();

require_once('local_dbConnection.php');

if (isset($_POST['login'])) {

    $username = !empty($_POST['username']) ? trim($_POST['username']) : null;
    $password = !empty($_POST['password']) ? trim($_POST['password']) : null;

    $sql = "SELECT * FROM buyer WHERE username=:username";
    $check = $db->prepare($sql);

    // Bind parameter to username 
    $select->bindParam(':username',htmlspecialchars($username));

    // Execute sql statement
    $select->execute();

    // Fetch the row.
    $row = $select->fetch(PDO::FETCH_ASSOC);

    if ($row['num'] == 0){
        die ('User with these details does not exist');
    } else {
        echo 'User Exists';

        if (password_verify($_POST['password'], $user['password'])) {

            // Assign values to session variables
            $_SESSION['user_id'] = $_POST['buyerID'];
            $_SESSION['logged_in'] = true;

            // Destroy db connection object
            $db = null;
            header("location: mainpage.php");
        } else {
            // Prompt to error page in case of wrong password
            $_SESSION['message'] = "You have entered wrong password, try again!";
            header("location: error.php");
        }
    }
}
?>