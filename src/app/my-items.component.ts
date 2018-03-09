import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Item, ItemService } from './shared/services/item.service';
import { User, UserService } from './shared/services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-my-items',
  templateUrl: './my-items.html',
  styleUrls: ['./my-items.css']
})
export class MyItemsComponent implements OnInit {
  item: Item;
  userAuctions: Observable<Item[]> = null;
  userBids: Observable<Item[]> = null;
  // buyerWatchingItems: Observable<Item[]> = null;

  private user: User;

  constructor(
    private userService: UserService,
    private itemService: ItemService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.user = this.getUser();

    this.getItems();
  }

  getItems(): void {
    const headers: any = new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      options: any = { userID: this.user.userID,
                       includeExpired: true },
      url: any =
        'https://php-group30.azurewebsites.net/retrieve_user_items.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {

        this.userAuctions = data.auctions;
        for (let i = 0; i < data.auctions.length; i++) {
          this.userAuctions[i].photo = 'https://php-group30.azurewebsites.net/uploads/' +
            this.userAuctions[i].photo.substring(5, this.userAuctions[i].photo.length - 5);
        }

        this.userBids = data.bids;
        for (let i = 0; i < data.bids.length; i++) {
          this.userBids[i].photo = 'https://php-group30.azurewebsites.net/uploads/' +
            this.userBids[i].photo.substring(5, this.userBids[i].photo.length - 5);
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
