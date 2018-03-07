import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { RegistrationComponent } from './registration.component';
import { LoginComponent } from './login.component';
import { MyItemsComponent } from './my-items.component';
import { ItemDetailsComponent } from './item-details.component';
import { AddItemComponent } from './add-item.component';
import { FeedbackComponent } from './feedback.component'


export const routes: Routes = [
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  { path: 'search', component: AppComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'add-item', component: AddItemComponent },
  { path: 'items/:itemID', component: ItemDetailsComponent },
  { path: 'my-items', component: MyItemsComponent },
  {path : 'feedback', component: FeedbackComponent}
];

export const appRoutingProviders: any[] = [
];

export const routing = RouterModule.forRoot(routes);

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
