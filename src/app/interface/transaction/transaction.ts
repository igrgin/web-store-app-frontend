import {CartProduct} from "../cart/cart-product";
import {Product} from "../product/product";

export interface Transaction {
  id?:string;
  userId?:number;
  created_at:string;
  cart_product:CartProduct[];
  cart_id?:string;
  status?:string;
  price?:string;
  product?:Product[];
  quantities?: { [productId: string]: number };
}
