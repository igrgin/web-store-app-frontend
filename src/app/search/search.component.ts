import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Search} from "../interface/search/search";
import {CategoryService} from "../service/category/category.service";
import {ActivatedRoute} from "@angular/router";
import {BrandService} from "../service/brand/brand.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchEventOutput: Search = {priceRange:[20,80], name:'', brands:[] as String[], page:0,size:40} as Search
  allSubcategories: string[] = [];
  allBrands: string[] = [];
  minMaxRangeValues: number[] = [0, 4000];
  @Output()
  searchEvent: EventEmitter<Search> = new EventEmitter<Search>();

  constructor(private categoryService:CategoryService, private brandService:BrandService, private router:ActivatedRoute) {
  }

  ngOnInit(): void {
    this.router.params.subscribe(params => {
      this.searchEventOutput.category=params['categoryName']
      this.allSubcategories = []
      this.allBrands = []
      this.categoryService.getSubcategoriesByParentId(params['categoryId']).subscribe(value =>
        { const categoryNames = value.map(value1 => value1.name)
          this.allSubcategories.push(...categoryNames)
        })
      this.brandService.getBrandsByParentId(params['categoryId']).subscribe(
        value => { const brandsNames = value.map(value1 => value1.name)
          this.allBrands.push(...brandsNames)}
      )
    });
  }

  onSearchEvent() {
    if (this.searchEventOutput) {
      console.log(this.searchEventOutput)
      this.searchEvent.emit(this.searchEventOutput);
    }

  }

}
