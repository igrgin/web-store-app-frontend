import {Component, OnInit} from '@angular/core';
import {PageableProducts} from "../interface/product/pagable-products";
import {ProductService} from "../service/product/product.service";
import {Search} from "../interface/search/search";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {Observable, switchMap} from "rxjs";

@Component({
  selector: 'app-search-products-view',
  templateUrl: './search-products-view.component.html',
  styleUrls: ['./search-products-view.component.css']
})
export class SearchProductsViewComponent implements OnInit {
  searchResults: PageableProducts = {
    products: [],
    total_pages: 0,
    total_products: 0
  };
  searchParams: Search = { size:40} as Search

  constructor(private productService: ProductService, private route: ActivatedRoute) {

  }

  ngOnInit(): void {


  }


  onSearchEventTriggered() {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          const nameParam = this.route.snapshot.paramMap.get('name');
          const categoryParam = this.route.snapshot.paramMap.get('category');
          const subcategoryParam = this.route.snapshot.paramMap.get('subcategory');
          const brandsParam = this.route.snapshot.paramMap.get('brands');
          const priceRangeParam = this.route.snapshot.paramMap.get('priceRange');
          const pageParam = this.route.snapshot.paramMap.get('page');
          const sizeParam = this.route.snapshot.paramMap.get('size');
          console.log(pageParam)
          if (
            pageParam !== null && sizeParam != null && categoryParam !== null
          ) {
            this.searchParams = {
              name: nameParam?.toString(),
              category: categoryParam,
              subcategory: subcategoryParam?.toString(),
              brands: brandsParam?.split(","),
              priceRange: priceRangeParam?.split(",").map(Number),
              page: parseInt(pageParam),
              size: parseInt(sizeParam)
            };
            this.productService.searchProducts(this.searchParams).subscribe(value => {
              console.log(value)
            });
          }
          return new Observable<any>()
        })).subscribe()
  }

  onPageChange(event: any) {
    if (this.searchParams) {
      console.log(event.rows)
      const newPageQuery: Search = {
        name: this.searchParams.name,
        category: this.searchParams.category,
        subcategory: this.searchParams.subcategory,
        brands: this.searchParams.brands,
        page: event.target.value - 1,
        size: event.rows,
        priceRange: this.searchParams.priceRange
      }
      this.onSearchEventTriggered()
    }

  }
}
