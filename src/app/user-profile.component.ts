import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Item, ItemService } from './shared/services/item.service';
import { User, UserService, Feedback } from './shared/services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {MatGridListModule} from '@angular/material/grid-list';

@Component({
  selector: 'app-profile',
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.css']
})
export class ProfileComponent implements OnInit {
  private user: User; // the logged-in user

  private profileUser: User; // the user whose profile we 're viewing
  private item: Item;
  private userAuctions: Observable<Item[]> = null;

  private averageSellerRating: number;
  private sellerFeedbackCount: number;
  private userSellerFeedback: Observable<Feedback[]> = null;

  private averageBuyerRating: number;
  private buyerFeedbackCount: number;
  private userBuyerFeedback: Observable<Feedback[]> = null;

  constructor(
    private userService: UserService,
    private itemService: ItemService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.user = this.getUser();
    if (this.user === null) {
      this.router.navigate(['/login']);
    }

    this.profileUser = this.getProfile();

    this.getUsersSellerFeedback();
    this.getUsersBuyerFeedback();

    this.getItems(this.profileUser.userID);
  }

  getProfile(): User {
    return this.userService.getProfile();
  }

  getItem(): Item {
    return this.itemService.getItem();
  }

  getUsersSellerFeedback(): void {
    const headers: any = new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      options: any = { sellerID: this.profileUser.userID },
      url: any =
        'https://php-group30.azurewebsites.net/retrieve_seller_feedback.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        if (data != null) {
          this.userSellerFeedback = data['feedbackRows'];
          this.averageSellerRating = data['average'].average * 20;
          this.sellerFeedbackCount = data['average'].count;
        }
      },
      (error: any) => {}
    );
    return null;
  }

  getUsersBuyerFeedback(): void {
    const headers: any = new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      options: any = { buyerID: this.profileUser.userID },
      url: any =
        'https://php-group30.azurewebsites.net/retrieve_buyer_feedback.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        if (data != null) {
          this.userBuyerFeedback = data['feedbackRows'];
          this.averageBuyerRating = data['average'].average * 20;
          this.buyerFeedbackCount = data['average'].count;
        }
      },
      (error: any) => {}
    );
    return null;
  }

  getItems(sellerID: number): void {
    const headers: any = new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      options: any = {
        userID: sellerID,
        includeExpired: true
      },
      url: any =
        'https://php-group30.azurewebsites.net/retrieve_user_items.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        this.userAuctions = data.auctions;
        for (let i = 0; i < data.auctions.length; i++) {
          this.userAuctions[i].photo =
            'https://php-group30.azurewebsites.net/uploads/' +
            this.userAuctions[i].photo.substring(
              5,
              this.userAuctions[i].photo.length - 5
            );
        }
      },
      (error: any) => {
        // If there is unauthorised / improper access, log out and return to Login page.
        this.user = null;
        this.setUser(null);
        this.router.navigate(['/login']);
      }
    );
  }

  setItem(item: Item): void {
    this.itemService.setItem(item);
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
}
