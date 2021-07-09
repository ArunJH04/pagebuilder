import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareConfigComponent } from './compare-config.component';

describe('CompareConfigComponent', () => {
  let component: CompareConfigComponent;
  let fixture: ComponentFixture<CompareConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
