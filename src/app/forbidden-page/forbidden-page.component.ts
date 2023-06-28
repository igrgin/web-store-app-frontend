import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-forbidden-page',
  templateUrl: './forbidden-page.component.html'
})
export class ForbiddenPageComponent implements OnInit {
  title: string = '';
  errorCodeText: any = {
    "404": "Page Not Found",
    "403": "Forbidden",
    "401": "Unauthorized"
  }

  constructor(private route: ActivatedRoute, private titleService: Title) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log(params['errorCode'])
      if (params['errorCode']) {
        this.title = params['errorCode']
        this.titleService.setTitle(this.title)
      } else {
        this.title = "404"
        this.titleService.setTitle(this.title)
      }
    })
  }


}
