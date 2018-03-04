import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { LoginComponent } from './login.component';
import { DialogComponent } from './dialog.component';

import { User, UserService } from './shared/services/user.service';
import { Category } from './shared/services/item.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.html',
  styleUrls: ['./add-item.css']
})
export class AddItemComponent implements OnInit {
  private user: User;

  name: string;
  description: string;
  condition: string;
  quantity: number;
  category: string;
  picture = '';
  endDate: string;
  endTime: string;
  startPrice: number;
  reservePrice: number;
  buyNowPrice: number;

  categories: Observable<Category[]> = null;
  selectedCategory: string;

  private localURI: string;
  private remoteURI: string;

  constructor(
    private userService: UserService,
    public http: HttpClient,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.getUser();
    this.getCategories();

    this.localURI = 'http://localhost:3000/php/';
    this.remoteURI = 'https://php-group30.azurewebsites.net/';
  }

  addItem(): void {
    // If the details supplied are incomplete/incorrect, do not proceed with the transaction.
    if (!this.validate()) {
      return;
    }

    const headers: any = new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      options: any = {
        name: this.name,
        description: this.description,
        condition: this.condition,
        quantity: this.quantity,
        categoryName: this.selectedCategory,
        endDate: this.endDate,
        endTime: this.endTime,
        startPrice: this.startPrice,
        reservePrice: this.reservePrice,
        buyNowPrice: this.buyNowPrice,
        picture: this.picture,
        sellerID: this.user.userID
      },
      url: any = this.remoteURI + 'insert_item.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        this.addAuction(data);
      },
      (error: any) => {
        // If there is an error, notify the user.
        this.openDialog(
          'Something went wrong when adding the item, please try again!',
          '',
          false
        );
      }
    );
  }

  addAuction(itemID): void {
    const headers: any = new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      options: any = {
        itemID: itemID,
        endDate: this.endDate,
        endTime: this.endTime,
        startPrice: this.startPrice,
        reservePrice: this.reservePrice,
        buyNowPrice: this.buyNowPrice,
        sellerID: this.user.userID
      },
      url: any = this.remoteURI + 'create_auction.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        // If the request was successful, notify the user.
        this.openDialog(
          'Congratulations, the item was added and the auction was created!',
          '',
          true
        );
      },
      (error: any) => {
        // If there is an error, notify the user.
        this.openDialog(
          'Something went wrong when creating the auction, please try again!',
          '',
          false
        );
      }
    );
  }

  getCategories(): void {
    this.http
      .get(
        'https://php-group30.azurewebsites.net/retrieve_categories.php'
      )
      .subscribe(
        (data: any) => {
          this.categories = data;
        },
        (error: any) => {
          console.dir(error);
        }
      );
  }

  getUser(): User {
    return this.userService.getUser();
  }

  validate(): boolean {
    if (
      this.name == null ||
      this.description == null ||
      this.condition == null ||
      this.quantity == null ||
      this.selectedCategory == null ||
      this.endDate == null ||
      this.endTime == null ||
      this.startPrice == null ||
      this.reservePrice == null ||
      this.buyNowPrice == null ||
      this.picture == null
    ) {
      // If there are any empty fields, notify the user.
      this.openDialog('Please fill in all the fields!', '', false);
      return false;
    } else if (
      this.name.trim().length === 0 ||
      this.description.trim().length === 0 ||
      this.condition.trim().length === 0 ||
      this.endDate.trim().length === 0 || new Date(this.endDate + 'T' + this.endTime) <= new Date(Date.now()) ||
      this.endTime.trim().length === 0 ||
      this.quantity <= 0 ||
      this.startPrice <= 0 ||
      this.reservePrice < this.startPrice ||
      this.buyNowPrice < this.reservePrice
    ) {
      // If there are any incorrect details entered, notify the user.
      this.openDialog('Please fill in the correct details!', '', false);
      return false;
    }
    return true;
  }

  openDialog(message: string, name: string, succeeded: boolean): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        message: message,
        username: name
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (succeeded) {
        this.router.navigate(['/sell']);
      }
    });
  }

  setUser(user: User): void {
    this.userService.setUser(user);
  }

  goBack(): void {
    this.router.navigate(['/search']);
  }

  logout(): void {
    this.user = null;
    this.setUser(null);
    this.router.navigate(['/search']);
  }
}
