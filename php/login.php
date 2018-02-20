<?php
    require_once('connect_azure_db.php');

    // Retrieving the posted data.
    $json    =  file_get_contents('php://input');
    $obj     =  json_decode($json);

    // Sanitising URL supplied values.
    $userRole = filter_var($obj->userRole, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
    $username = filter_var($obj->username, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
    $password = filter_var($obj->password, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
    
    if ($userRole == 'buyer') {
        $query = 'SELECT buyerID, username, password, email, firstName, lastName FROM buyer WHERE username = :username LIMIT 1';
    }
    else if ($userRole == 'seller') {
        $query = 'SELECT sellerID, username, password, email, firstName, lastName FROM seller WHERE username = :username LIMIT 1';
    }
    else {
        die('Incorrect user role, closing connection!');
    }

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
        if ($password === $storedPass) {
            if ($userRole == 'buyer') {
                $row->ID = $row->buyerID;
                unset($row->buyerID);
            }
            else if ($userRole == 'seller') {
                $row->ID = $row->sellerID;
                unset($row->sellerID);
            }

            // Returning data as JSON.
            echo json_encode($row);
            exit;
        } else {
            // incorrect password
            die ('Incorrect password!');
        }
}
?>