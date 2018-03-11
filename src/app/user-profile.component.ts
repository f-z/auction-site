import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Item, ItemService, Feedback } from './shared/services/item.service';
import { User, UserService } from './shared/services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {MatGridListModule} from '@angular/material/grid-list';

@Component({
  selector: 'app-profile',
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.scss']
})
export class ProfileComponent {
  private user: User; // the logged-in user

  private profileUserID: number;
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
    private activatedRoute : ActivatedRoute,
    private http: HttpClient
  ) { 
    activatedRoute.params.subscribe(val => {
    this.profileUserID = +this.activatedRoute.snapshot.url[1].path;
    this.user = this.getUser();
    if (this.user === null) {
      this.router.navigate(['/login']);
    }
    this.retrieveProfile();
    this.getUsersSellerFeedback();
    this.getUsersBuyerFeedback();
    this.getItems();
  });
  }


  retrieveProfile(): void{
     const headers: any = new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      options: any = {
        userID: +this.activatedRoute.snapshot.url[1].path,
        includeExpired: true
      },
      url: any =
        'https://php-group30.azurewebsites.net/retrieve_user.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        this.profileUser = data;
        if (this.profileUser.photo != null) {
            this.profileUser.photo =
              'http://php-group30.azurewebsites.net/uploads/' +
              this.profileUser.photo.substring(
                1,
                this.profileUser.photo.length - 1
              );
          }
      },
      (error: any) => {

      }
    );

  }

  getItem(): Item {
    return this.itemService.getItem();
  }

  getUsersSellerFeedback(): void {
    const headers: any = new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      options: any = { sellerID: +this.activatedRoute.snapshot.url[1].path},
      url: any =
        'https://php-group30.azurewebsites.net/retrieve_seller_feedback.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        if (data != null) {
          this.userSellerFeedback = data['feedbackRows'];
          console.log(data['feedbackRows']);
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
      options: any = { buyerID: +this.activatedRoute.snapshot.url[1].path },
      url: any =
        'https://php-group30.azurewebsites.net/retrieve_buyer_feedback.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        if (data != null) {
          console.log(data['feedbackRows']);
          this.userBuyerFeedback = data['feedbackRows'];
          this.averageBuyerRating = data['average'].average * 20;
          this.buyerFeedbackCount = data['average'].count;
        }
      },
      (error: any) => {}
    );
    return null;
  }

  getItems(): void {
    const headers: any = new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      options: any = {
        userID: +this.activatedRoute.snapshot.url[1].path,
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
      //  this.user = null;
       // this.setUser(null);
        // this.router.navigate(['/login']);
                alert('error in get items');
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
    this.userService.setUser(this.user);
    this.router.navigate(['/search']);
  }

  goToMyProfile(): void {
    this.router.navigate(['/profile', this.user.userID]);
  }

  logout(): void {
    this.user = null;
    this.setUser(null);
    this.router.navigate(['/search']);
  }
}
