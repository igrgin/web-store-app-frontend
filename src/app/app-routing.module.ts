import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ProductDetailsViewComponent} from "./product-details-view/product-details-view.component";
import {CartViewComponent} from "./cart-view/cart-view.component";
import {TransactionViewComponent} from "./transaction-view/transaction-view.component";
import {LoginComponent} from "./login/login.component";
import {SearchProductsViewComponent} from "./search-products-view/search-products-view.component";
import {HomeViewComponent} from "./home-view/home-view.component";
import {RegisterComponent} from "./register/register.component";

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {path: 'home', component: HomeViewComponent},
  {path: 'detail/:name', component: ProductDetailsViewComponent},
  {path: 'checkout/cart', component: CartViewComponent},
  {path: 'profile/transactions', component: TransactionViewComponent},
  {path: 'login', component: LoginComponent},
  {path: 'search', component: SearchProductsViewComponent},
  {path: 'user/cart', component: CartViewComponent},
  { path: 'register', component: RegisterComponent },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports:[RouterModule]
})
export class AppRoutingModule { }
