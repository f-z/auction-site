import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogComponent } from './dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { User, UserService } from './shared/services/user.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import {Item, 
		ItemService,
		Auction,
		Bid } from './shared/services/item.service';


@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.html',
  styleUrls: ['./feedback.css']
})

export class FeedbackComponent implements OnInit {
  private user: User;
  private buyerID: number;
  private subjectID: number;
  private subject: string;
  private item: Item;
  private comment: string;
  private rating: number;

  constructor(
  	public dialog: MatDialog,
  	private userService: UserService,
  	private itemService: ItemService,
  	private http: HttpClient,
  	private router: Router,
  ) {}

  ngOnInit(): void {
  	this.user = this.getUser();
  	this.item = this.getItem();
    this.setSubject();
  } 

   getUser(): User {
    return this.userService.getUser();
  }

   getItem(): Item {
    return this.itemService.getItem();
  }

  setSubject():void {
  	if(this.user.role === 'buyer'){
  		this.subjectID = this.item.sellerID; 
  	}
  	if(this.user.role === 'seller'){
      //return the userID of the winner of the auction:
  		this.getHighestBid(this.item.auctionID);
  	}
  	const headers: any = new HttpHeaders({'Content-Type': 'application/json'}),
    options: any = { 'userID': this.subjectID },
    url: any = 'https://php-group30.azurewebsites.net/retrieve_user.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        console.log(data)
        // Set the date we're counting down to.
        if (data != null) {
          this.subject = data.username;
        }
      },
      (error: any) => {
        // If there is an error, return to main search page.
        this.openDialog('Oops! Something went wrong; redirecting you to safety...','', false);
        }
      );
    return null;
  }

  insertFeedback():void {
  	if(this.user.role ==='seller'){
  		this.insertSellerFeedback();
  	}
  	else if(this.user.role ==='buyer'){
  		this.insertBuyerFeedback();
  	}
  }

  insertBuyerFeedback(): void{
  	const headers: any = new HttpHeaders({'Content-Type': 'application/json'}),
    options: any = { 'sellerID': this.item.sellerID,
    				 'buyerID' : this.buyerID ,
    				 'buyerComment': this.comment,
    				 'buyerRating': this.rating,
    				 'auctionID': this.item.auctionID},
    url: any = 'https://php-group30.azurewebsites.net/insert_buyer_feedback.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        console.log(data)
        // Set the date we're counting down to.
        if (data != null) {
          this.subject = data;
        }
      },
      (error: any) => {
        // If there is an error, return to main search page.
        this.openDialog('Oops! Something went wrong; redirecting you to safety...','', false);
        }
      );
    return null;
  }

    insertSellerFeedback(): void{
  	const headers: any = new HttpHeaders({'Content-Type': 'application/json'}),
    options: any = { 'sellerID': this.item.sellerID,
    				 'buyerID' : this.buyerID ,
    				 'sellerComment': this.comment,
    				 'sellerRating': this.rating,
    				 'auctionID': this.item.auctionID},
    url: any = 'https://php-group30.azurewebsites.net/insert_seller_feedback.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        console.log(data)
        // Set the date we're counting down to.
        if (data != null) {
          this.subject = data;
        }
      },
      (error: any) => {
        // If there is an error, return to main search page.
        this.openDialog('Oops! Something went wrong; redirecting you to safety...','', false);
        }
      );
    return null;
  }


    getHighestBid(auctionID): void {
    const headers: any = new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      options: any = { auctionID: auctionID },
      url: any =
        'https://php-group30.azurewebsites.net/retrieve_bid_information.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        console.log(data)
        // Set the date we're counting down to.
        if (data != null) {
          this.subjectID = data.bid.buyerID;
        }
      },
      (error: any) => {
        // If there is an error, return to main search page.
        this.openDialog(
          'Oops! Something went wrong; redirecting you to safety...',
          '',
          false
        );
      }
    );
    return null;
  }


   openDialog(message: string, username: string, succeeded: boolean): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        message: message,
        username: username
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!succeeded) {
        this.router.navigate(['/search']);
      } else {
        window.location.reload();
      }
    });
  }

}
