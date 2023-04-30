import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Search} from "../interface/search/search";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit{

  searchEventOutput:Search = {} as Search;
  allCategories:string[] = [];
  allBrands:string[]=[];
  rangeValues: number[] = [20, 80];
  minMaxRangeValues: number[] = [0, 1000];
  @Output()
  searchEvent: EventEmitter<Search> = new EventEmitter<Search>();

  constructor() {
  }

  ngOnInit(): void {
    this.allCategories.push("test","test1")
    this.allBrands.push("test2","test3")
    console.log(this.allBrands)
  }

  onSearchEvent()
  {
    this.searchEvent.emit(this.searchEventOutput);
  }

}
