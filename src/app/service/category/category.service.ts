import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, of, tap} from "rxjs";
import {CategoryDto} from "../../interface/category/category-dto";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private productUrl: String = 'http://localhost:8080/category/api';
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(private http: HttpClient) {
  }

  getSubcategoriesByParentId(parentId: number): Observable<CategoryDto[]> {

    return this.http.get<CategoryDto[]>(`${this.productUrl}/find/category/${parentId}`)
      .pipe(
        tap(_ => {
          console.log(`fetched Subcategories`)
        }),
        catchError(this.handleError<CategoryDto[]>('getSubcategoriesByParentId', []))
      );
  }

  getTopLevelCategories(): Observable<CategoryDto[]> {

    return this.http.get<CategoryDto[]>(`${this.productUrl}/find/top`)
      .pipe(
        tap(_ => {
          console.log(`fetched Top Level Categories`)
        }),
        catchError(this.handleError<CategoryDto[]>('getTopLevelCategories', []))
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
