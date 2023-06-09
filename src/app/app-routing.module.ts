import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ProductDetailsViewComponent} from "./product-details-view/product-details-view.component";
import {CartViewComponent} from "./cart-view/cart-view.component";
import {TransactionViewComponent} from "./transaction-view/transaction-view.component";
import {LoginComponent} from "./login/login.component";
import {HomeViewComponent} from "./home-view/home-view.component";
import {RegisterComponent} from "./register/register.component";
import {SearchProductsViewComponent} from "./search-products-view/search-products-view.component";
import {ChartViewComponent} from "./chart-view/chart-view.component";

import {ForbiddenPageComponent} from "./forbidden-page/forbidden-page.component";
import {AuthGuard} from "./guard/auth.guard";

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {path: 'home', component: HomeViewComponent, title:'home',canActivate:[AuthGuard]},
  {path: 'product/:id', component: ProductDetailsViewComponent, canActivate:[AuthGuard]},
  {path: 'profile/transactions', component: TransactionViewComponent,title:'My Transactions', canActivate:[AuthGuard]},
  {path: 'login', component: LoginComponent, title:'Login'},
  {path: 'search/:category', component: SearchProductsViewComponent, canActivate:[AuthGuard]},
  {path: 'cart', component: CartViewComponent, title:'My Cart', canActivate:[AuthGuard]},
  {path: 'register', component: RegisterComponent, title:'Register'},
  {path: 'admin/panel', component: ChartViewComponent, title:'Admin Panel', canActivate:[AuthGuard]},
  {path: 'problem/:errorCode', component: ForbiddenPageComponent},
  { path: '**', pathMatch   : 'full', component: ForbiddenPageComponent, title:'Error'}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports:[RouterModule],
  providers:[AuthGuard]
})
export class AppRoutingModule { }
