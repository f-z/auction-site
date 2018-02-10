import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { HomeComponent } from './home';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ItemComponent } from './item.component';
import { ItemDetailsComponent } from './item-details.component';
import { RegistrationComponent } from './registration.component';
import { LoginComponent } from './login.component';

import { SearchPipe } from './search.pipe';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [BrowserModule, FormsModule, AppRoutingModule, HttpClientModule ],
  declarations: [
    HomeComponent,
    AppComponent,
    RegistrationComponent,
    LoginComponent,
    ItemComponent,
    ItemDetailsComponent,
    SearchPipe
  ],
  bootstrap: [HomeComponent],
  providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
})
export class AppModule {}
