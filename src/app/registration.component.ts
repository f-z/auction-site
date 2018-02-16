import {Component, Inject} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';

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
  phone: number;
  day: number;
  month: number;
  year: number;
  termsAccepted: boolean;

  private localURI: string;
  private remoteURI: string;

  constructor(public http: HttpClient,
              public dialog: MatDialog,
              private router: Router) {
    this.loginPage = 'false';
    this.userRole = 'buyer';

    this.localURI = 'http://localhost:3000/php/';
    this.remoteURI = 'https://php-group30.azurewebsites.net/';
  }

  register(): void {
    // If the details supplied are incomplete/incorrect, do not proceed with the transaction.
    if (!this.validate()) {
      return;
    }

    if (this.termsAccepted) {
      const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
          options: any		= { 'userRole': this.userRole, 'firstName': this.firstName,
                              'lastName': this.lastName, 'street': this.street, 'city': this.city,
                              'postcode': this.postcode, 'username': this.username,
                              'email': this.email, 'password': this.password,
                              'confirmedPassword': this.confirmedPassword,
                              'phone': this.phone, 'day': this.day,
                              'month': this.month, 'year': this.year },
          url: any      	= this.remoteURI + 'register.php';

      this.http.post(url, JSON.stringify(options), headers)
      .subscribe((data: any) => {
            // If the request was successful, notify the user.
            this.openDialog('Congratulations, the following user was registered: ', this.username, true);
    },
      (error: any) => {
        // If the supplied username or email already exist in the database, notify the user.
        this.openDialog('The supplied username/email already exists!', '', false);
      });
    } else {
        // If the terms have not been accepted, notify the user.
        this.openDialog('Please accept the terms to proceed!', '', false);
}
  }

  validate(): boolean {
    if (this.firstName == null || this.lastName == null || this.street == null || this.city == null
      || this.postcode == null || this.username == null || this.email == null
      || this.password == null || this.confirmedPassword == null
      || this.phone == null
      || this.day == null || this.month == null || this.year == null) {
        // If there are any empty fields, notify the user.
        this.openDialog('Please fill in all the fields!', '', false);
        return false;
    } else if (this.firstName.trim().length === 0 || this.lastName.trim().length === 0
        || this.street.trim().length === 0 || this.city.trim().length === 0
        || this.postcode.trim().length === 0 || this.username.trim().length === 0
        || this.email.trim().length === 0
        || this.password.trim().length === 0 || this.confirmedPassword.trim().length === 0
        || this.phone === 0 || this.phone.toString().length < 9
        || this.day < 1 || this.day > 31 || this.month < 1 || this.month > 12
        || this.year < 1900 || this.year > 2000) {
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
          username: this.username
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (succeeded) {
          this.router.navigate(['/login']);
        }
      });
    }

  goBack(): void {
    this.router.navigate(['/app']);
  }
}

@Component({
  selector: 'app-dialog',
  templateUrl: 'registration.dialog.html',
})
export class DialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
