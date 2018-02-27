import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Item, ItemService } from './shared/services/item.service';
import { User, UserService } from './shared/services/user.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  item: Item;
  items: Observable<Item[]> = null;
  category: string;
  private user: User;

  constructor(private itemService: ItemService,
              private userService: UserService,
              private router: Router,
              private http: HttpClient) {
  }

  ngOnInit(): void {
    this.category = 'all';

    this.getItems();

    this.user = this.getUser();
}

  getItems(): void {
      this.http
        .get('https://php-group30.azurewebsites.net/retrieve_all_auctioned_items.php')
        .subscribe((data: any) => {
         this.items = data;
         // console.dir(this.items);
      },
      (error: any) => {
         console.dir(error);
      });
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
  }
}
