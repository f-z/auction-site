-- COMPGC06 Group 30
-- Since: 2018-02-12

-- Tables
-- Table: administrator
CREATE TABLE administrator (
    adminID int NOT NULL AUTO_INCREMENT,
    username varchar(40) NOT NULL,
    password varchar(40) NOT NULL,
    photo blob NULL,
    firstName varchar(50) NOT NULL,
    lastName varchar(50) NOT NULL,
    DOB date NOT NULL,
    email varchar(80) NOT NULL,
    phone int NOT NULL,
    CONSTRAINT Users_pk PRIMARY KEY (adminID)
) ENGINE InnoDB CHARACTER SET utf8;

-- Table: buyer
CREATE TABLE buyer (
    buyerID int NOT NULL AUTO_INCREMENT,
    username varchar(40) NOT NULL,
    password varchar(40) NOT NULL,
    photo blob NULL,
    firstName varchar(50) NOT NULL,
    lastName varchar(50) NOT NULL,
    DOB date NOT NULL,
    email varchar(80) NOT NULL,
    phone int NOT NULL,
    street varchar(150) NOT NULL,
    city varchar(100) NOT NULL,
    postcode varchar(6) NOT NULL,
    CONSTRAINT Users_pk PRIMARY KEY (buyerID)
) ENGINE InnoDB CHARACTER SET utf8;

-- Table: seller
CREATE TABLE seller (
    sellerID int NOT NULL AUTO_INCREMENT,
    username varchar(40) NOT NULL,
    password varchar(40) NOT NULL,
    photo blob NULL,
    firstName varchar(50) NOT NULL,
    lastName varchar(50) NOT NULL,
    DOB date NOT NULL,
    email varchar(80) NOT NULL,
    phone int NOT NULL,
    street varchar(150) NOT NULL,
    city varchar(100) NOT NULL,
    postcode varchar(6) NOT NULL,
    CONSTRAINT Users_pk PRIMARY KEY (sellerID)
) ENGINE InnoDB CHARACTER SET utf8;

-- Table: auction
CREATE TABLE auction (
    auctionID int NOT NULL,
    startPrice decimal(8,2) NOT NULL,
    reservePrice decimal(8,2) NOT NULL,
    buyNowPrice int NULL,
    startTime datetime NOT NULL,
    endTime datetime NOT NULL,
    viewings int NOT NULL DEFAULT '0',
    itemID int NOT NULL,
    CONSTRAINT Auction_pk PRIMARY KEY (auctionID)
) ENGINE InnoDB CHARACTER SET utf8;

-- Table: bid
CREATE TABLE bid (
    bidID int NOT NULL,
    price decimal(8,2) NOT NULL,
    time datetime NOT NULL,
    buyerID int NOT NULL,
    auctionID int NOT NULL,
    CONSTRAINT Bids_pk PRIMARY KEY (bidID)
) ENGINE InnoDB CHARACTER SET utf8;

-- Table: category
CREATE TABLE category (
    categoryID varchar(150) NOT NULL,
    description varchar(500) NULL,
    CONSTRAINT Item_pk PRIMARY KEY (categoryID)
) ENGINE InnoDB CHARACTER SET utf8;

-- Table: feedback
CREATE TABLE feedback (
    feedbackID int NOT NULL,
    rating int NOT NULL,
    comment blob NOT NULL,
    auctionID int NOT NULL,
    buyerID int NOT NULL,
    sellerID int NOT NULL,
    CONSTRAINT ratingPk PRIMARY KEY (feedbackID)
) ENGINE InnoDB CHARACTER SET utf8;

-- Table: item
CREATE TABLE item (
    itemID int NOT NULL AUTO_INCREMENT,
    name varchar(150) NOT NULL,
    picture blob NOT NULL,
    description blob NOT NULL,
    `condition` varchar(50) NOT NULL,
    quantity int NOT NULL,
    categoryID varchar(150) NULL,
    sellerID int NOT NULL,
    CONSTRAINT Item_pk PRIMARY KEY (itemID)
) ENGINE InnoDB CHARACTER SET utf8;

-- Foreign keys
-- Reference: auction_bids (table: bid)
ALTER TABLE bid ADD CONSTRAINT auction_bids FOREIGN KEY auction_bids (auctionID)
    REFERENCES auction (auctionID)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT;

-- Reference: auction_item (table: auction)
ALTER TABLE auction ADD CONSTRAINT auction_item FOREIGN KEY auction_item (itemID)
    REFERENCES item (itemID)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT;

-- Reference: bids_users (table: bid)
ALTER TABLE bid ADD CONSTRAINT bids_users FOREIGN KEY bids_users (buyerID)
    REFERENCES buyer (buyerID)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT;

-- Reference: feedback_auction (table: feedback)
ALTER TABLE feedback ADD CONSTRAINT feedback_auction FOREIGN KEY feedback_auction (auctionID)
    REFERENCES auction (auctionID)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT;

-- Reference: feedback_seller (table: feedback)
ALTER TABLE feedback ADD CONSTRAINT feedback_seller FOREIGN KEY feedback_seller (sellerID)
    REFERENCES seller (sellerID)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT;

-- Reference: feedback_user (table: feedback)
ALTER TABLE feedback ADD CONSTRAINT feedback_user FOREIGN KEY feedback_user (buyerID)
    REFERENCES buyer (buyerID)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT;

-- Reference: item_category (table: item)
ALTER TABLE item ADD CONSTRAINT item_category FOREIGN KEY item_category (categoryID)
    REFERENCES category (categoryID)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT;

-- Reference: item_seller (table: item)
ALTER TABLE item ADD CONSTRAINT item_seller FOREIGN KEY item_seller (sellerID)
    REFERENCES seller (sellerID)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT;

-- Index: username_UNIQUE (table: buyer)
ALTER TABLE `buyer` 
ADD UNIQUE INDEX `username_UNIQUE` (`username` ASC);

-- Index: email_UNIQUE (table: buyer)
ALTER TABLE `buyer` 
ADD UNIQUE INDEX `email_UNIQUE` (`email` ASC);

-- Index: username_UNIQUE (table: seller)
ALTER TABLE `seller` 
ADD UNIQUE INDEX `username_UNIQUE` (`username` ASC);

-- Index: email_UNIQUE (table: seller)
ALTER TABLE `seller` 
ADD UNIQUE INDEX `email_UNIQUE` (`email` ASC);

-- Index: username_UNIQUE (table: administrator)
ALTER TABLE `administrator` 
ADD UNIQUE INDEX `username_UNIQUE` (`username` ASC);

-- Index: email_UNIQUE (table: administrator)
ALTER TABLE `administrator` 
ADD UNIQUE INDEX `email_UNIQUE` (`email` ASC);
-- End.
