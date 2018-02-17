import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { DialogComponent } from './dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  loginPage: string;

  username: string;
  password: string;

  private localURI: string;
  private remoteURI: string;

  constructor(public http: HttpClient,
              public dialog: MatDialog,
              private router: Router) {
                this.loginPage = 'true';

                this.localURI = 'http://localhost:3000/php/';
                this.remoteURI = 'https://php-group30.azurewebsites.net/';
  }

  register(): void {
    const headers: any  = new HttpHeaders({ 'Content-Type': 'application/json' }),
      options: any		  = { 'username': this.username, 'password': this.password },
      url: any      	  = this.remoteURI + 'login.php';

      this.http.post(url, JSON.stringify(options), headers)
      .subscribe((data: any) => {
        // If the request was successful, notify the user.
        this.openDialog('Congratulations, logging in...', '', true);
      },
      (error: any) => {
        // If the supplied username and password do not match, notify the user.
        this.openDialog('The supplied username and password are incorrect!', '', false);
      });
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
          this.router.navigate(['/app']);
        }
      });
    }
}
