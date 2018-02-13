import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css']
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
    this.remoteURI = 'https://php-group30.azurewebsites.net/';
  }

  register(): void {
    console.log('registering');

      const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
          options: any		= { 'username': this.username,
                              'password': this.password },
          url: any      	= this.remoteURI + 'login.php';

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
