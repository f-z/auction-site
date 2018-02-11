import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'login',
  templateUrl: './html/login.html',
  styleUrls: ['./css/login.css']
})
export class LoginComponent {
  loginPage: string;

  username: string;
  email: string;
  password: string;

  private localURI: string;
  private remoteURI: string;

  constructor(public http: HttpClient) {
    this.loginPage = 'true';

    this.localURI = 'https://localhost/php/';
    this.remoteURI = 'https://ucl-group30.azurewebsites.net/php/';
  }

  register(): void {
    console.log('registering');

      let headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
          options: any		= { 'username': this.username,
                              'email': this.email, 'password': this.password },
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
