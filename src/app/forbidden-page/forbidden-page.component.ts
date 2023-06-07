import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-forbidden-page',
  templateUrl: './forbidden-page.component.html'
})
export class ForbiddenPageComponent implements OnInit {
  title:string ='';
  constructor(private route:ActivatedRoute,private titleService:Title) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {

      this.title = params['errorCode']
      this.titleService.setTitle(this.title)
    })
  }


}
