import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {catchError, Observable, of, tap} from "rxjs";
import {PageableProducts} from "../../interface/product/pagable-products";
import {Product} from "../../interface/product/product";
import {Search} from "../../interface/search/search";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productUrl:String = 'http://localhost:8080/product/api';
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };
  constructor(private http:HttpClient) { }

  getProducts(): Observable<PageableProducts> {

    return this.http.get<PageableProducts>(`${this.productUrl}/private/find/all`)
      .pipe(
        tap(_ => {
          console.log(`fetched products`)
        }),
        catchError(this.handleError<PageableProducts>('getProducts', { products:[], number_of_pages:0}))
      );
  }

  getProductById(id:String): Observable<Product> {

    return this.http.get<Product>(`${this.productUrl}/private/find/id/${id}`)
      .pipe(
        tap(_ => {
          console.log(`fetched products`)
        }),
        catchError(this.handleError<Product>('getProductById', {} as Product))
      );
  }

  getProductsByCategory(category:String): Observable<PageableProducts> {

    return this.http.get<PageableProducts>(`${this.productUrl}/private/find/category/${category}`)
      .pipe(
        tap(_ => {
          console.log(`fetched products`)
        }),
        catchError(this.handleError<PageableProducts>('getProductsByCategory',
          { products:[], number_of_pages:0}))
      );
  }

  getProductsBySubcategory(subcategory:String): Observable<PageableProducts> {

    return this.http.get<PageableProducts>(`${this.productUrl}/private/find/subcategory/${subcategory}`)
      .pipe(
        tap(_ => {
          console.log(`fetched products`)
        }),
        catchError(this.handleError<PageableProducts>('getProductsByCategory',
          { products:[], number_of_pages:0}))
      );
  }

  getProductsByBrand(brand:String): Observable<PageableProducts> {

    return this.http.get<PageableProducts>(`${this.productUrl}/private/find/brand/${brand}`)
      .pipe(
        tap(_ => {
          console.log(`fetched products`)
        }),
        catchError(this.handleError<PageableProducts>('getProductsByBrand',
          { products:[], number_of_pages:0}))
      );
  }

  addProduct(product: Product): Observable<Product> {

    return this.http.post<Product>(`${this.productUrl}/private/add`, product, this.httpOptions).pipe(
      tap((newProduct: Product) => console.log(`added product w/ id=${newProduct.id}`)),
      catchError(this.handleError<Product>('addProduct'))
    )

  }

  updateProduct(product: Product): Observable<any> {

    return this.http.put<Product>(`${this.productUrl}/private/update`, product, this.httpOptions).pipe(
      tap(_ => console.log(`updated product id=${product.id}`)),
      catchError(this.handleError<any>('updateStudent'))
    )
  }

  deleteProduct(id: string): Observable<any> {
    const url = `${this.productUrl}/private/delete/${id}`;
    return this.http.delete(url, this.httpOptions).pipe(
      tap(res => console.log('HTTP response:', res)),
      tap(_ => console.log(`deleted product id=${id}`)),
      catchError(this.handleError<Product>('deleteProduct'))
    );
  }

  searchProducts(searchQuery:Search): Observable<PageableProducts> {


    let queryParams = new HttpParams().set(encodeURIComponent("name"),encodeURIComponent(searchQuery.name))
      .set(encodeURIComponent("category"),encodeURIComponent(searchQuery.category))
      .set("size",searchQuery.size).set("page",searchQuery.page)
      .set("pMin",searchQuery.priceRange[0]).set("pMax",searchQuery.priceRange[1]);

    if(searchQuery.brands.length > 0 )
    {
      queryParams = new HttpParams().set(encodeURIComponent("brands"),encodeURIComponent(searchQuery.brands.toString()))
        .set(encodeURIComponent("name"),encodeURIComponent(searchQuery.name))
        .set(encodeURIComponent("category"),encodeURIComponent(searchQuery.category))
    }

    console.log(queryParams.toString())

    return this.http.get<PageableProducts>(`${this.productUrl}/public/search`,{params:queryParams}).pipe(
        tap(_ => {
          console.log(`fetched products`)

        }),
        catchError(this.handleError<PageableProducts>('getProducts', { products:[], number_of_pages:0}))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(operation);
      console.error(error);
      return of(result as T);
    };
  }




}
