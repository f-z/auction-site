import { Component, Input, OnInit } from '@angular/core';
import { Item } from './shared/services/item.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.html',
  styleUrls: ['./item.css']
})
export class ItemComponent implements OnInit {
  @Input() item: Item;

  ngOnInit(): void {
  	this.timeRemaining(this.item.endTime);
  } 

    // Displays time remaining on auction.
  timeRemaining(auction_endTime: string): void {
    // Set the date we're counting down to
    const countDownDate = new Date(auction_endTime).getTime();

    // Update the count down every 1 second
    
    var id = this.item.itemID.toString();
      window.onload = function() {
        // Get todays date and time
        const now = new Date().getTime();

        // Find the distance between now an the count down date
        const distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);


        // Display the result in the element with id='countdown'
        if (document.getElementById(id) != null) {
          if (days >= 1) {
            document.getElementById(id).innerHTML = 'Time remaining: ' + days +'d ' +hours +'h ';
          } else if (hours >= 1) {
            document.getElementById(id).innerHTML = 'Time remaining: ' + hours + 'h ';
          } else if (minutes >= 1) {
             document.getElementById(id).innerHTML = 'Time remaining: ' + minutes + 'm ';
          } else if (seconds >= 1) {
             document.getElementById(id).innerHTML = 'Time remaining: ' + seconds + 's ';
          }
          // If the count down is finished, display a notification text message.
          if (distance < 0) {
           document.getElementById(id).innerHTML = 'Time remaining: EXPIRED';
          }
       }
     }
  } 
}
