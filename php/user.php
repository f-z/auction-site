<?php

class User {

    private $is_buyer = false;
    private $is_seler = false;
    private $is_admin = false;
    private $first_name;
    private $last_name;
    private $username;
    private $password;
    private $photo;
    private $dob;
    private $email;
    private $phone;
}

class Admin extends User {
    private $admin_id;
    private $is_admin = true;

    protected function delete_item($item_id) {
        
    }

    protected function delete_user($id) {
        
    }
}

class Buyer extends User {
    private $buyer_id;
    private $is_buyer = true;
    private $street;
    private $city;
    private $postcode;

    protected function place_bid($auction_id, $value, $time) {
        
        $bid = new Bid($buyer_id, $auction_id);
        set_price($value);
        set_time($time);

        // SQL Statement

    }
}

class Seller extends User {

    private $seller_id;
    private $is_seler = true;
    private $street;
    private $city;
    private $postcode;

    protected function list_item($name, $description, $condition, $quantity, $category_id) {

        $item_id = rand();
        $item = new Item($item_id, $seller_id);
        set_name($name);
        set_description($desctiption);
        set_picture($picture);
        set_condition($condition);
        set_category($category_id);

        // SQL Statement

    }

    protected function create_auction($item_id, $quantity) {

    }
}
?>