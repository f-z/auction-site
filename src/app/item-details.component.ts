import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Item, ItemService } from './shared/services/item.service';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.html',
  styleUrls: ['./item-details.css']
})
export class ItemDetailsComponent implements OnInit, OnDestroy {
  private item: Item;
  itemID: number;
  private sub: any;

  constructor(
    private itemService: ItemService,
    private route: ActivatedRoute
  ) {}

  getItem(): Item {
    return this.itemService.getItem();
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.itemID = +params['itemID']; // (+) converts string 'id' to a number

      this.item = this.getItem();
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
