import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { LoginComponent } from './login.component';
import { DialogComponent } from './dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { User, UserService } from './shared/services/user.service';
import { Item, ItemService } from './shared/services/item.service';
import { Category } from './shared/services/item.service';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.html',
  styleUrls: ['./add-item.css']
})
export class AddItemComponent implements OnInit {
  item : Item;
  private user: User;

  private name: string;
  private description: string;
  private condition: string;
  private quantity: number = 1;
  private category: string;
  private photo: string;
  private endDate: string;
  private endTime: string;
  private startPrice: number;
  private reservePrice: number;
  private buyNowPrice: number;

  private categories: Observable<Category[]> = null;
  private selectedCategory: string;

  public uploader1: FileUploader = new FileUploader({
    url: 'https://php-group30.azurewebsites.net/upload_image.php',
    itemAlias: 'photo'
  });

  constructor(
    private userService: UserService,
    private itemService: ItemService,
    public http: HttpClient,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.photo = null;
  }

  ngOnInit(): void {
    this.item = this.itemService.getItem();
    this.name = this.item.name;
    this.description = this.item.description;
    this.condition = this.item.condition;
    this.startPrice = this.item.startPrice;
    this.reservePrice = this.item.reservePrice;
    this.buyNowPrice = this.item.buyNowPrice;
    this.quantity = this.item.quantity;
    this.photo = this.item.photo;
    this.selectedCategory = this.item.categoryName;

    this.user = this.getUser();
    this.getCategories();

    this.uploader1.onAfterAddingFile = file => {
      file.withCredentials = false;
      this.uploader1.uploadAll();
    };
    // Overriding the default onCompleteItem property of the uploader,
    // so we are able to deal with the server response.
    this.uploader1.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      this.photo = response;
    };
  }

  addItem(): void {

    let phpurl = '';
    if(!this.item.name){
        phpurl = 'https://php-group30.azurewebsites.net/insert_item.php';
    } else {
       phpurl = 'https://php-group30.azurewebsites.net/update_item.php';
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
        photo: this.photo,
        sellerID: this.user.userID,
        itemID: this.item.itemID
      },
      url: any = phpurl;

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        this.addAuction(data);
        console.log(data);
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
      url: any = 'https://php-group30.azurewebsites.net/create_auction.php';

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
      .get('https://php-group30.azurewebsites.net/retrieve_categories.php')
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
     // If the details supplied are incomplete/incorrect, do not proceed with the transaction.
     const date = new Date(Date.now());
     const year = date.getFullYear();
     const month = date.getMonth();
     const day = date.getDate();
     const maxAuctionDate = new Date(year, month + 6, day);

    // If the details supplied are incomplete/incorrect, do not proceed with the transaction.
    if (
      this.name == null ||
      this.description == null ||
      this.condition == null ||
      this.quantity == null ||
      this.endDate == null ||
      this.endTime == null ||
      this.startPrice == null ||
      this.reservePrice == null
    ) {
      // If there are any empty fields, notify the user.
      this.openDialog('Please fill in all the fields!', '', false);
      return false;
    } else if (
      this.name.trim().length === 0) {
        this.openDialog('Please add your name', '', false);
        return false;
      } else if (this.description.trim().length === 0) {
        this.openDialog('Please add description', '', false);
        return false;
      } else if (this.condition.trim().length === 0) {
        this.openDialog('Please include item condition', '', false);
        return false;
      } else if (this.endDate.trim().length === 0 || this.endTime.trim().length === 0 ) {
        this.openDialog('Please add auction end date and time', '', false);
        return false;
      } else if (new Date(this.endDate + 'T' + this.endTime) <= new Date(Date.now())) {
        this.openDialog('End date and time cannot be in the past', '', false);
        return false;
      } else if (this.quantity <= 0 || !Number.isInteger(this.quantity)) {
        this.openDialog('Quantity should be positive round number', '', false);
        return false;
      } else if (this.startPrice <= 0) {
        this.openDialog('Start price should be larger than £0.00', '', false);
        return false;
      } else if (this.buyNowPrice != null && (+this.buyNowPrice < +this.reservePrice || +this.buyNowPrice < +this.startPrice)) {
        this.openDialog('Buy-it-now price cannot be less than reserve price or start price', '', false);
        return false;
      } else if (new Date(this.endDate + 'T' + this.endTime) > maxAuctionDate) {
      this.openDialog('The auction end date cannot be more than 6 months into the future!', '', false);
      return false;
    } else if (this.photo == null) {
      // If the user has not accepted the terms and conditions, do not allow them to proceed with registration.
      this.openDialog('Please add an item photo!', '', false);
      return false;
    } else if (+this.startPrice > +this.reservePrice) {
        this.openDialog('Reserve price cannot be smaller than start price', '', false);
        return false;
      } 

    // If all the checks have passed, then proceed with uploading the image
    // and creating the registration record in the database.
    this.addItem();
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
        this.router.navigate(['/my-items']);
      }
    });
  }

  setUser(user: User): void {
    this.userService.setUser(user);
  }

  goBack(): void {
    this.router.navigate(['/my-items']);
  }

  goToMyProfile(): void {
    this.router.navigate(['/profile', this.user.userID]);
  }

  logout(): void {
    this.user = null;
    this.setUser(null);
    this.router.navigate(['/search']);
  }
}
