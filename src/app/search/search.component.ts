import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Search} from "../interface/search/search";
import {CategoryService} from "../service/category/category.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchEventOutput: Search = { priceRange:[20, 80]} as Search
  allSubcategories: string[] = [];
  allBrands: string[] = [];
  minMaxRangeValues: number[] = [0, 1000];
  @Output()
  searchEvent: EventEmitter<Search> = new EventEmitter<Search>();

  constructor(private categoryService:CategoryService) {
  }

  ngOnInit(): void {
    if(this.allSubcategories.length ==  0) this.allSubcategories = ["Cameras"]
    if(this.allBrands.length ==  0) this.allBrands = ["Microsoft"]
  }

  onSearchEvent() {
    if (this.searchEventOutput) {
      this.searchEventOutput.page = 1
      this.searchEventOutput.size = 10
      this.searchEvent.emit(this.searchEventOutput);
    }

  }

}
