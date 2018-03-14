import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Item, ItemService } from './shared/services/item.service';
import { User, UserService } from './shared/services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatIconRegistry } from '@angular/material';
import { MatGridListModule } from '@angular/material/grid-list';
import { DomSanitizer } from '@angular/platform-browser';
import { query } from '@angular/animations';
import { MatDialog } from '@angular/material';
import { DialogComponent } from './dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  item: Item;
  items: Observable<Item[]> = null;
  recommendedItems: Observable<Item[]> = null;
  public selectedCategory: string;
  private user: User;
  private term: string;
  categories: any;

  constructor(
    private itemService: ItemService,
    private userService: UserService,
    public dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      'car',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/car.svg')
    );
    iconRegistry.addSvgIcon(
      'book',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/book.svg')
    );
    iconRegistry.addSvgIcon(
      'fashion',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/clothes.svg')
    );
    iconRegistry.addSvgIcon(
      'sports',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/ball.svg')
    );
    iconRegistry.addSvgIcon(
      'home',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/home.svg')
    );
    iconRegistry.addSvgIcon(
      'collectables',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/collectables.svg')
    );
  }

  ngOnInit(): void {
    this.term = 'All';
    this.user = this.getUser();
    this.getItems();
    this.getUserRecommendations();
  }

  getItems(): void {
    this.http
      .get(
        'https://php-group30.azurewebsites.net/retrieve_all_auctioned_items.php'
      )
      .subscribe(
        (data: any) => {
          this.items = data;
          for (let i = 0; i < data.length; i++) {
            // Format the end date and time.
            const endDate = new Date(this.items[i].endTime).getTime();
            const now = new Date().getTime();
            // Find the distance between now and the end date.
            const distance = endDate - now;

            this.items[i].photo1 =
              'https://php-group30.azurewebsites.net/uploads/' +
              this.items[i].photo1.substring(
                5,
                this.items[i].photo1.length - 5
              );

            if (this.items[i].photo2 != null && this.items[i].photo2 !== '') {
              this.items[i].photo2 =
                'https://php-group30.azurewebsites.net/uploads/' +
                this.items[i].photo2.substring(
                  5,
                  this.items[i].photo2.length - 5
                );
            } else {
              this.items[i].photo2 = null;
            }

            if (this.items[i].photo3 != null && this.items[i].photo3 !== '') {
              this.items[i].photo3 =
                'https://php-group30.azurewebsites.net/uploads/' +
                this.items[i].photo3.substring(
                  5,
                  this.items[i].photo3.length - 5
                );
            } else {
              this.items[i].photo3 = null;
            }
          }
        },
        (error: any) => {
          console.dir(error);
        }
      );
  }

  getUserRecommendations():void{

    const headers: any = new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      options: any = { userID: this.user.userID },
      url: any =
        'https://php-group30.azurewebsites.net/get_user_recommendations.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        // Set the date we're counting down to.
        if (data != null) {
          this.recommendedItems = data;
           //photos
            for (let i = 0; i < data.length; i++) {
            this.recommendedItems[i].photo1 =
              'https://php-group30.azurewebsites.net/uploads/' +
              this.recommendedItems[i].photo1.substring(
                5,
                this.recommendedItems[i].photo1.length - 5
              );

            if (
              this.recommendedItems[i].photo2 != null &&
              this.recommendedItems[i].photo2 !== ''
            ) {
              this.recommendedItems[i].photo2 =
                'https://php-group30.azurewebsites.net/uploads/' +
                this.recommendedItems[i].photo2.substring(
                  5,
                  this.recommendedItems[i].photo2.length - 5
                );
            } else {
              this.recommendedItems[i].photo2 = null;
            }

            if (
              this.recommendedItems[i].photo3 != null &&
              this.recommendedItems[i].photo3 !== ''
            ) {
              this.recommendedItems[i].photo3 =
                'https://php-group30.azurewebsites.net/uploads/' +
                this.recommendedItems[i].photo3.substring(
                  5,
                  this.recommendedItems[i].photo3.length - 5
                );
            } else {
              this.recommendedItems[i].photo3 = null;
            }
          }
        }
      },
      (error: any) => {
        // If there is an error, return to main search page.
        //this.openDialog(
         // 'Oops! Something went wrong; redirecting you to safety...',
          //'',
         //false
        //);
        console.log(error);
      }
    );
    return null;

  }

  setItem(item: Item): void {
    this.itemService.setItem(item);

    if (this.user === null) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/items', item.itemID]);
    }
  }

  selectCategory(category): void {
    this.term = category;
  }

  getUser(): User {
    return this.userService.getUser();
  }

  setUser(user: User): void {
    this.userService.setUser(user);
  }

  goToMyProfile(): void {
    this.router.navigate(['/profile', this.user.userID]);
  }

  logout(): void {
    this.openDialog('Logging you out...', '', true);
  }

  openDialog(message: string, username: string, succeeded: boolean): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        message: message,
        username: username
      }
    });

    dialogRef.afterOpen().subscribe(result => {
      setTimeout(dialogRef.close(), 4000);
    });

    dialogRef.afterClosed().subscribe(result => {
      if (succeeded) {
        this.user = null;
        this.setUser(null);
      }
    });
  }
}
