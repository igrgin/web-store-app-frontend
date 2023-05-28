import {Component, OnInit} from '@angular/core';
import {StorageService} from "../service/storage/storage.service";


@Component({
  selector: 'app-cart-view',
  templateUrl: './cart-view.component.html',
  styleUrls: ['./cart-view.component.css']
})
export class CartViewComponent implements OnInit{
  cartItems:{ name:string,stock:number,id:string,price:number,subcategory:string, quantity: number }[] = [];
  selectedSize = 60;
  first = 0;
  sum: number = 0;

  constructor(private storageService:StorageService) {}

  ngOnInit(): void {
    if(this.storageService.doesCartExist())
    {
      this.cartItems = JSON.parse((<string>this.storageService.getCart()))
      this.calculateTotalPrice()
    }
  }

  loadPage(event: any) {
    this.first=event.first
    this.selectedSize= event.selectedSize
  }

  calculateTotalPrice() {
    this.sum = this.cartItems.map(value => value.price * value.quantity)
      .reduce((previousValue, currentValue) => previousValue+currentValue,0);
    this.storageService.updateCart(this.cartItems)
  }

  checkout() {
    console.log("checkout completed!")
    this.storageService.deleteCart()
  }
}
