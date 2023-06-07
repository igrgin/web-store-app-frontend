import {Component, OnInit} from '@angular/core';
import {ChartService} from "../service/chart/chart.service";
import {BrandService} from "../service/brand/brand.service";

@Component({
  selector: 'app-chart-view',
  templateUrl: './chart-view.component.html',
  styleUrls: ['./chart-view.component.css']
})
export class ChartViewComponent implements OnInit {
  chartData:any={}
  brandOptions:string[] =[];
  selectedBrand:string = '';

  constructor(private chartService:ChartService, private brandService:BrandService) {
  }

  ngOnInit(): void {
    this.brandService.getAllBrands().subscribe(
      value => {
        this.brandOptions=[...value.map(category => category.name )]
        this.selectedBrand = this.brandOptions[0]
        for (let i = 0; i < this.brandOptions.length; i++) {
          const brand = this.brandOptions[i];
          this.chartService.getTopProductsSoldByBrand(brand,10).subscribe(
            data => {
              console.log("brand: ",this.brandOptions[i])
              console.log("keys: ",Object.keys(data))
              console.log("values: ",Object.values(data))
              this.chartData[brand] = {
                labels: Object.keys(data),
                datasets: [
                  {
                    label: 'Values',
                    backgroundColor: '#42A5F5',
                    data: Object.values(data),
                  },
                ],
              }
              console.log(`${this.brandOptions[i]}`, this.chartData[this.brandOptions[i]])
            });
        }
      }
    )

  }
}
