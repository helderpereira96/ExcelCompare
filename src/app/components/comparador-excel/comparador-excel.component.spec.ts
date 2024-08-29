import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparadorExcelComponent } from './comparador-excel.component';

describe('ComparadorExcelComponent', () => {
  let component: ComparadorExcelComponent;
  let fixture: ComponentFixture<ComparadorExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparadorExcelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComparadorExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
