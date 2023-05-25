import {Injectable} from '@angular/core';
import {catchError, Observable, of, tap} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BrandDto} from "../../interface/brand/brand-dto";
import {CategoryDto} from "../../interface/category/category-dto";

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private brandUrl: String = 'http://localhost:8080/brand/api';
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(private http: HttpClient) {}

  getBrandsByParentId(categoryId: number): Observable<BrandDto[]> {

    return this.http.get<BrandDto[]>(`${this.brandUrl}/public/find/subcategory/id/${categoryId}`,this.httpOptions)
      .pipe(
        tap(_ => {
          console.log(`fetched brands`)
        }),
        catchError(this.handleError<BrandDto[]>('getBrandsByParentId', []))
      );
  }

  getBrandsByCategoryName(categoryName: string): Observable<BrandDto[]> {

    return this.http.get<BrandDto[]>(`${this.brandUrl}/public/find/category/name/${categoryName}`,this.httpOptions)
      .pipe(
        tap(_ => {
          console.log(`fetched brands`)
        }),
        catchError(this.handleError<BrandDto[]>('getBrandsBySubcategoryName', []))
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
