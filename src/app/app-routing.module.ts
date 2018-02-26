import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { RegistrationComponent } from './registration.component';
import { LoginComponent } from './login.component';
import { ItemDetailsComponent } from './item-details.component';
import { SellerComponent } from './seller.component';

const routes: Routes = [
  { path: '', redirectTo: '/app', pathMatch: 'full' },
  { path: 'app', component: AppComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'add-item', component: LoginComponent },
  { path: 'items/:itemId', component: ItemDetailsComponent },
  { path: 'sell', component: SellerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
