import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Item, ItemService } from './shared/services/item.service';
import { User, UserService } from './shared/services/user.service';
import { HttpClient } from '@angular/common/http';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  item: Item;
  items: Observable<Item[]> = null;
  public selectedCategory: string;
  private user: User;
  private term: string;
  categories: any;

  constructor(
    private itemService: ItemService,
    private userService: UserService,
    private router: Router,
    private http: HttpClient,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      'car',
      sanitizer.bypassSecurityTrustResourceUrl(
        'assets/img/car.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'book',
      sanitizer.bypassSecurityTrustResourceUrl(
        'assets/img/book.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'fashion',
      sanitizer.bypassSecurityTrustResourceUrl(
        'assets/img/clothes.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'sports',
      sanitizer.bypassSecurityTrustResourceUrl(
        'assets/img/ball.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'home',
      sanitizer.bypassSecurityTrustResourceUrl(
        'assets/img/home.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'collectables',
      sanitizer.bypassSecurityTrustResourceUrl(
        'assets/img/collectables.svg'
      )
    );
  }

  ngOnInit(): void {
    this.term = 'All';

    this.getItems();

    this.user = this.getUser();
  }

  getItems(): void {
    this.http
      .get(
        'https://php-group30.azurewebsites.net/retrieve_all_auctioned_items.php'
      )
      .subscribe(
        (data: any) => {
          this.items = data;
        },
        (error: any) => {
          console.dir(error);
        }
      );
  }

  setItem(item: Item): void {
    this.itemService.setItem(item);
  }

  selectCategory(category): void {
    this.term = category;
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
