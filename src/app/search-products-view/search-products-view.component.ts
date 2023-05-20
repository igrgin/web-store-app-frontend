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
  searchParams?:Search

  constructor(private productService:ProductService) {

  }

  onSearchEventTriggered(searchValue:Search)
  {
    this.productService.searchProducts(searchValue).subscribe(value => {
      this.searchParams=searchValue
      console.log(value)
      this.searchResults=value
    });
  }

  onPageChange($event: any) {
    if(this.searchParams)
    {
      const newPageQuery: Search={
        name:this.searchParams.name,
        category:this.searchParams.category,
        brands:this.searchParams.brands,
        page:$event.first - 1,
        size:$event.rows,
        priceRange:this.searchParams.priceRange
      }
      this.onSearchEventTriggered(newPageQuery)
    }



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
