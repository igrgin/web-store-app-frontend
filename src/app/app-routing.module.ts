import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ProductDetailsViewComponent} from "./product-details-view/product-details-view.component";
import {CartViewComponent} from "./cart-view/cart-view.component";
import {TransactionViewComponent} from "./transaction-view/transaction-view.component";
import {LoginComponent} from "./login/login.component";
import {SearchProductsViewComponent} from "./search-products-view/search-products-view.component";

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {path: 'home', component: SearchProductsViewComponent},
  {path: 'detail/:name', component: ProductDetailsViewComponent},
  {path: 'checkout/cart', component: CartViewComponent},
  {path: 'transactions', component: TransactionViewComponent},
  {path: 'login', component: LoginComponent}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports:[RouterModule]
})
export class AppRoutingModule { }
