import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {catchError, forkJoin, map, Observable, of, switchMap, tap} from "rxjs";
import {PageableTransaction} from "../../interface/transaction/pageable-transaction";
import {Transaction} from "../../interface/transaction/transaction";
import {StorageService} from "../storage/storage.service";
import {CartProduct} from "../../interface/cart/cart-product";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private paymentUrl:String = 'http://localhost:8080/payment/api';
  constructor(private http:HttpClient, private storageService:StorageService) { }

 getUserTransactionHistory(transactionView: { page: number, size: number }): Observable<PageableTransaction> {
    let queryParams = new HttpParams();
    if (transactionView) {
      if (transactionView.page != null && transactionView.page >= 0) queryParams = queryParams.append("page", transactionView.page)
      if (transactionView.size != null && transactionView.size > 0) queryParams = queryParams.append("size", transactionView.size)
    }

    console.log(queryParams.toString());
    return  this.http.get<PageableTransaction>(`${this.paymentUrl}/private/transaction/find/all`, { params: queryParams }).pipe(
      switchMap((response: PageableTransaction) => {
        const transactionsWithCartItems$ = response.transactions.map(transaction =>
          this.getUserCartByCartId((<string>transaction.cart_id)).pipe(
            map((cartProduct: CartProduct[]) => {
              transaction.cart_product = cartProduct
              return transaction;
            })
          )
        );
        return forkJoin(transactionsWithCartItems$).pipe(
          map(transactionsWithCartItems => {
            response.transactions = transactionsWithCartItems;
            return response;
          })
        );
      }),
      tap(_ => {
        console.log(`fetched transactions`)
      }),
      catchError(this.handleError<PageableTransaction>('getUserTransactionHistory',
        { transactions: [], total_transactions: 0, cart_products: [] } as PageableTransaction))
    );
  }

  getUserCartByCartId(cartId:string): Observable<CartProduct[]> {

    return this.http.get<CartProduct[]>(`${this.paymentUrl}/private/cart/find/${cartId}`)
      .pipe(
        tap(_ => {
          console.log(`fetched cart`)
        }),
        catchError(this.handleError<CartProduct[]>('getUserCartByCartId',
          {} as CartProduct[]))
      );
  }

  saveTransaction(transactionToSave:Transaction)
  {
    if(this.storageService.isLoggedIn())
    {
      return this.http.post<Transaction>(`${this.paymentUrl}/private/transaction/add`, transactionToSave).pipe(
        tap((newTransaction: Transaction) => console.log(`added transaction w/ id=${newTransaction.id}`)),
        catchError(this.handleError<Transaction>('saveTransaction'))
      )
    }

    return this.http.post<Transaction>(`${this.paymentUrl}/public/transaction/add`, transactionToSave).pipe(
      tap((newTransaction: Transaction) => console.log(`added transaction w/ id=${newTransaction.id}`)),
      catchError(this.handleError<Transaction>('saveTransaction'))
    )
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(operation);
      console.error(error);
      return of(result as T);
    };
  }
}
