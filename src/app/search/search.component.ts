import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Search} from "../interface/search/search";
import {CategoryService} from "../service/category/category.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {BrandService} from "../service/brand/brand.service";
import {Title} from "@angular/platform-browser";
import {Observable, switchMap} from "rxjs";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchEventOutput: Search = {
    priceRange: [20, 80],
    name: '',
    brands: [] as String[],
    page: 0,
    size: 40,
    category: ''
  } as Search
  allSubcategories: string[] = [];
  allBrands: string[] = [];
  minMaxRangeValues: number[] = [0, 4000];
  sizeValues: number[] = [20, 40, 60, 80, 100]
  @Output()
  searchEvent: EventEmitter<Search> = new EventEmitter<Search>();

  constructor(private categoryService: CategoryService, private titleService: Title, private brandService: BrandService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {

          this.allSubcategories = []
          this.allBrands = []
          console.log(params.get('category'))
          if (params.get('category')) this.searchEventOutput.category = <string>this.route.snapshot.paramMap.get('category')

          this.categoryService.getSubcategoriesByCategoryName(this.searchEventOutput.category)
            .subscribe(value => {
            const categoryNames = value.map(value1 => value1.name)
              console.log(categoryNames)
            this.allSubcategories.push(...categoryNames)
          })
          this.brandService.getBrandsByCategoryName(this.searchEventOutput.category)
            .subscribe(value => {
              const brandsNames = value.map(value1 => value1.name)
              this.allBrands.push(...brandsNames)
            }
          )
          this.titleService.setTitle(this.searchEventOutput.category)
          return new Observable<any>();

        })).subscribe();

  }


  onSearchEvent() {
    if (this.searchEventOutput) {
      this.router.navigate([`/search/${this.searchEventOutput.category}`], {
        queryParams: {
          name: this.searchEventOutput.name, subcategory: this.searchEventOutput.subcategory,
          brands: this.searchEventOutput?.brands?.toString(), priceRange: this.searchEventOutput.priceRange?.toString(),
          page: this.searchEventOutput.page, size: this.searchEventOutput.size
        }
      })
      this.searchEvent.emit()
    }

  }

}
