import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {CartViewComponent} from './cart-view/cart-view.component';
import {TransactionViewComponent} from './transaction-view/transaction-view.component';
import {SearchProductsViewComponent} from './search-products-view/search-products-view.component';
import {HttpClientModule} from "@angular/common/http";
import {AppRoutingModule} from "./app-routing.module";
import {SearchComponent} from './search/search.component';
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {FormsModule} from "@angular/forms";
import {RippleModule} from "primeng/ripple";
import {PaginatorModule} from "primeng/paginator";
import {LoginComponent} from './login/login.component';
import {ProductDetailsViewComponent} from './product-details-view/product-details-view.component';
import { MenuViewComponent } from './menu-view/menu-view.component';
import {TabMenuModule} from "primeng/tabmenu";
import {MegaMenuModule} from "primeng/megamenu";
import {MenubarModule} from "primeng/menubar";
import {DataViewModule} from "primeng/dataview";
import {TagModule} from "primeng/tag";
import {NgOptimizedImage} from "@angular/common";
import {SidebarModule} from "primeng/sidebar";
import {MultiSelectModule} from "primeng/multiselect";
import {DividerModule} from "primeng/divider";
import {DropdownModule} from "primeng/dropdown";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {SliderModule} from "primeng/slider";

@NgModule({
  declarations: [
    AppComponent,
    CartViewComponent,
    TransactionViewComponent,
    SearchProductsViewComponent,
    SearchComponent,
    LoginComponent,
    ProductDetailsViewComponent,
    MenuViewComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    RippleModule,
    PaginatorModule,
    TabMenuModule,
    MegaMenuModule,
    MenubarModule,
    DataViewModule,
    TagModule,
    NgOptimizedImage,
    SidebarModule,
    MultiSelectModule,
    DividerModule,
    DropdownModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    SliderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
