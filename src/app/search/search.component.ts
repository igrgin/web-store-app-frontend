import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Search} from "../interface/search/search";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchEventOutput: Search = { priceRange:[20, 80]} as Search
  allCategories: string[] = [];
  allBrands: string[] = [];
  rangeValues: number[] = [20, 80];
  minMaxRangeValues: number[] = [0, 1000];
  @Output()
  searchEvent: EventEmitter<Search> = new EventEmitter<Search>();

  constructor() {
  }

  ngOnInit(): void {
    this.allCategories.push("Cameras")
    this.allBrands.push("Microsoft")
  }

  onSearchEvent() {
    if (this.searchEventOutput) {
      this.searchEventOutput.page = 1
      this.searchEventOutput.size = 10
      this.searchEvent.emit(this.searchEventOutput);
    }

  }

}
