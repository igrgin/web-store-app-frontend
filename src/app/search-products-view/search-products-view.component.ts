import { Component } from '@angular/core';
import {PageableProducts} from "../interface/product/pagable-products";
import {type} from "os";
import {ProductService} from "../service/product/product.service";
import {Search} from "../interface/search/search";

@Component({
  selector: 'app-search-products-view',
  templateUrl: './search-products-view.component.html',
  styleUrls: ['./search-products-view.component.css']
})
export class SearchProductsViewComponent {
  searchResults?:PageableProducts;
  searchParams:Search = {} as Search;

  constructor(private productService:ProductService) {

  }


  onSearchEventTriggered(searchValue:Search)
  {
    this.searchParams = searchValue;
  }

  onPageChange($event: any) {
    const newPageQuery: Search={
      name:this.searchParams.name,
      category:this.searchParams.category,
      brand:this.searchParams.brand,
      page:$event.first - 1,
      size:$event.rows
    }
    this.productService.searchProducts(newPageQuery);

  }
}
