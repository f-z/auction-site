import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Item, ItemService } from './shared/services/item.service';
import { User, UserService } from './shared/services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
  selector: 'app-my-items',
  templateUrl: './my-items.html',
  styleUrls: ['./my-items.scss']
})
export class MyItemsComponent implements OnInit {
  item: Item;
  userAuctions: Observable<Item[]> = null;
  userTopBids: Observable<Item[]> = null;
  userWatching: Observable<Item[]> = null;
  userOutbid: Observable<Item[]> = null;

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

  additem(): void {
    this.itemService.setItem(null);
    this.router.navigate(['add-item']);
  }

  getItems(): void {
    const headers: any = new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      options: any = {
        userID: this.user.userID,
        includeExpired: true
      },
      url: any =
        'https://php-group30.azurewebsites.net/retrieve_user_items.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        this.userAuctions = data.auctions;
        for (let i = 0; i < data.auctions.length; i++) {
          if (this.userAuctions[i].photo.substring(0, 1) === '"') {
            this.userAuctions[i].photo =
              'http://php-group30.azurewebsites.net/uploads/' +
              this.userAuctions[i].photo.substring(
                1,
                this.userAuctions[i].photo.length - 1
              );
          } else {
            this.userAuctions[i].photo =
              'http://php-group30.azurewebsites.net/uploads/' +
              this.userAuctions[i].photo.substring(
                5,
                this.userAuctions[i].photo.length - 5
              );
          }
        }

        this.userTopBids = data.topbids;
        for (let i = 0; i < data.topbids.length; i++) {
          if (this.userTopBids[i].photo.substring(0, 1) === '"') {
            this.userTopBids[i].photo =
              'https://php-group30.azurewebsites.net/uploads/' +
              this.userTopBids[i].photo.substring(
                1,
                this.userTopBids[i].photo.length - 1
            );
          } else {
              this.userTopBids[i].photo =
                'https://php-group30.azurewebsites.net/uploads/' +
                this.userTopBids[i].photo.substring(
                  5,
                this.userTopBids[i].photo.length - 5
              );
            }
        }

        this.userWatching = data.watching;
        for (let i = 0; i < data.watching.length; i++) {
          if (this.userWatching[i].photo.substring(0, 1) === '"') {
            this.userWatching[i].photo =
              'https://php-group30.azurewebsites.net/uploads/' +
              this.userWatching[i].photo.substring(
                1,
                this.userWatching[i].photo.length - 1
            );
          } else {
            this.userWatching[i].photo =
              'https://php-group30.azurewebsites.net/uploads/' +
              this.userWatching[i].photo.substring(
                5,
                this.userWatching[i].photo.length - 5
            );
          }
        }

        this.userOutbid = data.outbid;
        for (let i = 0; i < data.outbid.length; i++) {
          if (this.userOutbid[i].photo.substring(0, 1) === '"') {
            this.userOutbid[i].photo =
              'https://php-group30.azurewebsites.net/uploads/' +
              this.userOutbid[i].photo.substring(
                1,
                this.userOutbid[i].photo.length - 1
            );
          } else {
            this.userOutbid[i].photo =
              'https://php-group30.azurewebsites.net/uploads/' +
              this.userOutbid[i].photo.substring(
                5,
                this.userOutbid[i].photo.length - 5
            );
          }
        }
      },
      (error: any) => {
        console.log(error);
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

  goToMyProfile(): void {
    this.router.navigate(['/profile', this.user.userID]);
  }

  logout(): void {
    this.user = null;
    this.setUser(null);
    this.router.navigate(['/search']);
  }
}
