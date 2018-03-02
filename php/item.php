<?php

class Item {

    private $item_id;
    private $name;
    private $picture;
    private $description;
    private $condition;
    private $quantity;
    private $category_id;
    private $seller_id;

    protected function __construct($item_id, $seller_id) {
        $this->item_id = $item_id;
        $this->seller_id = $seller_id;
    }

    protected function set_name($name){
        // do some check for a valid name before assigning it to var
        $this->name = $name;
    }

    protected function set_description($desctiption){

        // do some check for a valid descr before assigning it to var
        $this->desctiption = $desctiption;
    }

    protected function set_picture($picture){

        // do some check for a valid pic before assigning it to var
        $this->picture = $picture;
    }

    protected function set_condition($condition){

        // do some check for a valid cond before assigning it to var
        $this->condition = $condition;
    }

    protected function set_category($category_id){

        // do some check for a valid category before assigning it to var
        $this->category_id = $category_id;
    }
}

?>