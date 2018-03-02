import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { User, UserService } from './shared/services/user.service';
import { Item, ItemService, Auction, Bid } from './shared/services/item.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { DialogComponent } from './dialog.component';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.html',
  styleUrls: ['./item-details.css']
})
export class ItemDetailsComponent implements OnInit, OnDestroy {
  private item: Item;
  private auction: Auction;
  private highestBid: Bid;
  itemID: number;
  private sub: any;
  private user: User;
  private newBid: number;

  constructor(
    private userService: UserService,
    private itemService: ItemService,
    private router: Router,
    private route: ActivatedRoute,
    public http: HttpClient,
    public dialog: MatDialog
  ) {}

  getItem(): Item {
    return this.itemService.getItem();
  }

  ngOnInit() {
    this.user = this.getUser();

    this.sub = this.route.params.subscribe(params => {
      this.itemID = +params['itemID']; // (+) converts string 'id' to a number

      this.item = this.getItem();
    });

    this.getAuctionInformation();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getUser(): User {
    return this.userService.getUser();
  }


  setUser(user: User): void {
    this.userService.setUser(user);
  }

  logout(): void {
    this.user = null;
    this.setUser(null);
    this.router.navigate(['/search']);
  }

  getAuctionInformation(): void {
    const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
          options: any		= { 'itemID': this.itemID },
          url: any      	= 'https://php-group30.azurewebsites.net/retrieve_auction_information.php';

    this.http.post(url, JSON.stringify(options), headers)
      .subscribe((data: any) => {
        this.auction = data[0];
        this.getHighestBid(data[0].auctionID);
        this.countDown(data[0].endTime);
      },
      (error: any) => {
        // If there is an error, return to main search page.
        this.openDialog('Oops! Something went wrong; redirecting you to safety...', '', false);
      }
    );

    return null;
  }


  getHighestBid(auctionID: number): void {
    const headers: any    = new HttpHeaders({ 'Content-Type': 'application/json' }),
          options: any    = { 'auctionID': auctionID },
          url: any        = 'https://php-group30.azurewebsites.net/retrieve_highest_bid.php';

    this.http.post(url, JSON.stringify(options), headers)
      .subscribe((data: any) =>  // Set the date we're counting down to
       {
        if (data != null) {
          this.highestBid = data[0];
        }
      },
      (error: any) => {
        // If there is an error, return to main search page.
        this.openDialog('Oops! Something went wrong; redirecting you to safety...', '', false);
      }
    );

    return null;
  }

  bid(): void {
    // If the details supplied are incomplete/incorrect, do not proceed with the transaction.
    if (this.validateBid()) {



        const headers: any    = new HttpHeaders({ 'Content-Type': 'application/json' }),
        options: any    = { 'buyerID': this.user.userID ,
                            'auctionID': this.auction.auctionID,
                            'price': this.newBid},
        url: any        = 'https://php-group30.azurewebsites.net/insert_bid.php';

      this.http.post(url, JSON.stringify(options), headers)
        .subscribe((data: any) =>  {

              this.openDialog('Congratulations, you have successfully placed your bid', "", true);
          
        },
        (error: any) => {
          // If there is an error, return to main search page.
          this.openDialog('Oops! Something went wrong; redirecting you to safety...', '', true);
        }
      );
    }
    return null;
  }

  validateBid(): boolean {
    if(this.newBid == null){
      this.openDialog("Please enter your bid amount", "", true); 
      return false;
    }
    else if(this.highestBid == null){
      if( this.newBid < this.auction.startPrice){
         this.openDialog("Please enter more than start price", "", true);   
         return false;
        }
    }
    else if(this.newBid < this.highestBid.price){
      this.openDialog("Please enter more than current bid", "", true);
      return false;
    }
      return true;//if bid is valid 
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
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/search']);
  }

  //Displays time remaining on auction
  countDown(auction_endTime: string):void{
     // Set the date we're counting down to
    var countDownDate = new Date(auction_endTime).getTime();

    // Update the count down every 1 second
    var counter = setInterval(window.onload = function() {

        // Get todays date and time
        var now = new Date().getTime();

        // Find the distance between now an the count down date
        var distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result in the element with id="countdown"
        if(document.getElementById("countdown")!= null){
            if(days >= 1){
              document.getElementById("countdown").innerHTML ="Time remaining: "+ days + "d " + hours + "h "
              + minutes + "m " + seconds + "s ";}
            else if (hours >= 1){
                document.getElementById("countdown").innerHTML ="Time remaining: " + hours + "h "
                + minutes + "m " + seconds + "s ";}
            else if (minutes >= 1){
                  document.getElementById("countdown").innerHTML ="Time remaining: "+ minutes + "m " + seconds + "s ";}
            else if (seconds >= 1){
                  document.getElementById("countdown").innerHTML ="Time remaining: "+ seconds + "s ";
          }
          
          // If the count down is finished, write some text 
          if (distance < 0) {
            clearInterval(counter);
            document.getElementById("countdown").innerHTML = "Time remaining: EXPIRED";
          }
        }else{
          clearInterval(counter);
        }
    }, 1000);
  }


}
