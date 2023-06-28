import {Component, OnInit} from '@angular/core';
import {ProductService} from "../service/product/product.service";
import {Search} from "../interface/search/search";
import {ActivatedRoute, Router} from "@angular/router";
import {Product} from "../interface/product/product";
import {CategoryService} from "../service/category/category.service";
import {BrandService} from "../service/brand/brand.service";
import {Title} from "@angular/platform-browser";
import {StorageService} from "../service/storage/storage.service";
import {CategoryDto} from "../interface/category/category-dto";
import {BrandDto} from "../interface/brand/brand-dto";

@Component({
  selector: 'app-search-products-view',
  templateUrl: './search-products-view.component.html',
  styleUrls: ['./search-products-view.component.css']
})
export class SearchProductsViewComponent implements OnInit {
  virtualProducts: Product[] = [];
  selectedSize = 40;
  totalProducts = 0; // Total number of products
  selectedPage = 0; // Current page number
  name?: string; // Name search parameter, adjust the type as per your requirement
  category: string = (<string>this.route.snapshot.paramMap.get('category')); // Category search parameter, adjust the type as per your requirement
  subcategory?: string; // Subcategory search parameter, adjust the type as per your requirement
  selectedBrands: string[] = []; // Brands search parameter, initialized as an empty array
  priceRange: number[] = [0, 4000]; // Price range search parameter, adjust the type as per your requirement
  subcategories: string[] = [];
  brands: string[] = [];
  sizeOptions: number[] = [5, 20, 40, 60, 80, 100, 200, 500];
  selectedPriceRange: number[] = [20, 1000];
  first = 0;
  loading: boolean = false;
  pagesItems?: any

  constructor(
    private categoryService: CategoryService,
    private brandService: BrandService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private titleService: Title,
    private storageService: StorageService,
    private router:Router
  ) {
  }

   ngOnInit(): void{
    this.route.params.subscribe(params => {
      this.selectedBrands = []
      this.loading = true
      this.category = params['category']
      this.updateValues();
      if (this.category)
        this.titleService.setTitle(this.category);
      const initialSearchParams: Search = {
        size: this.selectedSize,
        page: this.selectedPage,
        category: this.category,
        subcategory: this.subcategory,
        brands: this.selectedBrands,
        priceRange: this.selectedPriceRange,
        name: this.name
      }

      this.search(initialSearchParams).then(
        () => {console.log('pagesItems:', this.pagesItems[this.selectedPage]);
          this.virtualProducts = [...this.pagesItems[this.selectedPage]]
          console.log('virtualProducts:', this.virtualProducts);
          console.log(`virtualProducts length: ${this.virtualProducts.length}`);
          this.loading = false}
      ).catch(_ => {
        this.virtualProducts = []
        this.loading = false
      })
    });

  }

  async search(searchParams: Search): Promise<string> {
    console.log("search");

    return await new Promise<string>((resolve, reject) => {
      this.productService.searchProducts(searchParams).then((value) => {
        this.pagesItems['searchParams'] = {
          category: searchParams.category,
          subcategory: searchParams.subcategory,
          brands: searchParams.brands,
          priceRange: searchParams.priceRange,
          name: searchParams.name
        };

        this.pagesItems['size'] = this.selectedSize
        this.pagesItems['page'] = this.selectedPage
        console.log('pagable products: ', value.products)
        this.pagesItems[this.selectedPage] = [...value.products]
        this.totalProducts = value.total_products;

        console.log(`name: ${this.name}`);
        console.log(`category: ${this.category}`);
        console.log(`subcategory: ${this.subcategory}`);
        console.log(`brands: ${this.selectedBrands}`);
        console.log(`Price range: ${this.selectedPriceRange[0]} - ${this.selectedPriceRange[1]}`);
        console.log(`Size: ${this.selectedSize}`);
        console.log(`first: ${this.first}`);
        console.log(`Page: ${this.selectedPage}`);

        resolve("success"); // Resolve with true
      }).catch((reason) => {
        console.log("search error: ", reason);
        reject("failure"); // Resolve with false
      });
    });
  }



  loadProducts(event: any, isButtonClicked: boolean) {
    this.loading = true
    console.log("loadProducts")
    this.first = event.first;
    this.selectedSize = event.rows;
    this.selectedPage = Math.floor(this.first / this.selectedSize);
    console.log(`Size: ${this.selectedSize}`);
    console.log(`first: ${this.first}`);
    console.log(`Page: ${this.selectedPage + 1}`);
    let searchParams: Search = {
      size: this.selectedSize,
      page: this.selectedPage,
      category: this.category,
      subcategory: this.subcategory,
      brands: this.selectedBrands,
      priceRange: this.selectedPriceRange,
      name: this.name
    }

    if (!this.pagesItems || isButtonClicked || (this.pagesItems && !this.isPageChange(searchParams))) {
      this.pagesItems = {}
    }

    if (this.pagesItems[this.selectedPage] == undefined) {
      if (this.pagesItems && this.isPageChange(searchParams)) searchParams = {
        size: searchParams.size,
        page: searchParams.page,
        priceRange: this.pagesItems['searchParams'].priceRange,
        brands: this.pagesItems['searchParams'].brands,
        subcategory: this.pagesItems['searchParams'].subcategory,
        name: this.pagesItems['searchParams'].name,
        category: this.pagesItems['searchParams'].category
      }

      this.search(searchParams).then(
        () => {
          console.log('pagesItems:', this.pagesItems[this.selectedPage]);
          this.virtualProducts = [...this.pagesItems[this.selectedPage]]
          event.forceUpdate = true;
          this.loading = false
        }
      ).catch(_ => {
        this.virtualProducts = []
        this.loading = false
      })
    } else {

      this.virtualProducts = [...this.pagesItems[this.selectedPage]]
      event.forceUpdate = true;
      this.loading = false
    }


  }

  isPageChange(searchParams: Search): boolean {

    return (searchParams.page != this.pagesItems['page']) &&
      searchParams.name == this.pagesItems['searchParams']?.name &&
      searchParams.size == this.pagesItems['size'] &&
      searchParams.category == this.pagesItems['searchParams'].category &&
      searchParams.subcategory == this.pagesItems['searchParams']?.subcategory &&
      searchParams.brands == this.pagesItems['searchParams']?.brands &&
      searchParams.priceRange == this.pagesItems['searchParams'].priceRange
  }

  private fetchCategories(category: string) {
    console.log("fetch categories")
    this.categoryService
      .getSubcategoriesByCategoryName(category)
      .subscribe((categories: CategoryDto[]) => {
        if(categories.length > 0)
        this.subcategories = categories.map((category: CategoryDto) => category.name);
        else this.router.navigate(['problem/404'])
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

  OnSearchButtonClick() {
    this.first = 0
    this.loadProducts({first: this.first, rows: this.selectedSize, forceUpdate: true}, true);
  }
}
