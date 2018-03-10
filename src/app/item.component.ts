import { Component, Input, OnInit } from '@angular/core';
import { Item } from './shared/services/item.service';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-item',
  templateUrl: './item.html',
  styleUrls: ['./item.scss']
})
export class ItemComponent implements OnInit {
  @Input() item: Item;
  timeleft: string;

  constructor() {}

  ngOnInit(): void {
    this.timeRemaining(this.item.endTime);
  }

  // Displays time remaining on auction.
  timeRemaining(auction_endTime: string): void {
    // Set the date we're counting down to
    const countDownDate = new Date(auction_endTime).getTime();

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

    if (days > 7) {
      this.timeleft = days + 'd left';
    } else if (days >= 1) {
      this.timeleft = days + 'd ' + hours + 'h left';
    } else if (hours >= 1) {
      this.timeleft = hours + 'h left';
    } else if (minutes >= 1) {
      this.timeleft = minutes + 'm left';
    } else if (seconds >= 1) {
      this.timeleft = seconds + 's left';
    }
    // If the count down is finished, display a notification text message.
    if (distance < 0) {
      this.timeleft = 'EXPIRED';
    }
  }
}
