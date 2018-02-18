import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/mergeMap';

import { Item, ItemService } from './shared/services/item.service';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.html',
  styleUrls: ['./item-details.css']
})
export class ItemDetailsComponent {
  private item: Item;

  constructor(private itemService: ItemService) {
    this.item = this.getItem();
  }

  getItem(): Item {
    return this.itemService.getItem();
  }
}
