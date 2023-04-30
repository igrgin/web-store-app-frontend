import {Component} from '@angular/core';
import {PageableProducts} from "../interface/product/pagable-products";
import {ProductService} from "../service/product/product.service";
import {Search} from "../interface/search/search";

@Component({
  selector: 'app-search-products-view',
  templateUrl: './search-products-view.component.html',
  styleUrls: ['./search-products-view.component.css']
})
export class SearchProductsViewComponent {
  searchResults:PageableProducts = {
    products:[],
    number_of_pages: 0
  };
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

  getSeverityStatus(stock: Number):string {
    if(stock > 500)
    {
      return 'success';
    }

    if(stock === 500)
    {
      return 'warning';
    }

    if(stock === 0)
    {
      return 'danger';
    }

    return 'danger'
  }

  getSeverity(stock: Number):string {
    if(stock > 500)
    {
      return 'IN STOCK';
    }

    if(stock === 500)
    {
      return 'LOW STOCK';
    }

    if(stock === 0)
    {
      return 'OUT OF STOCK';
    }

    return 'ERROR'
  }
}
