import {Component, ViewChild} from '@angular/core';
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
    total_pages:0,
    total_products:0
  };
  searchParams?:Search
  pageSize: number[] = [20,40,60,80,100];
  selectedPageSize?:number;
  @ViewChild('dataView', { static: false }) dataView?: DataView;

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

  onPageChange(event:any) {
    if(this.searchParams)
    {
      console.log(event.rows)
      const newPageQuery: Search={
        name:this.searchParams.name,
        category:this.searchParams.category,
        subcategory:this.searchParams.subcategory,
        brands:this.searchParams.brands,
        page:event.target.value - 1,
        size:event.rows,
        priceRange:this.searchParams.priceRange
      }
      this.onSearchEventTriggered(newPageQuery)
    }



  }

  loadData($event: any) {
    console.log($event.rows)
    const firstRowIndex = $event.first;
    const rowsPerPage = $event.rows;
    this.selectedPageSize = Math.min(rowsPerPage, this.searchResults.total_products - firstRowIndex);
  }
}
