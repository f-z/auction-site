import { Component, Input } from '@angular/core';
import { Item } from './shared/services/item/item.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.html',
  styleUrls: ['./item.css']
})
export class ItemComponent {
  @Input() item: Item;
}
