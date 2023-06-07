import {Transaction} from "./transaction";
import {Product} from "../product/product";

export interface PageableTransaction {
  transactions:Transaction[];
  cart_products?:Product[]
  total_transactions:number;
}
