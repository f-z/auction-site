import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Item, ItemService } from './shared/services/item.service';
import { User, UserService } from './shared/services/user.service';
import 'rxjs/add/operator/switchMap';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-seller',
  templateUrl: './seller.html'
})
export class SellerComponent implements OnInit {
  item: Item;
  sellerItems: Observable<Item[]> = null;
  private user: User;

  constructor(private itemService: ItemService,
              private userService: UserService,
              private route: ActivatedRoute,
              private router: Router,
              private http: HttpClient) {
  }

  ngOnInit(): void {
    // this.getSellerItems();

    this.user = this.getUser();
}

  getSellerItems(): void {
      this.http
        .get('https://php-group30.azurewebsites.net/retrieve_seller_items.php')
        .subscribe((data: any) => {
         this.sellerItems = data;
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
    this.setUser(null);
    this.router.navigate(['/app']);
  }
}
