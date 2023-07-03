import {Component, OnInit} from '@angular/core';
import {StorageService} from "../service/storage/storage.service";
import {PaymentService} from "../service/payment/payment.service";
import {ProductService} from "../service/product/product.service";
import {ToastService} from "../service/toast/toast.service";


@Component({
  selector: 'app-cart-view',
  templateUrl: './cart-view.component.html',
  styleUrls: ['./cart-view.component.css']
})
export class CartViewComponent implements OnInit{
  cartItems:{ name:string,stock:number,id:string,price:number,subcategory:string, quantity: number }[] = [];
  first: number = 0;
  sum: number = 0;

  constructor(private storageService:StorageService, private transactionService:PaymentService,
              private productService:ProductService, private toastService:ToastService) {}

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
    this.transactionService.saveTransaction({
      cart_product: this.storageService.getCart().map(value => {
        return {
          product_id: value.id,
          quantity:value.quantity
        };
      }),
      created_at: new Date().toISOString()
    }).subscribe(
      _ => {
        this.storageService.deleteCart();
        this.cartItems = [];
        this.sum = 0;
        this.toastService.showSuccess("Checkout Successful!","Checkout successfully completed.")
      }, () => this.toastService.showError("An error occurred",
        "There was a problem while checking out. Please try again.")
    );
  }

  removeFromCart(id: string) {
    this.storageService.removeFromCart(id)
    this.cartItems=this.storageService.getCart()
    this.calculateTotalPrice()
  }

  removeAllFromCart() {
    this.storageService.deleteCart()
    this.cartItems=[]
    this.calculateTotalPrice()
  }
}
