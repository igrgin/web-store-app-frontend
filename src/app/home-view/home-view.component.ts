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
  orderedCategories: string[] = []

  constructor(private categoryService: CategoryService, private productService: ProductService) {
  }

  ngOnInit(): void {
    this.categoryService.getTopLevelCategories().then(categories => {
      categories.forEach(category => this.productService.getProductsByCategory(category.name, this.size)
        .then(pagableProducts => {
          console.log('name: ', category.name)
          console.log('products: ', pagableProducts.products)
          this.categoryValues[category.name] = [...pagableProducts.products]
          console.log('map: ', this.categoryValues[category.name])
        }).catch(reason => {
          console.log("reason", reason)
        }))
      this.orderedCategories = categories.map(value => value.name).sort((a, b) => {
        if (a > b) {
          return 1
        }
        if (a < b) {
          return -1}

        return 0
      })
    })
  }

  protected readonly Object = Object;
}
