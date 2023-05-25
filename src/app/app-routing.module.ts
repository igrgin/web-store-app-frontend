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
  {path: 'home', component: HomeViewComponent, title:'home'},
  {path: 'product/:id', component: ProductDetailsViewComponent},
  {path: 'profile/transactions', component: TransactionViewComponent,title:'My Transactions'},
  {path: 'login', component: LoginComponent, title:'Login'},
  {path: 'search/:category', component: SearchProductsViewComponent},
  {path: 'user/cart', component: CartViewComponent, title:'My Cart'},
  { path: 'register', component: RegisterComponent, title:'Register'},
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes,{ onSameUrlNavigation: 'reload' })
  ],
  exports:[RouterModule]
})
export class AppRoutingModule { }
