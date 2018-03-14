<?php
    require_once('connect_azure_db.php');

    // Retrieving the posted data.
    $json    =  file_get_contents('php://input');
    $obj     =  json_decode($json);

    // Sanitising URL supplied values.
    $username = filter_var($obj->username, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
    $password = filter_var($obj->password, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
    $hashedPass = sha1($password);
    
    $query = 'SELECT userID, username, password, role, email, firstName, lastName, photo FROM user WHERE username = :username LIMIT 1';

    $checkCredentials = $pdo->prepare($query);

    // Binding the provided username to our prepared statement.
    $checkCredentials->bindParam(':username', $username, PDO::PARAM_STR);

    $checkCredentials->execute();
 
    $row = $checkCredentials->fetch(PDO::FETCH_OBJ);

    // Checking if $data is empty.
    if ($row === false) {
        // Could not find a user with that username!
        // PS: You might want to handle this error in a more user-friendly manner!
        die ('User does not exist!');
    } else {
        // Checking to see if the given password matches the hash stored in the user table.
        // Comparing the passwords.
        $storedPass = $row->password;

        // If password is verified as true, then the user can successfully log in.
        if ($hashedPass === $storedPass) {
            // Returning data as JSON.
            echo json_encode($row);
            exit;
        } else {
            // incorrect password
            die ('Incorrect password!');
        }
}
?>
