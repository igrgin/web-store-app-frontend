import {Component, OnInit} from '@angular/core';
import {CategoryService} from "../service/category/category.service";
import {ProductService} from "../service/product/product.service";

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.css']
})
export class HomeViewComponent implements OnInit {
  size: number = 25
  categoryValues: any = {}

  constructor(private categoryService: CategoryService, private productService: ProductService) {
  }

  ngOnInit(): void {
    this.categoryService.getTopLevelCategories().subscribe(categories =>
      categories.forEach(category => this.productService.getProductsByCategory(category.name, this.size)
        .subscribe(pagableProducts => {
          console.log('name: ',category.name)
          console.log('products: ',pagableProducts.products)
          this.categoryValues[category.name] = [...pagableProducts.products]
          console.log('map: ',this.categoryValues[category.name])
        })))
  }


  protected readonly Object = Object;
}
