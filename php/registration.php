<?php
    require_once('azure_dbConnection.php');

    // Retrieving the posted data
    $json    =  file_get_contents('php://input');
    $obj     =  json_decode($json);

    // Sanitising URL supplied values
    $username = filter_var($obj->username, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
    $email	  = filter_var($obj->email, FILTER_SANITIZE_EMAIL);

    // Attempting to query database table
    // and check if user already exists in database
   try {
        $stmnt = $pdo->prepare('SELECT username, email FROM buyer WHERE username = :username AND email = :email LIMIT 1');

        // Binding the provided username to our prepared statement
        $stmnt->bindParam(':username', $username, PDO::PARAM_STR);

        // Binding the provided email to our prepared statement
        $stmnt->bindParam(':email', $email, PDO::PARAM_STR);

        $stmnt->execute();
        
        // Fetching the row
        while($row  = $stmnt->fetch(PDO::FETCH_OBJ))
        {
           // Assigning each row of data to an associative array
           $data[] = $row;
        }
     }
     catch(PDOException $e) {
        echo $e->getMessage();
     }

    if($data != null){
        die('User with these details already exists!');
    }
    else {
        try {
            $password = filter_var($obj->password, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
            $passwordHash = password_hash($password, PASSWORD_BCRYPT, array("cost" => 12));
            $firstName = filter_var($obj->firstName, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
            $lastName = filter_var($obj->lastName, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
            $street = filter_var($obj->street, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
            $city = filter_var($obj->city, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
            $postcode = filter_var($obj->postcode, FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
            $phone = filter_var($obj->phone, FILTER_SANITIZE_NUMBER_INT);
            $photo = null;

            $day = filter_var($obj->day, FILTER_SANITIZE_NUMBER_INT);
            $month = filter_var($obj->month, FILTER_SANITIZE_NUMBER_INT);
            $year = filter_var($obj->year, FILTER_SANITIZE_NUMBER_INT);

            // Convertin to date format
            $DOB = strtotime("$year-$month-$day");

            $sql = 'INSERT INTO buyer(username, password, photo, firstName, lastName, DOB, email, phone, street, city, postcode) VALUES (:username, :password, :photo, :firstname, :lastname, :DOB, :email, :phone, :street, :city, :postcode)';

            $insert = $pdo->prepare($sql);

            $insert->bindParam(':username', $username, PDO::PARAM_STR);
            $insert->bindParam(':email', $email, PDO::PARAM_STR);
            $insert->bindParam(':password', $passwordHash, PDO::PARAM_STR);
            $insert->bindParam(':DOB', $dob, PDO::PARAM_STR);
            $insert->bindParam(':firstname', $firstName, PDO::PARAM_STR);
            $insert->bindParam(':lastname', $lastName, PDO::PARAM_STR);
            $insert->bindParam(':photo', $photo, PDO::PARAM_STR);
            $insert->bindParam(':phone', $phone, PDO::PARAM_INT);
            $insert->bindParam(':street', $street, PDO::PARAM_STR);
            $insert->bindParam(':city', $city, PDO::PARAM_STR);
            $insert->bindParam(':postcode', $postcode, PDO::PARAM_STR);

            $insert->execute();
            echo json_encode(array('message' => 'Congratulations, the record ' . $username . ' was added to the database!'));
        }
        // Catching any errors in running the prepared statement
        catch(PDOException $ex) {
           echo $ex->getMessage();
        }
    }
?>