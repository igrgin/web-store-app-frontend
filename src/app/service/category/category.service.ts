import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, of, tap} from "rxjs";
import {CategoryDto} from "../../interface/category/category-dto";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categoryUrl: String = 'http://localhost:8080/category/api';
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(private http: HttpClient) {}

  getSubcategoriesByParentId(parentId: number): Observable<CategoryDto[]> {

    return this.http.get<CategoryDto[]>(`${this.categoryUrl}/public/find/subcategory/id/${parentId}`,this.httpOptions)
      .pipe(
        tap(_ => {
          console.log(`fetched Subcategories`)
        }),
        catchError(this.handleError<CategoryDto[]>('getSubcategoriesByParentId', []))
      );
  }

  getCategoryById(id: number): Observable<CategoryDto> {

    return this.http.get<CategoryDto>(`${this.categoryUrl}/public/find/category/${id}`,this.httpOptions)
        .pipe(
            tap(_ => {
              console.log(`fetched category`)
            }),
            catchError(this.handleError<CategoryDto>('getSubcategoriesByParentId', {} as CategoryDto))
        );
  }

  getSubcategoriesByCategoryName(categoryName: string): Observable<CategoryDto[]> {

    return this.http.get<CategoryDto[]>(`${this.categoryUrl}/public/find/subcategory/name/${categoryName}`,this.httpOptions)
      .pipe(
        tap(_ => {
          console.log(`fetched Subcategories`)
        }),
        catchError(this.handleError<CategoryDto[]>('getSubcategoriesByCategoryName', []))
      );

  }

  getTopLevelCategories(): Observable<CategoryDto[]> {

    return this.http.get<CategoryDto[]>(`${this.categoryUrl}/public/find/top`,this.httpOptions)
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
