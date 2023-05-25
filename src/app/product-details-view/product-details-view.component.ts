import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Product} from "../interface/product/product";
import {ProductService} from "../service/product/product.service";

@Component({
  selector: 'app-product-details-view',
  templateUrl: './product-details-view.component.html',
  styleUrls: ['./product-details-view.component.css']
})
export class ProductDetailsViewComponent implements OnInit{

  selectedProduct?:Product;
  constructor(private route:ActivatedRoute, private productService:ProductService) {
  }
  ngOnInit(): void {
    if(this.route.snapshot.paramMap.get('id') !== null)
      this.productService.getProductById((<string>this.route.snapshot.paramMap.get('id')))
          .subscribe(value => {
            this.selectedProduct=value
          })
  }

}
