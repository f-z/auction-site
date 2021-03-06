import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

const ITEM_KEY = 'item_key';

@Injectable()
export class ItemService {
  private item: Item;

  constructor(private http: HttpClient) {
    this.item = this.loadState() || null;
  }

  private loadState(): Item {
    return JSON.parse(localStorage.getItem(ITEM_KEY));
  }

  private saveState(): void {
    localStorage.setItem(ITEM_KEY, JSON.stringify(this.item));
  }

  getItem(): Item {
    // Returning a copy of the stored item.
    return { ...this.item };
  }

  setItem(item: Item): void {
    this.item = item;
    this.saveState();
  }

  setItemFromID(itemID: number): void {
    const headers: any = new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      options: any = {
        itemID: itemID
      },
      url: any =
        'https://php-group30.azurewebsites.net/retrieve_item_from_itemID.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        this.item = data;

        this.item.photo =
          'https://php-group30.azurewebsites.net/uploads/' +
          this.item.photo.substring(5, this.item.photo.length - 5);

        this.saveState();
      },
      (error: any) => {
        console.log(error);
      }
    );
    return null;
  }

  removeItem(): void {
    delete this.item[ITEM_KEY];
    this.saveState();
  }
}

export interface Item {
  itemID: number;
  name: string;
  photo: string;
  description: string;
  condition: string;
  quantity: number;
  categoryName: string;
  sellerID: number;
  auctionID: number;
  startPrice: number;
  reservePrice: number;
  buyNowPrice: number;
  startTime: string;
  endTime: string;
  viewings: number;
  highestBid: number;
}

export interface Category {
  categoryName: string;
  description: string;
}

export interface Bid {
  bidID: number;
  price: number;
  time: string;
  buyerID: number;
  highest: number;
  username: string;
}

export interface Feedback {
  auctionID: number;
  name: string; // of item
  userID: number; // of person making comment
  username: string; // of person making comment
  comment: string;
  rating: number;
  endTime: string;
}

export interface Auction {
  auctionID: number;
  startPrice: number;
  reservePrice: number;
  buyNowPrice: number;
  startTime: string;
  endTime: string;
  viewings: number;
  itemID: number;
}
