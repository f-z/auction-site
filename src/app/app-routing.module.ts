import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { RegistrationComponent } from './registration.component';
import { LoginComponent } from './login.component';
import { ItemDetailsComponent } from './item-details.component';
import { SellerComponent } from './seller.component';
import { AddItemComponent } from './add-item.component';

export const routes: Routes = [
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  { path: 'search', component: AppComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'add-item', component: AddItemComponent },
  { path: 'items/:itemID', component: ItemDetailsComponent },
  { path: 'sell', component: SellerComponent },
];

export const appRoutingProviders: any[] = [
];

export const routing = RouterModule.forRoot(routes);

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
