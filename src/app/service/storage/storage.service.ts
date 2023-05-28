import {Injectable} from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {ProductService} from "../product/product.service";

const ACCESS_TOKEN = 'auth-access';
const REFRESH_TOKEN = 'auth-refresh';
const CART = 'cart';
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private cookieService:CookieService, private productService:ProductService) { }

  cleanAccessToken(): void {
    sessionStorage.clear();
  }

  cleanRefreshToken(): void {
    this.cookieService.delete(REFRESH_TOKEN)
  }

  public saveAccessToken(accessToken: string): void {
    sessionStorage.removeItem(ACCESS_TOKEN);
    sessionStorage.setItem(ACCESS_TOKEN, accessToken);
  }

  public saveRefreshToken(refreshToken: any): void {
    this.cookieService.delete(REFRESH_TOKEN);
    this.cookieService.set(REFRESH_TOKEN,refreshToken,{path:'/'});
  }

  public getAccessToken(): String | null {
    return sessionStorage.getItem(ACCESS_TOKEN)
  }

  public getRefreshToken(): any {

    if (!this.hasRefreshToken()) {
      return null;
    }

    return this.cookieService.get(REFRESH_TOKEN);
  }

  public isLoggedIn(): boolean {
    const token = sessionStorage.getItem(ACCESS_TOKEN);
    return token != null || this.hasRefreshToken();
  }

  public hasRefreshToken(): boolean {
    return this.cookieService.check(REFRESH_TOKEN);
  }

  public addToCart(productId:string) {
    let isInCart:boolean = false
    if (this.cookieService.check(CART)) {
      console.log("exists")
      const currentCart: { name:string,stock:number,id:string,price:number,subcategory:string, quantity: number }[] = JSON.parse(this.cookieService.get(CART))
      currentCart.forEach(product => {
        if (product.id == productId) {
          isInCart = true
          return
        }
      })
      if(!isInCart)
      {
        this.productService.getProductById(productId).subscribe(
          product => {
            if (product.id !== undefined) {
              currentCart.push(...[{
                id: productId, name: product.name, price: product.price,
                quantity: 1, stock: product.stock, subcategory: product.subcategory}])
            }
          this.cookieService.set(CART,JSON.stringify(currentCart),{path:'/'})}
        )
      }

      console.log(this.getCart())

    } else {

      this.productService.getProductById(productId).subscribe(
        product => this.cookieService.set(CART,JSON.stringify([{
          id: productId, name: product.name, price: product.price,
          quantity: 1, stock: product.stock, subcategory: product.subcategory}]),{path:'/'})
      )
    }

  }

  public getCart() {
    if(!this.cookieService.check(CART))
    {
      return
    }

    return this.cookieService.get(CART)
  }

  public removeFromCart(productId:string) {
    if(this.cookieService.check(CART))
    {
      const currentCart = this.cookieService.get(CART).split(",")
      const indexOfProduct = currentCart.indexOf(productId)
      if(indexOfProduct !== -1){
        currentCart.splice(indexOfProduct,1)
        this.cookieService.set(CART,JSON.stringify(currentCart),{path:'/'})
      }

    }
  }

  public deleteCart(){
    this.cookieService.delete(CART)
  }

  public doesCartExist(){
   return this.cookieService.check(CART)
  }

  public updateCart(cartItems: {
    name: string;
    stock: number;
    id: string;
    price: number;
    subcategory: string;
    quantity: number
  }[]) {
    this.cookieService.set(CART,JSON.stringify(cartItems),{path:'/'})

  }
}
