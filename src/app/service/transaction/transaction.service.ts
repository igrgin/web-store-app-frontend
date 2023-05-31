import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {catchError, Observable, of, tap} from "rxjs";
import {PageableTransaction} from "../../interface/transaction/pageable-transaction";
import {Transaction} from "../../interface/transaction/transaction";
import {StorageService} from "../storage/storage.service";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transactionUrl:String = 'http://localhost:8080/transaction/api';
  constructor(private http:HttpClient, private storageService:StorageService) { }

  getUserTransactionHistory(transactionView:{page:number,size:number}): Observable<PageableTransaction> {

    let queryParams = new HttpParams();
    if(transactionView){

      if(transactionView.page != null && transactionView.page >= 0) queryParams = queryParams.append("page",transactionView.page)
      if(transactionView.size != null && transactionView.size > 0) queryParams = queryParams.append("size",transactionView.size)
    }

    console.log(queryParams.toString())
    return this.http.get<PageableTransaction>(`${this.transactionUrl}/private/find/all`,{params:queryParams})
      .pipe(
        tap(_ => {
          console.log(`fetched transactions`)
        }),
        catchError(this.handleError<PageableTransaction>('getUserTransactionHistory',
          {transactions:[],total_transactions:0} as PageableTransaction))
      );
  }

  saveTransaction(transactionToSave:Transaction)
  {
    if(this.storageService.isLoggedIn())
    {
      return this.http.post<Transaction>(`${this.transactionUrl}/private/add`, transactionToSave).pipe(
        tap((newTransaction: Transaction) => console.log(`added transaction w/ id=${newTransaction.id}`)),
        catchError(this.handleError<Transaction>('saveTransaction'))
      )
    }

    return this.http.post<Transaction>(`${this.transactionUrl}/public/add`, transactionToSave).pipe(
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
