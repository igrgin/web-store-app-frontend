import {EventEmitter, Injectable} from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {ProductService} from "../product/product.service";

const ACCESS_TOKEN = 'auth-access';
const REFRESH_TOKEN = 'auth-refresh';
const CART = 'cart';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  changeCart: EventEmitter<void> = new EventEmitter<void>();

  constructor(private cookieService: CookieService, private productService: ProductService) {
  }

  cleanAccessToken(): void {
    sessionStorage.clear();
  }

  cleanRefreshToken(): void {
    this.cookieService.delete(REFRESH_TOKEN)
    console.log("does refresh exist after delete: ", this.getRefreshToken())
  }

  public saveAccessToken(accessToken: string): void {
    sessionStorage.setItem(ACCESS_TOKEN, accessToken);
  }

  public saveRefreshToken(refreshToken: any): void {
    const expirationDate = new Date()
    expirationDate.setDate(expirationDate.getDate() + 7)
    this.cookieService.set(REFRESH_TOKEN, refreshToken, {path: '/',expires:expirationDate,domain:'localhost',secure:true});
  }

  public getAccessToken(): String | null {
    return sessionStorage.getItem(ACCESS_TOKEN)
  }

  public getRefreshToken(): string | null {

    if (!this.hasRefreshToken()) {
      return null;
    }

    return this.cookieService.get(REFRESH_TOKEN);
  }

  public isLoggedIn(): boolean {
    const token = sessionStorage.getItem(ACCESS_TOKEN);
    return token != null;
  }

  public hasRefreshToken(): boolean {
    return this.cookieService.check(REFRESH_TOKEN);
  }

   public async addToCart(productId: string) {
    let isInCart: boolean = false
    if (this.cookieService.check(CART)) {
      console.log("exists")
      const currentCart: {
        name: string,
        stock: number,
        id: string,
        price: number,
        subcategory: string,
        quantity: number
      }[] = JSON.parse(this.cookieService.get(CART))
      currentCart.forEach(product => {
        if (product.id == productId) {
          isInCart = true
          return
        }
      })
      if (!isInCart) {
        await this.productService.getProductById(productId).then(
          product => {
            if (product.id !== undefined) {
              currentCart.push(...[{
                id: productId, name: product.name, price: product.price,
                quantity: 1, stock: product.stock, subcategory: product.subcategory
              }])
            }
            this.cookieService.set(CART, JSON.stringify(currentCart), {path: '/'})
          }
        )
      }
      console.log(this.getCart())

    } else {

      await this.productService.getProductById(productId).then(
        product => this.cookieService.set(CART, JSON.stringify([{
          id: productId, name: product.name, price: product.price,
          quantity: 1, stock: product.stock, subcategory: product.subcategory
        }]), {path: '/'})
      )
    }
     this.changeCart.emit()

  }

  public getCart(): {
    name: string;
    stock: number;
    id: string;
    price: number;
    subcategory: string;
    quantity: number
  }[] {
    if (!this.cookieService.check(CART)) {
      return []
    }

    return JSON.parse(this.cookieService.get(CART))
  }

  public removeFromCart(productId: string) {
    if (this.cookieService.check(CART)) {
      const currentCart: {
        name: string;
        stock: number;
        id: string;
        price: number;
        subcategory: string;
        quantity: number
      }[] = JSON.parse(this.cookieService.get(CART))
      console.log('cart', currentCart)
      const indexOfProduct = currentCart.map(value => value.id).indexOf(productId)
      console.log('index', indexOfProduct)
      if (indexOfProduct !== -1) {
        currentCart.splice(indexOfProduct, 1)
        this.cookieService.set(CART, JSON.stringify(currentCart), {path: '/'})
      }
    }
    this.changeCart.emit()
  }

  public deleteCart() {
    console.log("deleted CART")
    this.cookieService.delete(CART,'/')
    this.changeCart.emit()
  }

  public doesCartExist() {
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
    this.cookieService.set(CART, JSON.stringify(cartItems), {path: '/'})
    this.changeCart.emit()

  }
}
