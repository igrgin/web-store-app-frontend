import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Product} from "../interface/product/product";
import {ProductService} from "../service/product/product.service";
import {Title} from "@angular/platform-browser";
import {StorageService} from "../service/storage/storage.service";

@Component({
  selector: 'app-product-details-view',
  templateUrl: './product-details-view.component.html',
  styleUrls: ['./product-details-view.component.css']
})
export class ProductDetailsViewComponent implements OnInit{

  selectedProduct?:Product;
  constructor(private route:ActivatedRoute, private productService:ProductService, private titleService:Title,
              private storageService:StorageService) {
  }
  ngOnInit(): void {
    if(this.route.snapshot.paramMap.get('id') !== null)
      this.productService.getProductById((<string>this.route.snapshot.paramMap.get('id')))
          .subscribe(value => {
            this.selectedProduct=value
            this.titleService.setTitle(this.selectedProduct.name)
          })
  }

  addToCart(productId: string) {
    this.storageService.addToCart(productId)
    console.log('Cart:', this.storageService.getCart())
  }

}
