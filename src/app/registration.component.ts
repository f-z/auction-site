import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { DialogComponent } from './dialog.component';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { FileUploadModule } from 'primeng/fileupload';
import { Message } from 'primeng/components/common/message';
// const URL = 'http://localhost:3000/';
// const URL = 'https://express-group30.azurewebsites.net/';
// const URL = 'https://php-group30.azurewebsites.net/upload_image.php';

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

  private localURI: string;
  private remoteURI: string;
  files: FileList;
  msgs: Message[];
  uploadedFiles: any[] = [];

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
    this.userRole = 'buyer';

    this.localURI = 'http://localhost:3000/php/';
    this.remoteURI = 'https://php-group30.azurewebsites.net/';
  }

  ngOnInit(): void {
    this.uploader.onAfterAddingFile = file => {
      file.withCredentials = false;
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
    // If the details supplied are incomplete/incorrect, do not proceed with the transaction.
    if (!this.validate()) {
      return;
    }

    if (this.termsAccepted) {
      this.uploader.uploadAll();

      const headers: any = new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        options: any = {
          userRole: this.userRole,
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
        url: any = this.remoteURI + 'register.php';

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
  }

  validate(): boolean {
    const date = new Date(this.DOB);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const maxBirthDate = new Date(year + 18, month, day);

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
      this.phone.toString().length > 10
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

  goBack(): void {
    this.router.navigate(['/search']);
  }
}
