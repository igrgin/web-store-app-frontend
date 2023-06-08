import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {catchError, Observable, of, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  private chartUrl:String = 'http://localhost:8080/chart/api';
  constructor(private http:HttpClient) { }

  getTopProductsSoldByBrand(brand:string,columnSize:number): Observable<any> {
    let queryParams = new HttpParams();
    queryParams =queryParams.append("col",columnSize)

    return this.http.get<any>(`${this.chartUrl}/private/${brand}`,{params:queryParams})
      .pipe(
        tap(_ => {
          console.log(`fetched values:${_}`)
        }),
        catchError(this.handleError<any>('getTopProductsSoldByBrand',
          {}))
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
