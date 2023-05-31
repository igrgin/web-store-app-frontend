import {Transaction} from "./transaction";

export interface PageableTransaction {
  transactions:Transaction[];
  total_transactions:number;
}
