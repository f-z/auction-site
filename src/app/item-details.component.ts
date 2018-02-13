import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/mergeMap';

import { Item, ItemService } from './shared/services/item/item.service';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.html',
  styleUrls: ['./item-details.css']
})
export class ItemDetailsComponent {
  @Input() item: Item;

  constructor(itemService: ItemService, route: ActivatedRoute) {
    route.params
      .mergeMap(({itemId}) => itemService.getItemById(itemId))
      .subscribe(item => this.item = item);
  }
}
