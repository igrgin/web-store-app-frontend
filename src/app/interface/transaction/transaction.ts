export interface Transaction {
  id?:string;
  userId?:number;
  created_at:string;
  products:{id:string,name:string,quantity:number,price:number}[];
  status?:string;
  price?:number;
}
