import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchProductsViewComponent } from './search-products-view.component';

describe('SearchProductViewComponent', () => {
  let component: SearchProductsViewComponent;
  let fixture: ComponentFixture<SearchProductsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchProductsViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchProductsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
