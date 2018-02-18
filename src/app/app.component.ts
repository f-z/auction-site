import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Item, ItemService } from './shared/services/item.service';
import 'rxjs/add/operator/switchMap';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private loggedIn: string;
  item: Item;
  items: Observable<Item[]> = null;
  category: string;

  constructor(private itemService: ItemService,
              private route: ActivatedRoute,
              private router: Router,
              private http: HttpClient) {
                this.loggedIn = 'false';
  // this.items = this.route.params
   //  .switchMap(({category}) => {
   //    return this.category === 'all' ?
   //     this.itemService.getAll() :
     //    this.itemService.getCategory(category);
   // });
  }

  ngOnInit(): void {
    this.category = 'all';

    this.getItems();
}

  getItems(): void {
      this.http
        .get('https://php-group30.azurewebsites.net/retrieve_auctioned_items.php')
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
}
