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
import { MyItemsComponent } from './my-items.component';
import { AddItemComponent } from './add-item.component';
import { FeedbackComponent } from './feedback.component';
import { ProfileComponent } from './user-profile.component';
import { DialogComponent } from './dialog.component';

import { SearchPipe } from './search.pipe';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './shared/services/user.service';
import { ItemService } from './shared/services/item.service';
import { MatDialogModule, MatButtonToggleModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import {MatGridListModule} from '@angular/material/grid-list';

import { FileSelectDirective } from 'ng2-file-upload';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MatButtonToggleModule,
    MatIconModule,
    MatGridListModule
  ],
  declarations: [
    HomeComponent,
    AppComponent,
    RegistrationComponent,
    LoginComponent,
    MyItemsComponent,
    AddItemComponent,
    ItemComponent,
    ItemDetailsComponent,
    FeedbackComponent,
    ProfileComponent,
    SearchPipe,
    DialogComponent,
    FileSelectDirective
  ],
  bootstrap: [HomeComponent],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    UserService,
    ItemService
  ],
  schemas: [NO_ERRORS_SCHEMA],
  entryComponents: [DialogComponent]
})
export class AppModule {}
