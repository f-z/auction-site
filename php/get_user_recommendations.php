<?php 
$sql = 'SELECT other_user_views.userID AS other_user_id ,COUNT(*) AS same_auction_count
	FROM viewings AS other_user_views 
  JOIN viewings AS current_user_views 
    ON current_user_views.auctionID =  other_user_views.auctionID 
      AND current_user_views.userID = :userID
      	AND current_user_views.userID != other_user_views.userID
    
    GROUP BY other_user_views.userID
	ORDER BY same_auction_count DESC'
?>