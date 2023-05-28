import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Title} from '@angular/platform-browser';

import {Product} from '../interface/product/product';
import {CategoryDto} from '../interface/category/category-dto';
import {BrandDto} from '../interface/brand/brand-dto';
import {CategoryService} from '../service/category/category.service';
import {BrandService} from '../service/brand/brand.service';
import {ProductService} from '../service/product/product.service';
import {StorageService} from "../service/storage/storage.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  products: Product[] = [];
  virtualProducts: Product[] = [];
  selectedSize = 40;
  totalRecords = 0; // Total number of products
  selectedPage = 0; // Current page number
  name?: string; // Name search parameter, adjust the type as per your requirement
  category = this.route.snapshot.paramMap.get('category'); // Category search parameter, adjust the type as per your requirement
  subcategory?: string; // Subcategory search parameter, adjust the type as per your requirement
  selectedBrands: string[] = []; // Brands search parameter, initialized as an empty array
  priceRange: number[] = [0, 4000]; // Price range search parameter, adjust the type as per your requirement
  subcategories: string[] = [];
  brands: string[] = [];
  sizeOptions: number[] = [5, 20, 40, 60, 80, 100, 200, 500];
  selectedPriceRange: number[] = [20, 1000];
  first = 0;
  loading: boolean = false;
  newSearch: boolean = false;
  numberOfProduct: number = 1

  constructor(
    private categoryService: CategoryService,
    private brandService: BrandService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private titleService: Title,
    private storageService: StorageService
  ) {
  }

  ngOnInit(): void {
    console.log("oninit")
    this.route.params.subscribe(params => {
      this.category = params['category']
      this.updateValues();
      if (this.category)
        this.titleService.setTitle(this.category);
      this.loading = true;
      this.newSearch = true
      this.search()
      this.loading = false;
      setTimeout(() => {
        const loadedProducts = this.products.slice(this.first, this.first + this.selectedSize);
        this.virtualProducts = this.virtualProducts.concat(loadedProducts);
        console.log('virtualProducts:', this.virtualProducts);
        console.log(`virtualProducts length: ${this.virtualProducts.length}`);
      }, 1000);
    });

  }

  search(): void {
    console.log("search")
    if (this.newSearch) {
      this.first = 0
      this.products = []
      this.virtualProducts = []
      this.newSearch = false
      this.totalRecords = 0; // Total number of products
      this.selectedPage = 0
    }

    console.log(`first: ${this.first}`)
    console.log(`products length: ${this.products.length}`)

    if (this.category && this.products.length <= this.first) {
      console.log("here")
      const newSearch = {
        size: this.selectedSize,
        page: this.selectedPage,
        category: this.category,
        subcategory: this.subcategory,
        brands: this.selectedBrands,
        priceRange: this.selectedPriceRange,
        name: this.name
      }

      this.productService
        .searchProducts(newSearch)
        .subscribe((value) => {
          console.log('pagable products: ', value.products)
          this.products.push(...value.products)
          this.totalRecords = value.total_products;
          console.log(this.products)
          console.log(this.totalRecords)
        });


    }

    console.log(`name: ${this.name}`)
    console.log(`category: ${this.category}`)
    console.log(`subcategory: ${this.subcategory}`)
    console.log(`brands: ${this.selectedBrands}`)
    console.log(`Price range: ${this.selectedPriceRange[0]} - ${this.selectedPriceRange[1]}`)
    console.log(`Size: ${this.selectedSize}`)
    console.log(`first: ${this.first}`)
    console.log(`Page: ${this.selectedPage}`)
    console.log(`products length: ${this.products.length}`)
  }

  onPageChange(event: any) {
    this.loading = true;
    this.first = (<number>event.first)
    this.selectedSize = (<number>event.rows)
    this.loading = false
  }

  loadProducts(event: any) {
    console.log("loadProducts")
    this.first = event.first;
    this.selectedSize = event.rows;
    this.selectedPage = Math.floor(this.first / this.selectedSize);
    console.log(`Size: ${this.selectedSize}`);
    console.log(`first: ${this.first}`);
    console.log(`Page: ${this.selectedPage + 1}`);


    if (this.first >= this.products.length && this.totalRecords > this.virtualProducts.length) {
      this.search();
      setTimeout(() => {
        let loadedProducts = this.products.slice(this.first, this.first + this.selectedSize);
        this.virtualProducts = [...loadedProducts]
        console.log('virtualProducts:', this.virtualProducts);
        console.log(`virtualProducts length: ${this.virtualProducts.length}`);
        event.forceUpdate = true;
      }, 1000);
    }else{

        let loadedProducts = this.products.slice(this.first, this.first + this.selectedSize);
        this.virtualProducts = [...loadedProducts]
        event.forceUpdate = true;
    }


  }

  private fetchCategories(category: string) {
    console.log("fetch categories")
    this.categoryService
      .getSubcategoriesByCategoryName(category)
      .subscribe((categories: CategoryDto[]) => {
        this.subcategories = categories.map((category: CategoryDto) => category.name);
      });
  }

  private fetchBrands(category: string) {
    console.log("fetch brands")
    this.brandService.getBrandsByCategoryName(category).subscribe((brands: BrandDto[]) => {
      this.brands = brands.map((brand: BrandDto) => brand.name);
    });
  }

  updateValues(): void {
    if (this.category) {
      this.fetchCategories(this.category);
      this.fetchBrands(this.category);
    }
  }

  addToCart(productId: string) {
    this.storageService.addToCart(productId)
    console.log('Cart:', this.storageService.getCart())
  }
}
