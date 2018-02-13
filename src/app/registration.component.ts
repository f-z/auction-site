import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  constructor(public http: HttpClient) {
    this.loginPage = 'false';

    this.localURI = 'http://localhost:3000/php/';
    this.remoteURI = 'https://ucl-group30.azurewebsites.net/php/';
  }

  register(): void {
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
            // If the request was successful, notify the user
            console.log(`Congratulations, the user: ${this.username} was successfully added!`);
            this.goBack();
    },
      (error: any) => {
        console.log(`The supplied username/email already exists!`);
      });
    }
  }

  goBack(): void {
    window.history.back();
  }
}
