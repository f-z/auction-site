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
  // picture: binary?
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
        category: this.selectedCategory,
        endDate: this.endDate,
        endTime: this.endTime,
        startPrice: this.startPrice,
        reservePrice: this.reservePrice,
        buyNowPrice: this.buyNowPrice /*'picture': this.picture,*/
      },
      url: any = this.remoteURI + 'insert_item_create_auction.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        // If the request was successful, notify the user.
        this.openDialog(
          'Congratulations, the following item was added: ',
          this.name,
          true
        );
      },
      (error: any) => {
        // If the supplied username or email already exist in the database, notify the user.
        this.openDialog(
          'The supplied username/email already exists!',
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
      this.category == null ||
      this.endDate == null ||
      this.endTime == null ||
      this.startPrice == null ||
      this.reservePrice == null
      // || this.buyitnowprice == null
      /*  || this.picture == null*/
    ) {
      // If there are any empty fields, notify the user.
      this.openDialog('Please fill in all the fields!', '', false);
      return false;
    } else if (
      this.name.trim().length === 0 ||
      this.description.trim().length === 0 ||
      this.condition.trim().length === 0 ||
      this.endDate.trim().length === 0 ||
      this.endTime.trim().length === 0 ||
      this.quantity <= 0 ||
      this.startPrice < 0 ||
      this.reservePrice < this.startPrice
      // || this.buyitnowprice < this.reserveprice || this.day > 31 || this.month < 1 || this.month > 12
      // TODO:
      // need checks to make sure end date of auction is in future
    ) {
      // If there are any incorrect details entered, notify the user.
      this.openDialog('Please fill in the correct details!', '', false);
      return false;
    }
    return true;
  }

  openDialog(message: string, username: string, succeeded: boolean): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        message: message,
        username: username
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (succeeded) {
        this.router.navigate(['/login']);
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
