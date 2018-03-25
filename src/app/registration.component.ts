import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { DialogComponent } from './dialog.component';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.html',
  styleUrls: ['./registration.css']
})
export class RegistrationComponent {
  loginPage: string;

  userRole: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  postcode: string;
  username: string;
  email: string;
  password: string;
  confirmedPassword: string;
  DOB: string;
  phone: number;
  photo: string;
  termsAccepted: boolean;
  imageAdded: boolean;

  public uploader: FileUploader = new FileUploader({
    url: 'https://php-group30.azurewebsites.net/upload_image.php',
    itemAlias: 'photo'
  });

  constructor(
    public http: HttpClient,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.loginPage = 'false';
    this.imageAdded = false;
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit(): void {
    this.uploader.onAfterAddingFile = file => {
      file.withCredentials = false;
      this.imageAdded = true;
    };
    // overriding the default onCompleteItem property of the uploader, so we are
    // able to deal with the server response.
    this.uploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      this.photo = response;
      this.register();
      // console.log('ImageUpload:uploaded:', item, status, response);
    };
  }

  register(): void {
    const headers: any = new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      options: any = {
        firstName: this.firstName,
        lastName: this.lastName,
        street: this.street,
        city: this.city,
        postcode: this.postcode,
        username: this.username,
        email: this.email,
        password: this.password,
        confirmedPassword: this.confirmedPassword,
        phone: this.phone,
        DOB: this.DOB,
        photo: this.photo
      },
      url: any = 'https://php-group30.azurewebsites.net/register.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        // If the request was successful, notify the user.
        this.openDialog(
          'Congratulations, the following user was registered: ',
          this.username,
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

  validate(): boolean {
    // If the details supplied are incomplete/incorrect, do not proceed with the transaction.
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
      this.firstName == null ||
      this.lastName == null ||
      this.street == null ||
      this.city == null ||
      this.postcode == null ||
      this.username == null ||
      this.email == null ||
      this.password == null ||
      this.confirmedPassword == null ||
      this.phone == null ||
      this.DOB == null
    ) {
      // If there are any empty fields, notify the user.
      this.openDialog('Please fill in all the fields!', '', false);
      return false;
    } else if (
      this.firstName.trim().length === 0 ||
      this.lastName.trim().length === 0 ||
      this.street.trim().length === 0 ||
      this.city.trim().length === 0 ||
      this.postcode.trim().length === 0 ||
      this.username.trim().length === 0 ||
      this.email.trim().length === 0 ||
      this.password.trim().length === 0 ||
      this.confirmedPassword.trim().length === 0 ||
      this.phone === 0 ||
      this.phone.toString().length < 8 ||
      this.phone.toString().length > 13 ||
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
    } else if (!this.termsAccepted) {
      // If the user has not accepted the terms and conditions, do not allow them to proceed with registration.
      this.openDialog(
        'Please accept the terms and conditions to proceed!',
        '',
        false
      );
      return false;
    } else if (!this.imageAdded) {
      // If the user has not accepted the terms and conditions, do not allow them to proceed with registration.
      this.openDialog('Please add a profile photo!', '', false);
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

    // If all the checks have passed, then proceed with uploading the image
    // and creating the registration record in the database.
    this.uploader.uploadAll();
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

  goBack(): void {
    this.router.navigate(['/search']);
  }
}
