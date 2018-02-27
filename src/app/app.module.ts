import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HomeComponent } from './home';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ItemComponent } from './item.component';
import { ItemDetailsComponent } from './item-details.component';
import { RegistrationComponent } from './registration.component';
import { LoginComponent } from './login.component';
import { SellerComponent } from './seller.component';
import { AddItemComponent } from './add-item.component';
import { DialogComponent} from './dialog.component';

import { SearchPipe, SortByPipe } from './search.pipe';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './shared/services/user.service';
import { ItemService } from './shared/services/item.service';
import { MatDialogModule, MatButtonToggleModule } from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  imports: [BrowserModule,
            FormsModule,
            AppRoutingModule,
            HttpClientModule,
            MatDialogModule,
            BrowserAnimationsModule,
            MatButtonToggleModule,
            MatIconModule
          ],
  declarations: [
    HomeComponent,
    AppComponent,
    RegistrationComponent,
    LoginComponent,
    SellerComponent,
    AddItemComponent,
    ItemComponent,
    ItemDetailsComponent,
    SearchPipe,
    SortByPipe,
    DialogComponent
  ],
  bootstrap: [HomeComponent],
  providers: [{ provide: APP_BASE_HREF, useValue: '/' }, UserService, ItemService ],
  schemas: [ NO_ERRORS_SCHEMA ],
  entryComponents: [
    DialogComponent
]
})
export class AppModule {}
