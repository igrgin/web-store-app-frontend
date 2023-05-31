import {Component, OnInit} from '@angular/core';
import {TransactionService} from "../service/transaction/transaction.service";

@Component({
  selector: 'app-transaction-view',
  templateUrl: './transaction-view.component.html',
  styleUrls: ['./transaction-view.component.css']
})
export class TransactionViewComponent implements OnInit{
  transactionHistory:any={}
  totalTransactions:number =0
  virtualTransactionPage:{ products:{name:string,id:string}, createdAt:Date, status:string}[] =[];
  sizeOptions:number[]=[20,40,60,80,100]
  selectedPage= 0;
  first = 0
  selectedSize= 40
  loading = false

  constructor(private transactionService:TransactionService) {

  }

  ngOnInit(): void {
    this.getTransactions({page:this.selectedPage,
      size: this.selectedSize})
  }

  loadTransactions(event: any) {
    this.loading = true
    console.log("loadTransactions")
    this.first = event.first;
    this.selectedSize = event.rows;
    this.selectedPage = Math.floor(this.first / this.selectedSize);
    console.log(`Size: ${this.selectedSize}`);
    console.log(`first: ${this.first}`);
    console.log(`Page: ${this.selectedPage + 1}`);
    let transactionView: any = {
      size: this.selectedSize,
      page: this.selectedPage
    }

    if (transactionView.size != this.transactionHistory.size) {
      this.transactionHistory = {}
    }

    if (this.transactionHistory[this.selectedPage] == undefined) {
      this.transactionHistory[this.selectedPage]={};
      console.log(transactionView)
      this.getTransactions(transactionView);
      setTimeout(() => {
        console.log('transactionHistory:', this.transactionHistory[this.selectedPage]);
        this.virtualTransactionPage = [...this.transactionHistory[this.selectedPage]]
        this.loading = false
        event.forceUpdate = true;
        console.log(this.virtualTransactionPage)
      }, 1000);
    } else {
      this.virtualTransactionPage = [...this.transactionHistory[this.selectedPage]]
      this.loading = false
      event.forceUpdate = true;
    }
  }

  private getTransactions(transactionView: {page:number,
    size: number}) {
    console.log(transactionView)
    this.transactionService.getUserTransactionHistory(transactionView)
      .subscribe(value => {
        this.transactionHistory[this.selectedPage] = [...value.transactions]
        this.totalTransactions = value.total_transactions
      })
  }

  protected readonly Math = Math;
}
