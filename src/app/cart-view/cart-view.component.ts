import {Component, OnInit} from '@angular/core';
import {StorageService} from "../service/storage/storage.service";
import {TransactionService} from "../service/transaction/transaction.service";


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

  constructor(private storageService:StorageService, private transactionService:TransactionService) {}

  ngOnInit(): void {
    if(this.storageService.doesCartExist())
    {
      this.cartItems = this.storageService.getCart()
      this.calculateTotalPrice()
    }
  }

  calculateTotalPrice() {
    this.sum = Number(this.cartItems.map(value => value.price * value.quantity)
      .reduce((previousValue, currentValue) => previousValue+currentValue,0).toFixed(2));
    this.storageService.updateCart(this.cartItems)
  }

  checkout() {
    this.transactionService.saveTransaction({products:this.storageService.getCart().map(value => {
        return {id:value.id,quantity:value.quantity, name:value.name, price:Number(value.price.toFixed(2))*value.quantity}
      }), created_at:new Date().toISOString()}).subscribe(
      _ => {
        console.log("saved")
        this.storageService.deleteCart()
      }
    )
  }

  removeFromCart(id: string) {
    this.storageService.removeFromCart(id)
    this.cartItems=this.storageService.getCart()
  }
}
