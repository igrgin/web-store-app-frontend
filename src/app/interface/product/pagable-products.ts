import {Product} from "./product";

export interface PageableProducts {
  products:Product[];
  total_products:number;
}
