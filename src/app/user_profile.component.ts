import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Item, ItemService } from './shared/services/item.service';
import { User, UserService, Feedback } from './shared/services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './user_profile.html',
  styleUrls: ['./user_profile.css']
})
export class ProfileComponent implements OnInit {

  //buyerWatchingItems: Observable<Item[]> = null;
  private user: User;//the logged in user

  
  @Input() profileUser: User; // the user whose profile we're viewing
  item: Item;
  userItems: Observable<Item[]> = null;
  profileUserRole: string;
  averageRating: number;
  userFeedback: Observable<Feedback[]> = null;

  constructor(
    private userService: UserService,
    private itemService: ItemService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.user = this.getUser();
    
    //IF seller profile we're viewing we want to get their auctions 
    this.getUserRole();
    



  }

  getUsersFeedback(role: string): void {

      const headers: any = new HttpHeaders({
      'Content-Type': 'application/json'
      }),
      options: any = {
        'userID': this.profileUser.userID,
      },
      url: any = 'https://php-group30.azurewebsites.net/retrieve_'+role+'_feedback.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        if (data != null) {
          this.userFeedback = data['feedbackRows'];
          this.averageRating = data['average'].average;
        }
      },
      (error: any) => {
        
      }
    );
    return null;
  }

  getUserRole(): void {
    const headers: any = new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      options: any = {
        'userID': this.profileUser.userID,
      },
      url: any = 'https://php-group30.azurewebsites.net/retrieve_user_role.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        if (data != null) {
          this.profileUserRole = data;
          //IF seller profile we're viewing we want to get their auctions
          if(data === 'seller'){
            this.getItems(this.profileUser.userID);
          }
        }
      },
      (error: any) => {
        
      }
    );
    return null;
  }



  getItems(sellerID: number): void {
    const headers: any = new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      options: any = { userID: sellerID},
      url: any =
        'https://php-group30.azurewebsites.net/retrieve_user_items.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        this.userItems = data;
        for (let i = 0; i < data.length; i++) {
          this.userItems[i].photo = 'https://php-group30.azurewebsites.net/uploads/' +
            this.userItems[i].photo.substring(5, this.userItems[i].photo.length - 5);
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
