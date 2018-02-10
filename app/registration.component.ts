import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'registration',
  templateUrl: './html/registration.html',
  styleUrls: ['./css/registration.css']
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
  gender: string;
  termsAccepted: boolean;

  private localURI: string;
  private remoteURI: string;

  constructor(public http: HttpClient) {
    this.loginPage = 'false';

    this.localURI = 'https://localhost:3000/php/';
    this.remoteURI = 'https://ucl-group30.azurewebsites.net/php/';
  }

  register(): void {
    console.log('registering');

      let headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
          options: any		= { 'userRole': this.userRole, 'firstName': this.firstName,
                              'lastName': this.lastName, 'street': this.street, 'city': this.city,
                              'postcode': this.postcode, 'username': this.username,
                              'email': this.email, 'password': this.password,
                              'confirmedPassword': this.confirmedPassword,
                              'phone': this.phone, 'day': this.day, 'month': this.month, 'year': this.year,
                              'gender': this.gender },
          url: any      	= this.remoteURI + 'registration.php';

      this.http.post(url, JSON.stringify(options), headers)
      .subscribe((data: any) => {
        // If the request was successful, notify the user
        console.log(`Congratulations, the user: ${this.username} was successfully added!`);
      },
      (error: any) => {
        console.log('Something went wrong!');
      });

    this.goBack();
  }

  goBack(): void {
    window.history.back();
  }
}
