import {Product} from "./product";

export interface PageableProducts {
  products:Product[];
  number_of_pages:number;
}
