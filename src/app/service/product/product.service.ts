import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {catchError, lastValueFrom, Observable, of, tap} from "rxjs";
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

  async searchProducts(searchQuery:Search): Promise<PageableProducts> {
    let queryParams = new HttpParams();
    if(searchQuery){
      if(searchQuery.name != null && searchQuery.name.length > 0) queryParams = queryParams.append("name",searchQuery.name)
      if(searchQuery.category != null && searchQuery.category.length > 0) queryParams = queryParams.append("category",searchQuery.category)
      if(searchQuery.subcategory != null && searchQuery.subcategory.length > 0) queryParams = queryParams.append("subcategory",searchQuery.subcategory)
      if(searchQuery.brands != null && searchQuery.brands.length > 0) queryParams = queryParams.append("brands",searchQuery.brands.toString())
      if(searchQuery.priceRange != null && searchQuery.priceRange.length == 2) {
        queryParams = queryParams.append("pMin",searchQuery.priceRange[0])
        queryParams = queryParams.append("pMax",searchQuery.priceRange[1])
      }

      if(searchQuery.page != null && searchQuery.page >= 0) queryParams = queryParams.append("page",searchQuery.page)
      if(searchQuery.size != null && searchQuery.size > 0) queryParams = queryParams.append("size",searchQuery.size)
    }

    console.log(queryParams.toString())

    return  await lastValueFrom(this.http.get<PageableProducts>(`${this.productUrl}/public/search`,{params:queryParams}).pipe(
        tap(_ => {
          console.log(`fetched products`)

        }),
        catchError(this.handleError<PageableProducts>('getProducts', { products:[],
          total_products:0}))
    ));
  }

 async getProductById(id:string): Promise<Product> {

    return await lastValueFrom(this.http.get<Product>(`${this.productUrl}/public/find/id/${id}`)
      .pipe(
        tap(_ => {
          console.log(`fetched products`)
        }),
        catchError(this.handleError<Product>('getProductById', {} as Product))
      ));
  }

  async getProductsByCategory(category:string, size:number): Promise<PageableProducts> {
    let queryParams = new HttpParams()
    queryParams = queryParams.append("size",size)

    return await lastValueFrom(this.http.get<PageableProducts>(`${this.productUrl}/public/find/category/${category}`,{params:queryParams})
      .pipe(
        tap(_ => {
          console.log(`fetched products`)
        }),
        catchError(this.handleError<PageableProducts>('getProductsByCategory',
          { products:[],
          total_products:0}))
      ));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(operation);
      console.error(error);
      return of(result as T);
    };
  }




}
