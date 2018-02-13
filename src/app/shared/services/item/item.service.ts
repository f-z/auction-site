import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class ItemService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<Item[]> {
    return this.http.get<Item[]>('/resources/data/items/all.json');
  }

  getCategory(category: string): Observable<Item[]> {
    return this.http.get<Item[]>(`/resources/data/items/${category}.json`);
  }

  getItemById(itemId: number): Observable<Item> {
    return this.http.get<Item[]>('/resources/data/items/all.json')
      .map(items => items.find(item => item.itemID === itemId));
  }
}

export interface Item {
  itemID: number;
  name: string;
  picture: string;
  description: string;
  condition: string;
  quantity: number;
  categoryID: string;
  sellerID: number;
}
