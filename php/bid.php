<?php

class Bid {

private $bid_id;
private $price;
private $time;
private $buyer_id;
private $auction_id;

protected function __construct($buyer_id, $auction_id) {
    $this->$auction_id = $auction_id;
    $this->$buyer_id = $buyer_id;
}

protected function set_price($price) {
    $this->$price = $price;
}

protected function set_time($time) {
    $this->$time = $time;
}

}

?>