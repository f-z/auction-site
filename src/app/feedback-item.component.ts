import { Component, Input, OnInit } from '@angular/core';
import { Item, Feedback, ItemService } from './shared/services/item.service';
import { User, UserService } from './shared/services/user.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-feedback-item',
  templateUrl: './feedback-item.html',
  styleUrls: ['./feedback-item.css']
})
export class FeedbackItemComponent implements OnInit {
  @Input() feedback: Feedback;
  feedbackpercentage: number;
  item: Item;

  constructor( private userService: UserService,
               private itemService: ItemService,
               private router: Router,
               private route: ActivatedRoute,
               public http: HttpClient,) {}

  ngOnInit(): void {
    this.feedbackpercentage = this.feedback.rating * 20;
  }

  setProfile(user: User): void {
    this.userService.setProfile(user);
  }


  setItem(): void {
    this.getItem(this.feedback.auctionID);
    this.itemService.setItem(this.item);
  }

  getItem(auctionID: number): void {
    const headers: any = new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      options: any = { auctionID: auctionID },
      url: any =
        'https://php-group30.azurewebsites.net/retrieve_item.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        // Set the date we're counting down to.
        if (data != null) {
          this.item = data;
        }
      },
      (error: any) => {
      //  // If there is an error, return to main search page.
       // this.openDialog(
        //  'Oops! Something went wrong; redirecting you to safety...',
         // '',
         // false
       // );
      }
    );
    return null;
  }
}
