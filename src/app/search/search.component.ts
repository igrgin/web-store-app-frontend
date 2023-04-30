import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Search} from "../interface/search/search";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit{

  searchInput:Search = {} as Search;
  @Output()
  searchEvent: EventEmitter<Search> = new EventEmitter<Search>();

  constructor() {
  }

  ngOnInit(): void {
  }

  onSearchEvent()
  {
    this.searchEvent.emit(this.searchInput);
  }

}
