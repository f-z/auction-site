import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Item, ItemService, Feedback } from './shared/services/item.service';
import { User, UserService } from './shared/services/user.service';
import { DialogComponent } from './dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatGridListModule } from '@angular/material/grid-list';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';

@Component({
  selector: 'app-profile',
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.scss']
})
export class ProfileComponent {
  private user: User; // the logged-in user
  private userID: number;
  private street: string;
  private city: string;
  private postcode: string;
  private username: string;
  private email: string;
  private password: string;
  private confirmedPassword: string;
  private oldPassword: string;
  private DOB: string;
  private phone: string;
  private photo: string;
  private imageAdded: boolean;

  private profileUserID: number;
  private profileUser: User; // the user whose profile we 're viewing
  private item: Item;
  private userAuctions: Observable<Item[]> = null;

  private averageSellerRating: number;
  private sellerFeedbackCount: number;
  private userSellerFeedback: Observable<Feedback[]> = null;

  private averageBuyerRating: number;
  private buyerFeedbackCount: number;
  private userBuyerFeedback: Observable<Feedback[]> = null;

  public uploader: FileUploader = new FileUploader({
    url: 'https://php-group30.azurewebsites.net/upload_image.php',
    itemAlias: 'photo'
  });

  constructor(
    private userService: UserService,
    private itemService: ItemService,
    private router: Router,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient
  ) {
    activatedRoute.params.subscribe(val => {
      this.profileUserID = +this.activatedRoute.snapshot.url[1].path;
      this.user = this.getUser();
      if (this.user === null) {
        this.router.navigate(['/login']);
      }
      this.retrieveProfile();
      this.getUsersSellerFeedback();
      this.getUsersBuyerFeedback();
      this.getItems();
      this.imageAdded = false;
    });

    this.uploader.onAfterAddingFile = file => {
      file.withCredentials = false;
      this.uploader.uploadAll();
    };
    // Overriding the default onCompleteItem property of the uploader,
    // so we are able to deal with the server response.
    this.uploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      this.photo = response;
    };
  }

  retrieveProfile(): void {
    const headers: any = new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      options: any = {
        userID: +this.activatedRoute.snapshot.url[1].path,
        includeExpired: true
      },
      url: any = 'https://php-group30.azurewebsites.net/retrieve_user.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        this.profileUser = data;
        this.userID = data.userID;
        this.username = data.username;
        this.street = data.street;
        this.city = data.city;
        this.postcode = data.postcode;
        this.phone = data.phone;
        this.email = data.email;
        this.DOB = data.DOB;

        if (this.profileUser.photo != null) {
          if (this.profileUser.photo.substring(0, 1) === '"') {
            this.profileUser.photo =
              'http://php-group30.azurewebsites.net/uploads/' +
              this.profileUser.photo.substring(
                1,
                this.profileUser.photo.length - 1
              );
          } else {
            this.profileUser.photo =
              'http://php-group30.azurewebsites.net/uploads/' +
              this.profileUser.photo.substring(
                5,
                this.profileUser.photo.length - 5
              );
          }
        }
      },
      (error: any) => {}
    );
  }

  getItem(): Item {
    return this.itemService.getItem();
  }

  getUsersSellerFeedback(): void {
    const headers: any = new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      options: any = { sellerID: +this.activatedRoute.snapshot.url[1].path },
      url: any =
        'https://php-group30.azurewebsites.net/retrieve_seller_feedback.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        if (data != null) {
          this.userSellerFeedback = data['feedbackRows'];
          this.averageSellerRating = data['average'].average * 20;
          this.sellerFeedbackCount = data['average'].count;
        }
      },
      (error: any) => {}
    );
    return null;
  }

  getUsersBuyerFeedback(): void {
    const headers: any = new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      options: any = { buyerID: +this.activatedRoute.snapshot.url[1].path },
      url: any =
        'https://php-group30.azurewebsites.net/retrieve_buyer_feedback.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        if (data != null) {
          this.userBuyerFeedback = data['feedbackRows'];
          this.averageBuyerRating = data['average'].average * 20;
          this.buyerFeedbackCount = data['average'].count;
        }
      },
      (error: any) => {}
    );
    return null;
  }

  additem(): void {
    this.itemService.setItem(null);
    this.router.navigate(['add-item']);
  }

  getItems(): void {
    const headers: any = new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      options: any = {
        userID: +this.activatedRoute.snapshot.url[1].path,
        includeExpired: false
      },
      url: any =
        'https://php-group30.azurewebsites.net/retrieve_user_items.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        this.userAuctions = data.auctions;
        for (let i = 0; i < data.auctions.length; i++) {
          if (this.userAuctions[i].photo.substring(0, 1) === '"') {
            this.userAuctions[i].photo =
              'https://php-group30.azurewebsites.net/uploads/' +
              this.userAuctions[i].photo.substring(
                1,
                this.userAuctions[i].photo.length - 1
              );
          } else {
            this.userAuctions[i].photo =
              'https://php-group30.azurewebsites.net/uploads/' +
              this.userAuctions[i].photo.substring(
                5,
                this.userAuctions[i].photo.length - 5
              );
          }
        }
      },
      (error: any) => {
        alert('Error in get items!');
      }
    );
  }

  changeDetails(): void {
    if (this.validate()) {
      const headers: any = new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        options: any = {
          userID: this.userID,
          street: this.street,
          city: this.city,
          postcode: this.postcode,
          username: this.username,
          email: this.email,
          password: this.password,
          confirmedPassword: this.confirmedPassword,
          oldPassword: this.oldPassword,
          phone: this.phone,
          DOB: this.DOB,
          photo: this.photo
        },
        url: any = 'https://php-group30.azurewebsites.net/change_details.php';

      this.http.post(url, JSON.stringify(options), headers).subscribe(
        (data: any) => {
          // If the request was successful, notify the user.
          this.openDialog(
            'Congratulations, your changes have been saved!',
            '',
            false
          );
        },
        (error: any) => {
          // If the supplied username or email already exist in the database, notify the user.
          this.openDialog('Supplied password is incorrect!', '', false);
        }
      );
    }
  }

  validate(): boolean {
    // If the details supplied are incomplete / incorrect, do not proceed with the transaction.
    const date = new Date(this.DOB);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const maxBirthDate = new Date(year + 18, month, day);
    const minBirthDate = new Date(year + 110, month, day);

    const pw_regex_number = /[0-9]/;
    const pw_regex_lowercase = /[a-z]/;
    const pw_regex_uppercase = /[A-Z]/;
    // tslint:disable-next-line:max-line-length
    const email_regex = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (
      this.street == null ||
      this.city == null ||
      this.postcode == null ||
      this.username == null ||
      this.email == null ||
      this.phone == null ||
      this.DOB == null
    ) {
      // If there are any empty fields, notify the user.
      this.openDialog('Please fill in all the fields!', '', false);
      return false;
    } else if (this.oldPassword == null) {
      this.openDialog(
        'Please type your current password to save changes!',
        '',
        false
      );
      return false;
    } else if (
      this.street.trim().length === 0 ||
      this.city.trim().length === 0 ||
      this.postcode.trim().length === 0 ||
      this.username.trim().length === 0 ||
      this.oldPassword.trim().length === 0 ||
      this.phone.length < 10 ||
      this.phone.length > 13 ||
      minBirthDate < new Date()
    ) {
      // If there are any incorrect details entered, notify the user.
      this.openDialog('Please fill in the correct details!', '', false);
      return false;
    } else if (this.DOB.trim().length === 0 || maxBirthDate > new Date()) {
      // If the user is underage, do not allow registration.
      this.openDialog(
        'Our minimum age requirement is 18! Please view our terms and conditions for details on our policies.',
        '',
        false
      );
      return false;
    } else if (this.password !== this.confirmedPassword) {
      // If passwords do not match, notify the user.
      this.openDialog('Passwords need to match!', '', false);
      return false;
    } else if (
      this.password === this.confirmedPassword &&
      this.password === this.oldPassword
    ) {
      // If old and new passwords match, notify the user.
      this.openDialog('New password must be different to old one!', '', false);
      return false;
    } else if (this.password.length < 8) {
      this.openDialog(
        'Passwords must be at least 8 characters long!',
        '',
        false
      );
      return false;
    } else if (!pw_regex_number.test(this.password)) {
      this.openDialog('Passwords must contain at least one number!', '', false);
      return false;
    } else if (!pw_regex_lowercase.test(this.password)) {
      this.openDialog(
        'Passwords must contain at least one lowercase letter!',
        '',
        false
      );
      return false;
    } else if (!pw_regex_uppercase.test(this.password)) {
      this.openDialog(
        'Passwords must contain at least one uppercase letter!',
        '',
        false
      );
      return false;
    } else if (!email_regex.test(this.email)) {
      this.openDialog('Please enter a valid email address!', '', false);
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

    dialogRef.afterOpen().subscribe(result => {
      setTimeout(dialogRef.close(), 5000);
    });

    dialogRef.afterClosed().subscribe(result => {
      this.refresh();
    });
  }

  refresh(): void {
    window.location.reload();
  }

  setItem(item: Item): void {
    this.itemService.setItem(item);
  }

  getUser(): User {
    return this.userService.getUser();
  }

  setUser(user: User): void {
    this.userService.setUser(this.user);
    this.router.navigate(['/search']);
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
