import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
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

  removeItem(itemId: string): void {
    delete this.item[itemId];
    this.saveState();
  }
}

export interface Item {
  itemID: number;
  name: string;
  photo1: string;
  photo2: string;
  photo3: string;
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
