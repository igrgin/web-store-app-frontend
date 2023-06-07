import {Component, OnInit} from '@angular/core';
import {AuthService} from "./service/auth/auth.service";
import {StorageService} from "./service/storage/storage.service";
import {Observable, switchMap} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements  OnInit{
  title = 'web-store-app-frontend';

  constructor(private authService:AuthService, private storageService:StorageService) {}

  ngOnInit(): void {


  }

}
