import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { LoginComponent } from './login.component';
import { DialogComponent } from './dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { User, UserService } from './shared/services/user.service';
import { Category } from './shared/services/item.service';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.html',
  styleUrls: ['./add-item.css']
})
export class AddItemComponent implements OnInit {
  private user: User;

  private name: string;
  private description: string;
  private condition: string;
  private quantity: number;
  private category: string;
  private photo1: string;
  private photo2: string;
  private photo3: string;
  private endDate: string;
  private endTime: string;
  private startPrice: number;
  private reservePrice: number;
  private buyNowPrice: number;

  private categories: Observable<Category[]> = null;
  private selectedCategory: string;

  private imageAdded: boolean;

  public uploader1: FileUploader = new FileUploader({
    url: 'https://php-group30.azurewebsites.net/upload_image.php',
    itemAlias: 'photo1'
  });
  public uploader2: FileUploader = new FileUploader({
    url: 'https://php-group30.azurewebsites.net/upload_image.php',
    itemAlias: 'photo2'
  });
  public uploader3: FileUploader = new FileUploader({
    url: 'https://php-group30.azurewebsites.net/upload_image.php',
    itemAlias: 'photo3'
  });

  constructor(
    private userService: UserService,
    public http: HttpClient,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.imageAdded = false;
  }

  ngOnInit(): void {
    this.user = this.getUser();
    this.getCategories();

    this.uploader1.onAfterAddingFile = file => {
      file.withCredentials = false;
      this.imageAdded = true;
    };
    // Overriding the default onCompleteItem property of the uploader,
    // so we are able to deal with the server response.
    this.uploader1.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      this.photo1 = response;

      this.uploader2.uploadAll();
    };

    this.uploader2.onAfterAddingFile = file => {
      file.withCredentials = false;
      this.imageAdded = true;
    };
    // Overriding the default onCompleteItem property of the uploader,
    // so we are able to deal with the server response.
    this.uploader2.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      this.photo2 = response;

      this.uploader3.uploadAll();
    };

    this.uploader3.onAfterAddingFile = file => {
      file.withCredentials = false;
      this.imageAdded = true;
    };
    // Overriding the default onCompleteItem property of the uploader,
    // so we are able to deal with the server response.
    this.uploader3.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      this.photo3 = response;

      this.addItem();
    };
  }

  addItem(): void {
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
        photo1: this.photo1,
        photo2: this.photo2,
        photo3: this.photo3,
        sellerID: this.user.userID
      },
      url: any = 'https://php-group30.azurewebsites.net/insert_item.php';

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
      this.buyNowPrice == null
    ) {
      // If there are any empty fields, notify the user.
      this.openDialog('Please fill in all the fields!', '', false);
      return false;
    } else if (
      this.name.trim().length === 0 ||
      this.description.trim().length === 0 ||
      this.condition.trim().length === 0 ||
      this.endDate.trim().length === 0 ||
      new Date(this.endDate + 'T' + this.endTime) <= new Date(Date.now()) ||
      this.endTime.trim().length === 0 ||
      this.quantity <= 0 ||
      this.startPrice <= 0 ||
      this.reservePrice < this.startPrice ||
      this.buyNowPrice < this.reservePrice
    ) {
      // If there are any incorrect details entered, notify the user.
      this.openDialog('Please fill in the correct details!', '', false);
      return false;
    } else if (!this.imageAdded) {
      // If the user has not accepted the terms and conditions, do not allow them to proceed with registration.
      this.openDialog('Please add an item photo!', '', false);
      return false;
    }

    // If all the checks have passed, then proceed with uploading the image
    // and creating the registration record in the database.
    this.uploader1.uploadAll();
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
