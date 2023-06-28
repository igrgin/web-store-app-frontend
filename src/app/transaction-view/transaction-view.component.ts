import {Component} from '@angular/core';
import {PaymentService} from "../service/payment/payment.service";
import {forkJoin, map, switchMap} from "rxjs";
import {ProductService} from "../service/product/product.service";
import {CartProduct} from "../interface/cart/cart-product";

@Component({
  selector: 'app-transaction-view',
  templateUrl: './transaction-view.component.html',
  styleUrls: ['./transaction-view.component.css']
})
export class TransactionViewComponent {
  transactionHistory: any = {}
  totalTransactions: number = 0
  virtualTransactionPage: { products: { name: string, id: string }, createdAt: Date, status: string }[] = [];
  sizeOptions: number[] = [5, 20, 40, 60, 80, 100]
  selectedPage = 0;
  first = 0
  selectedSize = 40
  loading = false


  constructor(private paymentService: PaymentService, private productService: ProductService) {

  }




  loadTransactions(event: any) {
    console.log("loading", event)
    this.loading = true
    console.log("loadTransactions")
    this.first = event.first;
    let pastSelectedSize = this.selectedSize.valueOf()
    this.selectedSize = event.rows;
    this.selectedPage = Math.floor(this.first / this.selectedSize);
    console.log(`Size: ${this.selectedSize}`);
    console.log(`first: ${this.first}`);
    console.log(`Page: ${this.selectedPage + 1}`);
    let transactionView: any = {
      size: this.selectedSize,
      page: this.selectedPage
    }

    if (!this.transactionHistory || pastSelectedSize !== this.selectedSize) {
      this.transactionHistory = {}
    }

    if (this.transactionHistory[this.selectedPage] == undefined) {
      console.log(transactionView)
      this.getTransactions(transactionView)
      setTimeout(()=>{
        console.log("here: ", this.transactionHistory[this.selectedPage])
        this.virtualTransactionPage = [...this.transactionHistory[this.selectedPage]]
        this.loading = false
        event.forceUpdate = true;
      },1500)

    } else {
      console.log("there: ", this.transactionHistory[this.selectedPage])
      this.virtualTransactionPage = [...this.transactionHistory[this.selectedPage]]
      this.loading = false
      event.forceUpdate = true;
    }
  }

  private getTransactions(transactionView: { page: number, size: number }) {
    console.log(transactionView);
  this.paymentService.getUserTransactionHistory(transactionView).subscribe(value => {
      const transactionsWithProducts$ = value.transactions.map(transaction => {
        console.log("transaction",transaction)
        let transactionWithProducts: {
          created_at: string,
          status?: string,
          price?: string,
          products: { id?: string, quantity: number, name: string, price: string }[]
        } = {
          created_at: transaction.created_at,
          status: (<string>transaction.status),
          price: Number(transaction.price).toFixed(2),
          products: []
        };

        return this.paymentService.getUserCartByCartId((<string>transaction.cart_id)).pipe(
          switchMap(cart => {
            const productIdsQuantity: {
              productId: string,
              quantity: number
            }[] = cart.map((cartProduct: CartProduct) => {
              let value: { productId: string, quantity: number } = {
                productId: cartProduct.product_id,
                quantity: cartProduct.quantity
              };
              return value;
            });
            console.log("PIQ ", productIdsQuantity)
            const productPromise = productIdsQuantity.map((productIdsQuantity) => this.productService.getProductById(productIdsQuantity.productId));
            console.log("observable ", productPromise)
            return forkJoin(productPromise).pipe(
              map(products => {
                console.log("products", products);
                products.forEach((product, index) => {
                  const populatedProduct = {
                    id: product.id,
                    quantity: productIdsQuantity[index].quantity,
                    name: product.name,
                    price: (product.price * productIdsQuantity[index].quantity).toFixed(2)
                  };
                  transactionWithProducts.products?.push(populatedProduct);
                });
                console.log("transactionsWithProducts: ",transactionWithProducts)
                return transactionWithProducts; // Return the transaction with products

              }));
          }));
      });

      forkJoin(transactionsWithProducts$).subscribe(transactionsWithProducts => {
        console.log("transactionsWithProducts: ",transactionsWithProducts)
        transactionsWithProducts.sort((a, b) => {
          const dateA = new Date(a.created_at || '');
          const dateB = new Date(b.created_at || '');
          return dateB.getTime() - dateA.getTime();
        });
        this.transactionHistory[this.selectedPage] = transactionsWithProducts;
        console.log("transactionsWithProducts: ",transactionsWithProducts)
        this.totalTransactions = value.total_transactions;
      });
    }, error => error);
    if(!this.transactionHistory[this.selectedPage]) this.transactionHistory[this.selectedPage]=[]
  }

}
