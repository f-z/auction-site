<?php
    require_once('connect_azure_db.php');
    $target_dir = "./uploads/";
    $result="";
    $status=200;//:number;
    $error=true;//:boolean;
    $imagename=generateRandomString(20);
    $target_file = $target_dir . $imagename.basename($_FILES["photo"]["name"]);
    $uploadOk = 1;
    $imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
    // Check if image file is a actual image or fake image
     
       $check = getimagesize($_FILES["photo"]["tmp_name"]);
       if($check !== false) {
         // echo "File is an image - " . $check["mime"] . ".";
           $uploadOk = 1; 
           // Check if file already exists
           if (file_exists($target_file)) {
               $result= "Sorry, file already exists.";
               $error=true;   
               $uploadOk = 0;
           }
           else{
               // Check file size
               if ($_FILES["photo"]["size"] > 5000000) {
                   $result.= "Sorry, your file is too large."; 
                   $error=true;   
                   $uploadOk = 0;
               }
               else{
                   // Allow certain file formats
                   if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"&& $imageFileType != "gif" ) {
                      $error=true;
                     $result.= "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
                        $uploadOk = 0;
                   }
                   else{
                       // Check if $uploadOk is set to 0 by an error
                       if ($uploadOk == 0) {
                        $result.= "Sorry, your file was not uploaded.";
                        $error=true;
                        // if everything is ok, try to upload file
                    } 
                    else {
                        if (move_uploaded_file($_FILES["photo"]["tmp_name"], $target_file)) {
                           $result=$imagename.basename( $_FILES["photo"]["name"]);
                           $status=200;
                           $error=false;       
                        }
                        else {
                          $error=true;
                          $result.= "Sorry, there was an error uploading your file.";
                        }
                    }
                }
            }     
        } 
    } 
    else {
        $result= "File is not an image.";
        $error=true;
        $uploadOk = 0;
    }
 
 
    // $res=array("result"=>$result,"error"=>$error,"status"=>$status);
    echo json_encode($result);

    function generateRandomString($length = 10) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }
?>