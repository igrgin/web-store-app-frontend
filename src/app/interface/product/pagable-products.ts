import {Product} from "./product";

export interface PageableProducts {
  products:Product[];
  total_pages:number;
  total_products:number;
}
