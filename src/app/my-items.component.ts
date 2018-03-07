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
  userItems: Observable<Item[]> = null;

  private user: User;

  constructor(
    private userService: UserService,
    private itemService: ItemService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.user = this.getUser();

    if (this.user.role === 'seller') {
      this.getSellerItems();
    } else if (this.user.role === 'buyer') {
      this.getBuyerItems();
    }
  }

  getSellerItems(): void {
    const headers: any = new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      options: any = { sellerID: this.user.userID },
      url: any =
        'https://php-group30.azurewebsites.net/retrieve_seller_items.php';

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

  getBuyerItems(): void {
    const headers: any = new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      options: any = { buyerID: this.user.userID },
      url: any =
        'https://php-group30.azurewebsites.net/retrieve_buyer_bids.php';

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
